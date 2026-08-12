USE yingge_db;

CREATE TABLE IF NOT EXISTS creative_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS creative_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  price DECIMAL(10, 2) DEFAULT 0.00,
  badge VARCHAR(20) DEFAULT '',
  is_featured TINYINT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES creative_categories(id) ON DELETE CASCADE
);

INSERT INTO creative_categories (name, sort_order) VALUES
('手办模型', 1),
('文具用品', 2),
('服饰周边', 3),
('钥匙挂件', 4),
('家居装饰', 5);
