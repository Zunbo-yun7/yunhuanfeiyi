import pool from '../config/db.js';

const checkCreativeTables = async () => {
  try {
    console.log('=== 检查 creative_categories 表 ===');
    const [catRows] = await pool.query('SELECT * FROM creative_categories ORDER BY sort_order ASC');
    console.log(`共 ${catRows.length} 个分类:`);
    catRows.forEach((c) => {
      console.log(`  ${c.id}. ${c.name} (排序: ${c.sort_order})`);
    });

    console.log('\n=== 检查 creative_products 表 ===');
    const [prodRows] = await pool.query('SELECT * FROM creative_products ORDER BY sort_order ASC');
    console.log(`共 ${prodRows.length} 个商品:`);
    if (prodRows.length === 0) {
      console.log('  ⚠️  商品表为空！');
    } else {
      prodRows.forEach((p) => {
        console.log(`  ${p.id}. ${p.name} | 价格: ¥${p.price} | 精选: ${p.is_featured ? '是' : '否'} | 分类ID: ${p.category_id}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
};

checkCreativeTables();
