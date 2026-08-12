import pool from "../config/db.js";

const createTableSQL = `
CREATE TABLE IF NOT EXISTS poster_hotspots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL COMMENT '热点标签',
  description TEXT COMMENT '热点描述',
  x DECIMAL(6,2) NOT NULL COMMENT '左上角X(百分比)',
  y DECIMAL(6,2) NOT NULL COMMENT '左上角Y(百分比)',
  w DECIMAL(6,2) NOT NULL COMMENT '宽度(百分比)',
  h DECIMAL(6,2) NOT NULL COMMENT '高度(百分比)',
  target_url VARCHAR(500) NOT NULL COMMENT '跳转地址',
  target_type ENUM('internal', 'external') DEFAULT 'internal',
  poster_image VARCHAR(500) DEFAULT '/images/poster.png',
  sort_order INT DEFAULT 0,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='海报热点区域';
`;

const defaultHotspots = [
  {
    label: '英歌小将 IP',
    description: '查看吉祥物3D模型与设计说明',
    x: 30, y: 8, w: 40, h: 35,
    target_url: '/creative?scroll=mascot',
    target_type: 'internal',
    poster_image: '/images/poster.png',
    sort_order: 1,
  },
  {
    label: '表情包',
    description: '点击查看表情包大图，长按可下载',
    x: 5, y: 50, w: 25, h: 40,
    target_url: '/creative?scroll=stickers',
    target_type: 'internal',
    poster_image: '/images/poster.png',
    sort_order: 2,
  },
  {
    label: '冰箱贴',
    description: '英歌小将冰箱贴，磁吸式设计',
    x: 33, y: 50, w: 18, h: 22,
    target_url: '/creative?category=IP形象周边&scroll=products',
    target_type: 'internal',
    poster_image: '/images/poster.png',
    sort_order: 3,
  },
  {
    label: '帆布袋',
    description: '大容量帆布环保袋，日常出行必备',
    x: 54, y: 50, w: 20, h: 40,
    target_url: '/creative?category=IP形象周边&scroll=products',
    target_type: 'internal',
    poster_image: '/images/poster.png',
    sort_order: 4,
  },
  {
    label: '明信片',
    description: '一套六张精美明信片',
    x: 77, y: 50, w: 18, h: 25,
    target_url: '/creative?category=IP形象周边&scroll=products',
    target_type: 'internal',
    poster_image: '/images/poster.png',
    sort_order: 5,
  },
];

async function main() {
  try {
    console.log("=== 初始化海报热点区域表 ===\n");

    await pool.query(createTableSQL);
    console.log("✅ 表 poster_hotspots 已创建/确认存在\n");

    for (const hs of defaultHotspots) {
      const [existing] = await pool.query(
        "SELECT id FROM poster_hotspots WHERE label = ? AND target_url = ?",
        [hs.label, hs.target_url]
      );
      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO poster_hotspots 
           (label, description, x, y, w, h, target_url, target_type, poster_image, sort_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [hs.label, hs.description, hs.x, hs.y, hs.w, hs.h, hs.target_url, hs.target_type, hs.poster_image, hs.sort_order]
        );
        console.log(`  + 添加默认热点: ${hs.label}`);
      } else {
        console.log(`  = 已存在，跳过: ${hs.label}`);
      }
    }

    console.log("\n✅ 初始化完成！");
    process.exit(0);
  } catch (err) {
    console.error("错误:", err);
    process.exit(1);
  }
}

main();
