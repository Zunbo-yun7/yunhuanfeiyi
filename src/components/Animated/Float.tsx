import { motion } from 'framer-motion';

interface FloatProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  amplitude?: number;
}

export function Float({
  children,
  className = '',
  style,
  duration = 3,
  amplitude = 10,
}: FloatProps) {
  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
