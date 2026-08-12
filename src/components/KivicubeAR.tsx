import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Maximize2,
  Minimize2,
  Camera,
  AlertCircle,
  RotateCcw,
  Info,
  X,
  Smartphone,
  Monitor,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { BorderGlow } from './reactbits';

interface KivicubeARProps {
  sceneId: string;
  title?: string;
  description?: string;
  className?: string;
}

export function KivicubeAR({
  sceneId,
  title = 'AR 英歌小将',
  description = '扫描识别图，让吉祥物在现实世界中活起来',
  className = '',
}: KivicubeARProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sceneUrl = `https://www.kivicube.com/scenes/${sceneId}`;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    if (isFullscreen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const ARFrame = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div
      className={`relative ${
        fullscreen
          ? 'w-full h-full'
          : 'w-full rounded-2xl overflow-hidden bg-yingge-dark/5'
      }`}
      style={fullscreen ? {} : { aspectRatio: '9/16' }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-yingge-dark/90 flex flex-col items-center justify-center z-10">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-yingge-gold/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-yingge-gold animate-spin" />
            <Scan className="absolute inset-0 m-auto w-6 h-6 text-yingge-gold" />
          </div>
          <p className="text-white/80 text-sm">正在加载 AR 场景...</p>
          <p className="text-white/40 text-xs mt-2">首次加载可能需要 10-30 秒</p>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-yingge-dark/95 flex flex-col items-center justify-center z-10 px-6">
          <AlertCircle className="w-12 h-12 text-yingge-red mb-4" />
          <p className="text-white/80 text-sm mb-2">AR 场景加载失败</p>
          <p className="text-white/40 text-xs text-center mb-4">
            请检查网络连接，或确认当前环境支持摄像头访问（需要 HTTPS）
          </p>
          <button
            onClick={handleReload}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-yingge-red/20 text-yingge-red text-sm hover:bg-yingge-red/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新加载
          </button>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={sceneUrl}
        allow="xr-spatial-tracking;camera;microphone;autoplay;fullscreen;gyroscope;accelerometer"
        frameBorder="0"
        className="w-full h-full"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="Kivicube AR Scene"
      />

      {!fullscreen && !isLoading && !hasError && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(true)}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <Info className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {!fullscreen && !isLoading && !hasError && isMobile && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Camera className="w-3 h-3 text-yingge-gold" />
          <span className="text-white/80 text-xs">摄像头 AR</span>
        </div>
      )}
    </div>
  );

  // 电脑端：显示紧凑提示卡片
  if (!isMobile) {
    return (
      <>
        <BorderGlow
          glowIntensity={0.4}
          borderColor="rgba(200, 160, 96, 0.25)"
          glowColor="#C8A060"
          borderRadius={24}
          className={className}
        >
          <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yingge-red/10 flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-6 h-6 text-yingge-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yingge-red text-xs font-medium tracking-wider">AR EXPERIENCE</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg md:text-xl text-yingge-dark mb-2">{title}</h3>
                  <p className="text-yingge-dark/60 text-sm leading-relaxed mb-3">{description}</p>

                  <div className="bg-yingge-gold/10 rounded-xl p-3 mb-3 border border-yingge-gold/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-yingge-gold flex-shrink-0 mt-0.5" />
                      <p className="text-yingge-dark/70 text-xs leading-relaxed">
                        <span className="font-medium text-yingge-dark">为什么电脑端会弹出二维码？</span>
                        <br />
                        AR 体验需要调用摄像头、陀螺仪等硬件，电脑端通常不具备完整的 AR
                        环境。Kivicube WebAR 平台会自动检测设备类型，在电脑端显示二维码引导你用手机扫码体验。这是平台的安全适配机制，并非网页错误。
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={sceneUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yingge-red text-white text-sm font-medium hover:bg-yingge-red/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      新窗口打开 AR
                    </a>
                    <button
                      onClick={() => setShowInfo(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yingge-dark/5 text-yingge-dark/70 text-sm hover:bg-yingge-dark/10 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      查看说明
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1">
              <div className="flex flex-wrap gap-2">
                {['图像识别', '3D动画', '实时渲染', 'WebAR'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-yingge-gold/10 text-yingge-gold text-xs border border-yingge-gold/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BorderGlow>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowInfo(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-lg text-yingge-dark">AR 体验说明</h4>
                  <button onClick={() => setShowInfo(false)} className="text-yingge-dark/40 hover:text-yingge-dark">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3 text-sm text-yingge-dark/70">
                  <p>
                    <span className="font-medium text-yingge-dark">使用方式：</span>
                    允许摄像头权限后，将手机对准识别图即可看到 AR 英歌小将在现实世界中呈现。
                  </p>
                  <p>
                    <span className="font-medium text-yingge-dark">电脑端限制：</span>
                    电脑缺少摄像头和陀螺仪的完整 AR 支持，平台会自动显示二维码，请使用手机扫码体验。
                  </p>
                  <p>
                    <span className="font-medium text-yingge-dark">环境要求：</span>
                    需要在支持摄像头的移动设备上使用，建议通过 HTTPS 或手机端访问以获得最佳体验。
                  </p>
                  <p>
                    <span className="font-medium text-yingge-dark">技术支持：</span>
                    本功能由 Kivicube WebAR 平台提供支持。
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // 手机端：显示长矩形 iframe 卡片
  return (
    <>
      <BorderGlow
        glowIntensity={0.4}
        borderColor="rgba(200, 160, 96, 0.25)"
        glowColor="#C8A060"
        borderRadius={24}
        className={className}
      >
        <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Scan className="w-4 h-4 text-yingge-red" />
                  <span className="text-yingge-red text-xs font-medium tracking-wider">AR EXPERIENCE</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-yingge-dark">{title}</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-yingge-red/10 rounded-full px-3 py-1.5">
                <Smartphone className="w-3.5 h-3.5 text-yingge-red" />
                <span className="text-yingge-red text-xs font-medium">手机 AR</span>
              </div>
            </div>
            <p className="text-yingge-dark/60 text-sm mb-4">{description}</p>
          </div>
          <div className="px-5 md:px-6">
            <ARFrame />
          </div>
          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-4">
            <div className="flex flex-wrap gap-2">
              {['图像识别', '3D动画', '实时渲染', 'WebAR'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-yingge-gold/10 text-yingge-gold text-xs border border-yingge-gold/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BorderGlow>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black"
          >
            <ARFrame fullscreen />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-center max-w-[80vw]">
              {title} · 全屏 AR 体验（ESC 退出）
            </div>
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif font-bold text-lg text-yingge-dark">AR 体验说明</h4>
                <button onClick={() => setShowInfo(false)} className="text-yingge-dark/40 hover:text-yingge-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-yingge-dark/70">
                <p>
                  <span className="font-medium text-yingge-dark">使用方式：</span>
                  允许摄像头权限后，将手机对准识别图即可看到 AR 英歌小将在现实世界中呈现。
                </p>
                <p>
                  <span className="font-medium text-yingge-dark">环境要求：</span>
                  需要在支持摄像头的设备上使用，建议使用 HTTPS 环境或手机端访问以获得最佳体验。
                </p>
                <p>
                  <span className="font-medium text-yingge-dark">技术支持：</span>
                  本功能由 Kivicube WebAR 平台提供支持。
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default KivicubeAR;
