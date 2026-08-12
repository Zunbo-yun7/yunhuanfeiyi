import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "../services/imageUpload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const creativeDir = path.resolve(__dirname, "../../文创");
const category = "sanxiaxiang";

async function main() {
    console.log("重试上传冰箱贴2.png...\n");
    const fileName = "冰箱贴2.png";
    const filePath = path.join(creativeDir, fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`文件不存在: ${filePath}`);
        process.exit(1);
    }

    // 等待更长时间避免限流
    console.log("等待3秒后开始上传...");
    await new Promise((r) => setTimeout(r, 3000));

    try {
        const buffer = fs.readFileSync(filePath);
        console.log(`[上传] ${fileName} (${(buffer.length / 1024).toFixed(1)} KB)...`);
        const result = await uploadImage(buffer, fileName, category);
        if (result.success) {
            console.log(`[成功] ${fileName} -> ${result.url}\n`);
        } else {
            console.log(`[失败] ${fileName}: ${result.error}\n`);
        }
    } catch (err) {
        console.log(`[错误] ${fileName}: ${err.message}\n`);
    }

    process.exit(0);
}

main().catch(console.error);
