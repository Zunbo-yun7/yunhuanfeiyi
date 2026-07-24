-- 更新文化困境数据表结构和数据
USE yingge_db;

-- 添加 impact 字段
ALTER TABLE heritage_challenges 
ADD COLUMN impact VARCHAR(100) AFTER title;

-- 更新数据
UPDATE heritage_challenges SET 
  icon = 'Users',
  title = '年轻受众断层',
  impact = '传承人群体年龄结构失衡',
  description = '传统英歌受众以中老年人为主，年轻一代对英歌文化了解有限，非遗传承面临后继乏力的挑战。',
  source = '「人文计机」云焕非遗三下乡实践调研',
  source_url = 'https://mp.weixin.qq.com/s/sV3N-j0ngalD4vQivswY2A'
WHERE id = 1;

UPDATE heritage_challenges SET 
  icon = 'TrendingDown',
  title = '数字化传播薄弱',
  impact = '文化传播半径受限',
  description = '英歌文化传播主要依赖线下演出和口耳相传，缺乏系统化的数字传播渠道，难以触达更广泛的受众群体。',
  source = '「人文计机」云焕非遗三下乡实践调研',
  source_url = 'https://mp.weixin.qq.com/s/sV3N-j0ngalD4vQivswY2A'
WHERE id = 2;

UPDATE heritage_challenges SET 
  icon = 'AlertTriangle',
  title = '文化内涵普及不足',
  impact = '文化价值认知浅层化',
  description = '公众对英歌的了解多停留在表层表演形式，对其历史渊源、精神内涵、脸谱寓意等深层文化认知普遍不足。',
  source = '「人文计机」云焕非遗三下乡实践调研',
  source_url = 'https://mp.weixin.qq.com/s/sV3N-j0ngalD4vQivswY2A'
WHERE id = 3;

-- 删除 percentage 字段（可选，保留以兼容旧版本）
-- ALTER TABLE heritage_challenges DROP COLUMN percentage;
