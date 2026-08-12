import pool from "../config/db.js";

const updates = [
  { id: 1, desc: "猛猛食，食饱猛猛拼！英歌小将互你加油！" },
  { id: 2, desc: "猛猛做咪，莫等日头落山！冲冲冲！" },
  { id: 3, desc: "搭你一个心心，内面全是爱意~" },
  { id: 4, desc: "今日个精神头十足！做么都猛猛！" },
  { id: 5, desc: "瓦真个掠你气着了！勿碰我！" },
  { id: 6, desc: "哎唷！猛猛来看！做个会安尼个！" },
];

async function main() {
  try {
    for (const u of updates) {
      const [rows] = await pool.query("SELECT name FROM stickers WHERE id = ?", [u.id]);
      const name = rows[0]?.name || "?";
      await pool.query("UPDATE stickers SET description = ? WHERE id = ?", [u.desc, u.id]);
      console.log(`[OK] ID ${u.id} (${name}): ${u.desc}`);
    }
    console.log("\n全部更新完成！");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
