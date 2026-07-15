<template>
  <view class="home-page">
    <view class="container">
      <!-- 统计卡片 -->
      <view class="statistics-card card">
        <view class="card-title">数据统计</view>
        <view class="statistics-grid">
          <view class="statistics-item">
            <view class="statistics-value text-primary">{{ statistics.totalPackages }}</view>
            <view class="statistics-label">课程包</view>
          </view>
          <view class="statistics-item">
            <view class="statistics-value text-primary">{{ statistics.totalRemainingHours }}</view>
            <view class="statistics-label">剩余学时</view>
          </view>
          <view class="statistics-item">
            <view class="statistics-value">{{ statistics.totalConsumedHours }}</view>
            <view class="statistics-label">已消耗</view>
          </view>
          <view class="statistics-item">
            <view class="statistics-value">{{ statistics.totalHours }}</view>
            <view class="statistics-label">总学时</view>
          </view>
        </view>
        <view class="statistics-footer">
          <text class="statistics-footer-text">
            今日记录: {{ statistics.todayRecords }} | 本月记录: {{ statistics.monthRecords }}
          </text>
          <text v-if="statistics.totalPayment" class="statistics-payment">
            总支出: ¥{{ statistics.totalPayment.toFixed(2) }}
          </text>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions card">
        <view class="card-title">快捷操作</view>
        <view class="action-grid">
          <view class="action-item" @click="handleGoToRecord">
            <view class="action-icon">📝</view>
            <view class="action-text">登记</view>
          </view>
          <view class="action-item" @click="handleGoToAddPackage">
            <view class="action-icon">➕</view>
            <view class="action-text">添加</view>
          </view>
          <view class="action-item" @click="handleGoToHistory">
            <view class="action-icon">📋</view>
            <view class="action-text">记录</view>
          </view>
          <view class="action-item" @click="handleGoToPackageList">
            <view class="action-icon">📦</view>
            <view class="action-text">管理</view>
          </view>
          <view class="action-item" @click="handleGoToPayment">
            <view class="action-icon">💰</view>
            <view class="action-text">费用</view>
          </view>
        </view>
      </view>

      <!-- 课程包列表 -->
      <view class="package-list">
        <view class="package-list-header flex-between">
          <view class="card-title">我的课程包</view>
          <view v-if="coursePackageList.length > 0" class="sort-hint">
            <button 
              class="btn-sort" 
              size="mini" 
              @click="toggleEditMode"
            >
              {{ isEditMode ? '完成' : '调整顺序' }}
            </button>
          </view>
        </view>
        <view v-if="coursePackageList.length === 0" class="empty-state">
          <text class="empty-text">暂无课程包</text>
          <button class="btn-primary mt-20" @click="handleGoToAddPackage">添加第一个课程包</button>
        </view>
        <view v-else class="package-items-wrapper">
          <view
            v-for="(item, index) in localPackageList"
            :key="item.id"
            class="package-item-container"
          >
            <view
              :class="['package-item', 'card']"
              @click="!isEditMode && handleViewPackageDetail(item)"
            >
              <view class="package-content">
                <view class="package-header flex-between">
                  <view class="package-name">{{ item.courseName }}</view>
                  <view class="package-type">{{ getCourseTypeName(item.courseType) }}</view>
                </view>
                <view class="package-progress">
                  <view class="progress-bar">
                    <view
                      class="progress-fill"
                      :style="{ width: getProgressWidth(item) + '%' }"
                    ></view>
                  </view>
                  <view class="progress-text">
                    剩余 {{ item.remainingHours }} / {{ item.totalHours }} 学时
                  </view>
                </view>
              <view class="package-footer flex-between">
                <text class="package-date text-secondary">
                  购买于 {{ item.purchaseDate }}
                </text>
                <text
                  :class="['package-status', getStatusClass(item)]"
                >
                  {{ getStatusText(item) }}
                </text>
              </view>
              </view>
            </view>
            
            <!-- 排序按钮 -->
            <view v-if="isEditMode" class="sort-buttons">
              <button 
                class="sort-btn sort-btn-up" 
                :disabled="index === 0"
                @click="moveUp(index)"
              >
                ▲
              </button>
              <button 
                class="sort-btn sort-btn-down" 
                :disabled="index === localPackageList.length - 1"
                @click="moveDown(index)"
              >
                ▼
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
import { COURSE_TYPE_MAP } from '@/constants/course';
import type { CoursePackageTypes, CourseTypeEnum } from '@/types/course';

const courseStore = useCourseStore();

const coursePackageList = computed(() => courseStore.coursePackageList);
const statistics = computed(() => courseStore.statistics);

// 排序相关状态
const isEditMode = ref(false);
const localPackageList = ref<CoursePackageTypes[]>([...coursePackageList.value]);

// 监听原始列表变化，同步到本地列表
watch(coursePackageList, (newList) => {
  if (!isEditMode.value) {
    localPackageList.value = [...newList];
  }
}, { deep: true });

/**
 * 获取课程类型名称
 */
function getCourseTypeName(type: CourseTypeEnum): string {
  return COURSE_TYPE_MAP[type] || '';
}

/**
 * 获取进度百分比
 */
function getProgressWidth(item: CoursePackageTypes): number {
  if (item.totalHours === 0) return 0;
  return Math.round((item.remainingHours / item.totalHours) * 100);
}

/**
 * 获取状态文本
 */
function getStatusText(item: CoursePackageTypes): string {
  if (item.remainingHours === 0) {
    return '已用完';
  } else if (item.remainingHours <= 5) {
    return '即将用完';
  } else {
    return '充足';
  }
}

/**
 * 获取状态样式类
 */
function getStatusClass(item: CoursePackageTypes): string {
  if (item.remainingHours === 0) {
    return 'text-danger';
  } else if (item.remainingHours <= 5) {
    return 'text-warning';
  } else {
    return 'text-primary';
  }
}

/**
 * 跳转到学时登记
 */
function handleGoToRecord() {
  uni.navigateTo({
    url: '/pages/record/index',
  });
}

/**
 * 跳转到添加课程包
 */
function handleGoToAddPackage() {
  uni.navigateTo({
    url: '/pages/coursePackage/add',
  });
}

/**
 * 跳转到历史记录
 */
function handleGoToHistory() {
  uni.switchTab({
    url: '/pages/history/index',
  });
}

/**
 * 跳转到课程包列表
 */
function handleGoToPackageList() {
  uni.switchTab({
    url: '/pages/coursePackage/index',
  });
}

/**
 * 跳转到费用记录
 */
function handleGoToPayment() {
  uni.navigateTo({
    url: '/pages/payment/index',
  });
}

/**
 * 查看课程包详情
 */
function handleViewPackageDetail(item: CoursePackageTypes) {
  if (isEditMode.value) return;
  
  uni.showActionSheet({
    itemList: ['查看记录', '学时登记'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 查看记录
        console.log('Setting history filter packageId:', item.id, 'courseName:', item.courseName);
        courseStore.setHistoryFilterPackageId(item.id);
        console.log('Store historyFilterPackageId set to:', courseStore.historyFilterPackageId);
        
        // 使用 setTimeout 确保状态已设置
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/history/index',
            success: () => {
              console.log('Successfully switched to history tab');
            },
            fail: (err) => {
              console.error('Failed to switch tab:', err);
            }
          });
        }, 50);
      } else if (res.tapIndex === 1) {
        // 学时登记
        uni.navigateTo({
          url: `/pages/record/index?packageId=${item.id}`,
        });
      }
    },
  });
}

/**
 * 切换编辑模式
 */
async function toggleEditMode() {
  if (isEditMode.value) {
    // 退出编辑模式，保存顺序
    await courseStore.updateCoursePackageOrder(localPackageList.value);
    uni.showToast({
      title: '顺序已保存',
      icon: 'success',
    });
  } else {
    // 进入编辑模式
    uni.vibrateShort({
      type: 'light',
    });
  }
  isEditMode.value = !isEditMode.value;
}

/**
 * 上移
 */
function moveUp(index: number) {
  if (index === 0) return;
  
  const newList = [...localPackageList.value];
  [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
  localPackageList.value = newList;
  
  // 触觉反馈
  uni.vibrateShort({
    type: 'light',
  });
}

/**
 * 下移
 */
function moveDown(index: number) {
  if (index === localPackageList.value.length - 1) return;
  
  const newList = [...localPackageList.value];
  [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
  localPackageList.value = newList;
  
  // 触觉反馈
  uni.vibrateShort({
    type: 'light',
  });
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  color: #333;
}

/* 统计卡片 */
.statistics-card {
  margin-bottom: 20rpx;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.statistics-item {
  text-align: center;
}

.statistics-value {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.statistics-label {
  font-size: 24rpx;
  color: #999;
}

.statistics-footer {
  padding-top: 20rpx;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.statistics-footer-text {
  font-size: 24rpx;
  color: #666;
}

.statistics-payment {
  font-size: 26rpx;
  font-weight: bold;
  color: #ff4d4f;
}

/* 快捷操作 */
.quick-actions {
  margin-bottom: 20rpx;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 12rpx;
  border-radius: 12rpx;
  background-color: #f8f8f8;
  transition: all 0.2s ease;
}

.action-item:active {
  background-color: #efefef;
  transform: scale(0.98);
}

.action-icon {
  font-size: 52rpx;
  margin-bottom: 12rpx;
}

.action-text {
  font-size: 26rpx;
  color: #666;
  text-align: center;
  white-space: nowrap;
}

/* 课程包列表 */
.package-list {
  margin-top: 20rpx;
}

.package-list-header {
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-hint {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.btn-sort {
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: #3cc51f;
  border: 1px solid #3cc51f;
  background-color: #fff;
  border-radius: 8rpx;
  line-height: 1.2;
  height: auto;
}

.empty-state {
  text-align: center;
  padding: 80rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.package-items-wrapper {
  position: relative;
}

.package-item-container {
  position: relative;
  margin-bottom: 20rpx;
}

.package-item {
  transition: all 0.3s ease;
}

.package-content {
  width: 100%;
}

.sort-buttons {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  z-index: 10;
}

.sort-btn {
  width: 56rpx;
  height: 56rpx;
  padding: 0;
  margin: 0;
  font-size: 28rpx;
  line-height: 56rpx;
  text-align: center;
  background-color: #fff;
  color: #3cc51f;
  border: 2rpx solid #3cc51f;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(60, 197, 31, 0.15);
}

.sort-btn:active {
  background-color: #3cc51f;
  color: #fff;
}

.sort-btn[disabled] {
  opacity: 0.3;
  color: #ccc;
  border-color: #ccc;
  box-shadow: none;
}

.package-header {
  margin-bottom: 20rpx;
}

.package-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.package-type {
  font-size: 24rpx;
  color: #666;
  background-color: #f0f0f0;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

.package-progress {
  margin-bottom: 16rpx;
}

.progress-bar {
  height: 12rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3cc51f 0%, #5dd42c 100%);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
}

.package-footer {
  padding-top: 16rpx;
  border-top: 1px solid #f0f0f0;
}

.package-date {
  font-size: 24rpx;
}

.package-status {
  font-size: 24rpx;
  font-weight: bold;
}
</style>
