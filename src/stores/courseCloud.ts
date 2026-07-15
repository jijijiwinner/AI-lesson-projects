import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CoursePackageTypes, LessonRecordTypes, StatisticsTypes, PaymentRecordTypes } from '@/types/course';
import { generateShortId } from '@/utils/uuid';
import { getCurrentDateTime, isToday, isThisMonth } from '@/utils/date';
import {
  CoursePackageService,
  LessonRecordService,
  PaymentRecordService,
} from '@/services/cloudDatabase';

export const useCourseCloudStore = defineStore('courseCloud', () => {
  // 课程包列表
  const coursePackageList = ref<CoursePackageTypes[]>([]);

  // 学时记录列表
  const lessonRecordList = ref<LessonRecordTypes[]>([]);

  // 费用记录列表
  const paymentRecordList = ref<PaymentRecordTypes[]>([]);

  // 加载状态
  const isLoading = ref(false);
  const loadError = ref<string | null>(null);

  // 历史记录页面筛选的课程包ID
  const historyFilterPackageId = ref<string>('');

  /**
   * 初始化数据（从 Supabase 加载）
   */
  async function initData() {
    isLoading.value = true;
    loadError.value = null;
    try {
      const [packages, records, payments] = await Promise.all([
        CoursePackageService.getAll(),
        LessonRecordService.getAll(),
        PaymentRecordService.getAll(),
      ]);
      coursePackageList.value = packages;
      lessonRecordList.value = records;
      paymentRecordList.value = payments;
    } catch (error: any) {
      console.error('加载数据失败:', error);
      loadError.value = error.message || '加载数据失败';
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 刷新数据（重新从云端加载）
   */
  async function refreshData() {
    await initData();
  }

  /**
   * 添加课程包
   */
  async function addCoursePackage(
    coursePackage: Omit<
      CoursePackageTypes,
      'id' | 'createTime' | 'updateTime' | 'remainingHours' | 'sortOrder'
    >,
  ) {
    const now = getCurrentDateTime();
    const maxOrder = coursePackageList.value.reduce((max, p) => Math.max(max, p.sortOrder ?? 0), -1);
    const newPackage: CoursePackageTypes = {
      id: generateShortId(),
      ...coursePackage,
      remainingHours: coursePackage.totalHours,
      sortOrder: maxOrder + 1,
      createTime: now,
      updateTime: now,
    };

    await CoursePackageService.add(newPackage);
    coursePackageList.value.push(newPackage);

    return newPackage;
  }

  /**
   * 更新课程包
   */
  async function updateCoursePackage(id: string, data: Partial<CoursePackageTypes>) {
    const index = coursePackageList.value.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const updatedData = {
      ...data,
      updateTime: getCurrentDateTime(),
    };

    const updatedPackage = {
      ...coursePackageList.value[index],
      ...updatedData,
    };

    await CoursePackageService.update(id, updatedData);
    coursePackageList.value.splice(index, 1, updatedPackage);

    return true;
  }

  /**
   * 删除课程包
   */
  async function deleteCoursePackage(id: string) {
    const index = coursePackageList.value.findIndex((item) => item.id === id);
    if (index === -1) return false;

    await CoursePackageService.delete(id);
    coursePackageList.value.splice(index, 1);

    // 删除相关记录（Supabase CASCADE 会自动删除）
    lessonRecordList.value = lessonRecordList.value.filter(
      (record) => record.packageId !== id,
    );

    return true;
  }

  /**
   * 根据ID获取课程包
   */
  function getCoursePackageById(id: string) {
    return coursePackageList.value.find((item) => item.id === id);
  }

  /**
   * 添加学时记录
   */
  async function addLessonRecord(record: Omit<LessonRecordTypes, 'id' | 'createTime'>) {
    const now = getCurrentDateTime();
    const newRecord: LessonRecordTypes = {
      id: generateShortId(),
      ...record,
      createTime: now,
    };

    await LessonRecordService.add(newRecord);
    lessonRecordList.value.unshift(newRecord);

    // 重新计算该课程包的剩余学时
    const coursePackage = getCoursePackageById(record.packageId);
    if (coursePackage) {
      const consumedHours = lessonRecordList.value
        .filter((r) => r.packageId === record.packageId && r.recordType === 'consume')
        .reduce((sum, r) => sum + r.consumeHours, 0);

      const correctRemainingHours = coursePackage.totalHours - consumedHours;

      await updateCoursePackage(record.packageId, {
        remainingHours: correctRemainingHours,
      });
    }

    return newRecord;
  }

  /**
   * 更新学时记录
   */
  async function updateLessonRecord(id: string, data: Partial<LessonRecordTypes>) {
    const index = lessonRecordList.value.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const oldRecord = lessonRecordList.value[index];
    const coursePackage = getCoursePackageById(oldRecord.packageId);
    if (!coursePackage) return false;

    // 更新记录
    const updatedRecord = {
      ...oldRecord,
      ...data,
    };

    await LessonRecordService.update(id, data);
    lessonRecordList.value.splice(index, 1, updatedRecord);

    // 重新计算该课程包的剩余学时
    const consumedHours = lessonRecordList.value
      .filter((r) => r.packageId === oldRecord.packageId && r.recordType === 'consume')
      .reduce((sum, r) => sum + r.consumeHours, 0);

    const correctRemainingHours = coursePackage.totalHours - consumedHours;

    await updateCoursePackage(coursePackage.id, {
      remainingHours: correctRemainingHours,
    });

    return true;
  }

  /**
   * 删除学时记录
   */
  async function deleteLessonRecord(id: string) {
    const index = lessonRecordList.value.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const record = lessonRecordList.value[index];
    const coursePackage = getCoursePackageById(record.packageId);

    await LessonRecordService.delete(id);
    lessonRecordList.value.splice(index, 1);

    // 重新计算该课程包的剩余学时
    if (coursePackage) {
      const consumedHours = lessonRecordList.value
        .filter((r) => r.packageId === record.packageId && r.recordType === 'consume')
        .reduce((sum, r) => sum + r.consumeHours, 0);

      const correctRemainingHours = coursePackage.totalHours - consumedHours;

      await updateCoursePackage(record.packageId, {
        remainingHours: correctRemainingHours,
      });
    }

    return true;
  }

  /**
   * 根据日期获取记录列表
   */
  function getRecordsByDate(date: string) {
    return lessonRecordList.value.filter((record) => record.recordDate === date);
  }

  /**
   * 根据课程包ID获取记录列表
   */
  function getRecordsByPackageId(packageId: string) {
    return lessonRecordList.value.filter((record) => record.packageId === packageId);
  }

  /**
   * 统计数据
   */
  const statistics = computed<StatisticsTypes>(() => {
    const totalPackages = coursePackageList.value.length;
    const totalHours = coursePackageList.value.reduce((sum, item) => sum + item.totalHours, 0);
    const totalRemainingHours = coursePackageList.value.reduce(
      (sum, item) => sum + item.remainingHours,
      0,
    );

    // 直接从记录中统计已消耗学时（只统计消耗类型的记录）
    const totalConsumedHours = lessonRecordList.value
      .filter((record) => record.recordType === 'consume')
      .reduce((sum, record) => sum + record.consumeHours, 0);

    const todayRecords = lessonRecordList.value.filter((record) =>
      isToday(record.recordDate),
    ).length;

    const monthRecords = lessonRecordList.value.filter((record) =>
      isThisMonth(record.recordDate),
    ).length;

    const totalPayment = paymentRecordList.value.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalPackages,
      totalHours,
      totalRemainingHours,
      totalConsumedHours,
      todayRecords,
      monthRecords,
      totalPayment,
    };
  });

  /**
   * 设置历史记录页面的筛选课程包ID
   */
  function setHistoryFilterPackageId(packageId: string) {
    historyFilterPackageId.value = packageId;
  }

  /**
   * 清空历史记录页面的筛选
   */
  function clearHistoryFilter() {
    historyFilterPackageId.value = '';
  }

  /**
   * 更新课程包顺序（持久化到数据库）
   */
  async function updateCoursePackageOrder(newOrder: CoursePackageTypes[]) {
    coursePackageList.value = newOrder;
    // 批量更新每个课程包的 sort_order
    await Promise.all(
      newOrder.map((pkg, index) =>
        CoursePackageService.update(pkg.id, { sortOrder: index }),
      ),
    );
  }

  /**
   * 添加费用记录
   */
  async function addPaymentRecord(payment: Omit<PaymentRecordTypes, 'id' | 'createTime'>) {
    const newPayment: PaymentRecordTypes = {
      id: generateShortId(),
      paymentDate: payment.paymentDate,
      amount: payment.amount,
      packages: payment.packages,
      remark: payment.remark,
      createTime: getCurrentDateTime(),
    };

    await PaymentRecordService.add(newPayment);
    paymentRecordList.value.push(newPayment);

    return newPayment;
  }

  /**
   * 更新费用记录
   */
  async function updatePaymentRecord(id: string, updates: Partial<PaymentRecordTypes>): Promise<boolean> {
    const index = paymentRecordList.value.findIndex((payment) => payment.id === id);
    if (index === -1) return false;

    const updatedPayment = {
      ...paymentRecordList.value[index],
      ...updates,
    };

    await PaymentRecordService.update(id, updates);
    paymentRecordList.value.splice(index, 1, updatedPayment);

    return true;
  }

  /**
   * 删除费用记录
   */
  async function deletePaymentRecord(id: string): Promise<boolean> {
    const index = paymentRecordList.value.findIndex((payment) => payment.id === id);
    if (index === -1) return false;

    await PaymentRecordService.delete(id);
    paymentRecordList.value.splice(index, 1);

    return true;
  }

  /**
   * 根据ID获取费用记录
   */
  function getPaymentRecordById(id: string) {
    return paymentRecordList.value.find((payment) => payment.id === id);
  }

  /**
   * 修复数据：重新计算所有课程包的剩余学时
   */
  async function recalculateRemainingHours() {
    let fixedCount = 0;
    const details: string[] = [];

    for (const pkg of coursePackageList.value) {
      // 获取该课程包的所有消耗记录
      const consumeRecords = lessonRecordList.value.filter(
        (record) => record.packageId === pkg.id && record.recordType === 'consume',
      );

      // 计算总消耗学时
      const consumedHours = consumeRecords.reduce((sum, record) => sum + record.consumeHours, 0);

      // 计算正确的剩余学时
      const correctRemainingHours = pkg.totalHours - consumedHours;

      console.log(`课程包: ${pkg.courseName}`);
      console.log(`  总学时: ${pkg.totalHours}`);
      console.log(`  当前剩余: ${pkg.remainingHours}`);
      console.log(`  消耗记录数: ${consumeRecords.length}`);
      console.log(`  实际消耗: ${consumedHours}`);
      console.log(`  正确剩余: ${correctRemainingHours}`);

      // 如果不一致，修复它
      if (pkg.remainingHours !== correctRemainingHours) {
        const detail = `${pkg.courseName}: ${pkg.remainingHours} → ${correctRemainingHours}学时`;
        details.push(detail);
        console.log(`  ✓ 需要修复`);

        await updateCoursePackage(pkg.id, {
          remainingHours: correctRemainingHours,
        });
        fixedCount++;
      } else {
        console.log(`  ✓ 数据正确，无需修复`);
      }
    }

    if (fixedCount > 0) {
      console.log(`\n共修复了 ${fixedCount} 个课程包的剩余学时`);
      console.log('修复详情:', details);
    }

    return { count: fixedCount, details };
  }

  /**
   * 批量导入数据（覆盖）
   */
  async function importAllData(data: {
    packages: CoursePackageTypes[];
    records: LessonRecordTypes[];
    payments: PaymentRecordTypes[];
  }) {
    isLoading.value = true;
    loadError.value = null;
    try {
      // 先清空云端数据
      const { error: deletePackagesError } = await supabase
        .from('course_packages')
        .delete()
        .neq('id', '');
      if (deletePackagesError) throw deletePackagesError;

      // 导入新数据
      await Promise.all([
        CoursePackageService.upsertMany(data.packages),
        LessonRecordService.upsertMany(data.records),
        PaymentRecordService.upsertMany(data.payments),
      ]);

      // 更新本地状态
      coursePackageList.value = data.packages;
      lessonRecordList.value = data.records;
      paymentRecordList.value = data.payments;
    } catch (error: any) {
      console.error('导入数据失败:', error);
      loadError.value = error.message || '导入数据失败';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 清空所有数据
   */
  async function clearAllData() {
    isLoading.value = true;
    loadError.value = null;
    try {
      const { error: deletePackagesError } = await supabase
        .from('course_packages')
        .delete()
        .neq('id', '');
      if (deletePackagesError) throw deletePackagesError;

      const { error: deletePaymentsError } = await supabase
        .from('payment_records')
        .delete()
        .neq('id', '');
      if (deletePaymentsError) throw deletePaymentsError;

      // lesson_records 会通过 CASCADE 自动删除

      coursePackageList.value = [];
      lessonRecordList.value = [];
      paymentRecordList.value = [];
    } catch (error: any) {
      console.error('清空数据失败:', error);
      loadError.value = error.message || '清空数据失败';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    coursePackageList,
    lessonRecordList,
    paymentRecordList,
    statistics,
    isLoading,
    loadError,
    historyFilterPackageId,
    initData,
    refreshData,
    addCoursePackage,
    updateCoursePackage,
    deleteCoursePackage,
    getCoursePackageById,
    addLessonRecord,
    updateLessonRecord,
    deleteLessonRecord,
    getRecordsByDate,
    getRecordsByPackageId,
    addPaymentRecord,
    updatePaymentRecord,
    deletePaymentRecord,
    getPaymentRecordById,
    setHistoryFilterPackageId,
    clearHistoryFilter,
    updateCoursePackageOrder,
    recalculateRemainingHours,
    importAllData,
    clearAllData,
  };
});

// 导入 supabase 用于批量操作
import { supabase } from '@/lib/supabase';
