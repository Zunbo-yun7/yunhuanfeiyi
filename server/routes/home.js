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

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM home_data LIMIT 1');
    
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
