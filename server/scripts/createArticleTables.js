import pool from '../config/db.js';

const createArticleTables = [
  `CREATE TABLE IF NOT EXISTS news_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    thumbnail_url VARCHAR(500),
    author VARCHAR(100),
    is_published TINYINT(1) DEFAULT 0,
    published_at DATETIME,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS wechat_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    wechat_account VARCHAR(255) NOT NULL,
    wechat_url VARCHAR(500) NOT NULL,
    summary TEXT,
    thumbnail_url VARCHAR(500),
    published_at DATETIME NOT NULL,
    is_top TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_published_at (published_at),
    INDEX idx_is_top (is_top)
  )`,
];

async function createArticleDatabaseTables() {
  console.log('开始创建文章相关表结构...');

  try {
    for (let i = 0; i < createArticleTables.length; i++) {
      const sql = createArticleTables[i];
      await pool.query(sql);
      console.log(`表 ${i + 1}/${createArticleTables.length} 创建成功`);
    }

    console.log('\n文章相关表结构创建完成！');
    process.exit(0);
  } catch (error) {
    console.error('\n创建表结构失败:', error);
    process.exit(1);
  }
}

createArticleDatabaseTables();
