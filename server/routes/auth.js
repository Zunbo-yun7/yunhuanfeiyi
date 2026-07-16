import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const admin = rows[0];
    let isValidPassword;

    if (admin.password.startsWith('$2')) {
      isValidPassword = await bcrypt.compare(password, admin.password);
    } else {
      isValidPassword = password === admin.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'yingge_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/init-admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: '管理员已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO admin_users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.json({
      success: true,
      message: '管理员创建成功',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
