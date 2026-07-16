import { motion } from 'framer-motion';

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const fadeInDownVariants = {
  hidden: { opacity: 0, y: -60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const fadeInLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const fadeInRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const zoomInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const slideInUpVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const rotateInVariants = {
  hidden: { opacity: 0, rotation: -15, scale: 0.9 },
  visible: { 
    opacity: 1, 
    rotation: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const flipInVariants = {
  hidden: { opacity: 0, rotateX: -90 },
  visible: { 
    opacity: 1, 
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const skewInVariants = {
  hidden: { opacity: 0, skewX: 10, x: 30 },
  visible: { 
    opacity: 1, 
    skewX: 0,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const staggerUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  }),
};

export const staggerLeftVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  }),
};

export const textRevealVariants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { 
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const springScaleVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const springRotateVariants = {
  hover: { rotate: 5 },
  tap: { rotate: -5 },
};

export const cardHoverVariants = {
  rest: { 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.03, 
    y: -8,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  tap: { 
    scale: 0.98, 
    y: 0,
    transition: { duration: 0.15 }
  },
};

export const navbarScrollVariants = {
  transparent: { 
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  scrolled: { 
    backgroundColor: 'rgba(139, 0, 0, 0.95)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const pageTransitionVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

export const shimmerVariants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    }
  },
};

export const borderGlowVariants = {
  animate: {
    boxShadow: [
      '0 0 5px rgba(200, 160, 96, 0.5)',
      '0 0 20px rgba(200, 160, 96, 0.8)',
      '0 0 5px rgba(200, 160, 96, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

export const particleVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 1, 0],
    y: [0, -100, -200, -300],
    x: (i: number) => (Math.random() - 0.5) * 100,
    transition: (i: number) => ({
      duration: 2 + Math.random() * 2,
      delay: i * 0.1,
      repeat: Infinity,
      ease: 'easeOut',
    })
  },
};

export const parallaxVariants = {
  animate: {
    y: ['0%', '20%'],
    transition: {
      duration: 0,
      ease: 'none',
    }
  },
};

export const YinggeMotion = {
  fadeIn: motion.div,
  fadeInUp: motion.div,
  fadeInDown: motion.div,
  fadeInLeft: motion.div,
  fadeInRight: motion.div,
  zoomIn: motion.div,
  slideInUp: motion.div,
  rotateIn: motion.div,
  flipIn: motion.div,
  skewIn: motion.div,
  staggerUp: motion.div,
  staggerLeft: motion.div,
  textReveal: motion.div,
  card: motion.div,
  button: motion.button,
  img: motion.img,
  span: motion.span,
};

export const scrollAnimation = {
  triggerOnce: true,
  whileInView: 'visible',
  viewport: { 
    once: true,
    margin: '-50px',
  },
};

export const scrollAnimationRepeat = {
  whileInView: 'visible',
  viewport: { 
    once: false,
    margin: '-50px',
  },
};

export function getStaggerChildren(count: number, start: number = 0.1) {
  return (i: number) => ({
    transition: {
      delay: start + i * 0.08,
    }
  });
}

export function getSpringConfig(
  stiffness: number = 300,
  damping: number = 30,
  mass: number = 1
) {
  return {
    type: 'spring',
    stiffness,
    damping,
    mass,
  };
}
