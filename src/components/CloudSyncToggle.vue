<template>
  <view class="cloud-sync-toggle card">
    <view class="toggle-header flex-between">
      <view class="toggle-info">
        <view class="toggle-title">☁️ 云端同步</view>
        <view class="toggle-desc">开启后数据将自动同步到云端</view>
      </view>
      <switch
        :checked="useCloud"
        color="#3cc51f"
        @change="handleToggleChange"
      />
    </view>

    <view v-if="useCloud && lastSyncTime" class="sync-info">
      <text class="sync-time">上次同步：{{ lastSyncTime }}</text>
      <button
        class="btn-sync"
        size="mini"
        :disabled="isSyncing"
        @click="handleManualSync"
      >
        {{ isSyncing ? '同步中...' : '立即同步' }}
      </button>
    </view>

    <view v-if="syncError" class="sync-error">
      <text class="error-text">❌ {{ syncError }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface PropsTypes {
  useCloud: boolean;
  isSyncing: boolean;
  syncError: string | null;
  lastSyncTime: string | null;
}

interface EmitsTypes {
  (e: 'toggle', value: boolean): void;
  (e: 'sync'): void;
}

defineProps<PropsTypes>();
const emit = defineEmits<EmitsTypes>();

function handleToggleChange(e: any) {
  emit('toggle', e.detail.value);
}

function handleManualSync() {
  emit('sync');
}
</script>

<style scoped>
.cloud-sync-toggle {
  margin-bottom: 20rpx;
}

.toggle-header {
  margin-bottom: 16rpx;
}

.toggle-info {
  flex: 1;
}

.toggle-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.toggle-desc {
  font-size: 24rpx;
  color: #999;
}

.sync-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1px solid #f0f0f0;
}

.sync-time {
  font-size: 24rpx;
  color: #666;
}

.btn-sync {
  padding: 8rpx 20rpx;
  font-size: 22rpx;
  background-color: #3cc51f;
  color: #fff;
  border: none;
  border-radius: 6rpx;
}

.btn-sync[disabled] {
  opacity: 0.6;
}

.sync-error {
  margin-top: 16rpx;
  padding: 16rpx;
  background-color: #fff1f0;
  border-radius: 8rpx;
}

.error-text {
  font-size: 24rpx;
  color: #ff4d4f;
}
</style>
