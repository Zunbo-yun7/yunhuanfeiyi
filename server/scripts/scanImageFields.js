import pool from "../config/db.js";

async function scanImageFields() {
    const tables = [
        "home_banners",
        "actions",
        "action_items",
        "wechat_articles",
        "news_articles",
        "equipment",
        "xintan_teams",
        "xintan_training",
        "people",
        "masks",
        "heritage_sites",
    ];

    const imageKeywords = ["image", "img", "photo", "picture", "thumbnail", "cover", "banner"];

    for (const table of tables) {
        try {
            const [columns] = await pool.query(`DESCRIBE ${table}`);
            const imageColumns = columns.filter(col => 
                imageKeywords.some(kw => col.Field.toLowerCase().includes(kw))
            );
            
            if (imageColumns.length > 0) {
                console.log(`\n=== 表 ${table} ===`);
                imageColumns.forEach(col => {
                    console.log(`  - ${col.Field} (${col.Type})`);
                });

                const [rows] = await pool.query(`SELECT * FROM ${table} LIMIT 5`);
                if (rows.length > 0) {
                    console.log(`  样例数据 (共 ${rows.length} 条):`);
                    rows.forEach((row, i) => {
                        const imgData = {};
                        imageColumns.forEach(col => {
                            if (row[col.Field]) {
                                imgData[col.Field] = row[col.Field].substring(0, 80);
                            }
                        });
                        if (Object.keys(imgData).length > 0) {
                            console.log(`  [${i + 1}]`, JSON.stringify(imgData));
                        }
                    });
                }
            }
        } catch (error) {
            console.log(`表 ${table} 不存在或查询失败: ${error.message}`);
        }
    }

    process.exit(0);
}

scanImageFields();