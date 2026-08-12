import pool from "../config/db.js";

const stickers = [
  {
    name: "加油打气",
    description: "英歌小将为你加油，元气满满每一天！",
    image: "https://bee-reg-ab.imagency.cn/p/35d3585450d6bad1567dd7f2e9acc232.jpg",
    sort_order: 1,
  },
  {
    name: "冲鸭",
    description: "勇往直前，冲冲冲！",
    image: "https://bee-reg-ab.imagency.cn/p/d221450e93398c7c32faf6259662c4ea.jpg",
    sort_order: 2,
  },
  {
    name: "比心心",
    description: "送你一颗小心心，传递满满爱意。",
    image: "https://bee-reg-ab.imagency.cn/p/67d90f303f69d20c77d4ca04beaa562a.jpg",
    sort_order: 3,
  },
  {
    name: "元气满满",
    description: "今天也要元气满满哦！",
    image: "https://bee-reg-ab.imagency.cn/p/1291fc2f1c335bbc0d54e19a8df08b47.jpg",
    sort_order: 4,
  },
  {
    name: "调皮眨眼",
    description: "我知道你在想什么~",
    image: "https://bee-reg-ab.imagency.cn/p/9b3e4700e186e09ae089ac0e8c004dc5.jpg",
    sort_order: 5,
  },
  {
    name: "开心大笑",
    description: "哈哈哈，今天真开心！",
    image: "https://bee-reg-ab.imagency.cn/p/5a79a70ec8d01f6fd90f4afd58e7b1ea.jpg",
    sort_order: 6,
  },
];

async function main() {
  try {
    for (const s of stickers) {
      await pool.query(
        "INSERT INTO stickers (name, description, image, sort_order) VALUES (?, ?, ?, ?)",
        [s.name, s.description, s.image, s.sort_order]
      );
      console.log(`[OK] ${s.name}`);
    }
    console.log(`\n共插入 ${stickers.length} 条`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
