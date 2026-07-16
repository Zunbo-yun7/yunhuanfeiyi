CREATE TABLE IF NOT EXISTS practice_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500) DEFAULT '',
  is_top TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sort_order INT DEFAULT 0
);

INSERT INTO practice_logs (title, content, image, is_top, sort_order) VALUES
('第一次走进新坛村', '今天是我们实践队第一次来到新坛村，阳光明媚，微风轻拂。村口的老榕树见证了我们的到来，村民们热情地迎接了我们。我们参观了英歌队的训练场地，看到队员们正在刻苦训练，每一个动作都充满了力量和美感。队长向我们介绍了英歌的历史和文化内涵，让我们对这项非遗文化有了更深的了解。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20village%20entrance%20old%20banyan%20tree%20sunny%20day%20warm%20welcome&image_size=landscape_16_9', 1, 1),
('英歌动作学习第一天', '今天开始正式学习英歌动作。教练从最基础的马步开始教我们，看似简单的动作却需要全身的力量和协调性。我们反复练习，汗水湿透了衣衫，但每一次进步都让我们感到无比兴奋。下午我们学习了交叉槌和洗马动作，虽然还不够熟练，但已经能感受到英歌独特的韵律之美。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20training%20basic%20movements%20practice%20young%20people%20learning%20traditional&image_size=landscape_16_9', 0, 2),
('脸谱绘制体验', '今天我们有幸体验了脸谱绘制。张伯秋大师亲自指导我们，从调色到勾勒轮廓，每一步都充满了讲究。我们每人绘制了一张属于自己的脸谱，虽然不够精美，但都倾注了我们的心血。绘制脸谱让我们更加深入地了解了每个角色背后的故事和文化内涵。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20opera%20face%20painting%20traditional%20art%20workshop%20colorful%20creative&image_size=landscape_16_9', 0, 3),
('第一次登台表演', '经过一周的训练，我们终于迎来了第一次登台表演的机会。虽然只是小规模的内部展示，但站在舞台上的那一刻，我们的心情无比激动。随着鼓声响起，我们挥舞着英歌锤，完成了一套完整的动作。台下的队员们为我们鼓掌，那一刻，所有的汗水和努力都化作了满满的成就感。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20performance%20stage%20debut%20young%20performers%20excited%20traditional&image_size=landscape_16_9', 1, 0),
('文化传承座谈会', '今天我们与村里的老艺人举行了一场文化传承座谈会。老艺人们讲述了他们年轻时学习英歌的故事，以及英歌在不同年代的变迁。他们语重心长地告诉我们，英歌不仅是一种舞蹈，更是一种精神的传承。我们深刻感受到了作为新一代传承人的责任和使命。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20culture%20symposium%20elderly%20artists%20young%20people%20discussion&image_size=landscape_16_9', 0, 4);
