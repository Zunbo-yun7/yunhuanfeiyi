import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// 公开接口 - 获取激活的热点
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM poster_hotspots WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
        );
        const hotspots = rows.map((r) => ({
            id: r.id,
            label: r.label,
            description: r.description || "",
            x: Number(r.x),
            y: Number(r.y),
            w: Number(r.w),
            h: Number(r.h),
            target_url: r.target_url,
            target_type: r.target_type,
            poster_image: r.poster_image || '/images/poster.png',
        }));
        res.json(hotspots);
    } catch (error) {
        console.error("Get hotspots error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 管理端 - 获取所有热点(含未激活)
router.get("/admin/all", authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM poster_hotspots ORDER BY sort_order ASC, id ASC"
        );
        res.json(rows.map((r) => ({
            id: r.id,
            label: r.label,
            description: r.description || "",
            x: Number(r.x),
            y: Number(r.y),
            w: Number(r.w),
            h: Number(r.h),
            target_url: r.target_url,
            target_type: r.target_type,
            poster_image: r.poster_image || '/images/poster.png',
            sort_order: r.sort_order,
            is_active: !!r.is_active,
            created_at: r.created_at,
            updated_at: r.updated_at,
        })));
    } catch (error) {
        console.error("Get all hotspots error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 管理端 - 创建热点
router.post("/admin", authMiddleware, async (req, res) => {
    try {
        const {
            label, description, x, y, w, h,
            target_url, target_type, poster_image, sort_order, is_active
        } = req.body;

        if (!label || !x || !y || !w || !h || !target_url) {
            return res.status(400).json({ message: "缺少必要字段" });
        }

        const [result] = await pool.query(
            `INSERT INTO poster_hotspots 
             (label, description, x, y, w, h, target_url, target_type, poster_image, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                label, description || null, x, y, w, h,
                target_url, target_type || 'internal',
                poster_image || '/images/poster.png',
                sort_order || 0, is_active !== false ? 1 : 0
            ]
        );

        res.json({ id: result.insertId, message: "创建成功" });
    } catch (error) {
        console.error("Create hotspot error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 管理端 - 更新热点
router.put("/admin/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = [];
        const values = [];
        const fields = ['label', 'description', 'x', 'y', 'w', 'h', 'target_url', 'target_type', 'poster_image', 'sort_order', 'is_active'];

        for (const field of fields) {
            if (req.body[field] !== undefined && req.body[field] !== null) {
                updates.push(`${field} = ?`);
                values.push(field === 'is_active' ? (req.body[field] ? 1 : 0) : req.body[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "没有要更新的字段" });
        }

        values.push(id);
        await pool.query(
            `UPDATE poster_hotspots SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: "更新成功" });
    } catch (error) {
        console.error("Update hotspot error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 管理端 - 删除热点
router.delete("/admin/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM poster_hotspots WHERE id = ?", [id]);
        res.json({ message: "删除成功" });
    } catch (error) {
        console.error("Delete hotspot error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 管理端 - 批量排序
router.put("/admin/sort/batch", authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "参数错误" });
        }

        for (const item of items) {
            if (item.id !== undefined && item.sort_order !== undefined) {
                await pool.query(
                    "UPDATE poster_hotspots SET sort_order = ? WHERE id = ?",
                    [item.sort_order, item.id]
                );
            }
        }

        res.json({ message: "排序更新成功" });
    } catch (error) {
        console.error("Batch sort error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

export default router;
