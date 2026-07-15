<template>
  <view class="payment-page">
    <view class="header">
      <view class="header-stats">
        <view class="stat-item">
          <text class="stat-value">¥{{ totalPayment.toFixed(2) }}</text>
          <text class="stat-label">总支出</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ paymentRecordList.length }}</text>
          <text class="stat-label">支付次数</text>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="section-header">
        <text class="section-title">费用记录</text>
        <button class="btn-add" @click="handleAddPayment">+ 添加支付</button>
      </view>

      <view v-if="paymentRecordList.length === 0" class="empty-state">
        <text class="empty-text">暂无费用记录</text>
      </view>

      <view v-else class="payment-list">
        <view
          v-for="payment in sortedPaymentList"
          :key="payment.id"
          class="payment-item"
        >
          <view class="payment-header">
            <text class="payment-date">{{ payment.paymentDate }} {{ getWeekday(payment.paymentDate) }}</text>
            <text class="payment-amount">¥{{ payment.amount.toFixed(2) }}</text>
          </view>
          
          <view class="payment-packages">
            <view
              v-for="(pkg, index) in payment.packages"
              :key="index"
              class="package-detail"
            >
              <text class="package-name">{{ pkg.courseName }} {{ pkg.hours }}学时</text>
              <text class="package-price">¥{{ pkg.price.toFixed(2) }}</text>
            </view>
          </view>

          <view v-if="payment.remark" class="payment-remark">
            <text class="remark-text">{{ payment.remark }}</text>
          </view>

          <view class="payment-actions">
            <view class="btn-edit-mini" @click.stop="handleEditPayment(payment)">
              编辑
            </view>
            <view class="btn-delete-mini" @click.stop="handleDeletePayment(payment)">
              删除
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCourseCloudStore } from '../../stores/courseCloud';
import { getWeekday } from '../../utils/date';

const courseStore = useCourseCloudStore();

const paymentRecordList = computed(() => courseStore.paymentRecordList);

const sortedPaymentList = computed(() => {
  return [...paymentRecordList.value].sort((a, b) => {
    return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
  });
});

const totalPayment = computed(() => {
  return paymentRecordList.value.reduce((sum, payment) => sum + payment.amount, 0);
});

function handleAddPayment() {
  uni.navigateTo({
    url: '/pages/payment/add',
  });
}

function handleEditPayment(payment: any) {
  uni.navigateTo({
    url: `/pages/payment/add?id=${payment.id}`,
  });
}

function handleDeletePayment(payment: any) {
  uni.showModal({
    title: '删除确认',
    content: `确定要删除这条支付记录吗？（金额：¥${payment.amount.toFixed(2)}）`,
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        courseStore.deletePaymentRecord(payment.id);
        uni.showToast({
          title: '删除成功',
          icon: 'success',
        });
      }
    },
  });
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx 30rpx;
  color: #fff;
}

.header-stats {
  display: flex;
  justify-content: space-around;
  gap: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}

.stat-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

.content {
  padding: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.btn-add {
  padding: 12rpx 24rpx;
  background-color: #667eea;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  line-height: 1.4;
}

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

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.payment-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.payment-date {
  font-size: 28rpx;
  color: #666;
}

.payment-amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.payment-packages {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.package-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
}

.package-name {
  font-size: 28rpx;
  color: #333;
}

.package-price {
  font-size: 28rpx;
  color: #666;
}

.payment-remark {
  margin-bottom: 20rpx;
  padding: 16rpx;
  background-color: #fffbe6;
  border-left: 4rpx solid #faad14;
  border-radius: 4rpx;
}

.remark-text {
  font-size: 26rpx;
  color: #8c8c8c;
  line-height: 1.6;
}

.payment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-edit-mini,
.btn-delete-mini {
  padding: 8rpx 24rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  cursor: pointer;
  user-select: none;
}

.btn-edit-mini {
  background-color: #f0f5ff;
  color: #1890ff;
}

.btn-delete-mini {
  background-color: #fff1f0;
  color: #ff4d4f;
}
</style>
