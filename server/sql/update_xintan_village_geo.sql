USE yingge_db;

ALTER TABLE xintan_village
ADD COLUMN latitude VARCHAR(50) DEFAULT '',
ADD COLUMN longitude VARCHAR(50) DEFAULT '',
ADD COLUMN address VARCHAR(255) DEFAULT '',
ADD COLUMN geo_description TEXT,
ADD COLUMN environment TEXT,
ADD COLUMN climate TEXT,
ADD COLUMN traffic TEXT;

UPDATE xintan_village SET
  latitude = '23.30',
  longitude = '116.18',
  address = '广东省揭阳市普宁市流沙东街道新坛村',
  geo_description = '新坛村位于广东省东南部、揭阳市普宁市流沙东街道，地处榕江流域中下游平原地带，地势平坦开阔，土壤肥沃，是典型的潮汕平原村落。',
  environment = '新坛村所在的潮汕地区依山傍海，北靠大南山余脉，南临南海，四季常青。村落周边河网密布，水系发达，既有传统潮汕民居群落，又有现代村镇风貌，人文与自然景观交融。',
  climate = '属亚热带季风气候，年平均气温约 21°C，雨量充沛，光照充足，气候温和湿润，适宜农耕与各类民俗活动的开展。',
  traffic = '交通便利，靠近国道和省道，距揭阳市中心约 30 公里，距普宁市中心仅数公里，周边有多条公交线路经过，便于游客前往参观体验。';
