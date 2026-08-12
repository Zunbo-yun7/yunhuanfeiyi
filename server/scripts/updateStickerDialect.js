import pool from "../config/db.js";

// 潮汕（普宁）方言描述映射
const dialectMap = [
  { id: 1, name: "加油打气", desc: "猛猛食，食饱猛猛拼！英歌小将互你加油！" },
  { id: 2, name: "冲鸭", desc: "猛猛做咪，莫等日头落山！冲冲冲！" },
  { id: 3, name: "比心心", desc: "搭你一个心心，内面全是爱意~" },
  { id: 4, name: "元气满满", desc: "今日个精神头十足！做么都猛猛！" },
  { id: 5, name: "调皮眨眼", desc: "瓦知你心里底想乜个~" },
  { id: 6, name: "开心大笑", desc: "哈哈哈！今日心情真正好食！" },
  { id: 7, name: "生气", desc: "瓦真个掠你气着了！勿碰我！" },
  { id: 8, name: "惊讶", desc: "哎唷！猛猛来看！做个会安尼个！" },
];

async function main() {
  try {
    for (const item of dialectMap) {
      const [rows] = await pool.query("SELECT id FROM stickers WHERE id = ?", [item.id]);
      if (rows.length === 0) {
        console.log(`[跳过] ID ${item.id} (${item.name}) 不存在`);
        continue;
      }
      await pool.query(
        "UPDATE stickers SET description = ? WHERE id = ?",
        [item.desc, item.id]
      );
      console.log(`[OK] ID ${item.id} ${item.name}: ${item.desc}`);
    }
    console.log("\n更新完成！");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
