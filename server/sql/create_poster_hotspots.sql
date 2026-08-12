-- 海报热点区域表
CREATE TABLE IF NOT EXISTS poster_hotspots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL COMMENT '热点标签(如: 表情包、帆布袋)',
  description TEXT COMMENT '热点描述',
  x DECIMAL(6,2) NOT NULL COMMENT '左上角X坐标(百分比)',
  y DECIMAL(6,2) NOT NULL COMMENT '左上角Y坐标(百分比)',
  w DECIMAL(6,2) NOT NULL COMMENT '宽度(百分比)',
  h DECIMAL(6,2) NOT NULL COMMENT '高度(百分比)',
  target_url VARCHAR(500) NOT NULL COMMENT '跳转地址',
  target_type ENUM('internal', 'external') DEFAULT 'internal' COMMENT '跳转类型: internal站内/external外部',
  poster_image VARCHAR(500) DEFAULT '/images/poster.png' COMMENT '海报图片URL',
  sort_order INT DEFAULT 0,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='海报热点区域';
