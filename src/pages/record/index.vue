<template>
  <view class="record-page">
    <view class="container">
      <view class="form-card card">
        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            选择课程包
          </view>
          <picker
            mode="selector"
            :range="coursePackageList"
            range-key="courseName"
            :value="selectedPackageIndex"
            @change="handlePackageChange"
          >
            <view class="picker-input">
              {{ selectedPackage ? selectedPackage.courseName : '请选择课程包' }}
            </view>
          </picker>
          <view v-if="selectedPackage" class="package-info-tip">
            <text class="tip-text">
              剩余学时：{{ selectedPackage.remainingHours }} / {{ selectedPackage.totalHours }}
            </text>
          </view>
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            记录类型
          </view>
          <radio-group class="radio-group" @change="handleRecordTypeChange">
            <label
              v-for="item in recordTypeOptions"
              :key="item.value"
              class="radio-item"
            >
              <radio
                :value="item.value"
                :checked="formData.recordType === item.value"
                color="#3cc51f"
              />
              <text class="radio-label">{{ item.label }}</text>
            </label>
          </radio-group>
        </view>

        <view v-if="formData.recordType === 'consume'" class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            消耗学时
          </view>
          <input
            v-model.number="formData.consumeHours"
            class="form-input"
            type="digit"
            placeholder="请输入消耗学时"
          />
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            记录日期
          </view>
          <picker mode="date" :value="formData.recordDate" @change="handleDateChange">
            <view class="picker-input">
              {{ formData.recordDate ? `${formData.recordDate} ${getWeekday(formData.recordDate)}` : '请选择记录日期' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <view class="form-label">备注</view>
          <textarea
            v-model="formData.remark"
            class="form-textarea"
            placeholder="请输入备注信息（选填）"
            maxlength="200"
            :show-confirm-bar="false"
          />
          <view class="textarea-counter">{{ formData.remark.length }}/200</view>
        </view>

        <view class="form-actions">
          <button class="btn-default" @click="handleReset">重置</button>
          <button class="btn-primary ml-20" @click="handleSubmit">提交</button>
        </view>
      </view>

      <!-- 今日记录 -->
      <view v-if="todayRecordList.length > 0" class="today-records">
        <view class="section-title">今日记录</view>
        <view
          v-for="record in todayRecordList"
          :key="record.id"
          class="record-item card"
        >
          <view class="record-header flex-between">
            <view class="record-course">{{ record.courseName }}</view>
            <view
              class="record-type"
              :style="{ color: getRecordTypeColor(record.recordType) }"
            >
              {{ getRecordTypeName(record.recordType) }}
            </view>
          </view>
          <view v-if="record.consumeHours > 0" class="record-hours">
            消耗学时：{{ record.consumeHours }} 学时
          </view>
          <view v-if="record.remark" class="record-remark">
            备注：{{ record.remark }}
          </view>
          <view class="record-footer flex-between">
            <text class="record-time text-secondary">
              {{ formatTime(record.createTime) }}
            </text>
            <view class="record-actions">
              <button class="btn-edit" size="mini" @click.stop="handleEditRecord(record)">
                编辑
              </button>
              <button class="btn-delete" size="mini" @click.stop="handleDeleteRecord(record)">
                删除
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
import { onLoad } from '@dcloudio/uni-app';
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
import {
  RECORD_TYPE_OPTIONS,
  RECORD_TYPE_MAP,
  RECORD_TYPE_COLOR_MAP,
} from '@/constants/course';
import { getCurrentDate, formatDate, getWeekday } from '@/utils/date';
import type { RecordTypeEnum, LessonRecordTypes } from '@/types/course';

const courseStore = useCourseStore();

const coursePackageList = computed(() => courseStore.coursePackageList);

interface FormDataTypes {
  packageId: string;
  recordType: RecordTypeEnum | '';
  consumeHours: number | '';
  recordDate: string;
  remark: string;
}

const formData = ref<FormDataTypes>({
  packageId: '',
  recordType: 'consume',
  consumeHours: 1,
  recordDate: getCurrentDate(),
  remark: '',
});

const recordTypeOptions = RECORD_TYPE_OPTIONS;

const selectedPackageIndex = computed(() => {
  if (!formData.value.packageId) return 0;
  return coursePackageList.value.findIndex((item) => item.id === formData.value.packageId);
});

const selectedPackage = computed(() => {
  return coursePackageList.value.find((item) => item.id === formData.value.packageId);
});

const todayRecordList = computed(() => {
  return courseStore.getRecordsByDate(getCurrentDate());
});

onLoad((options) => {
  if (options?.packageId) {
    formData.value.packageId = options.packageId as string;
    // 初始化时生成默认备注
    setTimeout(() => {
      updateDefaultRemark();
    }, 100);
  }
});

// 监听记录类型变化
watch(
  () => formData.value.recordType,
  (newType) => {
    if (newType === 'consume') {
      formData.value.consumeHours = 1;
      // 自动生成默认备注
      updateDefaultRemark();
    } else {
      formData.value.consumeHours = 0;
      // 请假类型清空备注
      formData.value.remark = '';
    }
  },
);

// 监听选择的课程包变化，自动生成备注
watch(
  () => formData.value.packageId,
  () => {
    if (formData.value.recordType === 'consume') {
      updateDefaultRemark();
    }
  },
);

/**
 * 更新默认备注
 */
function updateDefaultRemark() {
  if (!selectedPackage.value) return;
  
  const pkg = selectedPackage.value;
  // 计算这是第几课时：总学时 - 剩余学时 + 1
  const lessonNumber = pkg.totalHours - pkg.remainingHours + 1;
  
  // 只有当备注为空或者是之前的默认备注时才更新
  if (!formData.value.remark || formData.value.remark.startsWith('第') && formData.value.remark.includes('课时')) {
    formData.value.remark = `第${lessonNumber}课时`;
  }
}

/**
 * 课程包改变
 */
function handlePackageChange(e: any) {
  const index = e.detail.value;
  formData.value.packageId = coursePackageList.value[index].id;
}

/**
 * 记录类型改变
 */
function handleRecordTypeChange(e: any) {
  formData.value.recordType = e.detail.value;
}

/**
 * 日期改变
 */
function handleDateChange(e: any) {
  formData.value.recordDate = e.detail.value;
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
 * 格式化时间
 */
function formatTime(time: string): string {
  return formatDate(time, 'HH:mm:ss');
}

/**
 * 表单验证
 */
function validateForm(): boolean {
  if (!formData.value.packageId) {
    uni.showToast({
      title: '请选择课程包',
      icon: 'none',
    });
    return false;
  }

  if (!formData.value.recordType) {
    uni.showToast({
      title: '请选择记录类型',
      icon: 'none',
    });
    return false;
  }

  if (formData.value.recordType === 'consume') {
    if (!formData.value.consumeHours || formData.value.consumeHours <= 0) {
      uni.showToast({
        title: '请输入正确的消耗学时',
        icon: 'none',
      });
      return false;
    }

    // 检查剩余学时是否足够
    if (selectedPackage.value) {
      if (formData.value.consumeHours > selectedPackage.value.remainingHours) {
        uni.showToast({
          title: '消耗学时不能大于剩余学时',
          icon: 'none',
        });
        return false;
      }
    }
  }

  if (!formData.value.recordDate) {
    uni.showToast({
      title: '请选择记录日期',
      icon: 'none',
    });
    return false;
  }

  return true;
}

/**
 * 提交表单
 */
function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  const coursePackage = selectedPackage.value;
  if (!coursePackage) {
    return;
  }

  courseStore.addLessonRecord({
    packageId: formData.value.packageId,
    courseType: coursePackage.courseType,
    courseName: coursePackage.courseName,
    recordType: formData.value.recordType as RecordTypeEnum,
    consumeHours: (formData.value.consumeHours as number) || 0,
    recordDate: formData.value.recordDate,
    remark: formData.value.remark,
  });

  uni.showToast({
    title: '提交成功',
    icon: 'success',
  });

  // 重置表单
  handleReset();
}

/**
 * 重置表单
 */
function handleReset() {
  formData.value = {
    packageId: formData.value.packageId,
    recordType: 'consume',
    consumeHours: 1,
    recordDate: getCurrentDate(),
    remark: '',
  };
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
.record-page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.form-card {
  margin-top: 20rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
  margin-right: 4rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
}

.picker-input {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  border: 1px solid #e5e5e5;
  color: #333;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-weekday-hint {
  margin-top: 12rpx;
  padding: 12rpx 16rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  text-align: center;
}

.weekday-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

.package-info-tip {
  margin-top: 12rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #3cc51f;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.radio-item {
  display: flex;
  align-items: center;
}

.radio-label {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  line-height: 1.5;
}

.textarea-counter {
  text-align: right;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.form-actions button {
  flex: 1;
  padding: 24rpx 0;
  font-size: 28rpx;
}

/* 今日记录 */
.today-records {
  margin-top: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.record-item {
  margin-bottom: 20rpx;
}

.record-header {
  margin-bottom: 12rpx;
}

.record-course {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.record-type {
  font-size: 24rpx;
  font-weight: 500;
}

.record-hours {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.record-remark {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.btn-edit {
  padding: 8rpx 20rpx;
  font-size: 22rpx;
  background-color: #f0f9ff;
  color: #1890ff;
  border: none;
  border-radius: 6rpx;
}

.btn-delete {
  padding: 8rpx 20rpx;
  font-size: 22rpx;
  background-color: #fff1f0;
  color: #ff4d4f;
  border: none;
  border-radius: 6rpx;
}
</style>
