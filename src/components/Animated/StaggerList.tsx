import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerDelay?: number;
  animateOnLoad?: boolean;
}

export function StaggerList({
  children,
  className = '',
  direction = 'up',
  staggerDelay = 0.08,
  animateOnLoad = false,
}: StaggerListProps) {
  const baseVariants = {
    up: { opacity: 0, y: 40 },
    down: { opacity: 0, y: -40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: baseVariants[direction],
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            initial={animateOnLoad ? 'hidden' : undefined}
          >
            {child}
          </motion.div>
        );
      }
      return child;
    });
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={animateOnLoad ? 'hidden' : undefined}
      animate={animateOnLoad ? 'visible' : undefined}
      whileInView={animateOnLoad ? undefined : 'visible'}
      viewport={animateOnLoad ? undefined : { once: true, margin: '-50px' }}
    >
      {renderChildren()}
    </motion.div>
  );
}
