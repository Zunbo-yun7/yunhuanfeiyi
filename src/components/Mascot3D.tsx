import { useRef, useState, Suspense, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, Html, useProgress } from '@react-three/drei';
import { RotateCcw, ZoomIn, ZoomOut, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 全局注册 meshopt 解码器，让 GLTFLoader 自动识别压缩模型
(GLTFLoader as any).setMeshoptDecoder?.(MeshoptDecoder);

interface ModelProps {
  url: string;
  autoRotate?: boolean;
  scale?: number;
  position?: [number, number, number];
}

function Model({ url, autoRotate = true, scale = 1, position = [0, 0, 0] }: ModelProps) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!gltf.scene) return;
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.envMapIntensity = 1.5;
                mat.needsUpdate = true;
              }
            });
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1.5;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [gltf]);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-yingge-gold/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-yingge-gold animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-yingge-gold text-xs font-bold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <p className="text-white/70 text-sm">3D模型加载中</p>
      </div>
    </Html>
  );
}

function Canvas3D({
  modelUrl,
  autoRotate,
  controlsRef,
}: {
  modelUrl: string;
  autoRotate: boolean;
  controlsRef: React.RefObject<any>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ touchAction: 'none' }}
    >
      <ambientLight intensity={3.0} />
      <directionalLight position={[5, 10, 5]} intensity={3.5} castShadow color="#FFF8DC" />
      <directionalLight position={[-5, 8, -5]} intensity={2.5} color="#FFE4B5" />
      <directionalLight position={[0, -3, 5]} intensity={2.0} color="#FFF0DB" />
      <directionalLight position={[8, 2, 0]} intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[-8, 2, 0]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[0, 5, 5]} intensity={3.0} color="#FFD700" distance={20} />
      <pointLight position={[0, -2, 5]} intensity={2.0} color="#FFA500" distance={15} />
      <pointLight position={[-4, 3, 4]} intensity={2.0} color="#FF6347" distance={15} />
      <pointLight position={[4, 3, 4]} intensity={2.0} color="#FFFFFF" distance={15} />
      <pointLight position={[0, 0, 8]} intensity={2.5} color="#FFF5E0" distance={12} />
      <hemisphereLight args={['#ffffff', '#FFE4C4', 1.2]} />

      <Suspense fallback={<LoadingScreen />}>
        <Model
          url={modelUrl}
          autoRotate={autoRotate}
          scale={1}
          position={[0, -0.5, 0]}
        />
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.4}
          scale={5}
          blur={2}
          far={2}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}

interface Mascot3DProps {
  height?: number | string;
  autoRotate?: boolean;
  showControls?: boolean;
  className?: string;
}

export function Mascot3D({
  height = 400,
  autoRotate = true,
  showControls = true,
  className = '',
}: Mascot3DProps) {
  const [rotateEnabled, setRotateEnabled] = useState(autoRotate);
  const [visible, setVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const modelUrl = '/models/mascot-compressed.glb';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // ESC 键退出全屏
  useEffect(() => {
    if (!isFullscreen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setRotateEnabled(autoRotate);
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.3);
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.3);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const canvasContent = visible ? (
    <Canvas3D
      modelUrl={modelUrl}
      autoRotate={rotateEnabled}
      controlsRef={controlsRef}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-yingge-gold/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-yingge-gold animate-spin"
            style={{ animationDuration: '1s' }}
          />
        </div>
        <p className="text-white/50 text-xs">等待加载</p>
      </div>
    </div>
  );

  const controlButtons = (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 z-10">
      <button
        onClick={() => setRotateEnabled(!rotateEnabled)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        title={rotateEnabled ? '暂停旋转' : '开始旋转'}
      >
        <Sparkles className={`w-4 h-4 ${rotateEnabled ? 'text-yingge-gold' : ''}`} />
      </button>
      <button
        onClick={handleZoomIn}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        title="放大"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={handleZoomOut}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        title="缩小"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={handleReset}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        title="重置视角"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      {showControls && (
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          title={isFullscreen ? '退出全屏' : '全屏展示'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );

  // 全屏模式：使用 Portal 渲染到 body
  if (isFullscreen) {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999]"
        style={{
          background: 'linear-gradient(180deg, rgba(178,34,34,0.2) 0%, rgba(44,44,44,0.95) 50%, rgba(178,34,34,0.2) 100%)',
          touchAction: 'none',
        }}
      >
        {canvasContent}
        {controlButtons}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
          英歌小将 · 全屏展示（ESC退出）
        </div>
        <div className="absolute top-3 right-3 text-xs text-white/40">
          拖拽旋转 · 滚轮缩放
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height, touchAction: 'none' }}
    >
      {canvasContent}

      {showControls && visible && controlButtons}

      {visible && (
        <div className="absolute top-3 right-3 text-xs text-white/40 pointer-events-none">
          拖拽旋转 · 滚轮缩放
        </div>
      )}
    </div>
  );
}

export default Mascot3D;
