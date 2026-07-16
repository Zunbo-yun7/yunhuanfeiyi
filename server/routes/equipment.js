import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [categoryRows] = await pool.query(
            "SELECT * FROM equipment_categories ORDER BY sort_order ASC, id ASC",
        );
        const [itemRows] = await pool.query(
            "SELECT * FROM equipment_items ORDER BY sort_order ASC, id ASC",
        );

        const result = categoryRows.map((cat) => ({
            id: cat.id,
            category: cat.category,
            items: itemRows
                .filter((item) => item.category_id === cat.id)
                .map((item) => ({
                    id: String(item.id),
                    name: item.name,
                    description: item.description || "",
                    image: item.image || "",
                    details: item.details || "",
                })),
        }));

        res.json(result);
    } catch (error) {
        console.error("Get equipment data error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.get("/admin", async (req, res) => {
    try {
        const [categoryRows] = await pool.query(
            "SELECT * FROM equipment_categories ORDER BY sort_order ASC, id ASC",
        );
        const [itemRows] = await pool.query(
            "SELECT * FROM equipment_items ORDER BY sort_order ASC, id ASC",
        );

        const categories = categoryRows.map((cat) => ({
            id: cat.id,
            category: cat.category,
            sort_order: cat.sort_order || 0,
        }));

        const items = itemRows.map((item) => ({
            id: item.id,
            category_id: item.category_id,
            name: item.name,
            description: item.description || "",
            image: item.image || "",
            details: item.details || "",
            sort_order: item.sort_order || 0,
        }));

        res.json({ categories, items });
    } catch (error) {
        console.error("Get equipment admin data error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/categories", authMiddleware, async (req, res) => {
    try {
        const { category, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO equipment_categories (category, sort_order) VALUES (?, ?)",
            [category, sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/categories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { category, sort_order } = req.body;

        const fields = [];
        const values = [];

        if (category != null) {
            fields.push("category = ?");
            values.push(category);
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
            `UPDATE equipment_categories SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM equipment_categories WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/items", authMiddleware, async (req, res) => {
    try {
        const { category_id, name, description, image, details, sort_order } =
            req.body;

        const [result] = await pool.query(
            `INSERT INTO equipment_items (category_id, name, description, image, details, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                category_id,
                name,
                description || "",
                image || "",
                details || "",
                sort_order || 0,
            ],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add equipment item error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/items/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, description, image, details, sort_order } =
            req.body;

        const fields = [];
        const values = [];

        if (category_id != null) {
            fields.push("category_id = ?");
            values.push(category_id);
        }
        if (name != null) {
            fields.push("name = ?");
            values.push(name);
        }
        if (description != null) {
            fields.push("description = ?");
            values.push(description);
        }
        if (image != null) {
            fields.push("image = ?");
            values.push(image);
        }
        if (details != null) {
            fields.push("details = ?");
            values.push(details);
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
            `UPDATE equipment_items SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update equipment item error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/items/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM equipment_items WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete equipment item error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

export default router;
