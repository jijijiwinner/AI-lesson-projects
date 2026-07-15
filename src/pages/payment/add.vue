<template>
  <view class="add-payment-page">
    <view class="header">
      <text class="title">{{ isEdit ? '编辑支付' : '添加支付' }}</text>
    </view>

    <view class="content">
      <view class="form">
        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            支付日期
          </view>
          <picker mode="date" :value="formData.paymentDate" @change="handleDateChange">
            <view class="picker-input">
              {{ formData.paymentDate ? `${formData.paymentDate} ${getWeekday(formData.paymentDate)}` : '请选择支付日期' }}
            </view>
          </picker>
        </view>

        <view class="packages-section">
          <view class="section-header">
            <text class="section-title">课程包列表</text>
            <button class="btn-add-package" @click="handleAddPackage">+ 添加课程包</button>
          </view>

          <view
            v-for="(pkg, index) in formData.packages"
            :key="index"
            class="package-item"
          >
            <view class="package-header">
              <text class="package-index">课程包 {{ index + 1 }}</text>
              <view class="btn-remove" @click="handleRemovePackage(index)">×</view>
            </view>

            <view class="package-form">
              <view class="form-item">
                <view class="form-label">
                  <text class="required">*</text>
                  课程类型
                </view>
                <picker
                  mode="selector"
                  :range="courseTypeOptions"
                  range-key="label"
                  :value="getCourseTypeIndex(pkg.courseType)"
                  @change="(e) => handleCourseTypeChange(e, index)"
                >
                  <view class="picker-input">
                    {{ getCourseTypeName(pkg.courseType) || '请选择课程类型' }}
                  </view>
                </picker>
              </view>

              <view class="form-item">
                <view class="form-label">
                  <text class="required">*</text>
                  课程名称
                </view>
                <input
                  v-model="pkg.courseName"
                  class="form-input"
                  placeholder="请输入课程名称"
                />
              </view>

              <view class="form-row">
                <view class="form-item flex-1">
                  <view class="form-label">
                    <text class="required">*</text>
                    学时数
                  </view>
                  <input
                    v-model.number="pkg.hours"
                    class="form-input"
                    type="number"
                    placeholder="请输入学时"
                  />
                </view>

                <view class="form-item flex-1">
                  <view class="form-label">
                    <text class="required">*</text>
                    价格（元）
                  </view>
                  <input
                    v-model.number="pkg.price"
                    class="form-input"
                    type="number"
                    placeholder="请输入价格"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="form-item">
          <view class="form-label">总金额</view>
          <view class="total-amount">¥{{ totalAmount.toFixed(2) }}</view>
        </view>

        <view class="form-item">
          <view class="form-label">备注</view>
          <textarea
            v-model="formData.remark"
            class="form-textarea"
            placeholder="请输入备注（选填）"
            maxlength="200"
          />
        </view>

        <view class="form-actions">
          <button class="btn-default" @click="handleCancel">取消</button>
          <button class="btn-primary ml-20" @click="handleSubmit">
            {{ isEdit ? '保存' : '添加' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useCourseCloudStore } from '../../stores/courseCloud';
import { CourseTypeEnum } from '../../types/course';
import { getCurrentDate, getWeekday } from '../../utils/date';

const COURSE_TYPE_OPTIONS = [
  { label: '认知课程', value: CourseTypeEnum.COGNITION },
  { label: '感统课程', value: CourseTypeEnum.SENSORY },
  { label: '言语课程', value: CourseTypeEnum.SPEECH },
  { label: '其他课程', value: CourseTypeEnum.OTHER },
];

const courseStore = useCourseCloudStore();
const isEdit = ref(false);
const editId = ref('');

const courseTypeOptions = COURSE_TYPE_OPTIONS;

interface PackageFormItem {
  courseType: CourseTypeEnum | '';
  courseName: string;
  hours: number | '';
  price: number | '';
}

interface FormDataTypes {
  paymentDate: string;
  packages: PackageFormItem[];
  remark: string;
}

const formData = ref<FormDataTypes>({
  paymentDate: getCurrentDate(),
  packages: [],
  remark: '',
});

const totalAmount = computed(() => {
  return formData.value.packages.reduce((sum, pkg) => {
    return sum + (typeof pkg.price === 'number' ? pkg.price : 0);
  }, 0);
});

onLoad((options) => {
  if (options?.id) {
    isEdit.value = true;
    editId.value = options.id as string;
    loadPaymentData(options.id as string);
  } else {
    handleAddPackage();
  }
});

function loadPaymentData(id: string) {
  const payment = courseStore.getPaymentRecordById(id);
  if (payment) {
    formData.value = {
      paymentDate: payment.paymentDate,
      packages: payment.packages.map((pkg) => ({ ...pkg })),
      remark: payment.remark,
    };
  }
}

function handleDateChange(e: any) {
  formData.value.paymentDate = e.detail.value;
}

function getCourseTypeIndex(courseType: CourseTypeEnum | '') {
  if (!courseType) return 0;
  return courseTypeOptions.findIndex((item) => item.value === courseType);
}

function getCourseTypeName(courseType: CourseTypeEnum | '') {
  const option = courseTypeOptions.find((item) => item.value === courseType);
  return option?.label || '';
}

function handleCourseTypeChange(e: any, index: number) {
  const selectedIndex = e.detail.value;
  formData.value.packages[index].courseType = courseTypeOptions[selectedIndex].value;
}

function handleAddPackage() {
  formData.value.packages.push({
    courseType: '',
    courseName: '',
    hours: '',
    price: '',
  });
}

function handleRemovePackage(index: number) {
  if (formData.value.packages.length === 1) {
    uni.showToast({
      title: '至少保留一个课程包',
      icon: 'none',
    });
    return;
  }
  formData.value.packages.splice(index, 1);
}

function handleSubmit() {
  if (!formData.value.paymentDate) {
    uni.showToast({
      title: '请选择支付日期',
      icon: 'none',
    });
    return;
  }

  if (formData.value.packages.length === 0) {
    uni.showToast({
      title: '请至少添加一个课程包',
      icon: 'none',
    });
    return;
  }

  for (let i = 0; i < formData.value.packages.length; i++) {
    const pkg = formData.value.packages[i];
    if (!pkg.courseType) {
      uni.showToast({
        title: `课程包${i + 1}：请选择课程类型`,
        icon: 'none',
      });
      return;
    }
    if (!pkg.courseName.trim()) {
      uni.showToast({
        title: `课程包${i + 1}：请输入课程名称`,
        icon: 'none',
      });
      return;
    }
    if (!pkg.hours || pkg.hours <= 0) {
      uni.showToast({
        title: `课程包${i + 1}：请输入有效学时`,
        icon: 'none',
      });
      return;
    }
    if (!pkg.price || pkg.price <= 0) {
      uni.showToast({
        title: `课程包${i + 1}：请输入有效价格`,
        icon: 'none',
      });
      return;
    }
  }

  if (isEdit.value) {
    const success = courseStore.updatePaymentRecord(editId.value, {
      paymentDate: formData.value.paymentDate,
      amount: totalAmount.value,
      packages: formData.value.packages.map((pkg) => ({
        courseType: pkg.courseType as CourseTypeEnum,
        courseName: pkg.courseName,
        hours: pkg.hours as number,
        price: pkg.price as number,
      })),
      remark: formData.value.remark,
    });

    if (success) {
      uni.showToast({
        title: '保存成功',
        icon: 'success',
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  } else {
    courseStore.addPaymentRecord({
      paymentDate: formData.value.paymentDate,
      amount: totalAmount.value,
      packages: formData.value.packages.map((pkg) => ({
        courseType: pkg.courseType as CourseTypeEnum,
        courseName: pkg.courseName,
        hours: pkg.hours as number,
        price: pkg.price as number,
      })),
      remark: formData.value.remark,
    });

    uni.showToast({
      title: '添加成功',
      icon: 'success',
    });

    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
}

function handleCancel() {
  uni.navigateBack();
}
</script>

<style scoped>
.add-payment-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.content {
  padding: 30rpx;
  box-sizing: border-box;
}

.form {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.form-item {
  margin-bottom: 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.required {
  color: #ff4d4f;
  margin-right: 8rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #667eea;
  background-color: #fff;
}

.picker-input {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 24rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 16rpx 24rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #667eea;
  background-color: #fff;
}

.packages-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.btn-add-package {
  padding: 8rpx 20rpx;
  background-color: #667eea;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
  line-height: 1.4;
}

.package-item {
  margin-bottom: 24rpx;
  padding: 20rpx;
  background-color: #fafafa;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.package-index {
  font-size: 28rpx;
  font-weight: bold;
  color: #667eea;
}

.btn-remove {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  font-size: 48rpx;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.btn-remove:active {
  opacity: 0.8;
  transform: scale(0.95);
}

.package-form {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.package-form .form-item {
  margin-bottom: 0;
}

.form-row {
  display: flex;
  gap: 16rpx;
  width: 100%;
}

.form-row .form-item {
  margin-bottom: 0;
  min-width: 0;
}

.flex-1 {
  flex: 1;
  min-width: 0;
}

.total-amount {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 24rpx;
  background-color: #fff7e6;
  border: 2rpx solid #ffd666;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #fa8c16;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  padding: 0;
}

.btn-default {
  flex: 1;
  height: 88rpx;
  background-color: #fff;
  color: #666;
  border: 2rpx solid #d9d9d9;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-default::after {
  border: none;
}

.btn-primary {
  flex: 1;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary::after {
  border: none;
}

.ml-20 {
  margin-left: 0;
}
</style>
