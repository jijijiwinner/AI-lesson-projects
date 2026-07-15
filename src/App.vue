<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useCourseCloudStore } from '@/stores/courseCloud';

const courseStore = useCourseCloudStore();

onLaunch(() => {
  console.log('App Launch');
  // 从 Supabase 加载数据
  courseStore.initData();
});

onShow(() => {
  console.log('App Show');
  // 应用恢复时刷新数据
  courseStore.refreshData();
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style>
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

/* 通用样式 */
.container {
  padding: 20rpx;
}

.card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.btn-primary {
  background-color: #3cc51f;
  color: #fff;
  border-radius: 8rpx;
  padding: 20rpx 40rpx;
  border: none;
}

.btn-default {
  background-color: #f5f5f5;
  color: #333;
  border-radius: 8rpx;
  padding: 20rpx 40rpx;
  border: none;
}

.text-primary {
  color: #3cc51f;
}

.text-secondary {
  color: #999;
}

.text-warning {
  color: #ff9500;
}

.text-danger {
  color: #ff4d4f;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mt-20 {
  margin-top: 20rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.ml-20 {
  margin-left: 20rpx;
}

.mr-20 {
  margin-right: 20rpx;
}
</style>
