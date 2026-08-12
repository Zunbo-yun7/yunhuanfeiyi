import pool from '../config/db.js';

async function updateChallenges() {
  try {
    const challenges = [
      {
        icon: 'TrendingDown',
        title: '传播碎片化，内涵挖掘不足',
        impact: '文化认知浅层化',
        description: '英歌舞短视频播放量破45亿，但传播以视觉冲击片段为主，历史渊源、脸谱寓意、阵法文化等深层内涵难以通过碎片化视频系统传递，用户知其然不知其所以然。',
        stat_number: '45亿+',
        stat_label: '短视频播放量',
        source: '英歌舞短视频播放破45亿报道',
        source_url: 'http://m.toutiao.com/group/7610332822931079690/',
        sort_order: 1,
      },
      {
        icon: 'Users',
        title: '年轻人有兴趣，但缺学习渠道',
        impact: '传承渠道断层',
        description: '抖音00后非遗视频创作者同比增长95%，年轻群体对非遗兴趣高涨，但英歌舞缺乏系统化的线上学习平台，动作、脸谱、历史等知识散落在各处，入门门槛高。',
        stat_number: '95%↑',
        stat_label: '00后创作者同比增长',
        source: '抖音2025非遗数据报告',
        source_url: 'https://3g.163.com/news/article/K0GCCE7J05149B41.html',
        sort_order: 2,
      },
      {
        icon: 'AlertTriangle',
        title: '数字化程度低，体验单一',
        impact: '数字体验滞后',
        description: '英歌数字化仍以视频播放和图文展示为主，首个英歌舞数字艺术馆2025年才上线，缺乏互动式、沉浸式的数字体验，难以满足年轻一代的参与需求。',
        stat_number: '2025',
        stat_label: '首个数字艺术馆上线',
        source: '首个英歌舞数字艺术馆上线报道',
        source_url: 'https://c.m.163.com/news/a/JVV3KV7505388J4C.html',
        sort_order: 3,
      },
    ];

    for (let i = 0; i < challenges.length; i++) {
      const c = challenges[i];
      const id = i + 1;
      await pool.query(
        `UPDATE heritage_challenges SET 
         icon = ?, title = ?, impact = ?, description = ?, 
         stat_number = ?, stat_label = ?, source = ?, source_url = ?, sort_order = ?
         WHERE id = ?`,
        [c.icon, c.title, c.impact, c.description, c.stat_number, c.stat_label, c.source, c.source_url, c.sort_order, id]
      );
      console.log(`✅ 更新第 ${id} 条困境数据: ${c.title}`);
    }

    console.log('\n🎉 所有困境数据更新完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

updateChallenges();
