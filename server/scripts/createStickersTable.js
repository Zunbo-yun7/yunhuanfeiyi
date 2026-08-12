import pool from "../config/db.js";

async function main() {
  try {
    console.log("=== 创建 stickers 独立表 ===\n");

    // 1. 创建表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stickers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[OK] stickers 表已创建");

    // 2. 检查是否已有数据
    const [existing] = await pool.query("SELECT COUNT(*) as count FROM stickers");
    if (existing[0].count > 0) {
      console.log(`[跳过] stickers 表已有 ${existing[0].count} 条数据`);
    } else {
      // 3. 从 creative_products 迁移"表情包展示"类目的数据
      const [catRows] = await pool.query(
        "SELECT id FROM creative_categories WHERE name = ?",
        ["表情包展示"]
      );

      if (catRows.length > 0) {
        const catId = catRows[0].id;
        const [products] = await pool.query(
          "SELECT name, description, image, sort_order FROM creative_products WHERE category_id = ? ORDER BY sort_order ASC, id ASC",
          [catId]
        );

        for (const p of products) {
          await pool.query(
            "INSERT INTO stickers (name, description, image, sort_order) VALUES (?, ?, ?, ?)",
            [p.name, p.description || "", p.image || "", p.sort_order || 0]
          );
        }
        console.log(`[OK] 已迁移 ${products.length} 条表情包数据到 stickers 表`);

        // 4. 从 creative_products 删除表情包数据
        await pool.query("DELETE FROM creative_products WHERE category_id = ?", [catId]);
        console.log("[OK] 已从 creative_products 删除表情包数据");

        // 5. 删除表情包展示类目
        await pool.query("DELETE FROM creative_categories WHERE id = ?", [catId]);
        console.log("[OK] 已删除'表情包展示'类目");
      } else {
        console.log("[跳过] 未找到'表情包展示'类目，无需迁移");
      }
    }

    // 6. 查看最终数据
    const [stickers] = await pool.query("SELECT * FROM stickers ORDER BY sort_order ASC, id ASC");
    console.log(`\n当前 stickers 表数据 (${stickers.length} 条):`);
    stickers.forEach((s) => {
      console.log(`  [${s.id}] ${s.name} | sort: ${s.sort_order} | ${s.image.substring(0, 50)}...`);
    });

    console.log("\n=== 完成 ===");
    process.exit(0);
  } catch (err) {
    console.error("错误:", err);
    process.exit(1);
  }
}

main();
