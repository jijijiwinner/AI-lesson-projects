<template>
  <view class="settings-page">
    <view class="container">
      <!-- 费用管理 -->
      <view class="section-card card">
        <view class="section-title">💰 费用管理</view>
        <view class="setting-item" @click="handleGoToPayment">
          <view class="setting-info">
            <text class="setting-label">费用记录</text>
            <text class="setting-desc">查看和管理支付记录</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
        <view class="setting-item" @click="handleImportHistoricalPayments">
          <view class="setting-info">
            <text class="setting-label">导入历史费用</text>
            <text class="setting-desc">一键导入2025年历史支付记录</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
      </view>

      <!-- 数据管理 -->
      <view class="section-card card">
        <view class="section-title">📊 数据管理</view>
        <view class="setting-item" @click="handleExportData">
          <view class="setting-info">
            <text class="setting-label">导出数据</text>
            <text class="setting-desc">导出所有数据为JSON文件</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
        <view class="setting-item" @click="handleImportData">
          <view class="setting-info">
            <text class="setting-label">导入数据</text>
            <text class="setting-desc">从JSON文件导入数据</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
        <view class="setting-item" @click="handleFixData">
          <view class="setting-info">
            <text class="setting-label">修复数据</text>
            <text class="setting-desc">重新计算课程包剩余学时</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
      </view>

      <!-- 统计信息 -->
      <view class="stats-card card">
        <view class="section-title">📈 数据统计</view>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-label">课程包</text>
            <text class="stat-value">{{ statistics.totalPackages }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">总记录</text>
            <text class="stat-value">{{ lessonRecordList.length }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">总学时</text>
            <text class="stat-value">{{ statistics.totalHours }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">已消耗</text>
            <text class="stat-value">{{ statistics.totalConsumedHours }}</text>
          </view>
          <view v-if="statistics.totalPayment" class="stat-item stat-payment">
            <text class="stat-label">总支出</text>
            <text class="stat-value stat-payment-value">¥{{ statistics.totalPayment.toFixed(2) }}</text>
          </view>
        </view>
      </view>

      <!-- 危险操作 -->
      <view class="danger-card card">
        <view class="section-title text-danger">⚠️ 危险操作</view>
        <button class="btn-danger" @click="handleClearData">
          清空所有数据
        </button>
      </view>

      <!-- 关于 -->
      <view class="about-card card">
        <view class="section-title">ℹ️ 关于</view>
        <view class="about-info">
          <text class="about-text">课程学时登记系统 v1.0.0</text>
          <text class="about-text">帮助您轻松管理课程学时</text>
          <text class="about-text" style="color: #3cc51f; margin-top: 8rpx;">数据存储：Supabase 云端</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCourseCloudStore } from '@/stores/courseCloud';

const store = useCourseCloudStore();

const statistics = computed(() => store.statistics);
const lessonRecordList = computed(() => store.lessonRecordList);

/**
 * 跳转到费用记录
 */
function handleGoToPayment() {
  uni.navigateTo({
    url: '/pages/payment/index',
  });
}

/**
 * 导入历史费用数据
 */
function handleImportHistoricalPayments() {
  uni.showModal({
    title: '导入历史费用',
    content: '将导入2025年8月至2026年1月的历史支付记录，确认导入吗？',
    success: (res) => {
      if (res.confirm) {
        importHistoricalPayments();
      }
    },
  });
}

/**
 * 执行导入历史费用数据
 */
async function importHistoricalPayments() {
  const historicalPayments = [
    {
      paymentDate: '2025-08-01',
      amount: 27000,
      packages: [
        {
          courseType: 'cognition' as any,
          courseName: '个训课程',
          hours: 48,
          price: 13200,
        },
        {
          courseType: 'sensory' as any,
          courseName: '感统课程',
          hours: 48,
          price: 13800,
        },
      ],
      remark: '第一次上课购买',
    },
    {
      paymentDate: '2025-10-15',
      amount: 31200,
      packages: [
        {
          courseType: 'cognition' as any,
          courseName: '个训课程',
          hours: 48,
          price: 13200,
        },
        {
          courseType: 'sensory' as any,
          courseName: '感统课程',
          hours: 48,
          price: 13800,
        },
        {
          courseType: 'speech' as any,
          courseName: '言语课程',
          hours: 12,
          price: 4200,
        },
      ],
      remark: '续费 - 新增言语课程',
    },
    {
      paymentDate: '2025-12-06',
      amount: 12600,
      packages: [
        {
          courseType: 'speech' as any,
          courseName: '言语课程',
          hours: 48,
          price: 12600,
        },
      ],
      remark: '言语课程续费',
    },
    {
      paymentDate: '2026-01-06',
      amount: 40800,
      packages: [
        {
          courseType: 'sensory' as any,
          courseName: '感统课程',
          hours: 48,
          price: 13800,
        },
        {
          courseType: 'sensory' as any,
          courseName: '感统课程（第二组）',
          hours: 48,
          price: 13800,
        },
        {
          courseType: 'cognition' as any,
          courseName: '认知课程',
          hours: 48,
          price: 13200,
        },
      ],
      remark: '感统2组+认知1组',
    },
  ];

  // 检查是否已经导入过
  const existingPayments = store.paymentRecordList;
  const existingDates = new Set(existingPayments.map((p: any) => p.paymentDate));

  // 过滤掉已存在的记录
  const newPayments = historicalPayments.filter(
    (payment: any) => !existingDates.has(payment.paymentDate),
  );

  if (newPayments.length === 0) {
    uni.showToast({
      title: '历史数据已存在，无需重复导入',
      icon: 'none',
      duration: 2000,
    });
    return;
  }

  // 导入数据
  let successCount = 0;
  for (const payment of newPayments) {
    try {
      await store.addPaymentRecord(payment);
      successCount++;
    } catch (error) {
      console.error('导入支付记录失败:', error);
    }
  }

  if (successCount > 0) {
    uni.showModal({
      title: '导入成功',
      content: `成功导入 ${successCount} 条历史支付记录\n\n总金额：¥${newPayments.reduce((sum: number, p: any) => sum + p.amount, 0).toFixed(2)}`,
      showCancel: false,
      success: () => {
        // 跳转到费用记录页面
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/payment/index',
          });
        }, 500);
      },
    });
  } else {
    uni.showToast({
      title: '导入失败',
      icon: 'none',
    });
  }
}

/**
 * 修复数据
 */
function handleFixData() {
  console.log('handleFixData 被调用');
  console.log('当前课程包数量:', store.coursePackageList.length);
  console.log('当前记录数量:', store.lessonRecordList.length);

  uni.showModal({
    title: '修复数据',
    content: '将根据所有记录重新计算每个课程包的剩余学时，确认修复吗？',
    success: (res) => {
      console.log('Modal success callback, confirm:', res.confirm);
      if (res.confirm) {
        console.log('开始修复数据...');
        store.recalculateRemainingHours().then((result) => {
          console.log('修复结果:', result);

          if (result.count > 0) {
            const detailText = result.details.join('\n');
            uni.showModal({
              title: '修复完成',
              content: `已修复 ${result.count} 个课程包：\n${detailText}`,
              showCancel: false,
              success: () => {
                console.log('准备刷新页面...');
                // 刷新页面以显示最新数据
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/home/index',
                  });
                }, 500);
              },
            });
          } else {
            console.log('数据无需修复');
            uni.showToast({
              title: '数据无需修复',
              icon: 'success',
            });
          }
        });
      }
    },
  });
}

/**
 * 导出数据
 */
function handleExportData() {
  const data = {
    packages: store.coursePackageList,
    records: store.lessonRecordList,
    payments: store.paymentRecordList,
    exportTime: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(data, null, 2);

  // H5环境下载文件
  if (typeof window !== 'undefined') {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    uni.showToast({
      title: '导出成功',
      icon: 'success',
    });
  } else {
    uni.showToast({
      title: '当前环境不支持导出',
      icon: 'none',
    });
  }
}

/**
 * 导入数据
 */
function handleImportData() {
  // H5 环境使用 input file
  if (typeof window !== 'undefined' && window.document) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // 验证数据格式
        if (!data.packages || !data.records) {
          uni.showToast({
            title: '数据格式错误',
            icon: 'none',
          });
          return;
        }

        // 如果没有payments字段，设置为空数组
        if (!data.payments) {
          data.payments = [];
        }

        // 询问用户是否覆盖
        uni.showModal({
          title: '导入数据',
          content: `将导入${data.packages.length}个课程包、${data.records.length}条记录和${data.payments?.length || 0}条费用记录\n\n现有数据将被清空，确认导入吗？`,
          confirmColor: '#ff4d4f',
          success: async (res) => {
            if (res.confirm) {
              try {
                await store.importAllData({
                  packages: data.packages,
                  records: data.records,
                  payments: data.payments || [],
                });

                uni.showToast({
                  title: '导入成功',
                  icon: 'success',
                });

                // 刷新页面
                setTimeout(() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }, 1500);
              } catch (error: any) {
                console.error('导入失败:', error);
                uni.showToast({
                  title: `导入失败: ${error.message || '未知错误'}`,
                  icon: 'none',
                  duration: 3000,
                });
              }
            }
          },
        });
      } catch (error) {
        console.error('导入失败:', error);
        uni.showToast({
          title: '文件格式错误',
          icon: 'none',
        });
      }
    };

    input.click();
  } else {
    // APP 环境
    uni.showToast({
      title: 'APP环境请使用文件管理器',
      icon: 'none',
    });
  }
}

/**
 * 清空数据
 */
function handleClearData() {
  uni.showModal({
    title: '危险操作',
    content: '确定要清空所有数据吗？此操作不可恢复！',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        uni.showModal({
          title: '最后确认',
          content: '数据清空后将无法恢复，请再次确认！',
          confirmColor: '#ff4d4f',
          success: async (res2) => {
            if (res2.confirm) {
              try {
                await store.clearAllData();
                uni.showToast({
                  title: '数据已清空',
                  icon: 'success',
                });
              } catch (error) {
                console.error('清空数据失败:', error);
                uni.showToast({
                  title: '清空失败',
                  icon: 'none',
                });
              }
            }
          },
        });
      }
    },
  });
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.section-card,
.stats-card,
.danger-card,
.about-card {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.setting-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.setting-arrow {
  font-size: 40rpx;
  color: #ccc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-item {
  text-align: center;
  padding: 32rpx 0;
  background-color: #f8f8f8;
  border-radius: 12rpx;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.stat-value {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #3cc51f;
}

.danger-card .btn-danger {
  width: 100%;
  padding: 24rpx 0;
  font-size: 28rpx;
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 8rpx;
}

.about-card .about-info {
  text-align: center;
}

.about-text {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
}
</style>
