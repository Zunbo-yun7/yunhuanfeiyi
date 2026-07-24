import { Router } from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

const defaultNav = [
  { id: 'about', title: '认识英歌', description: '了解英歌文化的起源与发展', icon: 'BookOpen', path: '/about', color: 'yingge-red' },
  { id: 'xintan', title: '新坛英歌', description: '探访新坛村的英歌传奇', icon: 'MapPin', path: '/xintan', color: 'yingge-gold' },
  { id: 'actions', title: '动作图谱', description: '学习英歌的经典动作', icon: 'Move', path: '/actions', color: 'yingge-dark' },
  { id: 'equipment', title: '脸谱与装备', description: '欣赏精美的脸谱与装备', icon: 'Mask', path: '/equipment', color: 'yingge-brown' },
  { id: 'stories', title: '人物故事', description: '聆听传承人的感人故事', icon: 'Users', path: '/stories', color: 'yingge-red' },
  { id: 'guide', title: 'AI导游', description: '智能问答，探索英歌奥秘', icon: 'Bot', path: '/guide', color: 'yingge-gold' },
];

const defaultChallenges = [
  { icon: 'TrendingDown', title: '传播碎片化，内涵挖掘不足', impact: '文化认知浅层化', description: '英歌舞短视频播放量破45亿，但传播以视觉冲击片段为主，历史渊源、脸谱寓意、阵法文化等深层内涵难以通过碎片化视频系统传递，用户知其然不知其所以然。', source: '英歌舞短视频播放破45亿报道', sourceUrl: 'http://m.toutiao.com/group/7610332822931079690/' },
  { icon: 'Users', title: '年轻人有兴趣，但缺学习渠道', impact: '传承渠道断层', description: '抖音00后非遗视频创作者同比增长95%，年轻群体对非遗兴趣高涨，但英歌舞缺乏系统化的线上学习平台，动作、脸谱、历史等知识散落在各处，入门门槛高。', source: '抖音2025非遗数据报告', sourceUrl: 'https://3g.163.com/news/article/K0GCCE7J05149B41.html' },
  { icon: 'AlertTriangle', title: '数字化程度低，体验单一', impact: '数字体验滞后', description: '英歌数字化仍以视频播放和图文展示为主，首个英歌舞数字艺术馆2025年才上线，缺乏互动式、沉浸式的数字体验，难以满足年轻一代的参与需求。', source: '首个英歌舞数字艺术馆上线报道', sourceUrl: 'https://c.m.163.com/news/a/JVV3KV7505388J4C.html' },
];

const defaultSolutions = [
  { icon: 'BookOpen', title: '系统化知识图谱', description: '将英歌历史、动作、脸谱、装备等知识结构化呈现，破解短视频碎片化传播的局限，让用户系统理解英歌文化全貌。', feature: '破解碎片化传播', color: 'from-yingge-red to-red-700', link: '/about' },
  { icon: 'Bot', title: 'AI智能导游', description: '基于大模型的24小时智能问答，降低学习门槛，解决年轻人有兴趣但缺引导渠道的痛点，随时解答英歌疑问。', feature: '降低学习门槛', color: 'from-purple-600 to-indigo-700', link: '/guide' },
  { icon: 'Image', title: '高清脸谱图鉴', description: '数字化保存珍贵脸谱图像并深度解读寓意，弥补短视频重视觉、轻内涵的不足，让用户读懂脸谱背后的文化密码。', feature: '深挖文化内涵', color: 'from-amber-600 to-orange-700', link: '/mask-diy' },
  { icon: 'Video', title: '动作图谱可视化', description: '将传统英歌招式拆解呈现，配以图文说明，解决线下教学资源稀缺的问题，让更多人可以在线学习英歌动作。', feature: '线上学习渠道', color: 'from-emerald-600 to-teal-700', link: '/actions' },
  { icon: 'Globe', title: '轻量化数字平台', description: 'H5网页形式，无需下载，随时随地访问，打破地域和时间限制，让英歌文化触达更广泛的年轻群体。', feature: '打破时空限制', color: 'from-blue-600 to-cyan-700', link: '/about' },
  { icon: 'Sparkles', title: '沉浸式交互体验', description: '精美视觉设计与流畅动效，结合可交互的脸谱DIY等玩法，改变传统图文展示的单一体验，让非遗变得好玩有趣。', feature: '丰富互动体验', color: 'from-pink-600 to-rose-700', link: '/mask-diy' },
];

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM home_data LIMIT 1');
    const [challengeRows] = await pool.query('SELECT * FROM heritage_challenges ORDER BY sort_order ASC');
    const [solutionRows] = await pool.query('SELECT * FROM digital_solutions ORDER BY sort_order ASC');

    const challenges = challengeRows.length > 0 ? challengeRows.map(c => ({
      icon: c.icon,
      title: c.title,
      impact: c.impact,
      description: c.description,
      source: c.source,
      sourceUrl: c.source_url,
    })) : defaultChallenges;

    const solutions = solutionRows.length > 0 ? solutionRows.map(s => ({
      icon: s.icon,
      title: s.title,
      description: s.description,
      feature: s.feature,
      color: s.color,
      link: s.link,
    })) : defaultSolutions;

    if (rows.length === 0) {
      return res.json({
        hero: {
          title: '云焕非遗',
          subtitle: '英歌文化数字展示平台',
          description: '走进普宁英歌，感受非遗魅力',
          backgroundImage: '',
          videoUrl: '',
        },
        projectIntro: '',
        navigation: defaultNav,
        challenges,
        solutions,
      });
    }

    const data = rows[0];
    res.json({
      hero: {
        title: data.hero_title,
        subtitle: data.hero_subtitle,
        description: data.hero_description || '',
        backgroundImage: data.hero_background_image || '',
        videoUrl: data.hero_video_url || '',
      },
      projectIntro: data.project_intro || '',
      navigation: defaultNav,
      challenges,
      solutions,
    });
  } catch (error) {
    console.error('Get home data error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { hero, projectIntro } = req.body;

    const [rows] = await pool.query('SELECT id FROM home_data LIMIT 1');

    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO home_data (hero_title, hero_subtitle, hero_description, hero_background_image, hero_video_url, project_intro) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          hero?.title || '云焕非遗',
          hero?.subtitle || '英歌文化数字展示平台',
          hero?.description || '',
          hero?.backgroundImage || '',
          hero?.videoUrl || '',
          projectIntro || '',
        ]
      );
    } else {
      await pool.query(
        `UPDATE home_data SET 
         hero_title = ?, hero_subtitle = ?, hero_description = ?, 
         hero_background_image = ?, hero_video_url = ?, project_intro = ? 
         WHERE id = ?`,
        [
          hero?.title || '云焕非遗',
          hero?.subtitle || '英歌文化数字展示平台',
          hero?.description || '',
          hero?.backgroundImage || '',
          hero?.videoUrl || '',
          projectIntro || '',
          rows[0].id,
        ]
      );
    }

    res.json({ success: true, message: '保存成功' });
  } catch (error) {
    console.error('Update home data error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
