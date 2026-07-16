import { useEffect, useRef } from 'react';
import emblemImg from '@/assets/emblem.jpg';

interface Emblem3DProps {
  size?: number;
  autoRotate?: boolean;
  interactive?: boolean;
}

export function Emblem3D({ size = 64, autoRotate = true, interactive = true }: Emblem3DProps) {
  const shieldRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const sheenBrushedRef = useRef<HTMLDivElement>(null);
  const domeRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shield = shieldRef.current;
    const sheen = sheenRef.current;
    const sheenBrushed = sheenBrushedRef.current;
    const dome = domeRef.current;
    const light = lightRef.current;
    const scene = sceneRef.current;

    if (!shield || !sheen || !sheenBrushed || !dome || !light) return;

    let rotX = -10;
    let rotY = 25;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let time = 0;
    let rafId: number;

    const updateShield = () => {
      shield.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      const sx = 50 + Math.sin((rotY * Math.PI) / 180) * 30;
      const sy = 42 + Math.cos((rotX * Math.PI) / 180) * 18;
      sheen.style.background = `radial-gradient(ellipse 28% 32% at ${sx}% ${sy}%, rgba(255,255,255,0.5) 0%, transparent 70%)`;

      sheenBrushed.style.transform = `rotate(${rotY * 0.3}deg)`;

      const dx = 47 + Math.sin((rotY * Math.PI) / 180) * 6;
      const dy = 40 + Math.cos((rotX * Math.PI) / 180) * 6;
      dome.style.background = `
        radial-gradient(ellipse 48% 42% at ${dx}% ${dy}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 18%, transparent 45%),
        radial-gradient(ellipse 80% 75% at 50% 50%, transparent 18%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.3) 100%)
      `;

      const nx = Math.sin((rotY * Math.PI) / 180) * 0.5 + 0.5;
      const ny = Math.cos((rotX * Math.PI) / 180) * 0.5 + 0.5;
      light.style.background = `radial-gradient(
        ellipse at ${nx * 100}% ${ny * 100}%,
        rgba(255, 220, 150, 0.18) 0%,
        transparent 40%,
        rgba(0, 0, 20, 0.15) 100%
      )`;
    };

    const animate = () => {
      time += 0.016;
      if (!isDragging && autoRotate) {
        rotY += 0.15 + Math.sin(time * 0.5) * 0.08;
        rotX = -10 + Math.sin(time * 0.3) * 3;
      }
      velX *= 0.95;
      velY *= 0.95;
      rotX += velX;
      rotY += velY;
      updateShield();
      rafId = requestAnimationFrame(animate);
    };
    animate();

    if (interactive && scene) {
      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        velX = 0;
        velY = 0;
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        rotY += (e.clientX - lastX) * 0.5;
        rotX -= (e.clientY - lastY) * 0.5;
        velY = (e.clientX - lastX) * 0.12;
        velX = -(e.clientY - lastY) * 0.12;
        lastX = e.clientX;
        lastY = e.clientY;
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleTouchStart = (e: TouchEvent) => {
        isDragging = true;
        const t = e.touches[0];
        lastX = t.clientX;
        lastY = t.clientY;
        velX = 0;
        velY = 0;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        const t = e.touches[0];
        rotY += (t.clientX - lastX) * 0.5;
        rotX -= (t.clientY - lastY) * 0.5;
        velY = (t.clientX - lastX) * 0.12;
        velX = -(t.clientY - lastY) * 0.12;
        lastX = t.clientX;
        lastY = t.clientY;
      };

      const handleTouchEnd = () => {
        isDragging = false;
      };

      scene.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      scene.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        cancelAnimationFrame(rafId);
        scene.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        scene.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [autoRotate, interactive]);

  const edgeLayers = [];
  const EDGE_LAYERS = 30;
  const THICKNESS = Math.max(size * 0.25, 12);

  for (let i = 0; i < EDGE_LAYERS; i++) {
    const t = i / (EDGE_LAYERS - 1);
    const z = -THICKNESS / 2 + t * THICKNESS;
    const edgeFactor = Math.abs(t - 0.5) * 2;
    const r = Math.round(50 + 160 * edgeFactor);
    const g = Math.round(25 + 120 * edgeFactor * edgeFactor);
    const b = Math.round(35 + 30 * edgeFactor);
    const cr = Math.round(25 + 30 * (1 - edgeFactor));
    const cg = Math.round(12 + 20 * (1 - edgeFactor));
    const cb = Math.round(45 + 60 * (1 - edgeFactor));
    const bossBulge = Math.cos(t * Math.PI);
    const scale = 0.96 + 0.04 * (1 - bossBulge * 0.3);

    edgeLayers.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          transform: `translateZ(${z.toFixed(2)}px) scale(${scale.toFixed(3)})`,
          background: `radial-gradient(circle at 50% 50%,
            rgba(${cr + 30}, ${cg + 20}, ${cb + 40}, 0.9) 0%,
            rgba(${Math.round((r + cr) / 2)}, ${Math.round((g + cg) / 2)}, ${Math.round((b + cb) / 2)}, 0.85) 50%,
            rgba(${r}, ${g}, ${b}, 0.8) 100%
          )`,
          border: `${edgeFactor > 0.7 ? 2 : 1}px solid rgba(${r}, ${g}, ${b}, ${0.12 + 0.2 * edgeFactor})`,
          boxShadow: `inset 0 0 ${6 + 12 * edgeFactor}px rgba(${r}, ${g}, ${b}, ${0.04 + 0.08 * edgeFactor})`,
        }}
      />
    );
  }

  const rivetPositions = [
    { top: '4%', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '4%', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', left: '4%', transform: 'translateY(-50%)' },
    { top: '50%', right: '4%', transform: 'translateY(-50%)' },
  ];

  const rivetSize = Math.max(size * 0.08, 6);
  const faceZ = THICKNESS / 2;

  return (
    <div
      ref={sceneRef}
      style={{
        position: 'relative',
        width: size,
        height: size,
        perspective: `${size * 2}px`,
        perspectiveOrigin: '50% 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'grab' : 'default',
      }}
    >
      <div
        ref={shieldRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '115%',
            height: '115%',
            top: '-7.5%',
            left: '-7.5%',
            borderRadius: '50%',
            zIndex: -1,
            background: 'radial-gradient(circle, rgba(200,160,96,0.25) 30%, transparent 65%)',
            filter: 'blur(8px)',
            animation: 'glowPulse 4s ease-in-out infinite',
          }}
        />

        {edgeLayers}

        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            transform: `translateZ(${faceZ}px)`,
            overflow: 'hidden',
          }}
        >
          <img
            src={emblemImg}
            alt="队徽"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              display: 'block',
            }}
            draggable={false}
          />
          <div
            ref={domeRef}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
              background: `
                radial-gradient(circle at 50% 50%,
                  transparent 30%,
                  rgba(255,255,255,0.04) 32%,
                  rgba(255,255,255,0.08) 34%,
                  rgba(255,255,255,0.04) 36%,
                  transparent 38%,
                  transparent 46%,
                  rgba(0,0,0,0.06) 47%,
                  rgba(0,0,0,0.1) 48%,
                  rgba(0,0,0,0.06) 49%,
                  transparent 51%
                )
              `,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
              boxShadow: `
                inset 0 0 ${size * 0.1}px rgba(180,140,60,0.2),
                inset 0 0 ${size * 0.15}px rgba(0,0,0,0.15)
              `,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
              border: `${Math.max(size * 0.02, 1)}px solid transparent`,
              background: `
                linear-gradient(160deg, rgba(230,200,100,0.7), rgba(160,100,220,0.5), rgba(100,60,180,0.4), rgba(230,200,100,0.6)) border-box
              `,
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <div
            ref={sheenRef}
            style={{
              position: 'absolute',
              inset: '-10%',
              borderRadius: '50%',
              pointerEvents: 'none',
              opacity: 0.45,
              mixBlendMode: 'overlay',
            }}
          />
          <div
            ref={sheenBrushedRef}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
              opacity: 0.12,
              background: `repeating-conic-gradient(
                from 0deg,
                rgba(255,255,255,0.15) 0deg,
                transparent 1deg,
                transparent 3deg
              )`,
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            transform: `rotateY(180deg) translateZ(${faceZ}px)`,
            background: 'radial-gradient(circle, #2a1a50 0%, #1a1040 50%, #120a30 100%)',
            border: `${Math.max(size * 0.015, 1)}px solid rgba(180, 140, 60, 0.4)`,
            backfaceVisibility: 'hidden',
            boxShadow: `inset 0 0 ${size * 0.12}px rgba(100,60,180,0.2)`,
          }}
        />

        <div
          ref={lightRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: `translateZ(${faceZ + 1}px)`,
            mixBlendMode: 'soft-light',
          }}
        />

        {rivetPositions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: rivetSize,
              height: rivetSize,
              borderRadius: '50%',
              pointerEvents: 'none',
              background: 'radial-gradient(circle at 35% 35%, #f0dca0, #b09050, #705830)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.4)',
              transform: `${pos.transform || ''} translateZ(${faceZ + 2}px)`,
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
