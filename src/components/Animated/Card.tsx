import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverScale?: number;
  hoverY?: number;
}

export function Card({
  children,
  className = '',
  style,
  onClick,
  hoverScale = 1.03,
  hoverY = -8,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ 
        scale: hoverScale, 
        y: hoverY,
        transition: {
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
      style={{
        ...style,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </motion.div>
  );
}
