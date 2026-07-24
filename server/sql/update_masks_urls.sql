-- 更新脸谱图片为图床链接
USE yingge_db;

UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWpj5npqd9sQgHCpygD.jpg' WHERE category_id = 1 AND name = '程咬金';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWp2bJIgjINzY7cTo1i.jpg' WHERE category_id = 1 AND name = '秦琼';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWp1W2u1VmzxtiEWuCD.jpg' WHERE category_id = 1 AND name = '尉迟恭';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWp1n6hYh0XruaAXYy2.jpg' WHERE category_id = 1 AND name = '鲁智深';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWpkJkE5HZLgbGiCsXy.jpg' WHERE category_id = 1 AND name = '黄诗培';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWpoWP10Z9HsA3DtsOa.jpg' WHERE category_id = 1 AND name = '关胜';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWpHvLfgrqNr8M4dMre.jpg' WHERE category_id = 1 AND name = '林冲';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWpjuCfr55bSAg9DzRg.jpg' WHERE category_id = 1 AND name = '武松';
UPDATE equipment_items SET image = 'https://pic1.imgdb.cn/i/033uWpO2pwp4FeqnQSPcp6.jpg' WHERE category_id = 1 AND name = '花荣';

SELECT id, name, image FROM equipment_items WHERE category_id = 1 ORDER BY sort_order;
