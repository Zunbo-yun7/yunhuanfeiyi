import express from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM wechat_articles ORDER BY is_top DESC, published_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('获取公众号文章失败:', error);
    res.status(500).json({ error: '获取公众号文章失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM wechat_articles WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).json({ error: '获取文章详情失败' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, wechat_account, wechat_url, summary, thumbnail_url, published_at, is_top } = req.body;
    
    if (!title || !wechat_account || !wechat_url || !published_at) {
      return res.status(400).json({ error: '标题、公众号名称、公众号链接和发布时间不能为空' });
    }

    const [result] = await pool.query(
      'INSERT INTO wechat_articles (title, wechat_account, wechat_url, summary, thumbnail_url, published_at, is_top) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        wechat_account,
        wechat_url,
        summary || null,
        thumbnail_url || null,
        published_at,
        is_top ? 1 : 0,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: '公众号文章创建成功',
    });
  } catch (error) {
    console.error('创建公众号文章失败:', error);
    res.status(500).json({ error: '创建公众号文章失败' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, wechat_account, wechat_url, summary, thumbnail_url, published_at, is_top } = req.body;
    
    const [existing] = await pool.query(
      'SELECT * FROM wechat_articles WHERE id = ?',
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: '文章不存在' });
    }

    await pool.query(
      'UPDATE wechat_articles SET title = ?, wechat_account = ?, wechat_url = ?, summary = ?, thumbnail_url = ?, published_at = ?, is_top = ? WHERE id = ?',
      [
        title,
        wechat_account,
        wechat_url,
        summary || null,
        thumbnail_url || null,
        published_at,
        is_top ? 1 : 0,
        req.params.id,
      ]
    );

    res.json({ message: '公众号文章更新成功' });
  } catch (error) {
    console.error('更新公众号文章失败:', error);
    res.status(500).json({ error: '更新公众号文章失败' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM wechat_articles WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '文章不存在' });
    }

    res.json({ message: '公众号文章删除成功' });
  } catch (error) {
    console.error('删除公众号文章失败:', error);
    res.status(500).json({ error: '删除公众号文章失败' });
  }
});

router.post('/:id/top', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE wechat_articles SET is_top = 1 WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: '文章已置顶' });
  } catch (error) {
    console.error('置顶文章失败:', error);
    res.status(500).json({ error: '置顶文章失败' });
  }
});

router.post('/:id/untop', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE wechat_articles SET is_top = 0 WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: '文章已取消置顶' });
  } catch (error) {
    console.error('取消置顶文章失败:', error);
    res.status(500).json({ error: '取消置顶文章失败' });
  }
});

export default router;
