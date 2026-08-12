import pool from "../config/db.js";

async function main() {
  try {
    // 获取IP形象周边类别的ID
    const [cats] = await pool.query(
      "SELECT id FROM creative_categories WHERE name = ?",
      ["IP形象周边"]
    );

    if (cats.length === 0) {
      console.error("未找到IP形象周边类别");
      process.exit(1);
    }

    const categoryId = cats[0].id;
    console.log(`IP形象周边类别ID: ${categoryId}`);

    await pool.query(
      `INSERT INTO creative_products 
       (category_id, name, description, image, price, badge, is_featured, is_sold_out, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId,
        "英歌小将冰箱贴（双人款）",
        "双英雄形象冰箱贴，展现英歌小将双人组合英姿，双倍英气更有气势。",
        "https://bee-reg-ab.imagency.cn/p/d9b14c03d2144461ca15030f2a9eb936.png",
        29.9,
        "限量",
        1,
        0,
        5,
      ]
    );

    console.log("成功添加冰箱贴（双人款）商品！");
    process.exit(0);
  } catch (err) {
    console.error("错误:", err);
    process.exit(1);
  }
}

main();
