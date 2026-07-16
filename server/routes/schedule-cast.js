import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// 初始化数据库表
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_cast_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] schedule_cast_members 表已就绪');
  } catch (err) {
    console.error('[DB] 创建 schedule_cast_members 表失败:', err.message);
  }
})();

// 获取所有演职人员（公开）
router.get("/", async (req, res) => {
  try {
    const [members] = await pool.query(
      "SELECT * FROM schedule_cast_members ORDER BY sort_order ASC, id ASC"
    );
    res.json(members);
  } catch (error) {
    console.error("Get cast members error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 创建演职人员（需登录）
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, role, phone } = req.body;
    if (!name) {
      return res.status(400).json({ message: "姓名不能为空" });
    }
    const [result] = await pool.query(
      "INSERT INTO schedule_cast_members (name, role, phone) VALUES (?, ?, ?)",
      [name, role || '', phone || '']
    );
    res.json({ success: true, id: result.insertId, message: "创建成功" });
  } catch (error) {
    console.error("Create cast member error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 更新演职人员（需登录）
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, phone } = req.body;
    await pool.query(
      "UPDATE schedule_cast_members SET name = ?, role = ?, phone = ? WHERE id = ?",
      [name || '', role || '', phone || '', id]
    );
    res.json({ success: true, message: "更新成功" });
  } catch (error) {
    console.error("Update cast member error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 删除演职人员（需登录）
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM schedule_cast_members WHERE id = ?", [id]);
    res.json({ success: true, message: "删除成功" });
  } catch (error) {
    console.error("Delete cast member error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

export default router;
