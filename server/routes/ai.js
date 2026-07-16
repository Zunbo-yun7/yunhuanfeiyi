import express from "express";
import fetch from "node-fetch";
import pool from "../config/db.js";

const router = express.Router();

const MODELS = {
    chat: [
        {
            id: "doubao-seed-2-1-pro-260628",
            name: "豆包 Seed 2.1 Pro",
            provider: "豆包",
            description:
                "豆包旗舰级Agent通用模型，支持256K上下文，全面升级编程、智能体与多模态能力",
            advantages: [
                "256K超大上下文",
                "深度思考能力",
                "多模态理解",
                "工具调用能力",
            ],
            recommended: true,
        },
        {
            id: "doubao-seed-2-1-turbo-260628",
            name: "豆包 Seed 2.1 Turbo",
            provider: "豆包",
            description: "豆包高性能模型，支持结构化输出，平衡性能与成本",
            advantages: ["响应速度快", "结构化输出", "性价比高"],
            recommended: false,
        },
        {
            id: "deepseek-chat",
            name: "DeepSeek Chat",
            provider: "DeepSeek",
            description: "DeepSeek对话模型，擅长代码和技术问题，适合技术类问答",
            advantages: ["代码能力强", "技术问题处理好", "逻辑推理优秀"],
            recommended: false,
        },
        {
            id: "deepseek-v2-chat",
            name: "DeepSeek V2",
            provider: "DeepSeek",
            description: "DeepSeek第二代模型，性能全面升级，支持多模态理解",
            advantages: ["多模态支持", "性能全面升级", "推理能力强"],
            recommended: false,
        },
    ],
    image: [
        {
            id: "doubao-seedream-4-5-251128",
            name: "豆包 Seedream 4.5",
            provider: "豆包",
            description:
                "豆包最新图像生成模型，支持多图融合、4K超清输出，人像生成效果出色",
            advantages: [
                "4K超清输出",
                "多图融合能力强",
                "人像生成效果好",
                "主体一致性强",
            ],
            recommended: true,
        },
        {
            id: "doubao-seedream-4-0-250828",
            name: "豆包 Seedream 4.0",
            provider: "豆包",
            description: "豆包图像生成模型，平衡质量与速度，适合日常生图需求",
            advantages: ["生成速度快", "性价比高", "质量稳定"],
            recommended: false,
        },
        {
            id: "deepseek-chat",
            name: "DeepSeek V4 Pro",
            provider: "DeepSeek",
            description:
                "DeepSeek视觉模型，支持图文理解和图像生成，技术问题处理好",
            advantages: ["技术能力强", "代码理解好", "逻辑推理优秀"],
            recommended: false,
        },
    ],
};

router.get("/models", async (req, res) => {
    try {
        const { type } = req.query;
        if (type === "chat") {
            res.json(MODELS.chat);
        } else if (type === "image") {
            res.json(MODELS.image);
        } else {
            res.json({ chat: MODELS.chat, image: MODELS.image });
        }
    } catch (error) {
        console.error("[Models] 获取模型列表失败:", error.message);
        res.status(500).json({ error: "获取模型列表失败" });
    }
});

// 确保表存在
(async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS mask_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL,
        prompt TEXT NOT NULL,
        image_url TEXT NOT NULL,
        mask_svg TEXT,
        style_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("[DB] mask_records 表已就绪");
    } catch (err) {
        console.error("[DB] 创建 mask_records 表失败:", err.message);
    }
})();

router.post("/chat", async (req, res) => {
    try {
        const { model, ...rest } = req.body;
        const isDoubao =
            model &&
            (model.startsWith("doubao") ||
                MODELS.chat.find(
                    (m) => m.id === model && m.provider === "豆包",
                ));

        if (isDoubao) {
            const DOUBAO_API_KEY =
                process.env.DOUBAO_API_KEY ||
                "33458d65-e7aa-4fb8-8bec-d518a29591f5";
            const DOUBAO_API_URL =
                "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

            const payload = {
                model: model,
                ...rest,
            };

            const response = await fetch(DOUBAO_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DOUBAO_API_KEY}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            res.json(data);
        } else {
            const DEEPSEEK_API_KEY =
                process.env.DEEPSEEK_API_KEY ||
                "sk-c2b06d7a95ec467181356d7470c03c5d";
            const DEEPSEEK_API_URL =
                "https://api.deepseek.com/v1/chat/completions";

            const modelMapping = {
                "deepseek-chat": "deepseek-chat",
                "deepseek-v2-chat": "deepseek-v2-chat",
                "deepseek-r1.5-chat": "deepseek-r1.5-chat",
            };

            const payload = {
                model: modelMapping[model] || "deepseek-chat",
                ...rest,
            };

            const response = await fetch(DEEPSEEK_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            res.json(data);
        }
    } catch (error) {
        console.error("AI API error:", error.message);
        res.status(500).json({
            error: "AI 服务暂时不可用，请稍后再试",
            details: error.message,
        });
    }
});

router.post("/face-mask", async (req, res) => {
    try {
        const DEEPSEEK_API_KEY =
            process.env.DEEPSEEK_API_KEY ||
            "sk-c2b06d7a95ec467181356d7470c03c5d";
        const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
        const { userImage, maskImage } = req.body;

        console.log(
            "[FaceMask] 请求收到，用户图片大小:",
            userImage ? userImage.length : 0,
            "脸谱图片大小:",
            maskImage ? maskImage.length : 0,
        );

        if (!userImage || !maskImage) {
            console.error("[FaceMask] 缺少图片参数");
            return res.status(400).json({ error: "请提供用户照片和脸谱图片" });
        }

        if (!userImage.startsWith("data:image/")) {
            console.error("[FaceMask] 用户图片格式不正确");
            return res
                .status(400)
                .json({ error: "用户图片格式不正确，需要base64格式" });
        }

        if (!maskImage.startsWith("data:image/")) {
            console.error("[FaceMask] 脸谱图片格式不正确");
            return res
                .status(400)
                .json({ error: "脸谱图片格式不正确，需要base64格式" });
        }

        const prompt = `请严格依据第一张真人正面素颜人脸照片五官轮廓、脸型比例，
将第二张定制手绘英歌舞脸谱精准贴合绘制在人物面部，做成真人戏曲脸谱妆容效果。
要求：五官位置对齐自然、妆容融合真实、国风写实风格、光影和谐、面部不扭曲不变形，
保留人物原本神态，脸谱色彩还原原图配色，生成高清自然真人实拍质感人像图。

第一张图片（人脸）：
${userImage}

第二张图片（脸谱）：
${maskImage}`;

        const payload = {
            model: "deepseek-v4-pro",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.6,
            max_tokens: 4096,
        };

        console.log("[FaceMask] 正在调用DeepSeek-V4-Pro API...");
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        console.log(
            "[FaceMask] API调用完成，状态:",
            response.status,
            response.statusText,
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[FaceMask] API错误响应:", JSON.stringify(errorData));
            return res.status(response.status).json({
                error: "AI 变脸服务调用失败",
                details: JSON.stringify(errorData),
            });
        }

        const data = await response.json();
        console.log(
            "[FaceMask] API调用成功，响应内容:",
            JSON.stringify(data).substring(0, 300),
        );
        res.json(data);
    } catch (error) {
        console.error("[FaceMask] DeepSeek API error:", error.message);
        console.error("[FaceMask] 错误堆栈:", error.stack);
        res.status(500).json({
            error: "AI 变脸服务暂时不可用，请稍后再试",
            details: error.message,
        });
    }
});

router.post("/generate-image", async (req, res) => {
    try {
        const DOUBAO_API_KEY =
            process.env.DOUBAO_API_KEY ||
            "33458d65-e7aa-4fb8-8bec-d518a29591f5";
        const DOUBAO_API_URL =
            "https://ark.cn-beijing.volces.com/api/v3/images/generations";
        const { prompt, size = "2K", sessionId, maskSvg, styleName } = req.body;

        console.log(
            "[Doubao] 收到生图请求，prompt长度:",
            prompt ? prompt.length : 0,
        );

        if (!prompt) {
            return res.status(400).json({ error: "请提供图片生成描述" });
        }

        const payload = {
            model: "doubao-seedream-5-0-pro-260628",
            prompt: prompt,
            response_format: "url",
            size: size,
            stream: false,
            watermark: true,
        };

        // 重试逻辑：最多重试3次
        let lastError = null;
        let data = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`[Doubao] 第 ${attempt} 次调用豆包生图API...`);
                const response = await fetch(DOUBAO_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${DOUBAO_API_KEY}`,
                    },
                    body: JSON.stringify(payload),
                });

                console.log(
                    "[Doubao] API调用完成，状态:",
                    response.status,
                    response.statusText,
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(
                        `[Doubao] 第 ${attempt} 次错误响应:`,
                        JSON.stringify(errorData),
                    );
                    lastError = errorData;
                    // 如果是限流错误，等待后重试
                    if (attempt < 3) {
                        await new Promise((r) => setTimeout(r, 3000 * attempt));
                        continue;
                    }
                    return res.status(response.status).json({
                        error: "AI 生图服务调用失败",
                        details: JSON.stringify(errorData),
                    });
                }

                data = await response.json();
                console.log(
                    "[Doubao] API调用成功，响应:",
                    JSON.stringify(data).substring(0, 300),
                );
                break;
            } catch (fetchErr) {
                console.error(
                    `[Doubao] 第 ${attempt} 次网络错误:`,
                    fetchErr.message,
                );
                lastError = fetchErr;
                if (attempt < 3) {
                    await new Promise((r) => setTimeout(r, 3000 * attempt));
                }
            }
        }

        if (!data || !data.data || !data.data[0]) {
            return res.status(500).json({
                error: "AI 生图服务暂时不可用，已重试3次",
                details: lastError
                    ? JSON.stringify(lastError).substring(0, 200)
                    : "未知错误",
            });
        }

        const imageUrl = data.data[0].url;

        // 存入数据库
        if (sessionId) {
            try {
                await pool.query(
                    "INSERT INTO mask_records (session_id, prompt, image_url, mask_svg, style_name) VALUES (?, ?, ?, ?, ?)",
                    [
                        sessionId,
                        prompt,
                        imageUrl,
                        maskSvg || null,
                        styleName || null,
                    ],
                );
                console.log("[DB] 脸谱记录已保存，session:", sessionId);
            } catch (dbErr) {
                console.error("[DB] 保存脸谱记录失败:", dbErr.message);
            }
        }

        res.json(data);
    } catch (error) {
        console.error("[Doubao] API error:", error.message);
        console.error("[Doubao] 错误堆栈:", error.stack);
        res.status(500).json({
            error: "AI 生图服务暂时不可用，请稍后再试",
            details: error.message,
        });
    }
});

// 获取用户历史脸谱记录
router.get("/mask-records/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;
        const [rows] = await pool.query(
            "SELECT * FROM mask_records WHERE session_id = ? ORDER BY created_at DESC",
            [sessionId],
        );
        res.json(rows);
    } catch (error) {
        console.error("[DB] 获取脸谱记录失败:", error.message);
        res.status(500).json({ error: "获取历史记录失败" });
    }
});

// 删除脸谱记录
router.delete("/mask-records/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM mask_records WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (error) {
        console.error("[DB] 删除脸谱记录失败:", error.message);
        res.status(500).json({ error: "删除失败" });
    }
});

export default router;
