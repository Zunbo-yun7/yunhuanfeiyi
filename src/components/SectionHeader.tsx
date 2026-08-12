import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  variant?: 'dark' | 'light' | 'gold';
  showIcon?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  variant = 'dark',
  showIcon = true,
}: SectionHeaderProps) {
  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'gold'
        ? 'text-yingge-gold'
        : 'text-yingge-dark';

  const subTextColor =
    variant === 'light'
      ? 'text-white/60'
      : variant === 'gold'
        ? 'text-yingge-gold/60'
        : 'text-yingge-dark/50';

  const lineColor = variant === 'gold' ? 'bg-yingge-gold' : 'bg-yingge-gold';

  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const lineAlign = align === 'center' ? 'mx-auto' : 'mx-0';
  const lineOrigin = align === 'center' ? 'center' : 'left';

  const titleParts = title.split('·');

  return (
    <div className={`${alignClass} mb-16`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {showIcon && subtitle && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yingge-gold" />
            <span className={`text-yingge-gold text-sm tracking-widest`}>{subtitle}</span>
            <Sparkles className="w-5 h-5 text-yingge-gold" />
          </div>
        )}

        <h2 className={`font-serif font-bold text-3xl md:text-5xl ${textColor} mb-4 tracking-widest`}>
          {titleParts.map((part, i) => (
            <span key={i}>
              {part}
              {i < titleParts.length - 1 && (
                <span className="text-yingge-red mx-2">·</span>
              )}
            </span>
          ))}
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`w-24 h-0.5 ${lineColor} ${lineAlign}`}
          style={{ transformOrigin: lineOrigin }}
        />

        {!showIcon && subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${subTextColor} mt-4 text-sm tracking-wider`}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default SectionHeader;
