import pool from "../config/db.js";

async function main() {
  console.log("=== 所有文创类目 ===");
  const [cats] = await pool.query("SELECT * FROM creative_categories ORDER BY id");
  cats.forEach((c) => console.log(`  ID:${c.id} 名称:"${c.name}" sort:${c.sort_order}`));

  console.log("\n=== 所有文创商品 ===");
  const [products] = await pool.query("SELECT id, category_id, name, price FROM creative_products ORDER BY id");
  products.forEach((p) => console.log(`  ID:${p.id} cat:${p.category_id} 名称:"${p.name}" 价格:${p.price}`));

  console.log("\n=== stickers 表 ===");
  const [stickers] = await pool.query("SELECT * FROM stickers");
  console.log(`  ${stickers.length} 条记录`);

  process.exit(0);
}

main().catch(console.error);
