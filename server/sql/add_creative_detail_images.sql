USE yingge_db;

ALTER TABLE creative_products ADD COLUMN detail_images TEXT DEFAULT NULL COMMENT '细节图，JSON数组字符串，最多9张';
