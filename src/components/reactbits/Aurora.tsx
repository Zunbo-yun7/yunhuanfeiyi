import { useRef, useEffect } from 'react';

interface AuroraProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
  wavelength?: number;
  className?: string;
  style?: React.CSSProperties;
}

// 预解析颜色，避免每帧重复计算
function parseColor(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export default function Aurora({
  colorStops = ['#B22222', '#C8A060', '#2F4F4F'],
  blend = 0.5,
  amplitude = 1,
  speed = 0.5,
  wavelength = 1,
  className = '',
  style,
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 尊重用户的减少动画偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // 不使用 DPR 缩放，大幅减少像素量
    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // 预解析颜色
    const colors = colorStops.map(parseColor);

    let t = 0;
    let raf = 0;
    let lastTime = 0;

    const draw = (now: number) => {
      // 限制为 ~30fps，减少绘制频率
      raf = requestAnimationFrame(draw);
      if (now - lastTime < 33) return;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const layers = colors.length;
      for (let i = 0; i < layers; i++) {
        const c = colors[i];
        const offset = (i / layers) * height * 0.6;
        const amp = amplitude * (50 + i * 30);
        const wl = wavelength * (0.005 + i * 0.002);

        ctx.beginPath();
        ctx.moveTo(0, height);

        // 增大采样步长到 12px，减少路径点数
        for (let x = 0; x <= width; x += 12) {
          const y1 = Math.sin(x * wl + t * speed + i) * amp;
          const y2 = Math.sin(x * wl * 2 + t * speed * 1.3 + i * 2) * amp * 0.5;
          const y = height * 0.4 + offset + y1 + y2;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, height * 0.2, 0, height);
        gradient.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${blend})`);
        gradient.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      t += 0.01;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [colorStops, blend, amplitude, speed, wavelength]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
