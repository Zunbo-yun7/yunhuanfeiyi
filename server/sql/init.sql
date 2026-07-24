CREATE DATABASE IF NOT EXISTS yingge_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yingge_db;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL DEFAULT '云焕非遗',
  hero_subtitle VARCHAR(255) NOT NULL DEFAULT '英歌文化数字展示平台',
  hero_description TEXT,
  hero_background_image VARCHAR(500),
  hero_video_url VARCHAR(500) DEFAULT '',
  project_intro TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  introduction TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(50) NOT NULL,
  event TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS about_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS about_puning_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS xintan_village (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL DEFAULT '新坛村',
  description TEXT,
  history TEXT,
  image VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xintan_team (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL DEFAULT '新坛英歌队',
  founded VARCHAR(50),
  description TEXT,
  images TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xintan_team_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS xintan_training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT,
  images TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xintan_stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  image VARCHAR(500),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS xintan_team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT,
  mbti VARCHAR(10),
  college VARCHAR(255),
  grade VARCHAR(50),
  class VARCHAR(50),
  avatar VARCHAR(500),
  introduction TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS actions_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  introduction TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  pinyin VARCHAR(100),
  description TEXT,
  video_url VARCHAR(500) DEFAULT '',
  image VARCHAR(500),
  meaning TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS equipment_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS equipment_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  details TEXT,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS people_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  introduction TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS people_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(255),
  avatar VARCHAR(500),
  story TEXT,
  achievements TEXT,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES people_categories(id) ON DELETE CASCADE
);

INSERT INTO admin_users (username, password) VALUES 
('admin', 'admin123');

INSERT INTO home_data (hero_title, hero_subtitle, hero_description, hero_background_image, project_intro) VALUES
('云焕非遗', '英歌文化数字展示平台', '走进普宁英歌，感受非遗魅力', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20with%20red%20costumes%20and%20masks%20dynamic%20movement%20cultural%20heritage&image_size=landscape_16_9',
'云焕非遗队是华南师范大学计算机学院的一支实践队伍，致力于通过数字化技术传承和弘扬中华优秀传统文化。本平台以广东普宁英歌为核心展示内容，通过现代化的H5网页形式，生动呈现英歌文化的历史渊源、艺术特色和传承故事。\n\n英歌是一种集舞蹈、武术、音乐于一体的民间艺术形式，被誉为"中国汉族男子汉的舞蹈"。普宁英歌更是其中的佼佼者，以其雄浑刚健的气势和精湛的表演技艺闻名于世，2006年被列入第一批国家级非物质文化遗产名录。');

INSERT INTO about_data (introduction) VALUES
('英歌舞是广东潮汕地区流传甚广的一种民间舞蹈，属汉族广场情绪舞蹈，是由男子表演的集体舞，舞者双手各持一根短木棒，上下左右互相对击，动作健壮有力，节奏强烈。英歌舞起源于明代，已有400多年的历史，被誉为"中国汉族男子汉的舞蹈"。\n\n英歌舞主要流行于广东潮汕地区，包括普宁、潮阳、惠来等地。其中，普宁英歌以其雄浑刚健的气势和精湛的表演技艺最为著名，2006年被列入第一批国家级非物质文化遗产名录。');

INSERT INTO about_history (year, event, sort_order) VALUES
('明代', '英歌舞起源于明代，由江西传入潮汕地区', 1),
('清代', '英歌舞在潮汕地区盛行，形成多种流派', 2),
('民国时期', '英歌舞成为潮汕地区重要的民俗活动', 3),
('1949年后', '英歌舞得到政府重视和扶持，多次参加全国汇演', 4),
('2006年', '普宁英歌被列入第一批国家级非物质文化遗产名录', 5),
('2024年', '英歌舞在海内外广泛传播，成为中华文化的重要名片', 6);

INSERT INTO about_features (title, description, image, sort_order) VALUES
('雄浑刚健', '英歌舞以武术为基础，动作刚劲有力，气势磅礴。舞者手持双槌，上下翻飞，配合默契，展现出男子汉的阳刚之气。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20performance%20with%20wooden%20sticks%20dynamic%20masculine%20movement%20Chinese%20traditional%20art&image_size=portrait_4_3', 1),
('节奏强烈', '英歌舞的音乐以锣鼓为主，节奏明快，富有感染力。鼓声、锣声、螺号声交织在一起，形成独特的音响效果。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20Chinese%20drums%20and%20gongs%20instrument%20music%20performance%20cultural&image_size=portrait_4_3', 2),
('脸谱独特', '英歌舞的脸谱造型独特，色彩鲜艳，每个角色都有固定的脸谱样式，代表不同的历史人物和性格特征。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20opera%20mask%20colorful%20Yingge%20dance%20face%20paint%20traditional%20art&image_size=portrait_4_3', 3),
('文化内涵深厚', '英歌舞融合了武术、舞蹈、音乐、戏剧等多种艺术形式，蕴含着丰富的历史文化内涵，是中华民族优秀传统文化的瑰宝。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20culture%20heritage%20performance%20art%20festival%20celebration&image_size=portrait_4_3', 4);

INSERT INTO about_puning_features (title, description, sort_order) VALUES
('国家级非遗', '普宁英歌是英歌舞的杰出代表，2006年被列入第一批国家级非物质文化遗产名录。', 1),
('流派众多', '普宁英歌有南山英歌、新坛英歌、泥沟英歌等多个流派，每个流派都有独特的风格和特点。', 2),
('表演精湛', '普宁英歌的表演技艺精湛，动作难度高，队形变化丰富，具有很高的艺术欣赏价值。', 3),
('传承良好', '普宁市政府高度重视英歌文化的传承和发展，建立了多个传承基地，培养了一批优秀的传承人。', 4);

INSERT INTO xintan_village (name, description, history, image) VALUES
('新坛村', '新坛村位于广东省普宁市流沙东街道，是一个历史悠久、文化底蕴深厚的村落。这里是普宁英歌的重要发源地之一，新坛英歌队更是享誉海内外的英歌表演团体。',
'新坛村始建于明代，至今已有500多年的历史。村落依山傍水，风景秀丽，保存了大量的传统建筑和文化遗产。英歌文化在新坛村代代相传，成为村民生活中不可或缺的一部分。',
'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20village%20architecture%20ancient%20houses%20Puning%20Guangdong%20cultural%20heritage&image_size=landscape_4_3');

INSERT INTO xintan_team (name, founded, description, images) VALUES
('新坛英歌队', '1953年', '新坛英歌队成立于1953年，是普宁英歌的代表性队伍之一。几十年来，新坛英歌队以精湛的技艺和独特的风格，多次参加国内外重大文化活动，赢得了广泛赞誉。',
'["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20team%20group%20photo%20red%20costumes%20masks%20performance%20Chinese%20traditional&image_size=portrait_4_3","https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20performance%20stage%20traditional%20Chinese%20culture%20festival&image_size=portrait_4_3","https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20parade%20street%20celebration%20crowd%20Chinese%20traditional%20festival&image_size=portrait_4_3"]');

INSERT INTO xintan_team_achievements (content, sort_order) VALUES
('多次获得广东省民间文艺汇演一等奖', 1),
('代表中国参加国际民间艺术节', 2),
('被评为"广东省非物质文化遗产传承基地"', 3),
('培养了数十名国家级和省级传承人', 4);

INSERT INTO xintan_training (description, images) VALUES
('新坛英歌队的训练非常严格，队员们每天清晨就开始训练。训练内容包括基本功练习、动作编排、队形变换等。年轻队员从小就开始接受训练，老队员则悉心传授技艺，确保英歌文化代代相传。',
'["https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20training%20practice%20young%20performers%20wooden%20sticks%20Chinese%20traditional&image_size=portrait_4_3","https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20basic%20training%20kung%20fu%20martial%20arts%20practice%20outdoor&image_size=portrait_4_3","https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20team%20training%20morning%20exercise%20discipline%20Chinese%20traditional&image_size=portrait_4_3"]');

INSERT INTO xintan_stories (title, content, image, sort_order) VALUES
('三代传承的英歌世家', '在新坛村，有一个三代人都从事英歌表演的家庭。爷爷是英歌队的创始人之一，父亲是现任队长，儿子则是年轻一代的骨干队员。这个家庭用实际行动诠释了什么是真正的文化传承。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20family%20generations%20traditional%20culture%20heritage%20grandfather%20father%20son&image_size=portrait_4_3', 1),
('年轻人的英歌梦', '近年来，越来越多的年轻人加入到英歌队中。他们有的是大学生，有的是上班族，但都怀着对英歌文化的热爱，利用业余时间参加训练和表演，成为英歌传承的新生力量。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20Chinese%20people%20Yingge%20dance%20passionate%20performance%20cultural%20heritage&image_size=portrait_4_3', 2),
('英歌走向世界', '新坛英歌队曾多次走出国门，到东南亚、欧洲等地进行交流演出。每一次表演都赢得了当地观众的热烈掌声，让世界感受到了中华传统文化的魅力。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20international%20performance%20stage%20world%20cultural%20exchange&image_size=portrait_4_3', 3);

INSERT INTO actions_data (introduction) VALUES
('英歌舞的动作非常丰富，每个动作都有独特的名称和含义。这些动作大多来源于武术和戏曲，经过长期的演变和发展，形成了英歌舞独特的动作体系。');

INSERT INTO actions (name, pinyin, description, image, meaning, sort_order) VALUES
('洗马', 'Xǐ Mǎ', '洗马是英歌舞的经典动作之一，动作模拟洗马的场景。舞者双手持槌，身体前倾，左右摆动，仿佛在清洗马匹。这个动作要求身体协调性好，节奏感强。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20movement%20washing%20horse%20pose%20wooden%20sticks%20Chinese%20traditional&image_size=portrait_4_3', '洗马动作象征着出征前的准备，体现了英歌舞的武舞特色。', 1),
('抛槌', 'Pāo Chuí', '抛槌是英歌舞中难度较高的动作。舞者将手中的木槌抛向空中，然后准确地接住。这个动作需要高超的技巧和良好的心理素质，是英歌舞表演中的亮点。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20throwing%20sticks%20acrobatic%20movement%20dynamic%20Chinese%20traditional&image_size=portrait_4_3', '抛槌动作展现了英歌队员的精湛技艺和勇敢精神。', 2),
('交叉槌', 'Jiāo Chā Chuí', '交叉槌是英歌舞的基本动作之一。舞者双手持槌，在身前交叉击打，动作整齐划一，节奏感强。这个动作是英歌舞队形变换的基础。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20cross%20sticks%20movement%20synchronized%20performance%20Chinese%20traditional&image_size=portrait_4_3', '交叉槌动作象征着团结协作，体现了英歌舞的集体精神。', 3),
('对打', 'Duì Dǎ', '对打是英歌舞中最具观赏性的动作之一。两名舞者面对面站立，手持木槌互相击打，动作快速有力，配合默契。这个动作要求舞者反应敏捷，技艺高超。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20duel%20two%20performers%20sticks%20fight%20dynamic%20Chinese%20traditional&image_size=portrait_4_3', '对打动作展现了英歌舞的武术本质，体现了阳刚之美。', 4),
('飞天', 'Fēi Tiān', '飞天是英歌舞中的高难度动作。舞者在跳跃的同时，将木槌抛向空中，身体在空中形成优美的弧线。这个动作需要强大的爆发力和良好的身体柔韧性。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20flying%20leap%20acrobatics%20dynamic%20movement%20Chinese%20traditional&image_size=portrait_4_3', '飞天动作象征着自由和力量，展现了英歌队员的英雄气概。', 5),
('盘龙', 'Pán Lóng', '盘龙是英歌舞中的队形变换动作。舞者们围绕成一个圆圈，手持木槌旋转击打，形成一个旋转的龙形图案。这个动作需要队员之间高度的配合和默契。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20dragon%20formation%20circular%20movement%20team%20performance%20Chinese%20traditional&image_size=portrait_4_3', '盘龙动作象征着龙的精神，体现了中华民族的凝聚力。', 6);

INSERT INTO equipment_categories (category, sort_order) VALUES
('脸谱', 1),
('服饰', 2),
('道具', 3);

INSERT INTO equipment_items (category_id, name, description, image, details, sort_order) VALUES
(1, '程咬金', '程咬金是英歌舞中的经典角色，脸谱以绿色为主色调，象征其勇猛善战的性格。', '/static/masks/mask-1.jpg', '程咬金是《隋唐演义》中的著名将领，以三板斧著称。在英歌舞中，程咬金通常由经验丰富的老队员扮演，是队伍中的核心角色。', 1),
(1, '秦琼', '秦琼是英歌舞中的正面角色，脸谱以黄色为主色调，象征其忠义勇敢的品质。', '/static/masks/mask-2.jpg', '秦琼是唐朝开国功臣，以勇猛善战、忠义双全著称。在英歌舞中，秦琼通常担任领队角色。', 2),
(1, '尉迟恭', '尉迟恭是英歌舞中的猛将角色，脸谱以黑色为主色调，象征其刚正不阿的性格。', '/static/masks/mask-3.jpg', '尉迟恭是唐朝著名将领，以勇猛无畏著称。在英歌舞中，尉迟恭通常由身材高大、力量充沛的队员扮演。', 3),
(1, '鲁智深', '鲁智深是英歌舞中的花脸角色，脸谱以蓝色为主色调，象征其豪爽洒脱的性格。', '/static/masks/mask-4.jpg', '鲁智深是《水浒传》中的著名好汉，以力大无穷、疾恶如仇著称。在英歌舞中，鲁智深的动作通常比较粗犷豪放。', 4),
(1, '关胜', '关胜是英歌舞中的大将角色，脸谱以红色为主色调，象征其忠义赤诚的品格。', '/static/masks/mask-5.jpg', '关胜是《水浒传》中的好汉，以关羽后代自居，使一口青龙偃月刀。在英歌舞中代表忠义勇武的精神。', 5),
(1, '林冲', '林冲是英歌舞中的英雄角色，脸谱以白色为主色调，象征其正直刚毅的性格。', '/static/masks/mask-6.jpg', '林冲是《水浒传》中的豹子头，八十万禁军教头。在英歌舞中代表隐忍与爆发的结合。', 6),
(1, '武松', '武松是英歌舞中的勇士角色，脸谱以金色为主色调，象征其威武不凡的气概。', '/static/masks/mask-7.jpg', '武松是《水浒传》中的行者，以打虎英雄闻名。在英歌舞中代表勇猛无畏的气魄。', 7),
(1, '李逵', '李逵是英歌舞中的猛将角色，脸谱以黑色为主色调，象征其刚烈直爽的性情。', '/static/masks/mask-8.jpg', '李逵是《水浒传》中的黑旋风，以力大无穷、性如烈火著称。在英歌舞中代表粗犷豪放的力量。', 8),
(1, '花荣', '花荣是英歌舞中的俊朗角色，脸谱以紫色为主色调，象征其儒雅俊秀的气质。', '/static/masks/mask-9.jpg', '花荣是《水浒传》中的小李广，以神箭手闻名。在英歌舞中代表精准与灵巧的结合。', 9),
(2, '战袍', '英歌队员穿着的传统战袍，以红色为主色调，象征着喜庆和勇气。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20costume%20red%20traditional%20Chinese%20warrior%20robe&image_size=portrait_4_3', '战袍是英歌队员的标志性服装，通常采用绸缎面料，上面绣有精美的图案。战袍的设计既美观又便于表演。', 1),
(2, '战靴', '英歌队员穿着的传统战靴，以黑色为主色调，坚固耐用。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20boots%20black%20traditional%20Chinese%20warrior%20footwear&image_size=portrait_4_3', '战靴是英歌队员必备的装备，采用牛皮制作，鞋底厚实，适合长时间的表演和训练。', 2),
(2, '腰带', '英歌队员系的传统腰带，以金色为主色调，华丽夺目。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20belt%20gold%20traditional%20Chinese%20warrior%20accessory&image_size=portrait_4_3', '腰带不仅起到装饰作用，还能帮助队员固定服装，方便动作表演。', 3),
(3, '英歌锤', '英歌队员手持的主要道具，由硬木制成，两端包有铁皮。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20wooden%20sticks%20hammers%20traditional%20Chinese%20performance%20prop&image_size=portrait_4_3', '英歌锤是英歌舞的核心道具，长度约30厘米，重量适中。舞者手持双槌，通过击打产生节奏感。', 1),
(3, '大鼓', '英歌舞的主要伴奏乐器，鼓声雄浑有力，是表演的灵魂。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20drum%20large%20traditional%20Chinese%20percussion%20instrument&image_size=portrait_4_3', '大鼓是英歌舞乐队的核心，鼓手需要有强大的体力和节奏感，能够带动整个队伍的表演节奏。', 2),
(3, '铜锣', '英歌舞的重要伴奏乐器，锣声清脆响亮，增添表演的气势。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20gong%20bronze%20traditional%20Chinese%20percussion%20instrument&image_size=portrait_4_3', '铜锣是英歌舞乐队中不可或缺的乐器，锣手需要精准地控制敲击的节奏和力度。', 3),
(3, '螺号', '英歌舞的特色伴奏乐器，螺号声悠长嘹亮，具有很强的穿透力。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20conch%20shell%20horn%20traditional%20Chinese%20instrument&image_size=portrait_4_3', '螺号是英歌舞中独特的乐器，声音高亢嘹亮，能够营造出激昂的氛围。', 4);

INSERT INTO people_data (introduction) VALUES
('英歌文化的传承离不开一代又一代传承人的努力。他们用自己的青春和汗水，守护着这项珍贵的非物质文化遗产，让英歌舞在新时代焕发出新的活力。');

INSERT INTO people_categories (title, description, sort_order) VALUES
('国家级传承人', '他们是英歌文化的杰出代表，拥有国家级非物质文化遗产传承人的荣誉称号。', 1),
('教练', '他们是英歌队的核心力量，负责日常训练和编排工作，是英歌文化传承的中坚力量。', 2),
('青少年传承人', '他们是英歌文化的未来，从小学习英歌，是传统文化的新生力量。', 3);

INSERT INTO people (category_id, name, role, avatar, story, achievements, sort_order) VALUES
(1, '杨继荣', '国家级非物质文化遗产传承人', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20Chinese%20man%20Yingge%20dance%20master%20portrait%20traditional%20culture&image_size=portrait_4_3',
'杨继荣是普宁英歌的国家级传承人，从事英歌表演和教学已有60多年。他从小跟随父亲学习英歌，精通各种英歌动作和技巧。杨继荣不仅自己表演，还培养了大量的英歌人才，为英歌文化的传承做出了巨大贡献。',
'["国家级非物质文化遗产传承人","广东省民间文艺家协会会员","多次带领英歌队参加国家级演出","培养了数百名英歌队员"]', 1),
(1, '张伯秋', '国家级非物质文化遗产传承人', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=senior%20Chinese%20man%20Yingge%20dance%20expert%20portrait%20traditional%20arts&image_size=portrait_4_3',
'张伯秋是普宁英歌的另一位国家级传承人，他擅长英歌脸谱的绘制和制作。张伯秋绘制的脸谱色彩鲜艳、造型独特，深受广大观众的喜爱。他还将脸谱制作技艺传授给年轻一代，确保这项传统技艺得以延续。',
'["国家级非物质文化遗产传承人","广东省工艺美术大师","脸谱作品多次获得国家级奖项","出版《普宁英歌脸谱》专著"]', 2),
(2, '李志强', '新坛英歌队主教练', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20Chinese%20man%20Yingge%20dance%20coach%20portrait%20professional&image_size=portrait_4_3',
'李志强是新坛英歌队的现任主教练，从事英歌教学已有30多年。他年轻时是英歌队的主力队员，退役后担任教练，将自己的经验和技艺传授给年轻队员。在他的带领下，新坛英歌队多次获得省市级比赛的一等奖。',
'["新坛英歌队主教练","广东省优秀民间文艺工作者","编排的英歌节目多次获奖","培养了一批优秀的年轻队员"]', 1),
(2, '王建国', '南山英歌队教练', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20Chinese%20man%20Yingge%20dance%20instructor%20portrait%20traditional&image_size=portrait_4_3',
'王建国是南山英歌队的教练，他致力于创新英歌表演形式，将现代元素融入传统英歌中。他编排的节目既有传统韵味，又符合现代观众的审美需求，受到了广泛好评。',
'["南山英歌队教练","英歌创新编排专家","多次获得省级文艺创新奖","推动英歌文化进校园"]', 2),
(3, '陈晓峰', '青少年传承人', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20Chinese%20boy%20Yingge%20dance%20performer%20portrait%20talented&image_size=portrait_4_3',
'陈晓峰今年16岁，是新坛英歌队的年轻队员。他从小就对英歌产生了浓厚的兴趣，8岁开始学习英歌。经过多年的刻苦训练，陈晓峰已经成为队里的骨干队员，多次参加重要演出。他希望将来能够成为一名专业的英歌演员，将英歌文化发扬光大。',
'["新坛英歌队骨干队员","多次参加省市级演出","获得"优秀青少年传承人"称号","在校期间推广英歌文化"]', 1),
(3, '林小雨', '青少年传承人', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20Chinese%20girl%20Yingge%20dance%20performer%20portrait%20talented&image_size=portrait_4_3',
'林小雨是一位年轻的女英歌队员，今年14岁。虽然英歌通常由男子表演，但林小雨对英歌的热爱让她成为了一名出色的表演者。她的动作刚劲有力，丝毫不逊色于男队员。林小雨希望通过自己的努力，打破传统观念，让更多的女性了解和喜爱英歌。',
'["首位参加正式演出的女队员","多次获得青少年才艺比赛奖项","推动英歌文化的性别平等","在社交媒体上推广英歌"]', 2);
