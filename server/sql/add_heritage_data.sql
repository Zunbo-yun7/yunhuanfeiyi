-- 添加文化困境与数字化解决方案数据
USE yingge_db;

-- 创建文化困境数据表
CREATE TABLE IF NOT EXISTS heritage_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  percentage INT NOT NULL,
  description TEXT,
  source VARCHAR(255),
  source_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建数字化解决方案数据表
CREATE TABLE IF NOT EXISTS digital_solutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  feature VARCHAR(50),
  color VARCHAR(100),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入文化困境数据
INSERT INTO heritage_challenges (icon, title, percentage, description, source, source_url, sort_order) VALUES
('TrendingDown', '传承人老龄化', 75, '75%以上的核心传承人年龄超过55岁，青年后备力量严重不足', '深圳大学英歌舞季调研报告', 'https://m.sohu.com/a/944824649_122255128/', 1),
('Users', '年轻群体参与度低', 68, '68%的年轻人表示对英歌了解有限，缺乏接触和学习渠道', '广东工业大学英歌舞传承调研', 'https://c.m.163.com/news/a/J77NOFTC04179HUU.html', 2),
('AlertTriangle', '传播方式单一', 62, '62%的传播仍依赖线下演出，数字化传播手段亟待加强', '文化新局：数字时代的非遗传承范式', 'https://m.sohu.com/a/859166237_121384323/', 3);

-- 插入数字化解决方案数据
INSERT INTO digital_solutions (icon, title, description, feature, color, sort_order) VALUES
('BookOpen', '系统化知识图谱', '将英歌历史、动作、脸谱、装备等知识结构化呈现，构建完整的文化知识库', '7大栏目', 'from-yingge-red to-red-700', 1),
('Bot', 'AI智能导游', '基于DeepSeek大模型，提供24小时智能问答服务，降低文化学习门槛', 'AI 24h在线', 'from-purple-600 to-indigo-700', 2),
('Image', '高清脸谱图鉴', '数字化保存珍贵脸谱图像，支持详细解读，让非遗美术走近大众', '9款经典脸谱', 'from-amber-600 to-orange-700', 3),
('Video', '动作图谱可视化', '将传统英歌动作拆解呈现，配以图文说明，便于学习和传播', '6大经典招式', 'from-emerald-600 to-teal-700', 4),
('Globe', '轻量化数字平台', 'H5网页形式，无需下载，随时随地访问，打破地域和时间限制', '响应式设计', 'from-blue-600 to-cyan-700', 5),
('Sparkles', '沉浸式体验', '精美视觉设计与流畅动画效果，让传统文化焕发年轻活力', '动效交互', 'from-pink-600 to-rose-700', 6);
