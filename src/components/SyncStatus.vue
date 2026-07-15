<template>
  <view v-if="show" class="sync-status" :class="statusClass">
    <view class="sync-content">
      <view v-if="isSyncing" class="sync-loading"></view>
      <text class="sync-icon">{{ statusIcon }}</text>
      <text class="sync-text">{{ statusText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface PropsTypes {
  isSyncing: boolean;
  syncError: string | null;
  lastSyncTime: string | null;
  show?: boolean;
}

const props = withDefaults(defineProps<PropsTypes>(), {
  show: true,
});

const statusClass = computed(() => {
  if (props.isSyncing) return 'syncing';
  if (props.syncError) return 'error';
  return 'success';
});

const statusIcon = computed(() => {
  if (props.isSyncing) return '⏳';
  if (props.syncError) return '❌';
  return '✅';
});

const statusText = computed(() => {
  if (props.isSyncing) return '正在同步...';
  if (props.syncError) return `同步失败: ${props.syncError}`;
  if (props.lastSyncTime) {
    return `已同步 (${formatSyncTime(props.lastSyncTime)})`;
  }
  return '等待同步';
});

function formatSyncTime(time: string): string {
  const now = new Date();
  const syncTime = new Date(time);
  const diff = now.getTime() - syncTime.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}
</script>

<style scoped>
.sync-status {
  position: fixed;
  top: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 16rpx 32rpx;
  border-radius: 60rpx;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10rpx);
}

.sync-content {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.sync-loading {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sync-icon {
  font-size: 28rpx;
}

.sync-text {
  font-size: 24rpx;
  color: #fff;
}

.sync-status.syncing {
  background-color: rgba(60, 197, 31, 0.9);
}

.sync-status.error {
  background-color: rgba(255, 77, 79, 0.9);
}

.sync-status.success {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
