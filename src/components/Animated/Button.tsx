import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-yingge-red text-white hover:bg-yingge-red-dark',
    secondary: 'bg-yingge-gold text-yingge-dark hover:bg-amber-500',
    outline: 'border-2 border-yingge-red text-yingge-red hover:bg-yingge-red hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 6px 25px rgba(139, 0, 0, 0.4)',
      }}
      whileTap={{ 
        scale: 0.95,
        boxShadow: '0 2px 10px rgba(139, 0, 0, 0.3)',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        font-bold
        rounded-lg
        transition-all
        duration-300
        flex items-center justify-center
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
