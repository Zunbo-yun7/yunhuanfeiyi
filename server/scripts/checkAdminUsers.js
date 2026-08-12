import pool from '../config/db.js';

const checkAdminUsers = async () => {
  try {
    const [rows] = await pool.query('SELECT id, username, password FROM admin_users');
    console.log('admin_users 表数据:');
    console.log(JSON.stringify(rows, null, 2));
    
    if (rows.length === 0) {
      console.log('\n⚠️  警告：admin_users 表为空！');
    } else {
      console.log(`\n共 ${rows.length} 个管理员账号`);
      rows.forEach((u) => {
        console.log(`  - ${u.username} (密码: ${u.password.substring(0, 15)}...)`);
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
};

checkAdminUsers();
