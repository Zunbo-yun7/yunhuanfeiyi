import pool from "../config/db.js";

async function scanAllTables() {
    const [tables] = await pool.query("SHOW TABLES");
    console.log("所有表:");
    tables.forEach(t => {
        const tableName = Object.values(t)[0];
        console.log(`  - ${tableName}`);
    });

    const imageKeywords = ["image", "img", "photo", "picture", "thumbnail", "cover", "banner", "avatar", "icon", "logo"];
    const results = [];

    for (const t of tables) {
        const tableName = Object.values(t)[0];
        try {
            const [columns] = await pool.query(`DESCRIBE ${tableName}`);
            const imageColumns = columns.filter(col => 
                imageKeywords.some(kw => col.Field.toLowerCase().includes(kw))
            );
            
            if (imageColumns.length > 0) {
                const [rows] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
                const total = rows[0].total;
                
                results.push({
                    table: tableName,
                    columns: imageColumns.map(c => c.Field),
                    total,
                });
            }
        } catch (e) {
            // skip
        }
    }

    console.log("\n=== 包含图片字段的表 ===");
    results.forEach(r => {
        console.log(`\n表: ${r.table} (共 ${r.total} 条记录)`);
        console.log(`  图片字段: ${r.columns.join(", ")}`);
    });

    process.exit(0);
}

scanAllTables();