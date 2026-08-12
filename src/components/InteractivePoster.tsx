import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MousePointerClick, X, ZoomIn, ExternalLink } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { FadeInUp } from './Animated';
import api from '@/lib/api';

interface Hotspot {
  id: number;
  label: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  target_url: string;
  target_type: 'internal' | 'external';
  poster_image: string;
}

export function InteractivePoster() {
  const navigate = useNavigate();
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const fullImgRef = useRef<HTMLImageElement>(null);

  const fetchHotspots = async () => {
    try {
      const res = await api.get('/poster');
      setHotspots(res.data);
    } catch (err) {
      console.error('获取海报热点失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  const handleHotspotClick = useCallback((spot: Hotspot) => {
    if (spot.target_type === 'external') {
      window.open(spot.target_url, '_blank', 'noopener');
    } else {
      navigate(spot.target_url);
    }
  }, [navigate]);

  const renderHotspots = () => (
    <>
      {hotspots.map((spot) => (
        <motion.div
          key={spot.id}
          className="absolute cursor-pointer group"
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: `${spot.w}%`,
            height: `${spot.h}%`,
          }}
          onMouseEnter={() => setHoveredId(spot.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={(e) => {
            e.stopPropagation();
            handleHotspotClick(spot);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 默认透明点击区 */}
          <div className="absolute inset-0" />

          {/* 悬停高亮 */}
          <AnimatePresence>
            {hoveredId === spot.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 border-2 border-yingge-gold rounded-lg pointer-events-none"
                style={{
                  backgroundColor: 'rgba(200, 160, 96, 0.12)',
                  boxShadow: '0 0 16px rgba(200, 160, 96, 0.3), inset 0 0 16px rgba(200, 160, 96, 0.08)',
                }}
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-yingge-gold" />
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-yingge-gold" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-yingge-gold" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-yingge-gold" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 悬停标签 */}
          <AnimatePresence>
            {hoveredId === spot.id && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute left-1/2 -translate-x-1/2 -top-11 z-20 whitespace-nowrap pointer-events-none"
              >
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-yingge-dark/95 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-xl">
                  <Sparkles className="w-3 h-3 text-yingge-gold" />
                  <span>{spot.label}</span>
                  {spot.target_type === 'external' ? (
                    <ExternalLink className="w-3 h-3 text-yingge-gold/60" />
                  ) : (
                    <span className="text-yingge-gold/60">→</span>
                  )}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1.5 h-1.5 bg-yingge-dark/95 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </>
  );

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-yingge-gold/20 border-t-yingge-gold rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yingge-red rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yingge-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <SectionHeader
          title="探·文创"
          subtitle="INTERACTIVE POSTER"
          align="center"
          variant="dark"
          showIcon={false}
        />

        <FadeInUp delay={0.2}>
          <p className="text-center text-yingge-dark/60 mb-8 max-w-2xl mx-auto leading-relaxed flex items-center justify-center gap-2">
            <MousePointerClick className="w-4 h-4 text-yingge-red" />
            点击海报中的文创产品，即可跳转查看详情
          </p>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="relative">
            {/* 海报缩略图 */}
            <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden shadow-xl bg-yingge-gray/50">
              <div
                ref={stageRef}
                className="relative w-full"
                style={{
                  aspectRatio: naturalSize.w && naturalSize.h
                    ? `${naturalSize.w}/${naturalSize.h}`
                    : '3/4',
                }}
              >
                <img
                  src={hotspots[0]?.poster_image || '/images/poster.png'}
                  alt="文创海报"
                  className="absolute inset-0 w-full h-full object-contain select-none"
                  draggable={false}
                  onLoad={(e) => {
                    const target = e.currentTarget;
                    setNaturalSize({ w: target.naturalWidth, h: target.naturalHeight });
                    setImageLoaded(true);
                  }}
                />

                {/* 热点覆盖层 */}
                {imageLoaded && hotspots.length > 0 && renderHotspots()}
              </div>

              {/* 全屏预览按钮 */}
              <motion.button
                onClick={() => setFullscreen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-yingge-dark/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-yingge-dark transition-colors z-30"
                title="全屏预览"
              >
                <ZoomIn className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </FadeInUp>

        {/* 标签列表 */}
        <FadeInUp delay={0.4}>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {hotspots.map((spot) => (
              <motion.button
                key={spot.id}
                onClick={() => handleHotspotClick(spot)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredId(spot.id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  hoveredId === spot.id
                    ? 'bg-yingge-red text-white border-yingge-red shadow-md'
                    : 'bg-white text-yingge-dark/70 border-yingge-dark/10 hover:border-yingge-gold/40'
                }`}
              >
                <Sparkles className="w-3 h-3" style={{ color: hoveredId === spot.id ? '#fff' : '#C8A060' }} />
                {spot.label}
              </motion.button>
            ))}
          </div>
        </FadeInUp>
      </div>

      {/* 全屏预览模式 */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div
              className="relative rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '95vw',
                aspectRatio: naturalSize.w && naturalSize.h ? `${naturalSize.w}/${naturalSize.h}` : '3/4',
                maxHeight: '90vh',
              }}
            >
              <img
                ref={fullImgRef}
                src={hotspots[0]?.poster_image || '/images/poster.png'}
                alt="海报全屏预览"
                className="absolute inset-0 w-full h-full object-contain select-none"
                draggable={false}
              />

              {/* 全屏热点覆盖层 */}
              {hotspots.length > 0 && (
                <div className="absolute inset-0">
                  {hotspots.map((spot) => (
                    <motion.div
                      key={spot.id}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        width: `${spot.w}%`,
                        height: `${spot.h}%`,
                      }}
                      onMouseEnter={() => setHoveredId(spot.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHotspotClick(spot);
                      }}
                    >
                      <div className="absolute inset-0" />
                      <AnimatePresence>
                        {hoveredId === spot.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 border-2 border-yingge-gold rounded-lg pointer-events-none"
                            style={{
                              backgroundColor: 'rgba(200, 160, 96, 0.12)',
                              boxShadow: '0 0 20px rgba(200, 160, 96, 0.4)',
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <AnimatePresence>
                        {hoveredId === spot.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="absolute left-1/2 -translate-x-1/2 -top-11 z-20 whitespace-nowrap pointer-events-none"
                          >
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-yingge-dark/95 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-xl">
                              <Sparkles className="w-3 h-3 text-yingge-gold" />
                              <span>{spot.label}</span>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1.5 h-1.5 bg-yingge-dark/95 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
              点击空白处关闭 · 点击热点区域跳转
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
