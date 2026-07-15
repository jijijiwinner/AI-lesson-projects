/**
 * Supabase 数据库服务
 * 字段映射：TypeScript camelCase <-> Supabase snake_case
 */

import { supabase } from '@/lib/supabase';
import type { CoursePackageTypes, LessonRecordTypes, PaymentRecordTypes } from '@/types/course';

// ---- 字段映射辅助函数 ----

function toCoursePackage(row: any): CoursePackageTypes {
  return {
    id: row.id,
    courseType: row.course_type,
    courseName: row.course_name,
    totalHours: Number(row.total_hours),
    remainingHours: Number(row.remaining_hours),
    purchaseDate: row.purchase_date,
    price: row.price != null ? Number(row.price) : undefined,
    sortOrder: Number(row.sort_order ?? 0),
    createTime: row.create_time,
    updateTime: row.update_time,
  };
}

function fromCoursePackage(data: CoursePackageTypes) {
  return {
    id: data.id,
    course_type: data.courseType,
    course_name: data.courseName,
    total_hours: data.totalHours,
    remaining_hours: data.remainingHours,
    purchase_date: data.purchaseDate,
    price: data.price ?? null,
    sort_order: data.sortOrder ?? 0,
    create_time: data.createTime,
    update_time: data.updateTime,
  };
}

function fromCoursePackagePartial(data: Partial<CoursePackageTypes>) {
  const row: Record<string, any> = {};
  if (data.courseType !== undefined) row.course_type = data.courseType;
  if (data.courseName !== undefined) row.course_name = data.courseName;
  if (data.totalHours !== undefined) row.total_hours = data.totalHours;
  if (data.remainingHours !== undefined) row.remaining_hours = data.remainingHours;
  if (data.purchaseDate !== undefined) row.purchase_date = data.purchaseDate;
  if (data.price !== undefined) row.price = data.price ?? null;
  if (data.sortOrder !== undefined) row.sort_order = data.sortOrder;
  if (data.createTime !== undefined) row.create_time = data.createTime;
  if (data.updateTime !== undefined) row.update_time = data.updateTime;
  return row;
}

function toLessonRecord(row: any): LessonRecordTypes {
  return {
    id: row.id,
    packageId: row.package_id,
    courseType: row.course_type,
    courseName: row.course_name,
    recordType: row.record_type,
    consumeHours: Number(row.consume_hours),
    recordDate: row.record_date,
    remark: row.remark ?? '',
    createTime: row.create_time,
  };
}

function fromLessonRecord(data: LessonRecordTypes) {
  return {
    id: data.id,
    package_id: data.packageId,
    course_type: data.courseType,
    course_name: data.courseName,
    record_type: data.recordType,
    consume_hours: data.consumeHours,
    record_date: data.recordDate,
    remark: data.remark,
    create_time: data.createTime,
  };
}

function fromLessonRecordPartial(data: Partial<LessonRecordTypes>) {
  const row: Record<string, any> = {};
  if (data.packageId !== undefined) row.package_id = data.packageId;
  if (data.courseType !== undefined) row.course_type = data.courseType;
  if (data.courseName !== undefined) row.course_name = data.courseName;
  if (data.recordType !== undefined) row.record_type = data.recordType;
  if (data.consumeHours !== undefined) row.consume_hours = data.consumeHours;
  if (data.recordDate !== undefined) row.record_date = data.recordDate;
  if (data.remark !== undefined) row.remark = data.remark;
  if (data.createTime !== undefined) row.create_time = data.createTime;
  return row;
}

function toPaymentRecord(row: any): PaymentRecordTypes {
  return {
    id: row.id,
    paymentDate: row.payment_date,
    amount: Number(row.amount),
    packages: row.packages ?? [],
    remark: row.remark ?? '',
    createTime: row.create_time,
  };
}

function fromPaymentRecord(data: PaymentRecordTypes) {
  return {
    id: data.id,
    payment_date: data.paymentDate,
    amount: data.amount,
    packages: data.packages,
    remark: data.remark,
    create_time: data.createTime,
  };
}

function fromPaymentRecordPartial(data: Partial<PaymentRecordTypes>) {
  const row: Record<string, any> = {};
  if (data.paymentDate !== undefined) row.payment_date = data.paymentDate;
  if (data.amount !== undefined) row.amount = data.amount;
  if (data.packages !== undefined) row.packages = data.packages;
  if (data.remark !== undefined) row.remark = data.remark;
  if (data.createTime !== undefined) row.create_time = data.createTime;
  return row;
}

// ---- 课程包服务 ----

export const CoursePackageService = {
  async getAll(): Promise<CoursePackageTypes[]> {
    const { data, error } = await supabase
      .from('course_packages')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('create_time', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toCoursePackage);
  },

  async getById(id: string): Promise<CoursePackageTypes | null> {
    const { data, error } = await supabase
      .from('course_packages')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return toCoursePackage(data);
  },

  async add(pkg: CoursePackageTypes): Promise<void> {
    const { error } = await supabase
      .from('course_packages')
      .insert(fromCoursePackage(pkg));
    if (error) throw error;
  },

  async update(id: string, data: Partial<CoursePackageTypes>): Promise<void> {
    const { error } = await supabase
      .from('course_packages')
      .update(fromCoursePackagePartial(data))
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('course_packages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async upsertMany(packages: CoursePackageTypes[]): Promise<void> {
    if (packages.length === 0) return;
    const { error } = await supabase
      .from('course_packages')
      .upsert(packages.map(fromCoursePackage));
    if (error) throw error;
  },
};

// ---- 学时记录服务 ----

export const LessonRecordService = {
  async getAll(): Promise<LessonRecordTypes[]> {
    const { data, error } = await supabase
      .from('lesson_records')
      .select('*')
      .order('record_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toLessonRecord);
  },

  async add(record: LessonRecordTypes): Promise<void> {
    const { error } = await supabase
      .from('lesson_records')
      .insert(fromLessonRecord(record));
    if (error) throw error;
  },

  async update(id: string, data: Partial<LessonRecordTypes>): Promise<void> {
    const { error } = await supabase
      .from('lesson_records')
      .update(fromLessonRecordPartial(data))
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('lesson_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async upsertMany(records: LessonRecordTypes[]): Promise<void> {
    if (records.length === 0) return;
    const { error } = await supabase
      .from('lesson_records')
      .upsert(records.map(fromLessonRecord));
    if (error) throw error;
  },
};

// ---- 费用记录服务 ----

export const PaymentRecordService = {
  async getAll(): Promise<PaymentRecordTypes[]> {
    const { data, error } = await supabase
      .from('payment_records')
      .select('*')
      .order('payment_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toPaymentRecord);
  },

  async getById(id: string): Promise<PaymentRecordTypes | null> {
    const { data, error } = await supabase
      .from('payment_records')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return toPaymentRecord(data);
  },

  async add(payment: PaymentRecordTypes): Promise<void> {
    const { error } = await supabase
      .from('payment_records')
      .insert(fromPaymentRecord(payment));
    if (error) throw error;
  },

  async update(id: string, data: Partial<PaymentRecordTypes>): Promise<void> {
    const { error } = await supabase
      .from('payment_records')
      .update(fromPaymentRecordPartial(data))
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async upsertMany(payments: PaymentRecordTypes[]): Promise<void> {
    if (payments.length === 0) return;
    const { error } = await supabase
      .from('payment_records')
      .upsert(payments.map(fromPaymentRecord));
    if (error) throw error;
  },
};
