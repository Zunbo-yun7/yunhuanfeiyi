import pool from "../config/db.js";

async function main() {
  try {
    const [cats] = await pool.query("SELECT * FROM creative_categories ORDER BY id");
    console.log("所有文创类别:");
    cats.forEach((c) => {
      console.log(`  ID: ${c.id}, 名称: ${c.name}, sort_order: ${c.sort_order}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("错误:", err);
    process.exit(1);
  }
}

main();
