import { motion } from 'framer-motion';

interface PulseProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}

export function Pulse({
  children,
  className = '',
  style,
  duration = 2,
}: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
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
