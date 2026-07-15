import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hboxkubpytypiaubbxyd.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhib3hrdWJweXR5cGlhdWJieHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mjc4MDYsImV4cCI6MjA5MTMwMzgwNn0.UaBlh4b0P_dt_OKMYtOeobdWaA-caj0DrulU2WPhGpY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('=== Supabase 数据库连接测试 ===\n');

  // 测试 course_packages 表
  console.log('[1/3] 查询 course_packages 表...');
  const { data: packages, error: err1 } = await supabase
    .from('course_packages')
    .select('*')
    .limit(5);
  if (err1) {
    console.error('  ❌ 失败:', err1.message);
  } else {
    console.log(`  ✅ 成功，共 ${packages.length} 条记录`);
    if (packages.length > 0) {
      console.log('  示例:', JSON.stringify(packages[0], null, 2));
    }
  }

  // 测试 lesson_records 表
  console.log('\n[2/3] 查询 lesson_records 表...');
  const { data: records, error: err2 } = await supabase
    .from('lesson_records')
    .select('*')
    .limit(5);
  if (err2) {
    console.error('  ❌ 失败:', err2.message);
  } else {
    console.log(`  ✅ 成功，共 ${records.length} 条记录`);
    if (records.length > 0) {
      console.log('  示例:', JSON.stringify(records[0], null, 2));
    }
  }

  // 测试 payment_records 表
  console.log('\n[3/3] 查询 payment_records 表...');
  const { data: payments, error: err3 } = await supabase
    .from('payment_records')
    .select('*')
    .limit(5);
  if (err3) {
    console.error('  ❌ 失败:', err3.message);
  } else {
    console.log(`  ✅ 成功，共 ${payments.length} 条记录`);
    if (payments.length > 0) {
      console.log('  示例:', JSON.stringify(payments[0], null, 2));
    }
  }

  console.log('\n=== 测试完成 ===');
}

testConnection().catch(console.error);
