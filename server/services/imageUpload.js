import fetch from "node-fetch";
import FormData from "form-data";

// BeeImg 图床配置
const BEEIMG_API_KEY = "TspNEANZsF2x7CSWBXgfB8AMbNP2J6jqr22rs29d434ea5d3";
const BEEIMG_API_URL = "https://www.beeimg.cn/api/v2/upload";
const BEEIMG_STORAGE_ID = 1; // 默认存储ID

/**
 * 上传单张图片到 BeeImg 图床
 * @param {Buffer} fileBuffer - 图片文件缓冲区
 * @param {string} fileName - 文件名
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadImage(fileBuffer, fileName) {
    try {
        const formData = new FormData();
        formData.append("file", fileBuffer, {
            filename: fileName,
        });
        formData.append("storage_id", String(BEEIMG_STORAGE_ID));
        formData.append("is_remove_exif", "true");

        const response = await fetch(BEEIMG_API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${BEEIMG_API_KEY}`,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error("BeeImg response is not JSON:", text.substring(0, 200));
            return {
                success: false,
                error: "响应格式错误",
            };
        }

        if (response.ok && data.status === "success" && data.data?.public_url) {
            return {
                success: true,
                url: data.data.public_url,
            };
        }

        console.error("BeeImg upload failed:", data);
        return {
            success: false,
            error: data.message || "上传失败",
        };
    } catch (error) {
        console.error("BeeImg upload error:", error);
        return {
            success: false,
            error: error.message || "上传失败",
        };
    }
}

/**
 * 批量上传图片
 * @param {Array<{buffer: Buffer, fileName: string}>} fileBuffers
 * @returns {Promise<Array<{success: boolean, url?: string, error?: string}>>}
 */
export async function uploadImages(fileBuffers) {
    const results = [];

    for (const { buffer, fileName } of fileBuffers) {
        const result = await uploadImage(buffer, fileName);
        results.push(result);
    }

    return results;
}
