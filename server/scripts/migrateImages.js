import fetch from "node-fetch";
import pool from "../config/db.js";
import { uploadImage, ALBUM_IDS } from "../services/imageUpload.js";
import path from "path";
import fs from "fs";

const MIGRATION_CONFIG = [
  {
    table: "actions",
    fields: ["image"],
    category: "actions-image",
    albumId: ALBUM_IDS.actions,
    idField: "id",
  },
  {
    table: "wechat_articles",
    fields: ["thumbnail_url"],
    category: "wechat-articles",
    albumId: ALBUM_IDS.shows,
    idField: "id",
  },
  {
    table: "news_articles",
    fields: ["thumbnail_url"],
    category: "news-articles",
    albumId: ALBUM_IDS.news,
    idField: "id",
  },
  {
    table: "equipment_items",
    fields: ["image"],
    category: "equipment-items",
    albumId: ALBUM_IDS.equipment,
    idField: "id",
  },
  {
    table: "mask_records",
    fields: ["image_url"],
    category: "mask-records",
    albumId: ALBUM_IDS.instructions,
    idField: "id",
  },
  {
    table: "people",
    fields: ["avatar"],
    category: "people",
    albumId: ALBUM_IDS.others,
    idField: "id",
  },
  {
    table: "practice_logs",
    fields: ["image"],
    category: "practice-logs",
    albumId: ALBUM_IDS.actions,
    idField: "id",
  },
  {
    table: "xintan_stories",
    fields: ["image"],
    category: "xintan-stories",
    albumId: ALBUM_IDS.sanxiaxiang,
    idField: "id",
  },
  {
    table: "xintan_team",
    fields: ["images"],
    category: "xintan-team",
    albumId: ALBUM_IDS.sanxiaxiang,
    idField: "id",
    isJsonArray: true,
  },
  {
    table: "xintan_team_members",
    fields: ["avatar"],
    category: "xintan-members",
    albumId: ALBUM_IDS.sanxiaxiang,
    idField: "id",
  },
  {
    table: "xintan_training",
    fields: ["images"],
    category: "xintan-training",
    albumId: ALBUM_IDS.sanxiaxiang,
    idField: "id",
    isJsonArray: true,
  },
  {
    table: "xintan_village",
    fields: ["image"],
    category: "xintan-village",
    albumId: ALBUM_IDS.sanxiaxiang,
    idField: "id",
  },
  {
    table: "about_features",
    fields: ["image"],
    category: "about-features",
    albumId: ALBUM_IDS.others,
    idField: "id",
  },
  {
    table: "home_data",
    fields: ["hero_background_image"],
    category: "home-data",
    albumId: ALBUM_IDS.others,
    idField: "id",
  },
  {
    table: "digital_solutions",
    fields: ["icon"],
    category: "digital-solutions",
    albumId: ALBUM_IDS.others,
    idField: "id",
  },
  {
    table: "heritage_challenges",
    fields: ["icon"],
    category: "heritage-challenges",
    albumId: ALBUM_IDS.others,
    idField: "id",
  },
];

const OLD_IMAGE_HOSTS = [
  "pic.imgdb.cn",
  "pic1.imgdb.cn",
  "i0.hdslb.com",
];

function isOldImageUrl(url) {
  if (!url || !url.startsWith("http")) return false;
  return OLD_IMAGE_HOSTS.some(host => url.includes(host));
}

function getFileNameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return path.basename(pathname);
  } catch {
    return `image-${Date.now()}.jpg`;
  }
}

async function downloadImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    console.error(`  下载失败: ${url} - ${error.message}`);
    return null;
  }
}

async function migrateTable(config) {
  const { table, fields, category, albumId, idField, isJsonArray } = config;
  console.log(`\n=== 迁移表: ${table} ===`);

  try {
    const [rows] = await pool.query(`SELECT * FROM ${table}`);
    if (rows.length === 0) {
      console.log(`  无数据，跳过`);
      return { success: 0, failed: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    for (const row of rows) {
      const rowId = row[idField];
      
      for (const field of fields) {
        const value = row[field];
        if (!value) continue;

        if (isJsonArray) {
          let urls = [];
          try {
            urls = JSON.parse(value);
          } catch {
            continue;
          }
          
          const newUrls = [];
          for (const url of urls) {
            if (isOldImageUrl(url)) {
            console.log(`  迁移: ${table}[${rowId}].${field}: ${url.substring(0, 60)}...`);
            const buffer = await downloadImage(url);
            if (buffer) {
              const fileName = getFileNameFromUrl(url);
              const result = await uploadImage(buffer, fileName, category);
              if (result.success) {
                newUrls.push(result.url);
                successCount++;
              } else {
                newUrls.push(url);
                failedCount++;
              }
            } else {
              newUrls.push(url);
              failedCount++;
            }
            await new Promise(r => setTimeout(r, 500));
            } else {
              newUrls.push(url);
            }
          }
          
          if (JSON.stringify(newUrls) !== JSON.stringify(urls)) {
            await pool.query(
              `UPDATE ${table} SET ${field} = ? WHERE ${idField} = ?`,
              [JSON.stringify(newUrls), rowId]
            );
            console.log(`  已更新: ${table}[${rowId}].${field}`);
          }
        } else {
          if (isOldImageUrl(value)) {
            console.log(`  迁移: ${table}[${rowId}].${field}: ${value.substring(0, 60)}...`);
            const buffer = await downloadImage(value);
            if (buffer) {
              const fileName = getFileNameFromUrl(value);
              const result = await uploadImage(buffer, fileName, category);
              if (result.success) {
                await pool.query(
                  `UPDATE ${table} SET ${field} = ? WHERE ${idField} = ?`,
                  [result.url, rowId]
                );
                console.log(`  成功: ${result.url.substring(0, 60)}...`);
                successCount++;
              } else {
                console.log(`  上传失败: ${result.error}`);
                failedCount++;
              }
            } else {
              failedCount++;
            }
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    }

    console.log(`  完成: 成功 ${successCount} 张，失败 ${failedCount} 张`);
    return { success: successCount, failed: failedCount };
  } catch (error) {
    console.error(`  迁移 ${table} 失败: ${error.message}`);
    return { success: 0, failed: 0 };
  }
}

async function runMigration() {
  console.log("开始图片迁移工具 - 旧图床 -> 蜜蜂图床\n");
  console.log(`共 ${MIGRATION_CONFIG.length} 个表待迁移`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const config of MIGRATION_CONFIG) {
    const result = await migrateTable(config);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  console.log("\n=== 迁移汇总 ===");
  console.log("总成功:", totalSuccess, "张");
  console.log("总失败:", totalFailed, "张");

  process.exit(0);
}

runMigration();