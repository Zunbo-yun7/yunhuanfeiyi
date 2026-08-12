import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Gift, ShoppingBag, Star, Tag, Share2, ZoomIn, X } from 'lucide-react';
import api from '@/lib/api';
import { SectionHeader } from '@/components/SectionHeader';

interface ProductDetail {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
  detail_images: string[];
  price: number;
  badge: string;
  is_featured: boolean;
  is_sold_out: boolean;
  sort_order: number;
  category?: { id: number; name: string };
}

export function CreativeProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [related, setRelated] = useState<ProductDetail[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 所有展示图片：主图 + 细节图（去重但保持顺序）
  const allImages: string[] = [];
  if (product) {
    if (product.image) allImages.push(product.image);
    for (const u of product.detail_images || []) {
      if (u && u !== product.image) allImages.push(u);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
    fetchRelated(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/creative/products/${productId}`);
      setProduct(res.data);
      setCurrentIndex(0);
    } catch (e) {
      console.error('fetch product error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (excludeId: string) => {
    try {
      const res = await api.get('/creative');
      const categories: any[] = Array.isArray(res.data) ? res.data : [];
      const all: ProductDetail[] = [];
      categories.forEach((cat) => {
        (cat.products || []).forEach((p: any) => all.push({ ...p, category: { id: cat.id, name: cat.name } }));
      });
      const filtered = all.filter((p) => String(p.id) !== excludeId).slice(0, 4);
      setRelated(filtered);
    } catch (e) {
      console.error('fetch related error:', e);
    }
  };

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((i) => (i <= 0 ? allImages.length - 1 : i - 1));
  }, [allImages.length]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((i) => (i >= allImages.length - 1 ? 0 : i + 1));
  }, [allImages.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    if (allImages.length <= 1 || isPaused) return;
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [allImages.length, isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prevSlide() : nextSlide();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="py-20 px-4 bg-yingge-gray/30 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 px-4 min-h-screen flex flex-col items-center gap-4">
        <p className="text-gray-500">商品不存在或已删除</p>
        <button
          onClick={() => navigate('/creative')}
          className="px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90"
        >
          返回文创周边
        </button>
      </div>
    );
  }

  const images = allImages.length > 0 ? allImages : (product.image ? [product.image] : []);
  const hasMultiple = images.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF0F0] via-[#F8EBE2] to-[#F5E0E0] pb-20">
      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 hover:text-yingge-red transition-colors"
          >
            <ArrowLeft size={16} />
            返回
          </button>
          <span>/</span>
          <Link to="/creative" className="hover:text-yingge-red transition-colors">
            文创周边
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="text-gray-400">{product.category.name}</span>
            </>
          )}
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden border border-white/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* 图片轮播区 */}
            <div className="relative">
              <div
                ref={carouselRef}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {images.length > 0 ? (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={currentIndex}
                      src={images[currentIndex]}
                      alt={product.name}
                      custom={direction}
                      variants={{
                        enter: (dir: number) => ({
                          x: dir > 0 ? 60 : -60,
                          opacity: 0,
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                        },
                        exit: (dir: number) => ({
                          x: dir > 0 ? -60 : 60,
                          opacity: 0,
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setLightboxOpen(true)}
                      draggable={false}
                    />
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Gift size={80} />
                  </div>
                )}

                {/* 图片计数 */}
                {hasMultiple && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}

                {/* 悬停显示放大按钮 */}
                {images.length > 0 && (
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn size={16} />
                  </button>
                )}

                {hasMultiple && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* 底部指示点 */}
                {hasMultiple && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`transition-all rounded-full ${
                          currentIndex === i
                            ? 'w-6 h-2 bg-yingge-red'
                            : 'w-2 h-2 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`切换到第${i + 1}张`}
                      />
                    ))}
                  </div>
                )}

                {product.is_sold_out && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                    <img
                      src="https://bee-reg-ab.imagency.cn/p/0f6c95861722ca533b221a261efab762.png"
                      alt="售罄"
                      className="w-40 h-40 object-contain mix-blend-multiply"
                    />
                  </div>
                )}
              </div>

              {/* 缩略图指示器 */}
              {hasMultiple && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentIndex === i
                          ? 'border-yingge-red shadow-md scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt={`缩略${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 信息区 */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-yingge-red text-white text-xs font-medium">
                    {product.badge}
                  </span>
                )}
                {product.is_featured && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1">
                    <Star size={12} className="fill-current" /> 首页精选
                  </span>
                )}
                {product.category && (
                  <span className="px-3 py-1 rounded-full border border-yingge-gold/40 text-yingge-gold text-xs">
                    {product.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-yingge-dark mb-3 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                {product.price > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-yingge-red">¥{product.price.toFixed(2)}</span>
                    {product.is_sold_out && (
                      <span className="text-gray-400 line-through text-sm">已售罄</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500 text-sm mt-1">咨询购买</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['勇敢', '正义', '团结', '传承'].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-yingge-red/10 text-yingge-red text-xs border border-yingge-red/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-medium text-yingge-dark mb-2">商品详情</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                <button
                  disabled={product.is_sold_out}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    product.is_sold_out
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yingge-red to-red-600 text-white hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {product.is_sold_out ? '已售罄' : '立即购买'}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <Share2 size={18} />
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 推荐商品 */}
        {related.length > 0 && (
          <div className="mt-16">
            <SectionHeader title="推荐商品" subtitle="You May Also Like" align="center" variant="dark" showIcon={false} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/creative/product/${p.id}`)}
                  className="bg-white/60 rounded-2xl overflow-hidden border border-white/80 cursor-pointer hover:shadow-md transition group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Gift size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-800 line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {p.detail_images?.length || 0} 张细节图
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 灯箱放大 */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            <X size={20} />
          </button>
          {hasMultiple && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={product.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {hasMultiple && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default CreativeProductDetail;
