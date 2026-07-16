import { Router } from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [dataRows] = await pool.query('SELECT * FROM actions_data LIMIT 1');
    const [actionRows] = await pool.query('SELECT * FROM actions ORDER BY sort_order ASC, id ASC');

    const data = dataRows[0] || { introduction: '' };

    res.json({
      introduction: data.introduction || '',
      actions: actionRows.map((item) => ({
        id: String(item.id),
        name: item.name,
        pinyin: item.pinyin || '',
        description: item.description || '',
        videoUrl: item.video_url || '',
        image: item.image || '',
        meaning: item.meaning || '',
      })),
    });
  } catch (error) {
    console.error('Get actions data error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/introduction', authMiddleware, async (req, res) => {
  try {
    const { introduction } = req.body;

    const [rows] = await pool.query('SELECT id FROM actions_data LIMIT 1');

    if (rows.length === 0) {
      await pool.query('INSERT INTO actions_data (introduction) VALUES (?)', [introduction || '']);
    } else {
      await pool.query('UPDATE actions_data SET introduction = ? WHERE id = ?', [introduction || '', rows[0].id]);
    }

    res.json({ success: true, message: '保存成功' });
  } catch (error) {
    console.error('Update actions introduction error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, pinyin, description, videoUrl, image, meaning, sort_order } = req.body;

    const [result] = await pool.query(
      `INSERT INTO actions (name, pinyin, description, video_url, image, meaning, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, pinyin || '', description || '', videoUrl || '', image || '', meaning || '', sort_order || 0]
    );

    res.json({ success: true, message: '添加成功', id: result.insertId });
  } catch (error) {
    console.error('Add action error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pinyin, description, videoUrl, image, meaning, sort_order } = req.body;

    if (sort_order !== undefined && name === undefined && pinyin === undefined && description === undefined && videoUrl === undefined && image === undefined && meaning === undefined) {
      await pool.query(
        'UPDATE actions SET sort_order = ? WHERE id = ?',
        [sort_order, id]
      );
    } else {
      await pool.query(
        `UPDATE actions SET name = ?, pinyin = ?, description = ?, video_url = ?, image = ?, meaning = ?, sort_order = ? 
         WHERE id = ?`,
        [name, pinyin || '', description || '', videoUrl || '', image || '', meaning || '', sort_order || 0, id]
      );
    }

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update action error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM actions WHERE id = ?', [id]);

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete action error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
