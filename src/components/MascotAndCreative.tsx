import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot3D } from './Mascot3D';
import { BorderGlow } from './reactbits';
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  StaggerList,
  Card,
  TextReveal,
} from './Animated';
import { SectionHeader } from './SectionHeader';
import { Gift, Star, Heart, ShoppingBag, Sparkles, ChevronRight, X, Download, Eye } from 'lucide-react';
import api from '@/lib/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KivicubeAR } from './KivicubeAR';

// 表情包类型
interface Sticker {
  id: number;
  name: string;
  description: string;
  image: string;
  sort_order: number;
}

interface CreativeProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  detail_images: string[];
  category_id: number;
  price: number;
  badge: string;
  is_featured: boolean;
  is_sold_out: boolean;
}

interface CreativeCategory {
  id: number;
  name: string;
  products: CreativeProduct[];
}

interface MascotAndCreativeProps {
  mode?: 'full' | 'featured';
}

export function MascotAndCreative({ mode = 'full' }: MascotAndCreativeProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [categories, setCategories] = useState<CreativeCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<CreativeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 从 URL 参数读取分类和滚动目标 (从交互海报跳转时使用)
  const targetCategory = searchParams.get('category');
  const targetScroll = searchParams.get('scroll');

  // 表情包相关状态
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [downloadHint, setDownloadHint] = useState<string | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    if (mode === 'featured') {
      fetchFeaturedProducts();
    } else {
      fetchAllProducts();
      fetchStickers();
    }
  }, [mode]);

  // 数据加载完成后,如果 URL 带有 category 参数,设置分类并滚动到目标区域
  useEffect(() => {
    if (mode !== 'full' || loading) return;
    if (targetCategory) {
      setActiveCategory(targetCategory);
    }
    if (targetScroll) {
      // 等待 DOM 更新后滚动
      setTimeout(() => {
        const el = document.getElementById(targetScroll);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [mode, loading, targetCategory, targetScroll]);

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/creative');
      setCategories(response.data);
    } catch (err) {
      console.error('获取文创产品失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/creative/featured');
      setFeaturedProducts(response.data);
    } catch (err) {
      console.error('获取精选产品失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStickers = async () => {
    try {
      const response = await api.get('/creative/stickers');
      setStickers(response.data);
    } catch (err) {
      console.error('获取表情包失败:', err);
    }
  };

  // 下载图片到本地
  const downloadImage = useCallback(async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `英歌小将_${name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setDownloadHint(`已下载: 英歌小将_${name}.jpg`);
      setTimeout(() => setDownloadHint(null), 2500);
    } catch {
      // 跨域降级：直接打开新窗口
      window.open(url, '_blank');
      setDownloadHint('已在新窗口打开，请长按图片保存');
      setTimeout(() => setDownloadHint(null), 2500);
    }
  }, []);

  // 长按开始
  const handleLongPressStart = useCallback((sticker: Sticker) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      downloadImage(sticker.image, sticker.name);
    }, 600);
  }, [downloadImage]);

  // 长按结束
  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // 点击表情包（如果不是长按则打开详情）
  const handleStickerClick = useCallback((sticker: Sticker) => {
    if (!longPressTriggered.current) {
      setSelectedSticker(sticker);
    }
    longPressTriggered.current = false;
  }, []);

  const allProducts = categories.flatMap((cat) => cat.products);
  const categoryNames = ['全部', ...categories.map((c) => c.name)];

  const filteredProducts =
    activeCategory === '全部'
      ? allProducts
      : categories.find((c) => c.name === activeCategory)?.products || [];

  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden"
        style={{
          background: mode === 'full' 
            ? 'linear-gradient(180deg, #FBF0F0 0%, #F8EBE2 50%, #F3D9D9 100%)'
            : 'linear-gradient(180deg, #F3D9D9 0%, #F5E0E0 15%, #F7EEEE 30%, #f5f5f5 50%, #f5f5f5 100%)',
        }}
      >
        <div className="container mx-auto max-w-6xl flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden"
      style={{
        background: mode === 'full' 
          ? 'linear-gradient(180deg, #FBF0F0 0%, #F8EBE2 50%, #F3D9D9 100%)'
          : 'linear-gradient(180deg, #F3D9D9 0%, #F5E0E0 15%, #F7EEEE 30%, #f5f5f5 50%, #f5f5f5 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yingge-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yingge-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          title="吉祥·文创"
          subtitle="CREATIVE & MASCOT"
          align="center"
          variant="dark"
          showIcon={true}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-yingge-dark/60 mt-[-40px] mb-16 max-w-2xl mx-auto leading-relaxed text-center"
        >
          以英歌舞文化为灵感，打造独具特色的吉祥物形象与文创周边，
          让传统文化以更年轻、更时尚的方式走进日常生活。
        </motion.p>

        {mode === 'full' && (
          <>
            <div id="mascot" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <FadeInLeft>
                <div className="relative">
                  <BorderGlow
                    glowIntensity={0.5}
                    borderColor="rgba(200, 160, 96, 0.3)"
                    glowColor="#C8A060"
                    borderRadius={32}
                  >
                    <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
                      <Mascot3D height={400} className="rounded-t-3xl" />
                      <div className="p-6 border-t border-yingge-dark/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-serif font-bold text-xl text-yingge-dark mb-1">英歌小将</h3>
                            <p className="text-yingge-red text-sm">Yingge Mascot</p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-yingge-red to-red-700 flex items-center justify-center"
                          >
                            <Heart className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                        <p className="text-yingge-dark/70 text-sm leading-relaxed mb-4">
                          我们的吉祥物"英歌小将"以英歌舞经典角色为原型，
                          融合了传统脸谱元素与现代Q版设计风格，
                          象征着勇敢、正义与团结的精神，是英歌文化的年轻代言人。
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['勇敢', '正义', '团结', '传承'].map((tag, i) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-yingge-red/10 text-yingge-red text-xs border border-yingge-red/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              </FadeInLeft>

              <FadeInRight>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-yingge-dark mb-4">设计说明</h3>
                    <p className="text-yingge-dark/70 leading-relaxed mb-4">
                      "英歌小将"IP取材普宁新坛村英歌，紧扣新坛英歌数字文化平台主题，定位为元气少年英歌小将、非遗文化数字传播使者。作为本土少年英歌队员，他随传承人研习英歌技艺，热衷以短视频、数字技术向青少年科普非遗，既恪守传统根脉，也善用AI、AR创新传播。IP兼具勇毅热血与少年朝气，承载普宁英歌刚劲忠义的民俗寓意，打破非遗刻板印象，适配数字平台、课堂、文创、短视频等全场景。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yingge-red/20 flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-yingge-red" />
                      </div>
                      <div>
                        <h4 className="text-yingge-dark font-medium mb-1">脸谱元素</h4>
                        <p className="text-yingge-dark/60 text-sm">
                          融入传统英歌脸谱的色彩与纹样，传承文化基因
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yingge-gold/20 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-yingge-gold" />
                      </div>
                      <div>
                        <h4 className="text-yingge-dark font-medium mb-1">萌系造型</h4>
                        <p className="text-yingge-dark/60 text-sm">
                          Q版萌化设计，拉近与年轻群体的距离，更具亲和力
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yingge-red/20 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-yingge-red" />
                      </div>
                      <div>
                        <h4 className="text-yingge-dark font-medium mb-1">文创衍生</h4>
                        <p className="text-yingge-dark/60 text-sm">
                          丰富的周边产品，让英歌文化融入日常生活
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInRight>
            </div>

            {/* 三视图与IP平面视图 */}
            <div id="ip-views" className="mb-20">
              <SectionHeader
                title="IP·三视图与平面视图"
                subtitle="英歌小将多角度形象展示"
                align="center"
                variant="dark"
                showIcon={false}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <FadeInUp>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="h-full"
                  >
                    <BorderGlow
                      glowIntensity={0.4}
                      borderColor="rgba(200, 160, 96, 0.25)"
                      glowColor="#C8A060"
                      borderRadius={28}
                    >
                      <div className="bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm rounded-3xl overflow-hidden h-full flex flex-col">
                        <div className="bg-gradient-to-r from-yingge-red/5 via-yingge-gold/5 to-yingge-red/5 px-6 py-4 border-b border-yingge-dark/5 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-yingge-red/15 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-yingge-red" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-lg text-yingge-dark">IP 平面视图</h3>
                              <p className="text-xs text-yingge-dark/50 mt-0.5">3D 渲染·立体质感</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex items-center justify-center">
                          <img
                            src="/ip-views/IP.png"
                            alt="英歌小将 IP 平面视图"
                            className="max-h-60 w-auto object-contain rounded-2xl bg-gradient-to-br from-white/60 to-transparent"
                          />
                        </div>
                      </div>
                    </BorderGlow>
                  </motion.div>
                </FadeInUp>

                <FadeInUp>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
                    className="h-full"
                  >
                    <BorderGlow
                      glowIntensity={0.4}
                      borderColor="rgba(200, 160, 96, 0.25)"
                      glowColor="#C8A060"
                      borderRadius={28}
                    >
                      <div className="bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm rounded-3xl overflow-hidden h-full flex flex-col">
                        <div className="bg-gradient-to-r from-yingge-gold/5 via-yingge-red/5 to-yingge-gold/5 px-6 py-4 border-b border-yingge-dark/5 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-yingge-gold/15 flex items-center justify-center">
                              <Star className="w-4 h-4 text-yingge-gold" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-lg text-yingge-dark">人物三视图</h3>
                              <p className="text-xs text-yingge-dark/50 mt-0.5">正面 · 侧面 · 背面</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex items-center justify-center">
                          <img
                            src="/ip-views/三视图.png"
                            alt="英歌小将 三视图"
                            className="max-h-60 w-auto object-contain rounded-2xl bg-gradient-to-br from-white/60 to-transparent"
                          />
                        </div>
                      </div>
                    </BorderGlow>
                  </motion.div>
                </FadeInUp>
              </div>
            </div>

            <div id="ar" className="mb-20">
              <SectionHeader title="AR·体验" subtitle="让吉祥物走进现实世界" align="center" variant="dark" showIcon={false} />
              <FadeInUp>
                <KivicubeAR
                  sceneId="e6iWiyUICtt3jtbeyZHpyk6p4qwAxxlw"
                  title="AR 英歌小将"
                  description="扫描识别图，让吉祥物在现实世界中活起来。支持图像识别、3D动画和实时渲染。"
                />
              </FadeInUp>
            </div>

            {/* 表情包展示区 */}
            <div id="stickers" className="mb-20">
              <SectionHeader
                title="表情包·展示"
                subtitle="点击查看大图 · 长按保存"
                align="center"
                variant="dark"
                showIcon={false}
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-yingge-dark/50 mt-[-30px] mb-10 max-w-xl mx-auto text-center text-sm leading-relaxed"
              >
                基于"英歌小将"IP形象设计的系列萌趣表情包，点击可查看单张大图，长按可下载保存到相册。
              </motion.p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-5">
                {stickers.map((sticker, idx) => (
                  <motion.div
                    key={sticker.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="group relative select-none"
                    onClick={() => handleStickerClick(sticker)}
                    onMouseDown={() => handleLongPressStart(sticker)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(sticker)}
                    onTouchEnd={handleLongPressEnd}
                    style={{ cursor: 'pointer' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.06, y: -6 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-white/70 p-3 shadow-md hover:shadow-2xl transition-all duration-500 border border-yingge-gold/15"
                    >
                      <img
                        src={sticker.image}
                        alt={sticker.name}
                        className="w-full h-full object-contain rounded-xl pointer-events-none"
                        draggable={false}
                      />
                      {/* 悬浮操作提示 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-center pb-3 pointer-events-none">
                        <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                          <Eye className="w-3.5 h-3.5" />
                          <span>查看</span>
                          <span className="mx-1 opacity-50">|</span>
                          <Download className="w-3.5 h-3.5" />
                          <span>长按下载</span>
                        </div>
                      </div>
                    </motion.div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-yingge-dark/70 group-hover:text-yingge-red transition-colors">
                        {sticker.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        <div id="products" className="mb-8">
          <div className="relative flex items-center justify-center mb-8">
            <SectionHeader title="文创·周边" subtitle="精选英歌文化主题文创产品" align="center" variant="dark" showIcon={false} />
            {mode === 'featured' && (
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate('/creative')}
                className="absolute right-0 top-8 flex items-center gap-1 text-yingge-red hover:text-yingge-red/80 font-medium text-sm"
              >
                查看更多
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {mode === 'full' && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categoryNames.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-yingge-red text-white font-medium'
                      : 'bg-yingge-dark/5 text-yingge-dark/60 hover:bg-yingge-dark/10 hover:text-yingge-dark/80 border border-yingge-dark/10'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(mode === 'featured' ? featuredProducts : filteredProducts).map((product) => (
            <motion.div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/creative/product/${product.id}`)}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <BorderGlow
                glowIntensity={0.3}
                borderColor="rgba(200, 160, 96, 0.15)"
                glowColor="#C8A060"
                borderRadius={20}
                className="h-full"
              >
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl overflow-hidden h-full hover:bg-white/50 transition-all duration-500">
                  <div className="relative aspect-square overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-yingge-dark/5 flex items-center justify-center">
                        <Gift className="w-16 h-16 text-yingge-dark/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {product.is_sold_out && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="https://bee-reg-ab.imagency.cn/p/0f6c95861722ca533b221a261efab762.png"
                          alt="售罄"
                          className="w-32 h-32 object-contain mix-blend-multiply"
                        />
                      </div>
                    )}
                    {product.badge && !product.is_sold_out && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yingge-red text-white text-xs font-medium">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-yingge-dark"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-yingge-dark font-medium group-hover:text-yingge-red transition-colors">
                        {product.name}
                      </h4>
                      {product.is_sold_out ? (
                        <span className="text-gray-400 font-bold line-through">
                          ¥{product.price}
                        </span>
                      ) : product.price > 0 ? (
                        <span className="text-yingge-red font-bold">¥{product.price}</span>
                      ) : null}
                    </div>
                    <p className="text-yingge-dark/60 text-sm line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-yingge-dark/40 text-xs">
                        {categories.find((c) => c.id === product.category_id)?.name || '文创周边'}
                      </span>
                      <div className="flex items-center gap-2">
                        {Array.isArray(product.detail_images) && product.detail_images.length > 0 && (
                          <span className="text-[10px] text-yingge-gold px-1.5 py-0.5 border border-yingge-gold/40 rounded">
                            {product.detail_images.length}图
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 text-yingge-gold fill-yingge-gold"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </StaggerList>

        {(mode === 'featured' ? featuredProducts : filteredProducts).length === 0 && !loading && (
          <div className="text-center py-12 text-yingge-dark/40">
            <Gift className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>暂无文创产品</p>
          </div>
        )}
      </div>

      {/* 表情包详情弹窗 */}
      <AnimatePresence>
        {selectedSticker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedSticker(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedSticker(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 大图展示 */}
              <div className="bg-gradient-to-br from-yingge-gold/10 to-yingge-red/10 p-8">
                <img
                  src={selectedSticker.image}
                  alt={selectedSticker.name}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-2xl"
                />
              </div>

              {/* 信息和操作 */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-yingge-dark mb-1">
                    {selectedSticker.name}
                  </h3>
                  <p className="text-yingge-dark/60 text-sm leading-relaxed">
                    {selectedSticker.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => downloadImage(selectedSticker.image, selectedSticker.name)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-yingge-red to-red-700 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <Download className="w-4 h-4" />
                    保存到相册
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedSticker(null)}
                    className="px-5 py-3 rounded-2xl bg-yingge-dark/5 text-yingge-dark/60 font-medium text-sm hover:bg-yingge-dark/10 transition-colors"
                  >
                    关闭
                  </motion.button>
                </div>

                <p className="text-xs text-yingge-dark/40 text-center">
                  提示：长按图片也可快速下载保存
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 下载提示 Toast */}
      <AnimatePresence>
        {downloadHint && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-2xl bg-yingge-dark/90 backdrop-blur-sm text-white text-sm font-medium shadow-2xl flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-yingge-gold" />
            {downloadHint}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default MascotAndCreative;
