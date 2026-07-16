import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [villageRows] = await pool.query(
            "SELECT * FROM xintan_village LIMIT 1",
        );
        const [teamRows] = await pool.query(
            "SELECT * FROM xintan_team LIMIT 1",
        );
        const [achievementRows] = await pool.query(
            "SELECT * FROM xintan_team_achievements ORDER BY sort_order ASC, id ASC",
        );
        const [trainingRows] = await pool.query(
            "SELECT * FROM xintan_training LIMIT 1",
        );
        const [storyRows] = await pool.query(
            "SELECT * FROM xintan_stories ORDER BY sort_order ASC, id ASC",
        );
        const [memberRows] = await pool.query(
            "SELECT * FROM xintan_team_members ORDER BY sort_order ASC, id ASC",
        );

        const village = villageRows[0] || {
            name: "新坛村",
            description: "",
            history: "",
            image: "",
            latitude: "",
            longitude: "",
            address: "",
            geo_description: "",
            environment: "",
            climate: "",
            traffic: "",
        };
        const team = teamRows[0] || {
            name: "新坛英歌队",
            founded: "",
            description: "",
            images: "[]",
        };
        const training = trainingRows[0] || { description: "", images: "[]" };

        let teamImages = [];
        let trainingImages = [];
        try {
            teamImages = JSON.parse(team.images || "[]");
        } catch (e) {
            teamImages = [];
        }
        try {
            trainingImages = JSON.parse(training.images || "[]");
        } catch (e) {
            trainingImages = [];
        }

        res.json({
            village: {
                name: village.name,
                description: village.description || "",
                history: village.history || "",
                image: village.image || "",
                latitude: village.latitude || "23.30",
                longitude: village.longitude || "116.18",
                address:
                    village.address || "广东省揭阳市普宁市流沙东街道新坛村",
                geoDescription: village.geo_description || "",
                environment: village.environment || "",
                climate: village.climate || "",
                traffic: village.traffic || "",
            },
            team: {
                name: team.name,
                founded: team.founded || "",
                description: team.description || "",
                achievements: achievementRows.map((item) => item.content),
                images: teamImages,
            },
            training: {
                description: training.description || "",
                images: trainingImages,
            },
            stories: storyRows.map((item) => ({
                id: item.id,
                title: item.title,
                content: item.content || "",
                image: item.image || "",
            })),
            members: memberRows.map((item) => ({
                id: item.id,
                name: item.name,
                age: item.age || null,
                mbti: item.mbti || "",
                college: item.college || "",
                grade: item.grade || "",
                class: item.class || "",
                avatar: item.avatar || "",
                introduction: item.introduction || "",
            })),
        });
    } catch (error) {
        console.error("Get xintan data error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/village", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            description,
            history,
            image,
            latitude,
            longitude,
            address,
            geoDescription,
            environment,
            climate,
            traffic,
        } = req.body;

        const [rows] = await pool.query(
            "SELECT id FROM xintan_village LIMIT 1",
        );

        if (rows.length === 0) {
            await pool.query(
                `INSERT INTO xintan_village (name, description, history, image, latitude, longitude, address, geo_description, environment, climate, traffic)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name || "新坛村",
                    description || "",
                    history || "",
                    image || "",
                    latitude || "23.30",
                    longitude || "116.18",
                    address || "",
                    geoDescription || "",
                    environment || "",
                    climate || "",
                    traffic || "",
                ],
            );
        } else {
            await pool.query(
                `UPDATE xintan_village SET
          name = ?, description = ?, history = ?, image = ?,
          latitude = ?, longitude = ?, address = ?, geo_description = ?,
          environment = ?, climate = ?, traffic = ?
         WHERE id = ?`,
                [
                    name || "新坛村",
                    description || "",
                    history || "",
                    image || "",
                    latitude || "23.30",
                    longitude || "116.18",
                    address || "",
                    geoDescription || "",
                    environment || "",
                    climate || "",
                    traffic || "",
                    rows[0].id,
                ],
            );
        }

        res.json({ success: true, message: "保存成功" });
    } catch (error) {
        console.error("Update village error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/team", authMiddleware, async (req, res) => {
    try {
        const { name, founded, description, images } = req.body;

        const [rows] = await pool.query("SELECT id FROM xintan_team LIMIT 1");
        const imagesJson = JSON.stringify(images || []);

        if (rows.length === 0) {
            await pool.query(
                "INSERT INTO xintan_team (name, founded, description, images) VALUES (?, ?, ?, ?)",
                [
                    name || "新坛英歌队",
                    founded || "",
                    description || "",
                    imagesJson,
                ],
            );
        } else {
            await pool.query(
                "UPDATE xintan_team SET name = ?, founded = ?, description = ?, images = ? WHERE id = ?",
                [
                    name || "新坛英歌队",
                    founded || "",
                    description || "",
                    imagesJson,
                    rows[0].id,
                ],
            );
        }

        res.json({ success: true, message: "保存成功" });
    } catch (error) {
        console.error("Update team error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/team/achievements", authMiddleware, async (req, res) => {
    try {
        const { content, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO xintan_team_achievements (content, sort_order) VALUES (?, ?)",
            [content, sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add achievement error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/team/achievements/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { content, sort_order } = req.body;

        if (sort_order !== undefined && content === undefined) {
            await pool.query(
                "UPDATE xintan_team_achievements SET sort_order = ? WHERE id = ?",
                [sort_order, id],
            );
        } else {
            await pool.query(
                "UPDATE xintan_team_achievements SET content = ?, sort_order = ? WHERE id = ?",
                [content, sort_order || 0, id],
            );
        }

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update achievement error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/team/achievements/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM xintan_team_achievements WHERE id = ?", [
            id,
        ]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete achievement error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/training", authMiddleware, async (req, res) => {
    try {
        const { description, images } = req.body;

        const [rows] = await pool.query(
            "SELECT id FROM xintan_training LIMIT 1",
        );
        const imagesJson = JSON.stringify(images || []);

        if (rows.length === 0) {
            await pool.query(
                "INSERT INTO xintan_training (description, images) VALUES (?, ?)",
                [description || "", imagesJson],
            );
        } else {
            await pool.query(
                "UPDATE xintan_training SET description = ?, images = ? WHERE id = ?",
                [description || "", imagesJson, rows[0].id],
            );
        }

        res.json({ success: true, message: "保存成功" });
    } catch (error) {
        console.error("Update training error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/stories", authMiddleware, async (req, res) => {
    try {
        const { title, content, image, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO xintan_stories (title, content, image, sort_order) VALUES (?, ?, ?, ?)",
            [title, content || "", image || "", sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add story error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/stories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image, sort_order } = req.body;

        if (
            sort_order !== undefined &&
            title === undefined &&
            content === undefined &&
            image === undefined
        ) {
            await pool.query(
                "UPDATE xintan_stories SET sort_order = ? WHERE id = ?",
                [sort_order, id],
            );
        } else {
            await pool.query(
                "UPDATE xintan_stories SET title = ?, content = ?, image = ?, sort_order = ? WHERE id = ?",
                [title, content || "", image || "", sort_order || 0, id],
            );
        }

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update story error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/stories/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM xintan_stories WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete story error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.post("/team/members", authMiddleware, async (req, res) => {
    try {
        const { name, age, mbti, college, grade, class: className, avatar, introduction, sort_order } = req.body;

        const [result] = await pool.query(
            "INSERT INTO xintan_team_members (name, age, mbti, college, grade, class, avatar, introduction, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, age || null, mbti || "", college || "", grade || "", className || "", avatar || "", introduction || "", sort_order || 0],
        );

        res.json({ success: true, message: "添加成功", id: result.insertId });
    } catch (error) {
        console.error("Add member error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.put("/team/members/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, mbti, college, grade, class: className, avatar, introduction, sort_order } = req.body;

        if (sort_order !== undefined && name === undefined && age === undefined && mbti === undefined && college === undefined && grade === undefined && className === undefined && avatar === undefined && introduction === undefined) {
            await pool.query(
                "UPDATE xintan_team_members SET sort_order = ? WHERE id = ?",
                [sort_order, id],
            );
        } else {
            await pool.query(
                "UPDATE xintan_team_members SET name = ?, age = ?, mbti = ?, college = ?, grade = ?, class = ?, avatar = ?, introduction = ?, sort_order = ? WHERE id = ?",
                [name, age || null, mbti || "", college || "", grade || "", className || "", avatar || "", introduction || "", sort_order || 0, id],
            );
        }

        res.json({ success: true, message: "更新成功" });
    } catch (error) {
        console.error("Update member error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

router.delete("/team/members/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM xintan_team_members WHERE id = ?", [id]);

        res.json({ success: true, message: "删除成功" });
    } catch (error) {
        console.error("Delete member error:", error);
        res.status(500).json({ message: "服务器错误" });
    }
});

export default router;
