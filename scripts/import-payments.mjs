import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hboxkubpytypiaubbxyd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhib3hrdWJweXR5cGlhdWJieHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mjc4MDYsImV4cCI6MjA5MTMwMzgwNn0.UaBlh4b0P_dt_OKMYtOeobdWaA-caj0DrulU2WPhGpY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const payments = [
  {
    id: 'pay_20250801',
    payment_date: '2025-08-01',
    amount: 27000,
    packages: [
      { courseType: 'cognition', courseName: '个训', hours: 48, price: 13200 },
      { courseType: 'sensory',   courseName: '感统', hours: 48, price: 13800 },
    ],
    remark: '8月首次购课：个训48+感统48',
    create_time: '2025-08-01 09:00:00',
  },
  {
    id: 'pay_20251015',
    payment_date: '2025-10-15',
    amount: 31200,
    packages: [
      { courseType: 'cognition', courseName: '个训', hours: 48, price: 13200 },
      { courseType: 'sensory',   courseName: '感统', hours: 48, price: 13800 },
      { courseType: 'speech',    courseName: '言语', hours: 12, price: 4200 },
    ],
    remark: '10月购课：个训48+感统48+言语12（350×12）',
    create_time: '2025-10-15 09:00:00',
  },
  {
    id: 'pay_20251206',
    payment_date: '2025-12-06',
    amount: 12600,
    packages: [
      { courseType: 'speech', courseName: '言语', hours: 48, price: 12600 },
    ],
    remark: '12月购课：48节言语课',
    create_time: '2025-12-06 09:00:00',
  },
  {
    id: 'pay_20260106',
    payment_date: '2026-01-06',
    amount: 40800,
    packages: [
      { courseType: 'sensory',   courseName: '感统（第一组）', hours: 48, price: 13800 },
      { courseType: 'sensory',   courseName: '感统（第二组）', hours: 48, price: 13800 },
      { courseType: 'cognition', courseName: '认知',           hours: 48, price: 13200 },
    ],
    remark: '1月购课：感统48×2+认知48',
    create_time: '2026-01-06 09:00:00',
  },
];

console.log(`准备导入 ${payments.length} 条费用记录...`);

const { error } = await supabase.from('payment_records').upsert(payments);
if (error) {
  console.error('导入失败:', error.message);
  process.exit(1);
}

console.log('✓ 费用记录导入成功');
console.log(`  总金额: ¥${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`);
