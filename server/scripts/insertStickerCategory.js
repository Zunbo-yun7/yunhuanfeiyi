import pool from "../config/db.js";

async function main() {
  try {
    console.log("=== 新增表情包展示类目 ===\n");

    // 检查是否已存在
    const [existing] = await pool.query(
      "SELECT id FROM creative_categories WHERE name = ?",
      ["表情包展示"]
    );

    let categoryId;

    if (existing.length > 0) {
      categoryId = existing[0].id;
      console.log(`类目已存在，ID: ${categoryId}`);
    } else {
      const [result] = await pool.query(
        "INSERT INTO creative_categories (name, sort_order) VALUES (?, ?)",
        ["表情包展示", 10]
      );
      categoryId = result.insertId;
      console.log(`新增类目成功，ID: ${categoryId}`);
    }

    // 检查是否已有商品
    const [existingProducts] = await pool.query(
      "SELECT COUNT(*) as count FROM creative_products WHERE category_id = ?",
      [categoryId]
    );

    if (existingProducts[0].count > 0) {
      console.log(`该类目已有 ${existingProducts[0].count} 个商品，跳过插入`);
      process.exit(0);
    }

    const stickers = [
      {
        name: "加油打气",
        description: "英歌小将为你加油，元气满满每一天！",
        image: "https://bee-reg-ab.imagency.cn/p/35d3585450d6bad1567dd7f2e9acc232.jpg",
      },
      {
        name: "冲鸭",
        description: "勇往直前，冲冲冲！",
        image: "https://bee-reg-ab.imagency.cn/p/d221450e93398c7c32faf6259662c4ea.jpg",
      },
      {
        name: "比心心",
        description: "送你一颗小心心，传递满满爱意。",
        image: "https://bee-reg-ab.imagency.cn/p/67d90f303f69d20c77d4ca04beaa562a.jpg",
      },
      {
        name: "元气满满",
        description: "今天也要元气满满哦！",
        image: "https://bee-reg-ab.imagency.cn/p/1291fc2f1c335bbc0d54e19a8df08b47.jpg",
      },
      {
        name: "调皮眨眼",
        description: "我知道你在想什么~",
        image: "https://bee-reg-ab.imagency.cn/p/9b3e4700e186e09ae089ac0e8c004dc5.jpg",
      },
      {
        name: "开心大笑",
        description: "哈哈哈，今天真开心！",
        image: "https://bee-reg-ab.imagency.cn/p/5a79a70ec8d01f6fd90f4afd58e7b1ea.jpg",
      },
    ];

    for (let i = 0; i < stickers.length; i++) {
      const s = stickers[i];
      await pool.query(
        `INSERT INTO creative_products
         (category_id, name, description, image, price, badge, is_featured, is_sold_out, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [categoryId, s.name, s.description, s.image, 0, "", 0, 0, i + 1]
      );
      console.log(`  [${i + 1}] 已添加: ${s.name}`);
    }

    console.log(`\n共添加 ${stickers.length} 个表情包商品`);
    console.log("=== 完成 ===");
    process.exit(0);
  } catch (err) {
    console.error("错误:", err);
    process.exit(1);
  }
}

main();
