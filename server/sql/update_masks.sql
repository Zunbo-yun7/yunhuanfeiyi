-- 更新脸谱图片数据
-- 将本地脸谱图片路径更新到数据库
USE yingge_db;

-- 更新现有脸谱项的图片路径为本地图片
UPDATE equipment_items SET image = '/static/masks/mask-1.jpg' WHERE category_id = 1 AND name = '程咬金';
UPDATE equipment_items SET image = '/static/masks/mask-2.jpg' WHERE category_id = 1 AND name = '秦琼';
UPDATE equipment_items SET image = '/static/masks/mask-3.jpg' WHERE category_id = 1 AND name = '尉迟恭';
UPDATE equipment_items SET image = '/static/masks/mask-4.jpg' WHERE category_id = 1 AND name = '鲁智深';
UPDATE equipment_items SET image = '/static/masks/mask-5.jpg' WHERE category_id = 1 AND name = '黄诗培';

-- 新增4个脸谱项（使用剩余4张图片）
INSERT INTO equipment_items (category_id, name, description, image, details, sort_order) VALUES
(1, '关胜', '关胜是英歌舞中的大将角色，脸谱以红色为主色调，象征其忠义赤诚的品格。', '/static/masks/mask-6.jpg', '关胜是《水浒传》中的好汉，以关羽后代自居，使一口青龙偃月刀。在英歌舞中代表忠义勇武的精神。', 6),
(1, '林冲', '林冲是英歌舞中的英雄角色，脸谱以白色为主色调，象征其正直刚毅的性格。', '/static/masks/mask-7.jpg', '林冲是《水浒传》中的豹子头，八十万禁军教头。在英歌舞中代表隐忍与爆发的结合。', 7),
(1, '武松', '武松是英歌舞中的勇士角色，脸谱以金色为主色调，象征其威武不凡的气概。', '/static/masks/mask-8.jpg', '武松是《水浒传》中的行者，以打虎英雄闻名。在英歌舞中代表勇猛无畏的气魄。', 8),
(1, '花荣', '花荣是英歌舞中的俊朗角色，脸谱以紫色为主色调，象征其儒雅俊秀的气质。', '/static/masks/mask-9.jpg', '花荣是《水浒传》中的小李广，以神箭手闻名。在英歌舞中代表精准与灵巧的结合。', 9);

SELECT id, name, image FROM equipment_items WHERE category_id = 1 ORDER BY sort_order;
