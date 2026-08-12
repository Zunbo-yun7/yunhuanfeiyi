USE yingge_db;

-- 冰箱贴-经典款 (id=5)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/5_1.jpg',
  '/product-details/5_2.jpg',
  '/product-details/5_3.jpg'
) WHERE id = 5;

-- 冰箱贴-场景款 (id=6) 复用冰箱贴经典款的图
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/5_1.jpg',
  '/product-details/5_2.jpg',
  '/product-details/5_3.jpg'
) WHERE id = 6;

-- 表情包贴纸 (id=7)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/7_1.jpg',
  '/product-details/7_2.jpg',
  '/product-details/7_3.jpg'
) WHERE id = 7;

-- 帆布袋-鼓槌款 (id=8)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/8_1.jpg',
  '/product-details/8_2.jpg',
  '/product-details/8_3.jpg'
) WHERE id = 8;

-- 帆布袋-经典款 (id=19)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/19_1.jpg',
  '/product-details/19_2.jpg'
) WHERE id = 19;

-- 明信片 (id=20)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/20_1.jpg',
  '/product-details/20_2.jpg'
) WHERE id = 20;

-- 冲鸭 (id=22)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/22_1.jpg',
  '/product-details/22_2.jpg',
  '/product-details/22_3.jpg'
) WHERE id = 22;

-- 比心心 (id=23)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/23_1.jpg',
  '/product-details/23_2.jpg'
) WHERE id = 23;

-- 元气满满 (id=24)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/24_1.jpg',
  '/product-details/24_2.jpg'
) WHERE id = 24;

-- 调皮眨眼 (id=25)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/25_1.jpg',
  '/product-details/25_2.jpg'
) WHERE id = 25;

-- 开心大笑 (id=26)
UPDATE creative_products SET detail_images = JSON_ARRAY(
  '/product-details/26_1.jpg',
  '/product-details/26_2.jpg'
) WHERE id = 26;
