import { motion } from 'framer-motion';

interface FadeInLeftProps {
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  animateOnLoad?: boolean;
}

export function FadeInLeft({
  delay = 0,
  duration = 0.6,
  className = '',
  children,
  style,
  animateOnLoad = false,
}: FadeInLeftProps) {
  if (animateOnLoad) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, x: -60 },
          visible: {
            opacity: 1,
            x: 0,
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
        hidden: { opacity: 0, x: -60 },
        visible: {
          opacity: 1,
          x: 0,
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
