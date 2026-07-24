import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const BEEIMG_API_KEY = "TspNEANZsF2x7CSWBXgfB8AMbNP2J6jqr22rs29d434ea5d3";
const BEEIMG_API_URL = "https://www.beeimg.cn/api/v2/upload";
const BEEIMG_STORAGE_ID = 1;

async function uploadImage(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const formData = new FormData();
    formData.append("file", buffer, {
      filename: fileName,
    });
    formData.append("storage_id", String(BEEIMG_STORAGE_ID));
    formData.append("is_remove_exif", "true");

    console.log(`正在上传: ${fileName}`);
    console.log(`文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);

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
    console.log(`响应状态码: ${response.status}`);
    console.log(`响应内容: ${text.substring(0, 500)}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("响应不是有效的 JSON");
      return;
    }

    if (response.ok && data.status === "success" && data.data?.public_url) {
      console.log("✅ 上传成功!");
      console.log(`图片URL: ${data.data.public_url}`);
      return data.data.public_url;
    }

    console.error("❌ 上传失败:", data.message || data);
  } catch (error) {
    console.error("❌ 上传出错:", error.message);
  }
}

const testFile = process.argv[2] || "../public/images/video-thumbnails/yingge-promo-1.png";
const fullPath = path.resolve(testFile);

if (!fs.existsSync(fullPath)) {
  console.error(`文件不存在: ${fullPath}`);
  process.exit(1);
}

uploadImage(fullPath);
