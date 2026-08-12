import fetch from "node-fetch";

const BEEIMG_API_KEY = "TspNEANZsF2x7CSWBXgfB8AMbNP2J6jqr22rs29d434ea5d3";
const BEEIMG_ALBUMS_URL = "https://www.beeimg.cn/api/v1/albums";

async function getAlbums() {
    try {
        const response = await fetch(BEEIMG_ALBUMS_URL, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${BEEIMG_API_KEY}`,
            },
        });

        const text = await response.text();
        console.log("Albums response:", text.substring(0, 2000));
        
        const data = JSON.parse(text);
        if (data.status === "success" && data.data) {
            console.log("\n=== 相册列表 ===");
            const albums = data.data.data || data.data;
            albums.forEach(album => {
                console.log(`ID: ${album.id} - 名称: ${album.name} - 图片数: ${album.image_count || album.count || 0}`);
            });
        }
    } catch (error) {
        console.error("获取相册列表失败:", error.message);
    }
}

getAlbums();