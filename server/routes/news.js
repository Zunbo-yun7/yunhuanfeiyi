import express from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news_articles WHERE is_published = 1 ORDER BY sort_order ASC, updated_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('获取新闻稿失败:', error);
    res.status(500).json({ error: '获取新闻稿失败' });
  }
});

router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news_articles ORDER BY sort_order ASC, updated_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('获取新闻稿列表失败:', error);
    res.status(500).json({ error: '获取新闻稿列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news_articles WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '新闻稿不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('获取新闻稿详情失败:', error);
    res.status(500).json({ error: '获取新闻稿详情失败' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, summary, thumbnail_url, author, is_published } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }

    const [result] = await pool.query(
      'INSERT INTO news_articles (title, content, summary, thumbnail_url, author, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        content,
        summary || null,
        thumbnail_url || null,
        author || null,
        is_published ? 1 : 0,
        is_published ? new Date() : null,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: '新闻稿创建成功',
    });
  } catch (error) {
    console.error('创建新闻稿失败:', error);
    res.status(500).json({ error: '创建新闻稿失败' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, summary, thumbnail_url, author, is_published } = req.body;
    
    const [existing] = await pool.query(
      'SELECT is_published FROM news_articles WHERE id = ?',
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: '新闻稿不存在' });
    }

    const currentPublished = existing[0].is_published;
    const newPublished = is_published ? 1 : 0;
    let published_at = existing[0].published_at;
    
    if (newPublished && !currentPublished) {
      published_at = new Date();
    }

    await pool.query(
      'UPDATE news_articles SET title = ?, content = ?, summary = ?, thumbnail_url = ?, author = ?, is_published = ?, published_at = ? WHERE id = ?',
      [
        title,
        content,
        summary || null,
        thumbnail_url || null,
        author || null,
        newPublished,
        published_at,
        req.params.id,
      ]
    );

    res.json({ message: '新闻稿更新成功' });
  } catch (error) {
    console.error('更新新闻稿失败:', error);
    res.status(500).json({ error: '更新新闻稿失败' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM news_articles WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '新闻稿不存在' });
    }

    res.json({ message: '新闻稿删除成功' });
  } catch (error) {
    console.error('删除新闻稿失败:', error);
    res.status(500).json({ error: '删除新闻稿失败' });
  }
});

router.post('/:id/publish', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE news_articles SET is_published = 1, published_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: '新闻稿已发布' });
  } catch (error) {
    console.error('发布新闻稿失败:', error);
    res.status(500).json({ error: '发布新闻稿失败' });
  }
});

router.post('/:id/unpublish', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE news_articles SET is_published = 0 WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: '新闻稿已取消发布' });
  } catch (error) {
    console.error('取消发布新闻稿失败:', error);
    res.status(500).json({ error: '取消发布新闻稿失败' });
  }
});

export default router;
