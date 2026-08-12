import pool from "../config/db.js";

const newCategories = [
  { name: "IP形象周边", sort_order: 4 },
  { name: "表情包衍生品", sort_order: 5 },
];

const categoryProducts = {
  "IP形象周边": [
    {
      name: "英歌小将冰箱贴（经典款）",
      description: "采用英歌小将正面形象设计，磁吸式冰箱贴，留住传统文化温度。",
      image: "https://bee-reg-ab.imagency.cn/p/72f8b5bf6604c127ba85422529217c00.png",
      price: 19.9,
      badge: "新品",
      is_featured: 1,
      is_sold_out: 0,
      sort_order: 1,
    },
    {
      name: "英歌小将帆布袋（红色款）",
      description: "大容量帆布环保袋，印有多角度IP形象，日常出行必备潮品。",
      image: "https://bee-reg-ab.imagency.cn/p/f029c0218c21cd19c42e62eec6ca446b.png",
      price: 49,
      badge: "热销",
      is_featured: 1,
      is_sold_out: 0,
      sort_order: 2,
    },
    {
      name: "英歌小将帆布袋（米色款）",
      description: "简约米色帆布袋搭配经典英歌小将形象，文艺通勤百搭单品。",
      image: "https://bee-reg-ab.imagency.cn/p/f14ec77a853e65915ebdb906913ab7dd.png",
      price: 49,
      badge: "",
      is_featured: 0,
      is_sold_out: 0,
      sort_order: 3,
    },
    {
      name: "英歌小将主题明信片",
      description: "一套六张精美明信片，收录英歌小将多个造型，传递祝福更有心意。",
      image: "https://bee-reg-ab.imagency.cn/p/dba986881c6076a0e4bab101ae026ee9.png",
      price: 25,
      badge: "限定",
      is_featured: 1,
      is_sold_out: 0,
      sort_order: 4,
    },
  ],
  "表情包衍生品": [
    {
      name: "表情包贴纸套装（全套6张）",
      description: "英歌小将萌趣表情包贴纸，手账、日记、手机壳装饰必备神器。",
      image: "https://bee-reg-ab.imagency.cn/p/35d3585450d6bad1567dd7f2e9acc232.jpg",
      price: 12.9,
      badge: "新品",
      is_featured: 1,
      is_sold_out: 0,
      sort_order: 1,
    },
    {
      name: "萌趣加油款贴纸",
      description: "英歌小将鼓励加油表情贴纸，为学习工作注入满满元气。",
      image: "https://bee-reg-ab.imagency.cn/p/d221450e93398c7c32faf6259662c4ea.jpg",
      price: 3.9,
      badge: "",
      is_featured: 0,
      is_sold_out: 0,
      sort_order: 2,
    },
    {
      name: "可爱比心款贴纸",
      description: "超萌比心表情包，传递心意的最佳选择，送朋友送自己都合适。",
      image: "https://bee-reg-ab.imagency.cn/p/67d90f303f69d20c77d4ca04beaa562a.jpg",
      price: 3.9,
      badge: "",
      is_featured: 0,
      is_sold_out: 0,
      sort_order: 3,
    },
    {
      name: "元气满满款贴纸",
      description: "元气满满的英歌小将，每一个表情都活力十足，点亮你的每一天。",
      image: "https://bee-reg-ab.imagency.cn/p/1291fc2f1c335bbc0d54e19a8df08b47.jpg",
      price: 3.9,
      badge: "",
      is_featured: 0,
      is_sold_out: 0,
      sort_order: 4,
    },
    {
      name: "调皮眨眼款贴纸",
      description: "调皮眨眼的英歌小将，为生活增添趣味，年轻人最爱的潮酷表情。",
      image: "https://bee-reg-ab.imagency.cn/p/9b3e4700e186e09ae089ac0e8c004dc5.jpg",
      price: 3.9,
      badge: "",
      is_featured: 0,
      is_sold_out: 0,
      sort_order: 5,
    },
    {
      name: "开心大笑款贴纸",
      description: "感染力满满的大笑表情，让英歌小将把快乐传递给身边每一个人。",
      image: "https://bee-reg-ab.imagency.cn/p/5a79a70ec8d01f6fd90f4afd58e7b1ea.jpg",
      price: 3.9,
      badge: "",
      is_featured: 0,
      is_sold_out: 0,
      sort_order: 6,
    },
  ],
};

async function main() {
  try {
    console.log("=== 开始创建文创商品类别和商品数据 ===\n");

    for (const cat of newCategories) {
      console.log(`[类别] 创建: ${cat.name}`);
      const [result] = await pool.query(
        "INSERT INTO creative_categories (name, sort_order) VALUES (?, ?)",
        [cat.name, cat.sort_order]
      );
      const categoryId = result.insertId;
      console.log(`  类别ID: ${categoryId}`);

      const products = categoryProducts[cat.name] || [];
      for (const product of products) {
        console.log(`  [商品] 添加: ${product.name}`);
        await pool.query(
          `INSERT INTO creative_products 
           (category_id, name, description, image, price, badge, is_featured, is_sold_out, sort_order) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            categoryId,
            product.name,
            product.description,
            product.image,
            product.price,
            product.badge,
            product.is_featured,
            product.is_sold_out,
            product.sort_order,
          ]
        );
      }
      console.log(`  已添加 ${products.length} 个商品\n`);
    }

    console.log("=== 完成！数据已成功插入 ===");
    process.exit(0);
  } catch (err) {
    console.error("错误:", err);
    process.exit(1);
  }
}

main();
