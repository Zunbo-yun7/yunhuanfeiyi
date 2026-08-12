import pool from '../config/db.js';

async function describeTable() {
  try {
    const [rows] = await pool.query('DESCRIBE heritage_challenges');
    console.log('heritage_challenges 表结构:');
    rows.forEach(r => {
      console.log(`  ${r.Field} - ${r.Type} - ${r.Null} - ${r.Default}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

describeTable();
