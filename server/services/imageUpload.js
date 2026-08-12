import fetch from "node-fetch";
import FormData from "form-data";

const BEEIMG_API_KEY = "TspNEANZsF2x7CSWBXgfB8AMbNP2J6jqr22rs29d434ea5d3";
const BEEIMG_API_URL = "https://www.beeimg.cn/api/v2/upload";
const BEEIMG_STORAGE_ID = 5;

export const ALBUM_IDS = {
    actions: 1414,
    instructions: 1412,
    shows: 1411,
    news: 1410,
    others: 1409,
    equipment: 1408,
    sanxiaxiang: 1400,
    other: 520,
};

export const CATEGORY_ALBUM_MAP = {
    "actions-image": ALBUM_IDS.actions,
    "actions-data": ALBUM_IDS.actions,
    "practice-logs": ALBUM_IDS.actions,
    "wechat-articles": ALBUM_IDS.shows,
    "news-articles": ALBUM_IDS.news,
    "equipment-items": ALBUM_IDS.equipment,
    "equipment-categories": ALBUM_IDS.equipment,
    "xintan-team": ALBUM_IDS.sanxiaxiang,
    "xintan-stories": ALBUM_IDS.sanxiaxiang,
    "xintan-training": ALBUM_IDS.sanxiaxiang,
    "xintan-village": ALBUM_IDS.sanxiaxiang,
    "xintan-members": ALBUM_IDS.sanxiaxiang,
    "xintan-achievements": ALBUM_IDS.sanxiaxiang,
    "people": ALBUM_IDS.others,
    "mask-records": ALBUM_IDS.instructions,
    "about-features": ALBUM_IDS.others,
    "home-data": ALBUM_IDS.others,
    "digital-solutions": ALBUM_IDS.others,
    "heritage-challenges": ALBUM_IDS.others,
    "schedule": ALBUM_IDS.shows,
    "default": ALBUM_IDS.others,
};

function getAlbumId(category) {
    return CATEGORY_ALBUM_MAP[category] || ALBUM_IDS.others;
}

export async function uploadImage(fileBuffer, fileName, category = "default") {
    try {
        const albumId = getAlbumId(category);
        const formData = new FormData();
        formData.append("file", fileBuffer, {
            filename: fileName,
        });
        formData.append("storage_id", String(BEEIMG_STORAGE_ID));
        formData.append("album_id", String(albumId));
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
            console.error("[BeeImg] response is not JSON:", text.substring(0, 200));
            return {
                success: false,
                error: "响应格式错误",
            };
        }

        if (response.ok && data.status === "success" && data.data?.public_url) {
            console.log(`[BeeImg] 上传成功: ${fileName} -> ${data.data.public_url}`);
            return {
                success: true,
                url: data.data.public_url,
            };
        }

        console.error("[BeeImg] upload failed:", data);
        return {
            success: false,
            error: data.message || "上传失败",
        };
    } catch (error) {
        console.error("[BeeImg] upload error:", error);
        return {
            success: false,
            error: error.message || "上传失败",
        };
    }
}

export async function uploadImages(fileBuffers, category = "default") {
    const results = [];

    for (const { buffer, fileName } of fileBuffers) {
        const result = await uploadImage(buffer, fileName, category);
        results.push(result);
    }

    return results;
}
