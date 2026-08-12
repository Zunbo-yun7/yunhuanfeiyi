import pool from "../config/db.js";

async function main() {
  const [rows] = await pool.query("SELECT id, name, description FROM stickers ORDER BY id");
  console.log("数据库中的表情包:");
  rows.forEach((r) => console.log(`  [${r.id}] ${r.name} | ${r.description}`));
  process.exit(0);
}
main().catch(console.error);
