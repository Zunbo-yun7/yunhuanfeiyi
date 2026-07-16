import pool from '../config/db.js';

const tables = [
  'home_data',
  'about_data',
  'about_history',
  'about_features',
  'about_puning_features',
  'xintan_village',
  'xintan_team',
  'xintan_team_achievements',
  'xintan_training',
  'xintan_stories',
  'actions_data',
  'actions',
  'equipment_items',
  'equipment_categories',
  'people',
  'people_categories',
  'people_data',
];

async function clearTables() {
  console.log('开始清空数据库表...');
  
  try {
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      await pool.query(`DELETE FROM ${table}`);
      await pool.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
      console.log(`✅ ${table} 已清空`);
    }
    
    console.log('\n✅ 所有表清空完成！');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 清空表失败:', error);
    process.exit(1);
  }
}

clearTables();