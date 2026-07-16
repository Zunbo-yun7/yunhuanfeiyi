import fetch from "node-fetch";
import FormData from "form-data";

const IMGBED_API_KEY = "5205f5e3849dce2b9f88fe0700ce0fbd";
const IMGBED_API_URL = "https://api.superbed.cn/upload";

export async function uploadImage(fileBuffer, fileName) {
    try {
        const formData = new FormData();
        formData.append("file", fileBuffer, {
            filename: fileName,
            contentType: "image/jpeg",
        });
        formData.append("token", IMGBED_API_KEY);

        const response = await fetch(IMGBED_API_URL, {
            method: "POST",
            headers: {
                ...formData.getHeaders(),
            },
            body: formData,
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);

            if (data.err === 0 || data.code === 200 || data.success) {
                return {
                    success: true,
                    url: data.url || data.data?.url,
                };
            } else {
                console.error("Image upload failed:", data);
                return {
                    success: false,
                    error:
                        data.msg || data.detail || data.message || "上传失败",
                };
            }
        } catch {
            console.error("Response is not JSON:", text.substring(0, 200));
            return {
                success: false,
                error: "响应格式错误",
            };
        }
    } catch (error) {
        console.error("Image upload error:", error);
        return {
            success: false,
            error: error.message || "上传失败",
        };
    }
}

export async function uploadImages(fileBuffers) {
    const results = [];

    for (const { buffer, fileName } of fileBuffers) {
        const result = await uploadImage(buffer, fileName);
        results.push(result);
    }

    return results;
}
