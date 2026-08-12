import pool from '../config/db.js';

async function addMissingColumns() {
  try {
    await pool.query(`
      ALTER TABLE heritage_challenges
      ADD COLUMN impact VARCHAR(100) DEFAULT '' AFTER title,
      ADD COLUMN stat_number VARCHAR(50) DEFAULT '' AFTER description,
      ADD COLUMN stat_label VARCHAR(100) DEFAULT '' AFTER stat_number
    `);
    console.log('✅ 添加缺失字段成功 (impact, stat_number, stat_label)');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  字段已存在，跳过');
      process.exit(0);
    }
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

addMissingColumns();
