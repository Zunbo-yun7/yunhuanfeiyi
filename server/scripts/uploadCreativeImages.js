import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "../services/imageUpload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const creativeDir = path.resolve(__dirname, "../../文创");
const category = "sanxiaxiang";

const filesToUpload = [
    "IP.png",
    "三视图.png",
    "表情包.png",
    "冰箱贴.png",
    "冰箱贴2.png",
    "帆布袋1.png",
    "帆布袋2.png",
    "明信片.png",
    "表情包贴纸1.jpg",
    "表情包贴纸2.jpg",
    "表情包贴纸3.jpg",
    "表情包贴纸4.jpg",
    "表情包贴纸5.jpg",
    "表情包贴纸6.jpg",
];

async function main() {
    console.log("开始上传文创素材图片...\n");
    const results = {};

    for (const fileName of filesToUpload) {
        const filePath = path.join(creativeDir, fileName);
        if (!fs.existsSync(filePath)) {
            console.log(`[跳过] 文件不存在: ${fileName}`);
            continue;
        }

        try {
            const buffer = fs.readFileSync(filePath);
            console.log(`[上传] ${fileName} (${(buffer.length / 1024).toFixed(1)} KB)...`);
            const result = await uploadImage(buffer, fileName, category);
            if (result.success) {
                results[fileName] = result.url;
                console.log(`[成功] ${fileName} -> ${result.url}\n`);
            } else {
                console.log(`[失败] ${fileName}: ${result.error}\n`);
            }
        } catch (err) {
            console.log(`[错误] ${fileName}: ${err.message}\n`);
        }

        await new Promise((r) => setTimeout(r, 500));
    }

    console.log("\n=== 上传结果汇总 ===");
    console.log(JSON.stringify(results, null, 2));

    const outputPath = path.join(__dirname, "creative_images_urls.json");
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
    console.log(`\n结果已保存到: ${outputPath}`);
}

main().catch(console.error);
