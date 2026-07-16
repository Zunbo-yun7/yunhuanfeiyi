import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [aboutRows] = await pool.query(
            "SELECT * FROM about_data LIMIT 1",
        );
        const [historyRows] = await pool.query(
            "SELECT * FROM about_history ORDER BY sort_order ASC, id ASC",
        );
        const [featureRows] = await pool.query(
            "SELECT * FROM about_features ORDER BY sort_order ASC, id ASC",
        );
        const [puningRows] = await pool.query(
            "SELECT * FROM about_puning_features ORDER BY sort_order ASC, id ASC",
        );

        const data = aboutRows[0] || { introduction: "" };

        res.json({
            introduction: data.introduction || "",
            history: historyRows.map((item) => ({
                id: item.id,
                year: item.year,
                event: item.event,
            })),
            features: featureRows.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description || "",
                image: item.image || "",
            })),
            puningFeatures: puningRows.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description || "",
            })),
        });
    } catch (error) {
        console.error("Get about data error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/introduction", authMiddleware, async (req, res) => {
    try {
        const { introduction } = req.body;

        const [rows] = await pool.query("SELECT id FROM about_data LIMIT 1");

        if (rows.length === 0) {
            await pool.query(
                "INSERT INTO about_data (introduction) VALUES (?)",
                [introduction || ""],
            );
        } else {
            await pool.query(
                "UPDATE about_data SET introduction = ? WHERE id = ?",
                [introduction || "", rows[0].id],
            );
        }

        res.json({ success: true, message: "保存成功" });
    } catch (error) {
        console.error("Update about introduction error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/history", authMiddleware, async (req, res) => {
    try {
        const { year, event, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO about_history (year, event, sort_order) VALUES (?, ?, ?)",
            [year, event, sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add history error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/history/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { year, event, sort_order } = req.body;

        const fields = [];
        const values = [];

        if (year != null) {
            fields.push("year = ?");
            values.push(year);
        }
        if (event != null) {
            fields.push("event = ?");
            values.push(event);
        }
        if (sort_order != null) {
            fields.push("sort_order = ?");
            values.push(sort_order);
        }

        if (fields.length === 0) {
            return res.json({ success: true, message: "无需更新" });
        }

        values.push(id);
        await pool.query(
            `UPDATE about_history SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update history error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/history/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM about_history WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete history error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/features", authMiddleware, async (req, res) => {
    try {
        const { title, description, image, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO about_features (title, description, image, sort_order) VALUES (?, ?, ?, ?)",
            [title, description || "", image || "", sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add feature error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/features/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, sort_order } = req.body;

        const fields = [];
        const values = [];

        if (title != null) {
            fields.push("title = ?");
            values.push(title);
        }
        if (description != null) {
            fields.push("description = ?");
            values.push(description);
        }
        if (image != null) {
            fields.push("image = ?");
            values.push(image);
        }
        if (sort_order != null) {
            fields.push("sort_order = ?");
            values.push(sort_order);
        }

        if (fields.length === 0) {
            return res.json({ success: true, message: "无需更新" });
        }

        values.push(id);
        await pool.query(
            `UPDATE about_features SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update feature error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/features/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM about_features WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete feature error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/puning-features", authMiddleware, async (req, res) => {
    try {
        const { title, description, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO about_puning_features (title, description, sort_order) VALUES (?, ?, ?)",
            [title, description || "", sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add puning feature error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/puning-features/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, sort_order } = req.body;

        const fields = [];
        const values = [];

        if (title != null) {
            fields.push("title = ?");
            values.push(title);
        }
        if (description != null) {
            fields.push("description = ?");
            values.push(description);
        }
        if (sort_order != null) {
            fields.push("sort_order = ?");
            values.push(sort_order);
        }

        if (fields.length === 0) {
            return res.json({ success: true, message: "无需更新" });
        }

        values.push(id);
        await pool.query(
            `UPDATE about_puning_features SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update puning feature error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/puning-features/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM about_puning_features WHERE id = ?", [
            id,
        ]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete puning feature error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

export default router;
