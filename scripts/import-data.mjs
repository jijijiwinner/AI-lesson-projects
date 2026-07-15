import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://hboxkubpytypiaubbxyd.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhib3hrdWJweXR5cGlhdWJieHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mjc4MDYsImV4cCI6MjA5MTMwMzgwNn0.UaBlh4b0P_dt_OKMYtOeobdWaA-caj0DrulU2WPhGpY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const raw = JSON.parse(readFileSync(join(__dirname, '../lesson-data-3月6号.json'), 'utf-8'));

// camelCase -> snake_case 转换
const packages = raw.packages.map((p) => ({
  id: p.id,
  course_type: p.courseType,
  course_name: p.courseName,
  total_hours: p.totalHours,
  remaining_hours: p.remainingHours,
  purchase_date: p.purchaseDate,
  price: p.price ?? null,
  create_time: p.createTime,
  update_time: p.updateTime,
}));

const records = raw.records.map((r)
const records = raw.records.map((r) => ({
  id: r.id,
  package_id: r.packageId,
  course_type: r.courseType,
  course_name: r.courseName,
  record_type: r.recordType,
  consume_hours: r.consumeHours,
  record_date: r.recordDate,
  remark: r.remark ?? '',
  create_time: r.createTime,
}));

console.log(`准备导入: ${packages.length} 个课程包, ${records.length} 条学时记录`);

// 导入课程包
const { error: pkgErr } = await supabase.from('course_packages').upsert(packages);
if (pkgErr) {
  console.error('课程包导入失败:', pkgErr.message);
  process.exit(1);
}
console.log(`✓ 课程包导入成功 (${packages.length} 条)`);

// 导入学时记录
const { error: recErr } = await supabase.from('lesson_records').upsert(records);
if (recErr) {
  console.error('学时记录导入失败:', recErr.message);
  process.exit(1);
}
console.log(`✓ 学时记录导入成功 (${records.length} 条)`);

console.log('\n全部导入完成！');
