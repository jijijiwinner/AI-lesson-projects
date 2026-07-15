import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CoursePackageTypes, LessonRecordTypes, StatisticsTypes } from '@/types/course';
import { getStorage, setStorage } from '@/utils/storage';
import { generateShortId } from '@/utils/uuid';
import { getCurrentDateTime, isToday, isThisMonth } from '@/utils/date';

const COURSE_PACKAGE_KEY = 'course_packages';
const LESSON_RECORD_KEY = 'lesson_records';

export const useCourseStore = defineStore('course', () => {
  // 课程包列表
  const coursePackageList = ref<CoursePackageTypes[]>([]);
  
  // 学时记录列表
  const lessonRecordList = ref<LessonRecordTypes[]>([]);

  /**
   * 初始化数据
   */
  function initData() {
    const packages = getStorage<CoursePackageTypes[]>(COURSE_PACKAGE_KEY);
    const records = getStorage<LessonRecordTypes[]>(LESSON_RECORD_KEY);
    
    if (packages) {
      coursePackageList.value = packages;
    }
    
    if (records) {
      lessonRecordList.value = records;
    }
  }

  /**
   * 保存课程包数据
   */
  function saveCoursePackages() {
    setStorage(COURSE_PACKAGE_KEY, coursePackageList.value);
  }

  /**
   * 保存学时记录数据
   */
  function saveLessonRecords() {
    setStorage(LESSON_RECORD_KEY, lessonRecordList.value);
  }

  /**
   * 添加课程包
   */
  function addCoursePackage(coursePackage: Omit<CoursePackageTypes, 'id' | 'createTime' | 'updateTime' | 'remainingHours'>) {
    const now = getCurrentDateTime();
    const newPackage: CoursePackageTypes = {
      id: generateShortId(),
      ...coursePackage,
      remainingHours: coursePackage.totalHours,
      createTime: now,
      updateTime: now,
    };
    
    coursePackageList.value.push(newPackage);
    saveCoursePackages();
    
    return newPackage;
  }

  /**
   * 更新课程包
   */
  function updateCoursePackage(id: string, data: Partial<CoursePackageTypes>) {
    const index = coursePackageList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      coursePackageList.value[index] = {
        ...coursePackageList.value[index],
        ...data,
        updateTime: getCurrentDateTime(),
      };
      saveCoursePackages();
      return true;
    }
    return false;
  }

  /**
   * 删除课程包
   */
  function deleteCoursePackage(id: string) {
    const index = coursePackageList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      coursePackageList.value.splice(index, 1);
      saveCoursePackages();
      
      // 同时删除相关记录
      lessonRecordList.value = lessonRecordList.value.filter((record) => record.packageId !== id);
      saveLessonRecords();
      
      return true;
    }
    return false;
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
  function addLessonRecord(record: Omit<LessonRecordTypes, 'id' | 'createTime'>) {
    const now = getCurrentDateTime();
    const newRecord: LessonRecordTypes = {
      id: generateShortId(),
      ...record,
      createTime: now,
    };
    
    lessonRecordList.value.unshift(newRecord);
    saveLessonRecords();
    
    // 更新课程包剩余学时
    const coursePackage = getCoursePackageById(record.packageId);
    if (coursePackage) {
      updateCoursePackage(record.packageId, {
        remainingHours: coursePackage.remainingHours - record.consumeHours,
      });
    }
    
    return newRecord;
  }

  /**
   * 删除学时记录
   */
  function deleteLessonRecord(id: string) {
    const index = lessonRecordList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const record = lessonRecordList.value[index];
      
      // 恢复课程包剩余学时
      const coursePackage = getCoursePackageById(record.packageId);
      if (coursePackage) {
        updateCoursePackage(record.packageId, {
          remainingHours: coursePackage.remainingHours + record.consumeHours,
        });
      }
      
      lessonRecordList.value.splice(index, 1);
      saveLessonRecords();
      
      return true;
    }
    return false;
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
    const totalConsumedHours = totalHours - totalRemainingHours;
    
    const todayRecords = lessonRecordList.value.filter((record) =>
      isToday(record.recordDate),
    ).length;
    
    const monthRecords = lessonRecordList.value.filter((record) =>
      isThisMonth(record.recordDate),
    ).length;
    
    return {
      totalPackages,
      totalHours,
      totalRemainingHours,
      totalConsumedHours,
      todayRecords,
      monthRecords,
    };
  });

  // 初始化数据
  initData();

  return {
    coursePackageList,
    lessonRecordList,
    statistics,
    addCoursePackage,
    updateCoursePackage,
    deleteCoursePackage,
    getCoursePackageById,
    addLessonRecord,
    deleteLessonRecord,
    getRecordsByDate,
    getRecordsByPackageId,
  };
});
