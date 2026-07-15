<template>
  <view class="course-package-page">
    <view class="container">
      <!-- 顶部操作栏 -->
      <view class="header-actions">
        <button class="btn-primary" @click="handleAddPackage">
          ➕ 添加课程包
        </button>
      </view>

      <!-- 课程包列表 -->
      <view v-if="coursePackageList.length === 0" class="empty-state">
        <text class="empty-text">暂无课程包</text>
        <text class="empty-hint">点击上方按钮添加第一个课程包</text>
      </view>

      <view v-else class="package-list">
        <view
          v-for="item in coursePackageList"
          :key="item.id"
          class="package-item card"
        >
          <view class="package-header flex-between">
            <view class="package-left">
              <view class="package-name">{{ item.courseName }}</view>
              <view class="package-type-tag">{{ getCourseTypeName(item.courseType) }}</view>
            </view>
            <view class="package-actions">
              <button class="btn-action" size="mini" @click="handleEditPackage(item)">
                编辑
              </button>
              <button
                class="btn-action btn-danger"
                size="mini"
                @click="handleDeletePackage(item)"
              >
                删除
              </button>
            </view>
          </view>

          <view class="package-info">
            <view class="info-row">
              <text class="info-label">总学时：</text>
              <text class="info-value">{{ item.totalHours }} 学时</text>
            </view>
            <view class="info-row">
              <text class="info-label">剩余学时：</text>
              <text class="info-value text-primary">{{ item.remainingHours }} 学时</text>
            </view>
            <view class="info-row">
              <text class="info-label">已消耗：</text>
              <text class="info-value">
                {{ item.totalHours - item.remainingHours }} 学时
              </text>
            </view>
            <view class="info-row">
              <text class="info-label">购买日期：</text>
              <text class="info-value">{{ item.purchaseDate }}</text>
            </view>
          </view>

          <view class="package-progress">
            <view class="progress-bar">
              <view
                class="progress-fill"
                :style="{ width: getProgressWidth(item) + '%' }"
              ></view>
            </view>
            <view class="progress-label">
              使用进度：{{ 100 - getProgressWidth(item) }}%
            </view>
          </view>

          <view class="package-footer">
            <button class="btn-default btn-small" @click="handleViewRecords(item)">
              查看记录
            </button>
            <button class="btn-primary btn-small ml-20" @click="handleQuickRecord(item)">
              快速登记
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
import { COURSE_TYPE_MAP } from '@/constants/course';
import type { CoursePackageTypes, CourseTypeEnum } from '@/types/course';

const courseStore = useCourseStore();

const coursePackageList = computed(() => courseStore.coursePackageList);

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
 * 添加课程包
 */
function handleAddPackage() {
  uni.navigateTo({
    url: '/pages/coursePackage/add',
  });
}

/**
 * 编辑课程包
 */
function handleEditPackage(item: CoursePackageTypes) {
  uni.navigateTo({
    url: `/pages/coursePackage/add?id=${item.id}`,
  });
}

/**
 * 删除课程包
 */
function handleDeletePackage(item: CoursePackageTypes) {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除"${item.courseName}"吗？删除后相关记录也将被删除，此操作不可恢复。`,
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        const success = courseStore.deleteCoursePackage(item.id);
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

/**
 * 查看记录
 */
function handleViewRecords(item: CoursePackageTypes) {
  // 设置筛选的课程包ID
  courseStore.setHistoryFilterPackageId(item.id);
  
  // 跳转到历史记录页面（tabBar页面使用switchTab）
  uni.switchTab({
    url: '/pages/history/index',
  });
}

/**
 * 快速登记
 */
function handleQuickRecord(item: CoursePackageTypes) {
  uni.navigateTo({
    url: `/pages/record/index?packageId=${item.id}`,
  });
}
</script>

<style scoped>
.course-package-page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header-actions {
  padding: 20rpx 0;
}

.header-actions button {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #ccc;
}

.package-list {
  margin-top: 20rpx;
}

.package-item {
  margin-bottom: 20rpx;
}

.package-header {
  margin-bottom: 24rpx;
}

.package-left {
  flex: 1;
}

.package-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.package-type-tag {
  display: inline-block;
  font-size: 22rpx;
  color: #666;
  background-color: #f0f0f0;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.package-actions {
  display: flex;
  gap: 12rpx;
}

.btn-action {
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  border-radius: 6rpx;
  background-color: #f0f0f0;
  color: #666;
  border: none;
}

.btn-action.btn-danger {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.package-info {
  margin-bottom: 24rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 28rpx;
}

.info-label {
  color: #999;
  min-width: 160rpx;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.package-progress {
  margin-bottom: 24rpx;
}

.progress-bar {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3cc51f 0%, #5dd42c 100%);
  border-radius: 8rpx;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 24rpx;
  color: #666;
  text-align: right;
}

.package-footer {
  display: flex;
  padding-top: 20rpx;
  border-top: 1px solid #f0f0f0;
}

.btn-small {
  flex: 1;
  padding: 16rpx 0;
  font-size: 26rpx;
}
</style>
