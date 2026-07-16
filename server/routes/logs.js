import { Router } from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM practice_logs ORDER BY is_top DESC, sort_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Get practice logs error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM practice_logs WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '日志不存在' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get practice log error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, image, is_top, sort_order } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }

    const [result] = await pool.query(
      'INSERT INTO practice_logs (title, content, image, is_top, sort_order) VALUES (?, ?, ?, ?, ?)',
      [title, content, image || '', is_top || 0, sort_order || 0]
    );

    res.json({
      success: true,
      message: '创建成功',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Create practice log error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, is_top, sort_order } = req.body;

    const [rows] = await pool.query('SELECT id FROM practice_logs WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '日志不存在' });
    }

    await pool.query(
      'UPDATE practice_logs SET title = ?, content = ?, image = ?, is_top = ?, sort_order = ? WHERE id = ?',
      [title, content, image || '', is_top || 0, sort_order || 0, id]
    );

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update practice log error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id/top', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_top } = req.body;

    const [rows] = await pool.query('SELECT id FROM practice_logs WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '日志不存在' });
    }

    await pool.query('UPDATE practice_logs SET is_top = ? WHERE id = ?', [is_top ? 1 : 0, id]);

    res.json({ success: true, message: is_top ? '置顶成功' : '取消置顶成功' });
  } catch (error) {
    console.error('Toggle top practice log error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT id FROM practice_logs WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '日志不存在' });
    }

    await pool.query('DELETE FROM practice_logs WHERE id = ?', [id]);

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete practice log error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
