import pool from '../config/db.js';

async function updateChallenges() {
  try {
    const challenges = [
      {
        icon: 'Users',
        title: '传承人极度稀缺，断层危机严峻',
        impact: '传承后继乏人',
        description: '普宁全市英歌项目各级传承人仅10人，其中国家级1人、省级2人。面对全市103支英歌队的传承需求，传承人数量严重不足，且老龄化趋势明显，"人走技失"风险持续加剧。',
        stat_number: '仅10人',
        stat_label: '全市各级传承人',
        source: '澎湃新闻·春节话非遗',
        source_url: 'https://m.thepaper.cn/newsDetail_forward_30090799',
        sort_order: 1,
      },
      {
        icon: 'BookOpen',
        title: '口传心授模式，传承效率低下',
        impact: '传承难以规模化',
        description: '英歌舞传统传承依赖"口传心授"，老一辈艺人用潮汕方言口诀教学，从发力技巧到队形变化全靠面对面示范。这种方式学习周期长、地域限制大、难以规模化复制，导致传播范围受限。',
        stat_number: '口传心授',
        stat_label: '传统传承方式',
        source: '新媒体时代非物质文化遗产的推广策略研究',
        source_url: 'https://m.renrendoc.com/paper/479091659.html',
        sort_order: 2,
      },
      {
        icon: 'MapPin',
        title: '地域壁垒森严，受众认知浅层',
        impact: '传播范围受限',
        description: '《非物质文化遗产公众知晓度与参与度调查报告》显示，仅四成受访者表示较为了解非遗，超七成停留在"听过"层面。英歌舞传统传播依赖线下演出，受地域限制严重，外地受众难以系统接触其文化内涵。',
        stat_number: '仅40%',
        stat_label: '受访者较了解非遗',
        source: '非物质文化遗产公众知晓度与参与度调查报告(2022)',
        source_url: 'http://m.toutiao.com/group/7130511499709121027/',
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
