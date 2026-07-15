<template>
  <view class="edit-record-page">
    <view class="container">
      <view class="form-card card">
        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            课程包
          </view>
          <view class="form-static">{{ currentRecord?.courseName }}</view>
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            记录类型
          </view>
          <view class="form-static">{{ getRecordTypeName(currentRecord?.recordType || 'consume') }}</view>
        </view>

        <view v-if="formData.recordType === 'consume'" class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            消耗学时
          </view>
          <input
            v-model.number="formData.consumeHours"
            class="form-input"
            type="number"
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
          <button class="btn-default" @click="handleCancel">取消</button>
          <button class="btn-primary ml-20" @click="handleSubmit">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
import { RECORD_TYPE_MAP } from '@/constants/course';
import { getWeekday } from '@/utils/date';
import type { RecordTypeEnum } from '@/types/course';

const courseStore = useCourseStore();

const recordId = ref('');
const currentRecord = computed(() => {
  return courseStore.lessonRecordList.find((r) => r.id === recordId.value);
});

interface FormDataTypes {
  recordType: RecordTypeEnum | '';
  consumeHours: number | '';
  recordDate: string;
  remark: string;
}

const formData = ref<FormDataTypes>({
  recordType: '',
  consumeHours: '',
  recordDate: '',
  remark: '',
});

onLoad((options) => {
  if (options?.id) {
    recordId.value = options.id as string;
    loadRecordData();
  }
});

/**
 * 加载记录数据
 */
function loadRecordData() {
  if (!currentRecord.value) {
    uni.showToast({
      title: '记录不存在',
      icon: 'none',
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
    return;
  }

  formData.value = {
    recordType: currentRecord.value.recordType,
    consumeHours: currentRecord.value.consumeHours,
    recordDate: currentRecord.value.recordDate,
    remark: currentRecord.value.remark || '',
  };
}

/**
 * 获取记录类型名称
 */
function getRecordTypeName(type: RecordTypeEnum): string {
  return RECORD_TYPE_MAP[type] || '';
}

/**
 * 日期改变
 */
function handleDateChange(e: any) {
  formData.value.recordDate = e.detail.value;
}

/**
 * 表单验证
 */
function validateForm(): boolean {
  if (formData.value.recordType === 'consume') {
    if (!formData.value.consumeHours || formData.value.consumeHours <= 0) {
      uni.showToast({
        title: '请输入正确的消耗学时',
        icon: 'none',
      });
      return false;
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

  const updateData: any = {
    recordDate: formData.value.recordDate,
    remark: formData.value.remark,
  };

  if (formData.value.recordType === 'consume') {
    updateData.consumeHours = formData.value.consumeHours as number;
  }

  const success = courseStore.updateLessonRecord(recordId.value, updateData);

  if (success) {
    uni.showToast({
      title: '保存成功',
      icon: 'success',
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
}

/**
 * 取消
 */
function handleCancel() {
  uni.navigateBack();
}
</script>

<style scoped>
.edit-record-page {
  min-height: 100vh;
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

.form-static {
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 24rpx;
  background-color: #fafafa;
  border-radius: 8rpx;
  border: 1px solid #e5e5e5;
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
</style>
