import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// 初始化数据库表
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        performance_time DATETIME NOT NULL,
        location VARCHAR(200) NOT NULL,
        duration INT DEFAULT 60,
        status VARCHAR(20) DEFAULT 'upcoming',
        notes TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        schedule_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        duration INT DEFAULT 0,
        description TEXT,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        schedule_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) DEFAULT '',
        sort_order INT DEFAULT 0,
        FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
      )
    `);

    console.log('[DB] schedules 相关表已就绪');
  } catch (err) {
    console.error('[DB] 创建 schedules 表失败:', err.message);
  }
})();

// 获取所有演出时间表（公开）
router.get("/", async (req, res) => {
  try {
    const [schedules] = await pool.query(
      "SELECT * FROM schedules ORDER BY performance_time ASC, sort_order ASC, id ASC"
    );

    const result = await Promise.all(schedules.map(async (s) => {
      const [programs] = await pool.query(
        "SELECT * FROM schedule_programs WHERE schedule_id = ? ORDER BY sort_order ASC, id ASC",
        [s.id]
      );
      const [members] = await pool.query(
        "SELECT * FROM schedule_members WHERE schedule_id = ? ORDER BY sort_order ASC, id ASC",
        [s.id]
      );
      return {
        ...s,
        programs,
        members
      };
    }));

    res.json(result);
  } catch (error) {
    console.error("Get schedules error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取单个演出详情（公开）
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [schedules] = await pool.query(
      "SELECT * FROM schedules WHERE id = ?",
      [id]
    );

    if (schedules.length === 0) {
      return res.status(404).json({ message: "演出不存在" });
    }

    const [programs] = await pool.query(
      "SELECT * FROM schedule_programs WHERE schedule_id = ? ORDER BY sort_order ASC, id ASC",
      [id]
    );
    const [members] = await pool.query(
      "SELECT * FROM schedule_members WHERE schedule_id = ? ORDER BY sort_order ASC, id ASC",
      [id]
    );

    res.json({
      ...schedules[0],
      programs,
      members
    });
  } catch (error) {
    console.error("Get schedule error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 创建演出（需登录）
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, performance_time, location, duration, status, notes, programs, members, recurrence } = req.body;

    // 辅助函数：创建单个演出
    const createSingleSchedule = async (perfTime) => {
      const [result] = await pool.query(
        `INSERT INTO schedules (title, performance_time, location, duration, status, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title || '', perfTime, location || '', duration || 60, status || 'upcoming', notes || '']
      );
      const scheduleId = result.insertId;

      // 插入节目
      if (programs && programs.length > 0) {
        for (let i = 0; i < programs.length; i++) {
          const p = programs[i];
          await pool.query(
            `INSERT INTO schedule_programs (schedule_id, name, duration, description, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            [scheduleId, p.name, p.duration || 0, p.description || '', i]
          );
        }
      }

      // 插入演职人员
      if (members && members.length > 0) {
        for (let i = 0; i < members.length; i++) {
          const m = members[i];
          await pool.query(
            `INSERT INTO schedule_members (schedule_id, name, role, sort_order)
             VALUES (?, ?, ?, ?)`,
            [scheduleId, m.name, m.role || '', i]
          );
        }
      }
      return scheduleId;
    };

    // 无周期性设置，只创建一个
    if (!recurrence || !recurrence.enabled) {
      const id = await createSingleSchedule(performance_time);
      return res.json({ success: true, id, message: "创建成功" });
    }

    // 周期性设置：批量生成
    const { frequency, days, endDate, count } = recurrence;
    const baseDate = new Date(performance_time);
    const dates = [];

    // 生成日期列表
    if (frequency === 'weekly' || frequency === 'biweekly') {
      const interval = frequency === 'biweekly' ? 14 : 7;
      let current = new Date(baseDate);
      let generated = 0;
      const maxCount = count || 52;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      while (generated < maxCount) {
        for (const day of days) {
          const d = new Date(current);
          const currentDay = d.getDay();
          const diff = (day - currentDay + 7) % 7;
          d.setDate(d.getDate() + diff);
          d.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);

          if (d.getTime() >= baseDate.getTime()) {
            if (end && d > end) break;
            dates.push(new Date(d));
            generated++;
            if (generated >= maxCount) break;
          }
        }
        current.setDate(current.getDate() + interval);
        if (end && current > end) break;
      }
    } else if (frequency === 'monthly') {
      let current = new Date(baseDate);
      const maxCount = count || 12;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      for (let i = 0; i < maxCount; i++) {
        if (end && current > end) break;
        dates.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
    }

    // 去重并排序
    const uniqueDates = dates
      .filter((d, i, arr) => arr.findIndex(t => t.getTime() === d.getTime()) === i)
      .sort((a, b) => a.getTime() - b.getTime());

    const createdIds = [];
    for (const dt of uniqueDates) {
      const isoStr = dt.toISOString().slice(0, 19).replace('T', ' ');
      const id = await createSingleSchedule(isoStr);
      createdIds.push(id);
    }

    res.json({
      success: true,
      ids: createdIds,
      count: createdIds.length,
      message: `成功创建 ${createdIds.length} 场演出`
    });
  } catch (error) {
    console.error("Create schedule error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 更新演出（需登录）
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, performance_time, location, duration, status, notes, programs, members } = req.body;

    await pool.query(
      `UPDATE schedules SET title = ?, performance_time = ?, location = ?, duration = ?, status = ?, notes = ?
       WHERE id = ?`,
      [title || '', performance_time, location || '', duration || 60, status || 'upcoming', notes || '', id]
    );

    // 删除原有节目和人员，重新插入
    await pool.query("DELETE FROM schedule_programs WHERE schedule_id = ?", [id]);
    await pool.query("DELETE FROM schedule_members WHERE schedule_id = ?", [id]);

    if (programs && programs.length > 0) {
      for (let i = 0; i < programs.length; i++) {
        const p = programs[i];
        await pool.query(
          `INSERT INTO schedule_programs (schedule_id, name, duration, description, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [id, p.name, p.duration || 0, p.description || '', i]
        );
      }
    }

    if (members && members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        await pool.query(
          `INSERT INTO schedule_members (schedule_id, name, role, sort_order)
           VALUES (?, ?, ?, ?)`,
          [id, m.name, m.role || '', i]
        );
      }
    }

    res.json({ success: true, message: "更新成功" });
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 更新排序（需登录）
router.put("/reorder", authMiddleware, async (req, res) => {
  try {
    const { order } = req.body; // [{id, sort_order}]

    for (const item of order) {
      await pool.query(
        "UPDATE schedules SET sort_order = ? WHERE id = ?",
        [item.sort_order, item.id]
      );
    }

    res.json({ success: true, message: "排序更新成功" });
  } catch (error) {
    console.error("Reorder schedules error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 删除演出（需登录）
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM schedule_programs WHERE schedule_id = ?", [id]);
    await pool.query("DELETE FROM schedule_members WHERE schedule_id = ?", [id]);
    await pool.query("DELETE FROM schedules WHERE id = ?", [id]);

    res.json({ success: true, message: "删除成功" });
  } catch (error) {
    console.error("Delete schedule error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

export default router;