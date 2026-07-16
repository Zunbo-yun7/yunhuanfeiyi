import { motion } from 'framer-motion';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  animateOnLoad?: boolean;
}

export function TextReveal({
  children,
  className = '',
  duration = 1.2,
  animateOnLoad = false,
}: TextRevealProps) {
  if (animateOnLoad) {
    return (
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`overflow-hidden ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
