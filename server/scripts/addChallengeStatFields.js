import pool from '../config/db.js';

async function addStatFields() {
  try {
    await pool.query(`
      ALTER TABLE heritage_challenges
      ADD COLUMN stat_number VARCHAR(50) DEFAULT '' AFTER description,
      ADD COLUMN stat_label VARCHAR(100) DEFAULT '' AFTER stat_number
    `);
    console.log('✅ heritage_challenges 表添加 stat_number、stat_label 字段成功');

    await pool.query(`
      UPDATE heritage_challenges
      SET stat_number = '45亿+', stat_label = '短视频播放量'
      WHERE id = 1
    `);
    await pool.query(`
      UPDATE heritage_challenges
      SET stat_number = '95%↑', stat_label = '00后创作者同比增长'
      WHERE id = 2
    `);
    await pool.query(`
      UPDATE heritage_challenges
      SET stat_number = '2025', stat_label = '首个数字艺术馆上线'
      WHERE id = 3
    `);
    console.log('✅ 3条困境数据已补充stat字段');

    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

addStatFields();
