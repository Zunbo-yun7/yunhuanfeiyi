import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initCreativeTables = async () => {
  try {
    const sqlPath = path.join(__dirname, '..', 'sql', 'create_creative_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      if (stmt.match(/^(CREATE TABLE|INSERT INTO|USE|ALTER TABLE)/i)) {
        await pool.query(stmt);
        console.log('Executed:', stmt.substring(0, 60) + '...');
      }
    }

    console.log('\n✅ 文创商品表初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
};

initCreativeTables();
