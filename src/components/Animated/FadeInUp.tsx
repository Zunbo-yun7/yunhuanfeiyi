import { motion } from 'framer-motion';
import { fadeInUpVariants, scrollAnimation } from '../../hooks/useMotion';
interface FadeInUpProps {
 delay?: number;
 duration?: number;
 className?: string;
 children: React.ReactNode;
 style?: React.CSSProperties;
 animateOnLoad?: boolean;
}
export function FadeInUp({ delay = 0, duration = 0.6, className = '', children, style, animateOnLoad = false, }: FadeInUpProps) {
 if (animateOnLoad) {
 return (<motion.div initial="hidden" animate="visible" exit="hidden" variants={{
 hidden: { opacity: 0, y: 60 },
 visible: {
 opacity: 1,
 y: 0,
 transition: {
 delay,
 duration,
 ease: [0.22, 1, 0.36, 1],
 },
 },
 }} className={className} style={style}>
 {children}
 </motion.div>);
 }
 return (<motion.div initial="hidden" variants={{
 hidden: { opacity: 0, y: 60 },
 visible: {
 opacity: 1,
 y: 0,
 transition: {
 delay,
 duration,
 ease: [0.22, 1, 0.36, 1],
 },
 },
 }} {...scrollAnimation} className={className} style={style}>
 {children}
 </motion.div>);
}
