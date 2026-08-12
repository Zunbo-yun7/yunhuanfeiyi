interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = '',
  style,
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? 'shiny-text-disabled' : ''} ${className}`}
      style={{
        '--shiny-duration': animationDuration,
        ...style,
      } as React.CSSProperties}
    >
      {text}
    </div>
  );
}
