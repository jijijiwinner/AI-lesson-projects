<template>
  <view class="history-page">
    <view class="container">
      <!-- 筛选栏 -->
      <view class="filter-bar card">
        <picker
          mode="selector"
          :range="filterOptions"
          range-key="label"
          :value="filterTypeIndex"
          @change="handleFilterChange"
        >
          <view class="filter-picker">
            <text>{{ currentFilterLabel }}</text>
            <text class="filter-arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 记录列表 -->
      <view v-if="displayRecordList.length === 0" class="empty-state">
        <text class="empty-text">暂无记录</text>
      </view>

      <view v-else class="record-list">
        <!-- 按日期分组显示 -->
        <view v-for="(group, date) in groupedRecords" :key="date" class="date-group">
          <view class="date-header">
            <text class="date-text">{{ formatDateHeader(date) }}</text>
            <text class="date-count">{{ group.length }} 条记录</text>
          </view>

          <view v-for="record in group" :key="record.id" class="record-item card">
            <view class="record-header flex-between">
              <view class="record-left">
                <view class="record-course">{{ record.courseName }}</view>
                <view class="record-course-type text-secondary">
                  {{ getCourseTypeName(record.courseType) }}
                </view>
              </view>
              <view
                class="record-type-tag"
                :style="{ 
                  color: getRecordTypeColor(record.recordType),
                  backgroundColor: getRecordTypeBgColor(record.recordType)
                }"
              >
                {{ getRecordTypeName(record.recordType) }}
              </view>
            </view>

            <view v-if="record.consumeHours > 0" class="record-info">
              <text class="info-label">消耗学时：</text>
              <text class="info-value">{{ record.consumeHours }} 学时</text>
            </view>

            <view v-if="record.remark" class="record-remark">
              <text class="remark-label">备注：</text>
              <text class="remark-text">{{ record.remark }}</text>
            </view>

            <view class="record-footer flex-between">
              <text class="record-time text-secondary">
                {{ formatDateTime(record.createTime) }}
              </text>
              <view class="record-actions">
                <view class="btn-edit-mini" @click.stop="handleEditRecord(record)">
                  编辑
                </view>
                <view class="btn-delete-mini" @click.stop="handleDeleteRecord(record)">
                  删除
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
import {
  COURSE_TYPE_MAP,
  RECORD_TYPE_MAP,
  RECORD_TYPE_COLOR_MAP,
} from '@/constants/course';
import { formatDate, isToday } from '@/utils/date';
import type { LessonRecordTypes, CourseTypeEnum, RecordTypeEnum } from '@/types/course';

const courseStore = useCourseStore();

const filterType = ref<string>('all');
const filterPackageId = ref<string>('');

interface FilterOptionTypes {
  label: string;
  value: string;
}

const filterOptions = computed<FilterOptionTypes[]>(() => {
  const options: FilterOptionTypes[] = [{ label: '全部记录', value: 'all' }];
  
  courseStore.coursePackageList.forEach((pkg) => {
    options.push({
      label: pkg.courseName,
      value: pkg.id,
    });
  });
  
  return options;
});

const filterTypeIndex = computed(() => {
  if (filterType.value === 'all') return 0;
  const index = filterOptions.value.findIndex((item) => item.value === filterPackageId.value);
  return index !== -1 ? index : 0;
});

const currentFilterLabel = computed(() => {
  const option = filterOptions.value[filterTypeIndex.value];
  return option ? option.label : '全部记录';
});

const displayRecordList = computed(() => {
  let records = courseStore.lessonRecordList;
  
  if (filterPackageId.value) {
    records = records.filter((record) => record.packageId === filterPackageId.value);
  }
  
  return records;
});

// 按日期分组
const groupedRecords = computed(() => {
  const groups: Record<string, LessonRecordTypes[]> = {};
  
  displayRecordList.value.forEach((record) => {
    const date = record.recordDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
  });
  
  // 按日期降序排序
  const sortedGroups: Record<string, LessonRecordTypes[]> = {};
  Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .forEach((date) => {
      sortedGroups[date] = groups[date];
    });
  
  return sortedGroups;
});

onLoad((options) => {
  // 页面加载时检查是否有传递的packageId（用于非tabBar跳转）
  if (options?.packageId) {
    filterPackageId.value = options.packageId as string;
    filterType.value = 'package';
  }
});

onShow(() => {
  // 每次页面显示时检查store中是否有设置的筛选packageId（用于tabBar跳转）
  console.log('History page onShow, historyFilterPackageId:', courseStore.historyFilterPackageId);
  
  if (courseStore.historyFilterPackageId) {
    console.log('Setting filter to packageId:', courseStore.historyFilterPackageId);
    filterPackageId.value = courseStore.historyFilterPackageId;
    filterType.value = 'package';
    // 使用后清空，避免影响下次进入
    courseStore.clearHistoryFilter();
  }
});

/**
 * 筛选改变
 */
function handleFilterChange(e: any) {
  const index = e.detail.value;
  const option = filterOptions.value[index];
  
  if (option.value === 'all') {
    filterType.value = 'all';
    filterPackageId.value = '';
  } else {
    filterType.value = 'package';
    filterPackageId.value = option.value;
  }
}

/**
 * 获取课程类型名称
 */
function getCourseTypeName(type: CourseTypeEnum): string {
  return COURSE_TYPE_MAP[type] || '';
}

/**
 * 获取记录类型名称
 */
function getRecordTypeName(type: RecordTypeEnum): string {
  return RECORD_TYPE_MAP[type] || '';
}

/**
 * 获取记录类型颜色
 */
function getRecordTypeColor(type: RecordTypeEnum): string {
  return RECORD_TYPE_COLOR_MAP[type] || '#333';
}

/**
 * 获取记录类型背景色
 */
function getRecordTypeBgColor(type: RecordTypeEnum): string {
  const colorMap: Record<RecordTypeEnum, string> = {
    consume: '#f6ffed',
    leave: '#fff7e6',
    cancel: '#f5f5f5',
  };
  return colorMap[type] || '#f5f5f5';
}

/**
 * 格式化日期标题
 */
function formatDateHeader(date: string): string {
  if (isToday(date)) {
    return `今天 ${date}`;
  }
  return date;
}

/**
 * 格式化日期时间
 */
function formatDateTime(datetime: string): string {
  return formatDate(datetime, 'YYYY-MM-DD HH:mm:ss');
}

/**
 * 编辑记录
 */
function handleEditRecord(record: LessonRecordTypes) {
  uni.navigateTo({
    url: `/pages/record/edit?id=${record.id}`,
  });
}

/**
 * 删除记录
 */
function handleDeleteRecord(record: LessonRecordTypes) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条记录吗？删除后将恢复对应的学时。',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        const success = courseStore.deleteLessonRecord(record.id);
        if (success) {
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          });
        }
      }
    },
  });
}
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 筛选栏 */
.filter-bar {
  margin-bottom: 20rpx;
}

.filter-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  font-size: 28rpx;
  color: #333;
}

.filter-arrow {
  font-size: 20rpx;
  color: #999;
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 记录列表 */
.record-list {
  margin-top: 20rpx;
}

.date-group {
  margin-bottom: 32rpx;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  margin-bottom: 12rpx;
}

.date-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.date-count {
  font-size: 24rpx;
  color: #999;
}

.record-item {
  margin-bottom: 16rpx;
}

.record-header {
  margin-bottom: 16rpx;
}

.record-left {
  flex: 1;
}

.record-course {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.record-course-type {
  font-size: 24rpx;
}

.record-type-tag {
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  font-weight: 500;
  border-radius: 8rpx;
}

.record-info {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.info-label {
  color: #999;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.record-remark {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 16rpx;
  padding: 16rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.remark-label {
  color: #999;
}

.remark-text {
  color: #666;
}

.record-footer {
  padding-top: 12rpx;
  border-top: 1px solid #f0f0f0;
}

.record-time {
  font-size: 22rpx;
}

.record-actions {
  display: flex;
  gap: 12rpx;
}

.btn-edit-mini {
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  background-color: #f0f9ff;
  color: #1890ff;
  border-radius: 8rpx;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.btn-edit-mini:active {
  background-color: #e6f4ff;
  transform: scale(0.95);
}

.btn-delete-mini {
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  background-color: #fff1f0;
  color: #ff4d4f;
  border-radius: 8rpx;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.btn-delete-mini:active {
  background-color: #ffe7e5;
  transform: scale(0.95);
}
</style>
