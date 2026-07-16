import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import useFetchData from '@/hooks/useFetchData';
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ZoomIn,
  StaggerList,
  Card,
  TextReveal,
  Float,
  Pulse,
} from '@/components/Animated';

interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    videoUrl: string;
  };
  projectIntro: string;
  navigation: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
    color: string;
  }>;
}

const bannerImages = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20red%20costumes%20heroic%20posture%20dramatic%20stage%20wide%20banner&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20facial%20makeup%20intricate%20patterns%20traditional%20Chinese%20opera%20style%20close%20up&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20troupe%20formation%20battle%20array%20traditional%20Chinese%20folk%20art%20performance&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Puning%20Yingge%20dance%20village%20celebration%20festival%20atmosphere%20traditional%20Chinese%20culture&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20martial%20arts%20movements%20dynamic%20action%20shots%20Chinese%20traditional%20performance&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20intangible%20cultural%20heritage%20exhibition%20museum%20style%20Chinese%20traditional%20art&image_size=landscape_16_9',
];

const danceTeams = [
  { name: '新坛英歌队', desc: '百年传承，威震普宁', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20team%20performance%20traditional%20Chinese%20folk%20art%20energetic&image_size=square' },
  { name: '泥沟英歌队', desc: '后起之秀，青春焕发', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20young%20performers%20Chinese%20traditional%20culture%20vibrant&image_size=square' },
  { name: '南山英歌队', desc: '古老阵法，气势恢宏', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20battle%20formation%20traditional%20Chinese%20martial%20arts%20style&image_size=square' },
  { name: '咸寮英歌队', desc: '独具特色，名扬四方', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20unique%20style%20Chinese%20traditional%20folk%20performance&image_size=square' },
];

const poses = [
  { name: '英歌舞起源和流派介绍', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20origin%20history%20traditional%20Chinese%20painting%20style&image_size=square' },
  { name: '英歌的传承与发展', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20inheritance%20development%20Chinese%20cultural%20heritage&image_size=square' },
  { name: '英歌的锤法', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20hammer%20technique%20martial%20arts%20Chinese%20traditional&image_size=square' },
  { name: '英歌基本动作之步法', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20footwork%20basic%20movements%20Chinese%20traditional%20dance&image_size=square' },
  { name: '英歌基本动作之跳跃动作', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20jumping%20movements%20dynamic%20Chinese%20traditional%20performance&image_size=square' },
];

const artifacts = [
  { name: '孩子们心中的英雄赞歌', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20artwork%20heroes%20children%20imagination%20colorful&image_size=square' },
  { name: '集世英歌', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20collection%20exhibition%20Chinese%20traditional%20culture%20museum&image_size=square' },
  { name: '吕方', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20historical%20figure%20Lv%20Fang%20traditional%20painting%20heroic&image_size=square' },
  { name: '蛇来运转', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20snake%20year%20cultural%20artwork%20auspicious%20traditional%20style&image_size=square' },
  { name: '英歌舞魔方', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20rubik%20cube%20creative%20Chinese%20cultural%20product&image_size=square' },
];

const performanceList = [
  { title: '五一期间英歌舞表演排期表', date: '2026-05-04' },
  { title: '春节英歌舞巡游活动安排', date: '2026-02-10' },
  { title: '非遗文化节英歌专场演出', date: '2026-06-15' },
  { title: '英歌舞进校园活动预告', date: '2026-04-20' },
];

export function Home() {
  const navigate = useNavigate();
  const { data: homeData, loading } = useFetchData<HomeData>('/home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  if (loading || !homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yingge-gray">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-yingge-dark/60">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yingge-gray overflow-x-hidden">
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '38%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={bannerImages[currentSlide]}
                alt={`轮播图${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
              x: mousePosition.x * 30,
              y: mousePosition.y * 30,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div className="text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider"
              >
                {homeData.hero.title.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 100, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.05,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="inline-block"
                    style={{ transformOrigin: 'bottom center' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-yingge-gold text-lg md:text-xl tracking-[0.3em]"
              >
                {homeData.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                <motion.button
                  onClick={() => navigate('/about')}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(200, 160, 96, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-8 py-3 border-2 border-yingge-gold text-yingge-gold font-medium hover:bg-yingge-gold hover:text-yingge-dark transition-all duration-300 tracking-wider rounded-lg"
                >
                  探索更多
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1, borderColor: '#C8A060', x: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 text-white flex items-center justify-center z-20"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1, borderColor: '#C8A060', x: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 text-white flex items-center justify-center z-20"
          >
            <ChevronRight size={24} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20"
          >
            {bannerImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-yingge-gold' : 'bg-white/40 hover:bg-white/60'
                }`}
                style={{
                  width: index === currentSlide ? '32px' : '16px',
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-yingge-gray to-transparent z-10" />
      </section>

      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <TextReveal className="text-center mb-16">
            <div className="inline-block">
              <h2 className="font-serif font-bold text-3xl md:text-5xl text-yingge-dark mb-4 tracking-widest">
                闯<span className="text-yingge-red mx-2">·</span>舞阵
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-24 h-0.5 bg-yingge-gold mx-auto"
                style={{ transformOrigin: 'center' }}
              />
            </div>
            <p className="text-yingge-dark/50 mt-4 text-sm tracking-wider">YINGGE DANCE TEAMS</p>
          </TextReveal>

          <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {danceTeams.map((team) => (
              <Card
                key={team.name}
                onClick={() => navigate('/xintan')}
                className="group"
              >
                <div className="relative overflow-hidden mb-4">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-yingge-dark/80 via-transparent to-transparent z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.img
                    src={team.image}
                    alt={team.name}
                    className="w-full aspect-square object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 z-20"
                    initial={{ y: '100%' }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white text-sm leading-relaxed">{team.desc}</p>
                  </motion.div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-yingge-gold z-10" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-yingge-gold z-10" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-yingge-gold z-10" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-yingge-gold z-10" />
                </div>
                <h3 className="font-serif font-bold text-lg text-yingge-dark text-center group-hover:text-yingge-red transition-colors duration-300">
                  {team.name}
                </h3>
                <motion.div
                  className="w-8 h-0.5 bg-yingge-gold mx-auto mt-2"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'center' }}
                />
              </Card>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-yingge-red/5 rounded-full"
          animate={{
            x: ['-50%', '-40%', '-50%'],
            y: ['-50%', '-45%', '-50%'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-yingge-gold/5 rounded-full"
          animate={{
            x: ['-50%', '-45%', '-50%'],
            y: ['50%', '45%', '50%'],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2">
              <TextReveal className="mb-10">
                <div className="inline-block">
                  <h2 className="font-serif font-bold text-3xl md:text-4xl text-yingge-dark mb-3 tracking-widest">
                    英歌展演
                  </h2>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    className="w-16 h-0.5 bg-yingge-gold"
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </TextReveal>

              <FadeInLeft>
                <motion.div
                  className="relative overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={bannerImages[0]}
                    alt="英歌展演"
                    className="w-full h-64 md:h-80 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-sm"
                      whileHover={{ borderColor: '#C8A060', scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <Play size={32} className="text-white ml-1" fill="white" />
                    </motion.div>
                  </motion.div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-serif text-xl md:text-2xl font-bold">英歌舞精彩表演集锦</p>
                    <p className="text-white/70 text-sm mt-2">感受千年非遗的震撼魅力</p>
                  </div>
                </motion.div>
              </FadeInLeft>

              <StaggerList direction="up" className="mt-8">
                {performanceList.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-yingge-border/50 cursor-pointer px-2 -mx-2"
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-yingge-dark flex items-center truncate flex-1">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-yingge-gold mr-3 flex-shrink-0"
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      />
                      <span className="truncate">{item.title}</span>
                    </span>
                    <span className="text-yingge-dark/40 text-sm ml-4 flex-shrink-0 font-mono">
                      {item.date}
                    </span>
                  </motion.li>
                ))}
              </StaggerList>
            </div>

            <FadeInRight delay={0.2}>
              <TextReveal className="mb-10">
                <div className="inline-block">
                  <h2 className="font-serif font-bold text-3xl md:text-4xl text-yingge-dark mb-3 tracking-widest">
                    通知公告
                  </h2>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    className="w-16 h-0.5 bg-yingge-gold"
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </TextReveal>

              <div className="bg-yingge-gray/50 p-6">
                <StaggerList direction="up">
                  {performanceList.map((item, index) => (
                    <motion.li
                      key={index}
                      className="group cursor-pointer py-3"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="flex items-start">
                        <span className="text-yingge-red font-serif font-bold mr-3 text-lg">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-yingge-dark group-hover:text-yingge-red transition-colors line-clamp-2 leading-relaxed">
                            {item.title}
                          </p>
                          <p className="text-yingge-dark/40 text-xs mt-2">{item.date}</p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </StaggerList>
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <TextReveal className="text-center mb-16">
            <div className="inline-block">
              <h2 className="font-serif font-bold text-3xl md:text-5xl text-yingge-dark mb-4 tracking-widest">
                识<span className="text-yingge-red mx-2">·</span>阵法
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="w-24 h-0.5 bg-yingge-gold mx-auto"
                style={{ transformOrigin: 'center' }}
              />
            </div>
            <p className="text-yingge-dark/50 mt-4 text-sm tracking-wider">YINGGE FORMATIONS</p>
          </TextReveal>

          <div className="bg-white p-8 md:p-12 shadow-sm">
            <StaggerList className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              {poses.map((pose) => (
                <Card
                  key={pose.name}
                  onClick={() => navigate('/actions')}
                  className="group"
                >
                  <div className="relative overflow-hidden mb-3">
                    <motion.img
                      src={pose.image}
                      alt={pose.name}
                      className="w-full aspect-square object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-yingge-dark/40 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center"
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        <Play size={24} className="text-white ml-0.5" fill="white" />
                      </motion.div>
                    </motion.div>
                  </div>
                  <p className="text-sm text-yingge-dark text-center group-hover:text-yingge-red transition-colors leading-relaxed line-clamp-2">
                    {pose.name}
                  </p>
                </Card>
              ))}
            </StaggerList>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-yingge-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q35 0 40 5 Q45 10 40 15 Q35 20 30 15 Q25 10 30 5' fill='none' stroke='%23C8A060' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <TextReveal className="text-center mb-16">
            <div className="inline-block">
              <h2 className="font-serif font-bold text-3xl md:text-5xl text-white mb-4 tracking-widest">
                取<span className="text-yingge-gold mx-2">·</span>神器
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="w-24 h-0.5 bg-yingge-gold mx-auto"
                style={{ transformOrigin: 'center' }}
              />
            </div>
            <p className="text-white/50 mt-4 text-sm tracking-wider">CULTURAL CREATIONS</p>
          </TextReveal>

          <ZoomIn>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {artifacts.map((item, index) => (
                <motion.div
                  key={index}
                  onClick={() => navigate('/equipment')}
                  className="cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative overflow-hidden bg-white p-2">
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-square object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yingge-gold to-transparent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-white/80 text-center group-hover:text-yingge-gold transition-colors">
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </ZoomIn>
        </div>
      </section>

      <section className="py-12 px-4 bg-yingge-red relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23C8A060' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }} />
        </div>

        <FadeInUp className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white/70 text-sm mr-3">访问人数</span>
              <motion.span
                className="font-serif font-bold text-3xl md:text-4xl text-yingge-gold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                18,989
              </motion.span>
            </motion.div>
            <div className="hidden md:block w-px h-10 bg-white/20" />
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white/70 text-sm mr-3">非遗历史</span>
              <motion.span
                className="font-serif font-bold text-3xl md:text-4xl text-yingge-gold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                400+
              </motion.span>
              <span className="text-white/70 text-sm ml-2">年</span>
            </motion.div>
            <div className="hidden md:block w-px h-10 bg-white/20" />
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white/70 text-sm mr-3">传承队伍</span>
              <motion.span
                className="font-serif font-bold text-3xl md:text-4xl text-yingge-gold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                50+
              </motion.span>
              <span className="text-white/70 text-sm ml-2">支</span>
            </motion.div>
          </div>
        </FadeInUp>
      </section>
    </div>
  );
}
