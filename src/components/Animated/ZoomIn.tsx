import { motion } from 'framer-motion';

interface ZoomInProps {
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  animateOnLoad?: boolean;
}

export function ZoomIn({
  delay = 0,
  duration = 0.5,
  className = '',
  children,
  style,
  animateOnLoad = false,
}: ZoomInProps) {
  if (animateOnLoad) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              delay,
              duration,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delay,
            duration,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
