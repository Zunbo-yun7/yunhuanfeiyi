import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

const BEEIMG_API_KEY = "TspNEANZsF2x7CSWBXgfB8AMbNP2J6jqr22rs29d434ea5d3";
const BEEIMG_API_URL = "https://www.beeimg.cn/api/v2/upload";
const STORAGE_ID = 5;

async function testAlbumId(albumId) {
    try {
        const testImage = fs.readFileSync("public/images/video-thumbnails/yingge-promo-1.png");
        
        const formData = new FormData();
        formData.append("file", testImage, { filename: "test-album.png" });
        formData.append("storage_id", String(STORAGE_ID));
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
        const data = JSON.parse(text);
        
        if (data.status === "success") {
            console.log(`album_id=${albumId}: SUCCESS - ${data.data.public_url}`);
            return { albumId, success: true, url: data.data.public_url };
        } else {
            console.log(`album_id=${albumId}: ${data.message}`);
            return { albumId, success: false, message: data.message };
        }
    } catch (error) {
        console.log(`album_id=${albumId}: Error -`, error.message);
        return { albumId, success: false };
    }
}

async function runTests() {
    console.log("Testing BeeImg album IDs...\n");
    
    const testIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    
    const results = [];
    for (const id of testIds) {
        const result = await testAlbumId(id);
        results.push(result);
        await new Promise(r => setTimeout(r, 800));
    }
    
    console.log("\n=== 成功的相册ID ===");
    results.filter(r => r.success).forEach(r => {
        console.log(`album_id=${r.albumId}: ${r.url}`);
    });
}

runTests();