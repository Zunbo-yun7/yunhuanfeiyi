import { Router } from "express";
import multer from "multer";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";
import { uploadImage } from "../services/imageUpload.js";

const router = Router();
const stickerUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/", async (req, res) => {
    try {
        const [categoryRows] = await pool.query(
            "SELECT * FROM creative_categories ORDER BY sort_order ASC, id ASC",
        );
        const [productRows] = await pool.query(
            "SELECT * FROM creative_products ORDER BY sort_order ASC, id ASC",
        );

        const result = categoryRows.map((cat) => ({
            id: cat.id,
            name: cat.name,
            products: productRows
                .filter((item) => item.category_id === cat.id)
                .map((item) => ({
                    id: item.id,
                    category_id: item.category_id,
                    name: item.name,
                    description: item.description || "",
                    image: item.image || "",
                    detail_images: parseDetailImages(item.detail_images),
                    price: item.price ? Number(item.price) : 0,
                    badge: item.badge || "",
                    is_featured: !!item.is_featured,
                    is_sold_out: !!item.is_sold_out,
                })),
        }));

        res.json(result);
    } catch (error) {
        console.error("Get creative products error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

function parseDetailImages(raw) {
    if (!raw) return [];
    try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.filter(Boolean).slice(0, 9) : [];
    } catch (e) {
        if (typeof raw === "string") {
            return raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 9);
        }
        return [];
    }
}

function stringifyDetailImages(arr) {
    if (!arr || !Array.isArray(arr)) return null;
    const filtered = arr.filter(Boolean).slice(0, 9);
    return JSON.stringify(filtered);
}

router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            "SELECT * FROM creative_products WHERE id = ?",
            [id],
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "商品不存在" });
        }
        const item = rows[0];
        const product = {
            id: item.id,
            category_id: item.category_id,
            name: item.name,
            description: item.description || "",
            image: item.image || "",
            detail_images: parseDetailImages(item.detail_images),
            price: item.price ? Number(item.price) : 0,
            badge: item.badge || "",
            is_featured: !!item.is_featured,
            is_sold_out: !!item.is_sold_out,
            sort_order: item.sort_order || 0,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };

        const [catRows] = await pool.query(
            "SELECT id, name FROM creative_categories WHERE id = ?",
            [item.category_id],
        );
        if (catRows.length > 0) {
            product.category = { id: catRows[0].id, name: catRows[0].name };
        }

        res.json(product);
    } catch (error) {
        console.error("Get creative product detail error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.get("/featured", async (req, res) => {
    try {
        let [rows] = await pool.query(
            "SELECT * FROM creative_products WHERE is_featured = 1 ORDER BY sort_order ASC, id ASC LIMIT 4",
        );

        if (rows.length === 0) {
            [rows] = await pool.query(
                "SELECT * FROM creative_products ORDER BY sort_order ASC, id ASC LIMIT 4",
            );
        }

        const products = rows.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            image: item.image || "",
            detail_images: parseDetailImages(item.detail_images),
            price: item.price ? Number(item.price) : 0,
            badge: item.badge || "",
            category_id: item.category_id,
            is_featured: !!item.is_featured,
            is_sold_out: !!item.is_sold_out,
        }));

        res.json(products);
    } catch (error) {
        console.error("Get featured products error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.get("/admin", authMiddleware, async (req, res) => {
    try {
        const [categoryRows] = await pool.query(
            "SELECT * FROM creative_categories ORDER BY sort_order ASC, id ASC",
        );
        const [productRows] = await pool.query(
            "SELECT * FROM creative_products ORDER BY sort_order ASC, id ASC",
        );

        const categories = categoryRows.map((cat) => ({
            id: cat.id,
            name: cat.name,
            sort_order: cat.sort_order || 0,
        }));

        const products = productRows.map((item) => ({
            id: item.id,
            category_id: item.category_id,
            name: item.name,
            description: item.description || "",
            image: item.image || "",
            detail_images: parseDetailImages(item.detail_images),
            price: item.price ? Number(item.price) : 0,
            badge: item.badge || "",
            is_featured: !!item.is_featured,
            is_sold_out: !!item.is_sold_out,
            sort_order: item.sort_order || 0,
        }));

        res.json({ categories, products });
    } catch (error) {
        console.error("Get creative admin data error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/categories", authMiddleware, async (req, res) => {
    try {
        const { name, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO creative_categories (name, sort_order) VALUES (?, ?)",
            [name, sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add creative category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/categories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sort_order } = req.body;

        const fields = [];
        const values = [];

        if (name != null) {
            fields.push("name = ?");
            values.push(name);
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
            `UPDATE creative_categories SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update creative category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM creative_categories WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete creative category error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/products", authMiddleware, async (req, res) => {
    try {
        const { category_id, name, description, image, detail_images, price, badge, is_featured, is_sold_out, sort_order } =
            req.body;

        const [result] = await pool.query(
            `INSERT INTO creative_products (category_id, name, description, image, detail_images, price, badge, is_featured, is_sold_out, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                category_id,
                name,
                description || "",
                image || "",
                stringifyDetailImages(detail_images),
                price || 0,
                badge || "",
                is_featured ? 1 : 0,
                is_sold_out ? 1 : 0,
                sort_order || 0,
            ],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add creative product error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/products/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, description, image, detail_images, price, badge, is_featured, is_sold_out, sort_order } =
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
        if (detail_images != null) {
            fields.push("detail_images = ?");
            values.push(stringifyDetailImages(detail_images));
        }
        if (price != null) {
            fields.push("price = ?");
            values.push(price);
        }
        if (badge != null) {
            fields.push("badge = ?");
            values.push(badge);
        }
        if (is_featured != null) {
            fields.push("is_featured = ?");
            values.push(is_featured ? 1 : 0);
        }
        if (is_sold_out != null) {
            fields.push("is_sold_out = ?");
            values.push(is_sold_out ? 1 : 0);
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
            `UPDATE creative_products SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update creative product error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/products/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM creative_products WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete creative product error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// ==================== 表情包专用接口（独立 stickers 表） ====================

// 获取所有表情包
router.get("/stickers", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM stickers ORDER BY sort_order ASC, id ASC"
        );

        const stickers = rows.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            image: item.image || "",
            sort_order: item.sort_order || 0,
            created_at: item.created_at,
            updated_at: item.updated_at,
        }));

        res.json(stickers);
    } catch (error) {
        console.error("Get stickers error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 获取单个表情包详情
router.get("/stickers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            "SELECT * FROM stickers WHERE id = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "表情包不存在" });
        }
        const item = rows[0];
        res.json({
            id: item.id,
            name: item.name,
            description: item.description || "",
            image: item.image || "",
            sort_order: item.sort_order || 0,
            created_at: item.created_at,
            updated_at: item.updated_at,
        });
    } catch (error) {
        console.error("Get sticker detail error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 新增表情包（JSON，直接传图片URL）
router.post("/stickers", authMiddleware, async (req, res) => {
    try {
        const { name, description, image, sort_order } = req.body;

        if (!name || !image) {
            return res.status(400).json({ success: false, message: "名称和图片URL不能为空" });
        }

        // 自动计算排序
        let finalSort = sort_order;
        if (finalSort == null) {
            const [maxRows] = await pool.query(
                "SELECT MAX(sort_order) as max_sort FROM stickers"
            );
            finalSort = (maxRows[0]?.max_sort || 0) + 1;
        }

        const [result] = await pool.query(
            "INSERT INTO stickers (name, description, image, sort_order) VALUES (?, ?, ?, ?)",
            [name, description || "", image, finalSort]
        );

        res.json({
            success: true,
            message: "表情包添加成功",
            id: result.insertId,
        });
    } catch (error) {
        console.error("Add sticker error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 上传单个表情包图片并新增（multipart/form-data）
// 字段: image(文件), name(可选), description(可选), sort_order(可选)
router.post("/stickers/upload", authMiddleware, stickerUpload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "请选择要上传的表情包图片" });
        }

        const { originalname, buffer } = req.file;
        const { name, description, sort_order } = req.body;

        // 上传到图床
        const uploadResult = await uploadImage(buffer, originalname, "sanxiaxiang");
        if (!uploadResult.success) {
            return res.status(500).json({ success: false, message: uploadResult.error || "图片上传失败" });
        }

        // 写入 stickers 表
        const stickerName = name || originalname.replace(/\.[^.]+$/, "");

        let finalSort = sort_order;
        if (finalSort == null) {
            const [maxRows] = await pool.query(
                "SELECT MAX(sort_order) as max_sort FROM stickers"
            );
            finalSort = (maxRows[0]?.max_sort || 0) + 1;
        }

        const [result] = await pool.query(
            "INSERT INTO stickers (name, description, image, sort_order) VALUES (?, ?, ?, ?)",
            [stickerName, description || "", uploadResult.url, finalSort]
        );

        res.json({
            success: true,
            message: "表情包上传成功",
            id: result.insertId,
            url: uploadResult.url,
            name: stickerName,
        });
    } catch (error) {
        console.error("Upload sticker error:", error);
        res.status(500).json({ success: false, message: "服务器错误" });
    }
});

// 批量上传表情包（multipart/form-data，最多10张）
router.post("/stickers/upload-batch", authMiddleware, stickerUpload.array("images", 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "请选择要上传的表情包图片" });
        }

        const [maxRows] = await pool.query(
            "SELECT MAX(sort_order) as max_sort FROM stickers"
        );
        let nextSort = (maxRows[0]?.max_sort || 0) + 1;

        const successItems = [];
        const failures = [];

        for (const file of req.files) {
            const uploadResult = await uploadImage(file.buffer, file.originalname, "sanxiaxiang");
            if (!uploadResult.success) {
                failures.push({ filename: file.originalname, error: uploadResult.error });
                continue;
            }

            const stickerName = file.originalname.replace(/\.[^.]+$/, "");
            const [result] = await pool.query(
                "INSERT INTO stickers (name, description, image, sort_order) VALUES (?, '', ?, ?)",
                [stickerName, uploadResult.url, nextSort]
            );

            successItems.push({
                id: result.insertId,
                name: stickerName,
                url: uploadResult.url,
            });
            nextSort++;
        }

        res.json({
            success: successItems.length > 0,
            message: failures.length === 0
                ? `全部上传成功（${successItems.length}张）`
                : `成功上传 ${successItems.length} 张，失败 ${failures.length} 张`,
            stickers: successItems,
            failures,
        });
    } catch (error) {
        console.error("Batch upload stickers error:", error);
        res.status(500).json({ success: false, message: "服务器错误" });
    }
});

// 修改表情包信息（JSON）
// 可修改字段: name, description, image, sort_order
router.put("/stickers/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, sort_order } = req.body;

        const [existing] = await pool.query(
            "SELECT id FROM stickers WHERE id = ?",
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "表情包不存在" });
        }

        const fields = [];
        const values = [];

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
        if (sort_order != null) {
            fields.push("sort_order = ?");
            values.push(sort_order);
        }

        if (fields.length === 0) {
            return res.json({ success: true, message: "无需更新" });
        }

        values.push(id);
        await pool.query(
            `UPDATE stickers SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        res.json({ success: true, message: "表情包更新成功" });
    } catch (error) {
        console.error("Update sticker error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 替换表情包图片（multipart/form-data）
router.put("/stickers/:id/image", authMiddleware, stickerUpload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "请选择新的表情包图片" });
        }

        const [existing] = await pool.query(
            "SELECT id FROM stickers WHERE id = ?",
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "表情包不存在" });
        }

        const uploadResult = await uploadImage(req.file.buffer, req.file.originalname, "sanxiaxiang");
        if (!uploadResult.success) {
            return res.status(500).json({ success: false, message: uploadResult.error || "图片上传失败" });
        }

        await pool.query(
            "UPDATE stickers SET image = ? WHERE id = ?",
            [uploadResult.url, id]
        );

        res.json({
            success: true,
            message: "表情包图片更新成功",
            url: uploadResult.url,
        });
    } catch (error) {
        console.error("Update sticker image error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

// 删除表情包
router.delete("/stickers/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query(
            "SELECT id FROM stickers WHERE id = ?",
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "表情包不存在" });
        }

        await pool.query("DELETE FROM stickers WHERE id = ?", [id]);

        res.json({ success: true, message: "表情包删除成功" });
    } catch (error) {
        console.error("Delete sticker error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

export default router;
