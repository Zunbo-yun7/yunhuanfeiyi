import { useRef, useState, useMemo } from 'react';

interface BorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowIntensity?: number;
  borderColor?: string;
  glowColor?: string;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
  useGradientBorder?: boolean;
}

export default function BorderGlow({
  children,
  glowIntensity = 0.6,
  borderColor = 'rgba(200, 160, 96, 0.4)',
  glowColor = '#C8A060',
  borderRadius = 16,
  className = '',
  style,
  useGradientBorder = true,
  ...rest
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const gradientBorderStyle = useMemo(() => {
    if (!useGradientBorder) return {};
    return {
      padding: 1,
      background: `linear-gradient(135deg, rgba(200, 160, 96, 0.4) 0%, rgba(178, 34, 34, 0.3) 50%, rgba(200, 160, 96, 0.4) 100%)`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none' as const,
    };
  }, [useGradientBorder]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius,
        border: useGradientBorder ? 'none' : `1px solid ${borderColor}`,
        ...style,
      }}
      {...rest}
    >
      {/* 渐变边框（常态） */}
      {useGradientBorder && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius,
            ...gradientBorderStyle,
          }}
        />
      )}
      {/* hover 时的发光光晕 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isHovering ? glowIntensity : 0,
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}33, transparent 40%)`,
        }}
      />
      {/* hover 时的边框发光 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          borderRadius,
          opacity: isHovering ? 1 : 0,
          padding: 1,
          background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 40%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  );
}
