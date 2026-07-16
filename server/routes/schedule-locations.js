import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// 初始化数据库表
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        address VARCHAR(300) DEFAULT '',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] schedule_locations 表已就绪');
  } catch (err) {
    console.error('[DB] 创建 schedule_locations 表失败:', err.message);
  }
})();

// 获取所有地点（公开）
router.get("/", async (req, res) => {
  try {
    const [locations] = await pool.query(
      "SELECT * FROM schedule_locations ORDER BY sort_order ASC, id ASC"
    );
    res.json(locations);
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 创建地点（需登录）
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name) {
      return res.status(400).json({ message: "地点名称不能为空" });
    }
    const [result] = await pool.query(
      "INSERT INTO schedule_locations (name, address) VALUES (?, ?)",
      [name, address || '']
    );
    res.json({ success: true, id: result.insertId, message: "创建成功" });
  } catch (error) {
    console.error("Create location error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 更新地点（需登录）
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    await pool.query(
      "UPDATE schedule_locations SET name = ?, address = ? WHERE id = ?",
      [name || '', address || '', id]
    );
    res.json({ success: true, message: "更新成功" });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 删除地点（需登录）
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM schedule_locations WHERE id = ?", [id]);
    res.json({ success: true, message: "删除成功" });
  } catch (error) {
    console.error("Delete location error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

export default router;
