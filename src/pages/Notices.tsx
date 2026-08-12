import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ChevronRight, ExternalLink, ArrowLeft } from 'lucide-react';
import useFetchData from '@/hooks/useFetchData';

interface WechatArticle {
  id: number;
  title: string;
  wechat_account: string;
  wechat_url: string;
  summary: string;
  thumbnail_url: string;
  published_at: string;
  is_top: number;
  sort_order: number;
}

export function Notices() {
  const navigate = useNavigate();
  const { data: wechatArticles, loading } = useFetchData<WechatArticle[]>('/wechat');

  if (loading || !wechatArticles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yingge-gray">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-yingge-dark/60">加载中...</p>
        </div>
      </div>
    );
  }

  const sortedArticles = [...wechatArticles].sort((a, b) => {
    if (a.is_top !== b.is_top) return b.is_top - a.is_top;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-yingge-gray">
      <section className="relative h-64 md:h-72 overflow-hidden">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20team%20red%20costumes%20heroic%20spirit%20cultural%20heritage%20documentary%20style&image_size=landscape_16_9"
          alt="通知公告"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-yingge-dark/90 via-yingge-dark/50 to-yingge-dark/60" />

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm hover:bg-white/20 hover:border-white/40 transition-all"
        >
          <ArrowLeft size={16} />
          <span>返回</span>
        </motion.button>

        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif font-bold text-white text-4xl md:text-5xl tracking-widest mb-4"
          >
            通知公告
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 text-white/80 text-sm"
          >
            <Home size={14} className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')} />
            <ChevronRight size={12} />
            <span className="text-white/60">首页</span>
            <ChevronRight size={12} />
            <span>通知公告</span>
            <ChevronRight size={12} />
            <span className="text-white/60">详情</span>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {sortedArticles.length === 0 ? (
            <div className="py-16 text-center text-yingge-dark/40">
              <p className="text-lg">暂无公告内容</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {sortedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => {
                    if (confirm('将跳转到微信公众号查看原文，是否继续？')) {
                      window.open(article.wechat_url, '_blank');
                    }
                  }}
                  className={`group cursor-pointer flex items-start gap-4 md:gap-6 px-5 md:px-8 py-5 md:py-6 hover:bg-yingge-gold/5 transition-colors ${
                    index < sortedArticles.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-yingge-red">
                        {formatDate(article.published_at)}
                      </span>
                      {!!article.is_top && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-yingge-gold/20 text-yingge-gold font-bold rounded">
                          置顶
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base md:text-lg text-yingge-dark leading-snug group-hover:text-yingge-red transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-yingge-dark/40 mt-1.5">
                      {article.wechat_account}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center mt-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yingge-red/5 text-yingge-red text-xs font-medium rounded-lg group-hover:bg-yingge-red group-hover:text-white transition-colors">
                      查看详情
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Notices;
