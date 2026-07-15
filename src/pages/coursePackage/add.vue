<template>
  <view class="add-package-page">
    <view class="container">
      <view class="form-card card">
        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            课程类型
          </view>
          <picker
            mode="selector"
            :range="courseTypeOptions"
            range-key="label"
            :value="selectedTypeIndex"
            @change="handleTypeChange"
          >
            <view class="picker-input">
              {{ formData.courseType ? getCourseTypeName(formData.courseType) : '请选择课程类型' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            课程名称
          </view>
          <input
            v-model="formData.courseName"
            class="form-input"
            type="text"
            placeholder="请输入课程名称"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            总学时
          </view>
          <input
            v-model.number="formData.totalHours"
            class="form-input"
            type="number"
            placeholder="请输入总学时"
          />
          <view v-if="isEdit && hasConsumedHours" class="form-hint">
            <text class="hint-text">提示：该课程已消耗 {{ consumedHoursCount }} 学时，总学时不能小于此数值</text>
          </view>
        </view>

        <view class="form-item">
          <view class="form-label">
            <text class="required">*</text>
            购买日期
          </view>
          <picker mode="date" :value="formData.purchaseDate" @change="handleDateChange">
            <view class="picker-input">
              {{ formData.purchaseDate ? `${formData.purchaseDate} ${getWeekday(formData.purchaseDate)}` : '请选择购买日期' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <view class="form-label">价格（元）</view>
          <input
            v-model.number="formData.price"
            class="form-input"
            type="number"
            placeholder="请输入价格（选填）"
          />
        </view>

        <view v-if="!isEdit" class="form-tips">
          <text class="tips-text">提示：请仔细核对总学时数量</text>
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
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useCourseCloudStore as useCourseStore } from '@/stores/courseCloud';
import { COURSE_TYPE_OPTIONS, COURSE_TYPE_MAP } from '@/constants/course';
import { getCurrentDate, getWeekday } from '@/utils/date';
import type { CourseTypeEnum } from '@/types/course';

const courseStore = useCourseStore();

const courseTypeOptions = COURSE_TYPE_OPTIONS;
const isEdit = ref(false);
const editId = ref('');
const originalTotalHours = ref(0);
const hasConsumedHours = ref(false);
const consumedHoursCount = ref(0);

interface FormDataTypes {
  courseType: CourseTypeEnum | '';
  courseName: string;
  totalHours: number | '';
  purchaseDate: string;
  price: number | '';
}

const formData = ref<FormDataTypes>({
  courseType: '',
  courseName: '',
  totalHours: '',
  purchaseDate: getCurrentDate(),
  price: '',
});

const selectedTypeIndex = computed(() => {
  if (!formData.value.courseType) return 0;
  return courseTypeOptions.findIndex((item) => item.value === formData.value.courseType);
});

onLoad((options) => {
  if (options?.id) {
    isEdit.value = true;
    editId.value = options.id as string;
    loadPackageData(options.id as string);
  }
});

/**
 * 加载课程包数据
 */
function loadPackageData(id: string) {
  const coursePackage = courseStore.getCoursePackageById(id);
  if (coursePackage) {
    originalTotalHours.value = coursePackage.totalHours;
    consumedHoursCount.value = coursePackage.totalHours - coursePackage.remainingHours;
    hasConsumedHours.value = consumedHoursCount.value > 0;
    
    formData.value = {
      courseType: coursePackage.courseType,
      courseName: coursePackage.courseName,
      totalHours: coursePackage.totalHours,
      purchaseDate: coursePackage.purchaseDate,
      price: coursePackage.price || '',
    };
  }
}

/**
 * 获取课程类型名称
 */
function getCourseTypeName(type: CourseTypeEnum): string {
  return COURSE_TYPE_MAP[type] || '';
}

/**
 * 课程类型改变
 */
function handleTypeChange(e: any) {
  const index = e.detail.value;
  formData.value.courseType = courseTypeOptions[index].value as CourseTypeEnum;
}

/**
 * 日期改变
 */
function handleDateChange(e: any) {
  formData.value.purchaseDate = e.detail.value;
}

/**
 * 表单验证
 */
function validateForm(): boolean {
  if (!formData.value.courseType) {
    uni.showToast({
      title: '请选择课程类型',
      icon: 'none',
    });
    return false;
  }

  if (!formData.value.courseName.trim()) {
    uni.showToast({
      title: '请输入课程名称',
      icon: 'none',
    });
    return false;
  }

  if (!formData.value.totalHours || formData.value.totalHours <= 0) {
    uni.showToast({
      title: '请输入正确的总学时',
      icon: 'none',
    });
    return false;
  }

  if (!formData.value.purchaseDate) {
    uni.showToast({
      title: '请选择购买日期',
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

  if (isEdit.value) {
    // 编辑模式
    const coursePackage = courseStore.getCoursePackageById(editId.value);
    if (!coursePackage) {
      uni.showToast({
        title: '课程包不存在',
        icon: 'none',
      });
      return;
    }

    const consumedHours = coursePackage.totalHours - coursePackage.remainingHours;
    const newTotalHours = formData.value.totalHours as number;

    // 检查新的总学时是否小于已消耗的学时
    if (newTotalHours < consumedHours) {
      uni.showModal({
        title: '无法保存',
        content: `已消耗 ${consumedHours} 学时，总学时不能小于已消耗学时`,
        showCancel: false,
        confirmColor: '#ff4d4f',
      });
      return;
    }

    // 如果总学时有变化，需要重新计算剩余学时
    const updateData: any = {
      courseType: formData.value.courseType as CourseTypeEnum,
      courseName: formData.value.courseName,
      purchaseDate: formData.value.purchaseDate,
    };

    if (formData.value.price) {
      updateData.price = formData.value.price as number;
    }

    if (newTotalHours !== originalTotalHours.value) {
      updateData.totalHours = newTotalHours;
      updateData.remainingHours = newTotalHours - consumedHours;
    }

    const success = courseStore.updateCoursePackage(editId.value, updateData);

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
    // 新增模式
    const packageData: any = {
      courseType: formData.value.courseType as CourseTypeEnum,
      courseName: formData.value.courseName,
      totalHours: formData.value.totalHours as number,
      purchaseDate: formData.value.purchaseDate,
    };

    if (formData.value.price) {
      packageData.price = formData.value.price as number;
    }

    courseStore.addCoursePackage(packageData);

    uni.showToast({
      title: '添加成功',
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
.add-package-page {
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

.form-input[disabled] {
  background-color: #f0f0f0;
  color: #999;
}

.form-hint {
  margin-top: 8rpx;
  padding: 8rpx 12rpx;
  background-color: #fff7e6;
  border-radius: 4rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #ff9500;
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

.form-tips {
  padding: 20rpx;
  background-color: #fff7e6;
  border-radius: 8rpx;
  margin-bottom: 32rpx;
}

.tips-text {
  font-size: 24rpx;
  color: #ff9500;
}

.form-actions {
  display: flex;
  gap: 20rpx;
}

.form-actions button {
  flex: 1;
  padding: 24rpx 0;
  font-size: 28rpx;
}
</style>
