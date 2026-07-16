import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [dataRows] = await pool.query(
            "SELECT introduction FROM people_data LIMIT 1",
        );
        const [categoryRows] = await pool.query(
            "SELECT * FROM people_categories ORDER BY sort_order ASC, id ASC",
        );
        const [peopleRows] = await pool.query(
            "SELECT * FROM people ORDER BY sort_order ASC, id ASC",
        );

        let introduction = "";
        if (dataRows.length > 0) {
            introduction = dataRows[0].introduction || "";
        }

        const categories = categoryRows.map((cat) => {
            const people = peopleRows
                .filter((p) => p.category_id === cat.id)
                .map((p) => {
                    let achievements = [];
                    try {
                        achievements = JSON.parse(p.achievements || "[]");
                    } catch (e) {
                        achievements = [];
                    }
                    return {
                        id: String(p.id),
                        name: p.name,
                        role: p.role || "",
                        avatar: p.avatar || "",
                        story: p.story || "",
                        achievements,
                    };
                });
            return {
                id: cat.id,
                title: cat.title,
                description: cat.description || "",
                people,
            };
        });

        res.json({
            introduction,
            categories,
        });
    } catch (error) {
        console.error("Get people data error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/introduction", authMiddleware, async (req, res) => {
    try {
        const { introduction } = req.body;

        const [rows] = await pool.query("SELECT id FROM people_data LIMIT 1");

        if (rows.length === 0) {
            await pool.query(
                "INSERT INTO people_data (introduction) VALUES (?)",
                [introduction || ""],
            );
        } else {
            await pool.query(
                "UPDATE people_data SET introduction = ? WHERE id = ?",
                [introduction || "", rows[0].id],
            );
        }

        res.json({ success: true, message: "保存成功" });
    } catch (error) {
        console.error("Update people introduction error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/categories", authMiddleware, async (req, res) => {
    try {
        const { title, description, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO people_categories (title, description, sort_order) VALUES (?, ?, ?)",
            [title, description || "", sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add people category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/categories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, sort_order } = req.body;

        if (
            sort_order !== undefined &&
            title === undefined &&
            description === undefined
        ) {
            await pool.query(
                "UPDATE people_categories SET sort_order = ? WHERE id = ?",
                [sort_order, id],
            );
        } else {
            await pool.query(
                "UPDATE people_categories SET title = ?, description = ?, sort_order = ? WHERE id = ?",
                [title, description || "", sort_order || 0, id],
            );
        }

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update people category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM people_categories WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete people category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/people", authMiddleware, async (req, res) => {
    try {
        const {
            category_id,
            name,
            role,
            avatar,
            story,
            achievements,
            sort_order,
        } = req.body;

        const achievementsJson = JSON.stringify(achievements || []);

        const [result] = await pool.query(
            `INSERT INTO people (category_id, name, role, avatar, story, achievements, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                category_id,
                name,
                role || "",
                avatar || "",
                story || "",
                achievementsJson,
                sort_order || 0,
            ],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add person error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/people/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            category_id,
            name,
            role,
            avatar,
            story,
            achievements,
            sort_order,
        } = req.body;

        if (
            sort_order !== undefined &&
            category_id === undefined &&
            name === undefined &&
            role === undefined &&
            avatar === undefined &&
            story === undefined &&
            achievements === undefined
        ) {
            await pool.query("UPDATE people SET sort_order = ? WHERE id = ?", [
                sort_order,
                id,
            ]);
        } else {
            const achievementsJson = JSON.stringify(achievements || []);

            await pool.query(
                `UPDATE people SET category_id = ?, name = ?, role = ?, avatar = ?, story = ?, achievements = ?, sort_order = ? 
         WHERE id = ?`,
                [
                    category_id,
                    name,
                    role || "",
                    avatar || "",
                    story || "",
                    achievementsJson,
                    sort_order || 0,
                    id,
                ],
            );
        }

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update person error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/people/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM people WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete person error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

export default router;
