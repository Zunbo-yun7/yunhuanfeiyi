import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  AlertTriangle,
  TrendingDown,
  Users,
  MapPin,
  Sparkles,
  Lightbulb,
  Globe,
  Bot,
  BookOpen,
  Image,
  Video,
  ArrowRight,
  ExternalLink,
  X,
  Newspaper,
  Calendar,
} from 'lucide-react';
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
import { SectionHeader } from '@/components/SectionHeader';
import { Strands, ShinyText, BorderGlow } from '@/components/reactbits';
import { lazy, Suspense } from 'react';
const MascotAndCreative = lazy(() => import('@/components/MascotAndCreative').then(m => ({ default: m.MascotAndCreative })));
const InteractivePoster = lazy(() => import('@/components/InteractivePoster').then(m => ({ default: m.InteractivePoster })));

interface ChallengeItem {
  icon: string;
  title: string;
  description: string;
  impact: string;
  statNumber: string;
  statLabel: string;
  source: string;
  sourceUrl: string;
}

interface SolutionItem {
  icon: string;
  title: string;
  description: string;
  feature: string;
  color: string;
}

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
  challenges?: ChallengeItem[];
  solutions?: SolutionItem[];
}

const bannerItems = [
  { type: 'image', src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20red%20costumes%20heroic%20posture%20dramatic%20stage%20wide%20banner&image_size=landscape_16_9' },
  { type: 'video', src: '/videos/yingge-promo-1.mp4', poster: '/images/video-thumbnails/yingge-promo-1.png', title: '英歌舞文化推广片' },
  { type: 'image', src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20facial%20makeup%20intricate%20patterns%20traditional%20Chinese%20opera%20style%20close%20up&image_size=landscape_16_9' },
  { type: 'video', src: '/videos/yingge-promo-1.mp4', poster: '/images/video-thumbnails/yingge-promo-1.png', title: '英歌舞精彩表演集锦' },
  { type: 'image', src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20troupe%20formation%20battle%20array%20traditional%20Chinese%20folk%20art%20performance&image_size=landscape_16_9' },
  { type: 'image', src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Puning%20Yingge%20dance%20village%20celebration%20festival%20atmosphere%20traditional%20Chinese%20culture&image_size=landscape_16_9' },
  { type: 'image', src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20martial%20arts%20movements%20dynamic%20action%20shots%20Chinese%20traditional%20performance&image_size=landscape_16_9' },
  { type: 'image', src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20intangible%20cultural%20heritage%20exhibition%20museum%20style%20Chinese%20traditional%20art&image_size=landscape_16_9' },
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

const articleData = {
  title: '云焕非遗 | 踏浪而行，赴一场非遗之约',
  subtitle: '「人文计机」公众号推送',
  date: '2026年7月23日',
  author: '计算机学院团委 人文计机',
  sourceUrl: 'https://mp.weixin.qq.com/s/sV3N-j0ngalD4vQivswY2A',
  summary: '华南师范大学"云焕非遗"突击队奔赴揭阳，开启为期一周的英歌舞非遗调研与文化传播专项实践之旅。',
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20team%20red%20costumes%20heroic%20spirit%20cultural%20heritage%20documentary%20style&image_size=landscape_16_9',
  sections: [
    {
      heading: '启程',
      content: `为深入贯彻落实乡村振兴与中华优秀传统文化传承发展战略，引导青年学子扎根乡土、躬身实践，以青春力量活化非遗文脉、赋能乡土文化发展。7月21日，华南师范大学"云焕非遗"突击队奔赴揭阳，开启为期一周的英歌舞非遗调研与文化传播专项实践之旅。`,
    },
    {
      heading: '深耕非遗，直面传承难题',
      content: `英歌舞作为国家级非物质文化遗产，是岭南民俗文化的璀璨瑰宝，承载着潮汕人民坚韧奋进、团结向上的精神内核，兼具独特的舞蹈韵律、服饰美学与民俗底蕴，是鲜活的乡土文化名片。但当下，英歌舞文化仍面临年轻受众断层、数字化传播薄弱、文化内涵普及不足等传承困境，传统传播形式难以适配新时代文化传播趋势，亟需青年群体以创新思维为古老非遗注入新生活力。

为破解非遗传承难题，深耕乡土文化沃土，"云焕非遗"突击队聚焦英歌舞非遗保护、传承与创新传播核心方向，精心筹备本次三下乡实践活动。突击队将立足专业优势与青年视角，开展沉浸式非遗调研、传承人深度访谈、文化素材采集、非遗创新传播四大核心工作。团队将深入揭阳当地乡村，走进英歌舞传承基地与民俗活动现场，近距离记录英歌舞表演形态、传承现状与发展难题，面对面倾听非遗传承人的坚守故事与发展诉求，系统梳理英歌舞的文化脉络与艺术价值。`,
    },
    {
      heading: '行前蓄力，全员整装待发',
      content: `行前阶段，"云焕非遗"突击队全员完成前期筹备，深入研习英歌舞的历史渊源、表演体系、民俗内涵与地域特色，细化调研方案、访谈提纲与传播计划，明确实践分工、严守实践纪律、筑牢安全防线，为本次实地实践筑牢基础、蓄势赋能。突击队将紧扣"云焕非遗"核心理念，打破传统非遗传播壁垒，依托新媒体传播优势，通过图文纪实、短视频、文创构思、线上科普等年轻化、数字化形式，立体化展现英歌舞的民俗魅力与岭南文化底蕴，让藏于乡土的传统非遗走出揭阳、走向大众，让千年民俗文化在新时代焕发全新光彩。

出征在即，步履不停。未来数日，"云焕非遗"实践团将怀揣热忱与初心，行走揭阳乡土、探寻非遗薪火，用脚步丈量文脉厚度，用镜头记录民俗之美，用创意活化传统文化，以青年之力守护非遗根脉、传播岭南文脉，书写新时代青年非遗传承的青春答卷！`,
    },
    {
      heading: '落地',
      content: `7月21日下午三点，华南师范大学"云焕非遗"突击队顺利抵达揭阳市普宁市新坛村。作为潮汕英歌舞文化氛围最为浓厚、传承根基最为深厚的村落之一，新坛村承载着代代相传的英歌记忆，等待着青年学子探寻非遗脉络。

抵达村落之后，新坛英歌队负责人陈松林老师热情迎接队员们，并围绕新坛英歌舞的历史渊源、传承现状与发展历程展开细致讲解。为帮助大家更加直观地感受英歌舞的岁月变迁，陈老师向突击队展示了珍贵的老纪录片《英雄的舞蹈》。透过荧幕，队员们得以认识老一辈英歌传承者陈炳章、陈进勇，也了解到如今英歌队教练陈夏杰的坚守与创新，一代代传承人接续接力，让英歌锣鼓声生生不息。

讲解结束后，陈老师带领突击队参观英歌文化陈列室。屋内整齐陈列着满满一墙奖状、奖杯与牌匾，每一件荣誉背后，都是新坛英歌数十年深耕不辍的见证。谈起这些荣誉背后的故事、一场场演出的过往，陈老师娓娓道来，言语间难掩对本土英歌文化的自豪与热忱，也让队员们真切感受到扎根乡土的非遗力量。`,
    },
  ],
  footer: {
    authors: '梁永治、石凯',
    editors: '付春昊、石凯',
    firstReview: '胡博',
    secondReview: '陈若北',
    finalReview: '黄子响',
  },
};

const heritageChallenges = [
  {
    icon: Users,
    title: '传承人极度稀缺，断层危机严峻',
    description: '普宁全市英歌项目各级传承人仅10人，其中国家级1人、省级2人。面对全市103支英歌队的传承需求，传承人数量严重不足，且老龄化趋势明显，"人走技失"风险持续加剧。',
    impact: '传承后继乏人',
    statNumber: '仅10人',
    statLabel: '全市各级传承人',
    source: '澎湃新闻·春节话非遗',
    sourceUrl: 'https://m.thepaper.cn/newsDetail_forward_30090799',
  },
  {
    icon: BookOpen,
    title: '口传心授模式，传承效率低下',
    description: '英歌舞传统传承依赖"口传心授"，老一辈艺人用潮汕方言口诀教学，从发力技巧到队形变化全靠面对面示范。这种方式学习周期长、地域限制大、难以规模化复制，导致传播范围受限。',
    impact: '传承难以规模化',
    statNumber: '口传心授',
    statLabel: '传统传承方式',
    source: '新媒体时代非物质文化遗产的推广策略研究',
    sourceUrl: 'https://m.renrendoc.com/paper/479091659.html',
  },
  {
    icon: MapPin,
    title: '地域壁垒森严，受众认知浅层',
    description: '《非物质文化遗产公众知晓度与参与度调查报告》显示，仅四成受访者表示较为了解非遗，超七成停留在"听过"层面。英歌舞传统传播依赖线下演出，受地域限制严重，外地受众难以系统接触其文化内涵。',
    impact: '传播范围受限',
    statNumber: '仅40%',
    statLabel: '受访者较了解非遗',
    source: '非物质文化遗产公众知晓度与参与度调查报告(2022)',
    sourceUrl: 'http://m.toutiao.com/group/7130511499709121027/',
  },
];

const digitalSolutions = [
  {
    icon: BookOpen,
    title: '系统化知识图谱',
    description: '将英歌历史、动作、脸谱、装备等知识结构化呈现，破解短视频碎片化传播的局限，让用户系统理解英歌文化全貌。',
    feature: '破解碎片化传播',
    color: 'from-yingge-red to-red-700',
    link: '/about',
  },
  {
    icon: Bot,
    title: 'AI智能导游',
    description: '基于大模型的24小时智能问答，降低学习门槛，解决年轻人有兴趣但缺引导渠道的痛点，随时解答英歌疑问。',
    feature: '降低学习门槛',
    color: 'from-purple-600 to-indigo-700',
    link: '/guide',
  },
  {
    icon: Image,
    title: '高清脸谱图鉴',
    description: '数字化保存珍贵脸谱图像并深度解读寓意，弥补短视频重视觉、轻内涵的不足，让用户读懂脸谱背后的文化密码。',
    feature: '深挖文化内涵',
    color: 'from-amber-600 to-orange-700',
    link: '/mask-diy',
  },
  {
    icon: Video,
    title: '动作图谱可视化',
    description: '将传统英歌招式拆解呈现，配以图文说明，解决线下教学资源稀缺的问题，让更多人可以在线学习英歌动作。',
    feature: '线上学习渠道',
    color: 'from-emerald-600 to-teal-700',
    link: '/actions',
  },
  {
    icon: Globe,
    title: '轻量化数字平台',
    description: 'H5网页形式，无需下载，随时随地访问，打破地域和时间限制，让英歌文化触达更广泛的年轻群体。',
    feature: '打破时空限制',
    color: 'from-blue-600 to-cyan-700',
    link: '/about',
  },
  {
    icon: Sparkles,
    title: '沉浸式交互体验',
    description: '精美视觉设计与流畅动效，结合可交互的脸谱DIY等玩法，改变传统图文展示的单一体验，让非遗变得好玩有趣。',
    feature: '丰富互动体验',
    color: 'from-pink-600 to-rose-700',
    link: '/mask-diy',
  },
];

const iconMap: Record<string, any> = {
  TrendingDown,
  Users,
  AlertTriangle,
  BookOpen,
  Bot,
  Image,
  Video,
  Globe,
  Sparkles,
  Lightbulb,
  MapPin,
};

export function Home() {
  const navigate = useNavigate();
  const { data: homeData, loading } = useFetchData<HomeData>('/home');
  const { data: wechatArticles } = useFetchData<any[]>('/wechat');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{ src: string; title: string } | null>(null);
  const [broken, setBroken] = useState(false);
  const [showBreakHint, setShowBreakHint] = useState(false);
  const [visibleNoticeCount, setVisibleNoticeCount] = useState(3);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const challengeSectionRef = useRef<HTMLDivElement>(null);
  const autoBreakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const challenges = homeData?.challenges || heritageChallenges;
  const solutions = homeData?.solutions || digitalSolutions;
  const currentBanner = bannerItems[currentSlide];

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const videoEl = videoSectionRef.current;
      if (!videoEl) return;
      const headerHeight = 60;
      const itemHeight = 54;
      const videoHeight = videoEl.offsetHeight;
      const available = videoHeight - headerHeight;
      const count = Math.max(2, Math.floor(available / itemHeight));
      setVisibleNoticeCount(count);
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    const observer = new ResizeObserver(updateCount);
    if (videoSectionRef.current) observer.observe(videoSectionRef.current);
    return () => {
      window.removeEventListener('resize', updateCount);
      observer.disconnect();
    };
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

  useEffect(() => {
    const section = challengeSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !broken) {
            hintTimerRef.current = setTimeout(() => {
              setShowBreakHint(true);
            }, 2000);

            autoBreakTimerRef.current = setTimeout(() => {
              if (!broken) {
                setBroken(true);
              }
            }, 10000);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (autoBreakTimerRef.current) clearTimeout(autoBreakTimerRef.current);
    };
  }, [broken]);

  const handleBreak = () => {
    if (broken) return;
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    if (autoBreakTimerRef.current) clearTimeout(autoBreakTimerRef.current);
    setBroken(true);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
  };

  const openVideo = (src: string, title: string) => {
    setCurrentVideo({ src, title });
    setShowVideoModal(true);
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
        {/* React Bits: Strands 流动光带背景 */}
        <Strands
          colors={['#B22222', '#C8A060', '#8B0000', '#2F4F4F']}
          count={4}
          speed={0.3}
          amplitude={0.8}
          intensity={0.4}
          opacity={0.5}
          scale={2}
        />
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
              {currentBanner.type === 'image' ? (
                <img
                  src={currentBanner.src}
                  alt={`轮播图${currentSlide + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img
                    src={currentBanner.poster}
                    alt={currentBanner.title || `视频${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.button
                    onClick={() => openVideo(currentBanner.src, currentBanner.title || '')}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center z-10 group"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-yingge-red/90 flex items-center justify-center group-hover:bg-yingge-red transition-colors">
                      <Play size={28} className="text-white ml-1" fill="white" />
                    </div>
                  </motion.button>
                  <div className="absolute bottom-8 left-8 z-10">
                    <span className="px-3 py-1 bg-yingge-red/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                      视频
                    </span>
                    <p className="text-white font-serif text-lg md:text-xl mt-2">
                      {currentBanner.title}
                    </p>
                  </div>
                </>
              )}
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
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-6 left-1/2 flex space-x-3 z-20"
          >
            {bannerItems.map((_, index) => (
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

      <section id="teams" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader title="闯·舞阵" subtitle="YINGGE DANCE TEAMS" align="center" variant="dark" showIcon={false} />

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

      <section id="show" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-yingge-gray to-transparent pointer-events-none" />
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
              <div className="mb-6">
                <SectionHeader title="英歌展演" align="left" variant="dark" showIcon={false} />
              </div>

              <FadeInLeft>
                <div ref={videoSectionRef}>
                <motion.div
                  onClick={() => openVideo('/videos/yingge-promo-1.mp4', '英歌舞精彩表演集锦')}
                  className="relative overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src="/images/video-thumbnails/yingge-promo-1.png"
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
                </div>
              </FadeInLeft>
            </div>

            <div id="notice">
              <FadeInRight delay={0.2}>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-2xl md:text-3xl text-yingge-dark tracking-widest">通知公告</h2>
                    <div className="w-16 h-0.5 bg-yingge-gold mt-2" />
                  </div>
                  {wechatArticles && wechatArticles.length > 0 && (
                    <button
                      onClick={() => navigate('/notices')}
                      className="px-3 py-1 text-xs border border-yingge-dark/20 rounded-full text-yingge-dark/60 hover:text-yingge-red hover:border-yingge-red transition-colors"
                    >
                      更多+
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  {wechatArticles && wechatArticles.length > 0 ? (
                    <StaggerList direction="up">
                      {wechatArticles.slice(0, visibleNoticeCount).map((article) => {
                        const d = new Date(article.published_at);
                        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        return (
                          <motion.li
                            key={article.id}
                            className="group cursor-pointer flex items-center gap-4 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-yingge-gold/5 transition-colors"
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            onClick={() => {
                              if (confirm('将跳转到微信公众号查看原文，是否继续？')) {
                                window.open(article.wechat_url, '_blank');
                              }
                            }}
                          >
                            <span className="flex-shrink-0 text-xs font-bold text-yingge-red w-20">{dateStr}</span>
                            <span className="text-sm text-yingge-dark font-medium leading-snug group-hover:text-yingge-red transition-colors line-clamp-1 flex-1">
                              {article.title}
                            </span>
                            {!!article.is_top && (
                              <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 bg-yingge-gold/20 text-yingge-gold font-bold rounded">
                                置顶
                              </span>
                            )}
                          </motion.li>
                        );
                      })}
                    </StaggerList>
                  ) : (
                    <div className="py-8 text-center text-yingge-dark/40 text-sm">
                      <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      暂无公告内容
                    </div>
                  )}
                </div>
              </FadeInRight>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-yingge-gray to-transparent pointer-events-none" />
      </section>

      <section id="formations" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader title="识·阵法" subtitle="YINGGE FORMATIONS" align="center" variant="dark" showIcon={false} />

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

      <section id="creative" className="py-20 px-4 bg-yingge-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-yingge-gray to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q35 0 40 5 Q45 10 40 15 Q35 20 30 15 Q25 10 30 5' fill='none' stroke='%23C8A060' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeader title="取·神器" subtitle="CULTURAL CREATIONS" align="center" variant="light" showIcon={false} />

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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
      </section>

      {/* 交互式文创海报 */}
      <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-white"><div className="w-10 h-10 rounded-full border-2 border-yingge-gold/20 border-t-yingge-gold animate-spin" /></div>}>
        <InteractivePoster />
      </Suspense>

      <section id="practice" className="py-20 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #FBF0F0 85%, #FBF0F0 100%)',
        }}
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeader title="行·足迹" subtitle="PRACTICE JOURNAL" align="center" variant="dark" showIcon={false} />

          <FadeInUp>
            {wechatArticles && wechatArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                {wechatArticles.slice(0, 4).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{
                      delay: index * 0.08,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    onClick={() => {
                      if (confirm('将跳转到微信公众号查看原文，是否继续？')) {
                        window.location.href = article.wechat_url;
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <BorderGlow
                      glowIntensity={0.35}
                      borderColor="rgba(200, 160, 96, 0.15)"
                      glowColor="#C8A060"
                      borderRadius={16}
                      className="h-full"
                    >
                      <div className="group relative bg-white rounded-[16px] overflow-hidden flex flex-col h-full">
                        {/* 缩略图区域 */}
                        <div className="relative h-40 sm:h-44 overflow-hidden flex-shrink-0">
                          <motion.img
                            src={article.thumbnail_url || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20team%20red%20costumes%20heroic%20spirit%20cultural%20heritage%20documentary%20style&image_size=landscape_16_9'}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          {!!article.is_top && (
                            <div className="absolute top-3 left-3 px-2.5 py-1 bg-yingge-gold text-yingge-dark text-xs font-bold rounded-full">
                              置顶
                            </div>
                          )}
                          {/* 公众号名称叠加在图片上 */}
                          <div className="absolute bottom-3 left-4 flex items-center text-white/90 text-sm">
                            <Newspaper size={13} className="mr-1.5" />
                            {article.wechat_account}
                          </div>
                        </div>
                        {/* 内容区域 */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1">
                          <h3 className="font-serif font-bold text-base sm:text-lg text-yingge-dark leading-snug mb-2 line-clamp-2 group-hover:text-yingge-red transition-colors duration-300">
                            {article.title}
                          </h3>
                          <p className="text-yingge-dark/55 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
                            {article.summary || '点击查看公众号原文'}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-yingge-dark/5">
                            <div className="flex items-center text-yingge-dark/40 text-xs">
                              <Calendar size={12} className="mr-1.5" />
                              {formatDate(article.published_at)}
                            </div>
                            <div className="flex items-center text-yingge-red text-xs font-medium group-hover:gap-1.5 transition-all">
                              <span>阅读全文</span>
                              <ArrowRight size={12} className="ml-1" />
                            </div>
                          </div>
                        </div>
                        {/* 底部金红渐变条 */}
                        <div className="h-0.5 bg-gradient-to-r from-yingge-gold via-yingge-red to-yingge-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </BorderGlow>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-yingge-gray rounded-full flex items-center justify-center">
                  <Newspaper size={24} className="text-yingge-dark/30" />
                </div>
                <p className="text-yingge-dark/50 text-sm">暂无公众号文章</p>
              </div>
            )}
          </FadeInUp>
        </div>

      </section>

      <Suspense fallback={<div className="h-[600px] flex items-center justify-center bg-yingge-dark"><div className="w-10 h-10 rounded-full border-2 border-yingge-gold/20 border-t-yingge-gold animate-spin" /></div>}>
        <MascotAndCreative mode="featured" />
      </Suspense>

      <section id="challenge" ref={challengeSectionRef} className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!broken ? (
            <motion.div
              key="challenges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="py-16 md:py-20 px-4 relative"
              style={{
                background: 'linear-gradient(180deg, #F3D9D9 0%, #E8B8B8 10%, #8B3A3A 25%, #2C2C2C 50%, #2C2C2C 100%)',
              }}
            >
              <div className="container mx-auto max-w-6xl relative z-10">
                <div className="mb-6">
                  <SectionHeader title="困·境" subtitle="HERITAGE CHALLENGES" align="center" variant="light" showIcon={false} />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center text-white/60 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed"
                >
                  作为国家级非物质文化遗产，英歌舞虽获殊荣，却面临着传承断层的严峻挑战。
                  年轻受众断层、数字化传播薄弱、文化内涵普及不足等问题亟待解决。
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {challenges.map((challenge, index) => {
                    const Icon = iconMap[challenge.icon] || AlertTriangle;
                    return (
                      <motion.div
                        key={challenge.title}
                        initial={{ opacity: 0, y: 60, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.15,
                          duration: 0.7,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="group"
                      >
                        <BorderGlow
                          glowIntensity={0.4}
                          borderColor="rgba(200, 160, 96, 0.2)"
                          glowColor="#C8A060"
                          borderRadius={24}
                          className="h-full"
                        >
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 h-full hover:bg-white/[0.08] transition-all duration-500 flex flex-col relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-yingge-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yingge-red/20 transition-colors duration-700" />

                          <div className="relative z-10 flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-6">
                              <motion.div
                                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yingge-red/30 to-yingge-gold/20 flex items-center justify-center group-hover:from-yingge-red/40 group-hover:to-yingge-gold/30 transition-all duration-500 shadow-lg"
                                whileHover={{ rotate: [0, -6, 6, 0], scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Icon size={30} className="text-yingge-gold" />
                              </motion.div>
                              <div className="text-right">
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-yingge-gold to-amber-400 bg-clip-text text-transparent">
                                  {challenge.statNumber}
                                </div>
                                <div className="text-[10px] text-white/40 mt-0.5">
                                  {challenge.statLabel}
                                </div>
                              </div>
                            </div>

                            <h3 className="font-serif font-bold text-xl text-white mb-4 group-hover:text-yingge-gold transition-colors duration-300">{challenge.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed flex-1">{challenge.description}</p>

                            <div className="mt-6 pt-4 border-t border-white/10">
                              <a
                                href={challenge.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs text-white/40 hover:text-yingge-gold transition-colors group/link"
                              >
                                <span className="truncate mr-1">数据来源：{challenge.source}</span>
                                <ExternalLink size={12} className="flex-shrink-0 group-hover/link:translate-x-0.5 transition-transform" />
                              </a>
                            </div>
                          </div>
                        </div>
                        </BorderGlow>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-12 md:mt-16 text-center relative"
                >
                  <motion.div
                    onClick={handleBreak}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-yingge-red via-red-600 to-yingge-red text-white font-bold rounded-full cursor-pointer shadow-xl hover:shadow-red-500/40 transition-all text-base tracking-widest relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      破&nbsp;·&nbsp;局
                      <ArrowRight size={18} className="ml-2" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {showBreakHint && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 flex flex-col items-center"
                      >
                        <motion.p
                          className="text-yingge-gold/80 text-sm mb-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          点击按钮，打破困境
                        </motion.p>
                        <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yingge-gold/60">
                            <path d="M12 4L12 16M12 16L6 10M12 16L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yingge-red to-transparent pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div
              key="solutions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              id="innovation"
              className="py-16 md:py-20 px-4 relative"
              style={{
                background: 'linear-gradient(180deg, #F3D9D9 0%, #F5E0E0 15%, #F7EEEE 30%, #f5f5f5 50%, #f5f5f5 100%)',
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(178,34,34,0.6) 0%, rgba(178,34,34,0.2) 50%, transparent 100%)',
                }}
              />

              <div className="container mx-auto max-w-6xl relative z-10">
                <div className="mb-6">
                  <SectionHeader title="破·局" subtitle="DIGITAL INNOVATION" align="center" variant="dark" showIcon={false} />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-center text-yingge-dark/60 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed"
                >
                  针对碎片化传播、学习渠道缺失、体验单一等痛点，
                  我们以数字技术赋能传统文化，打造轻量化英歌数字展示平台。
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {solutions.map((solution, index) => {
                    const Icon = iconMap[solution.icon] || Lightbulb;
                    return (
                      <motion.div
                        key={solution.title}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.7 + index * 0.08,
                          duration: 0.6,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        whileHover={{ y: -8, scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => solution.link && navigate(solution.link)}
                        className="group cursor-pointer"
                      >
                        <div className="bg-white rounded-2xl p-6 h-full shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-yingge-gold/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2" style={{ background: solution.color.includes('red') ? '#dc2626' : solution.color.includes('purple') ? '#7c3aed' : solution.color.includes('amber') ? '#d97706' : solution.color.includes('emerald') ? '#059669' : solution.color.includes('blue') ? '#2563eb' : '#db2777' }} />

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center mb-4">
                              <motion.div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center shadow-md`}
                                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Icon size={22} className="text-white" />
                              </motion.div>
                              <span className="ml-auto text-xs font-medium bg-yingge-gray text-yingge-dark/60 px-3 py-1 rounded-full">
                                {solution.feature}
                              </span>
                            </div>

                            <h3 className="font-serif font-bold text-lg text-yingge-dark mb-2 group-hover:text-yingge-red transition-colors">
                              {solution.title}
                            </h3>
                            <p className="text-sm text-yingge-dark/60 leading-relaxed flex-1">
                              {solution.description}
                            </p>

                            <div className="mt-4 pt-4 border-t border-yingge-gray/60 flex items-center justify-between">
                              <span className="text-xs text-yingge-dark/40">
                                点击体验
                              </span>
                              <motion.div
                                className="flex items-center text-yingge-red text-sm font-medium"
                                whileHover={{ x: 4 }}
                              >
                                <span>进入</span>
                                <ArrowRight size={14} className="ml-1" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  className="mt-10 md:mt-12 text-center"
                >
                  <motion.div
                    onClick={() => navigate('/guide')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yingge-red to-red-700 text-white font-medium rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Sparkles size={18} className="mr-2" />
                    体验 AI 导游
                    <ArrowRight size={18} className="ml-2" />
                  </motion.div>
                  <p className="text-yingge-dark/40 text-xs mt-4">
                    立即与智能导游对话，探索英歌文化的奥秘
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {broken && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 3],
                  opacity: [0, 0.8, 0],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(200,160,96,0.4) 30%, transparent 70%)',
                }}
              />

              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.3;
                const distance = 40 + Math.random() * 50;
                const size = 60 + Math.random() * 120;
                const shape = i % 3;
                return (
                  <motion.div
                    key={i}
                    initial={{
                      x: '50%',
                      y: '50%',
                      opacity: 0,
                      scale: 0,
                      rotate: 0,
                    }}
                    animate={{
                      x: `calc(50% + ${Math.cos(angle) * distance}%)`,
                      y: `calc(50% + ${Math.sin(angle) * distance}%)`,
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.2, 1, 0.8],
                      rotate: Math.random() * 540 - 270,
                    }}
                    transition={{
                      duration: 0.9 + Math.random() * 0.4,
                      delay: 0.05 + i * 0.015,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: `${size}px`,
                      height: `${size * (0.6 + Math.random() * 0.6)}px`,
                      background: shape === 0
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200,160,96,0.6) 50%, rgba(255,255,255,0.3) 100%)'
                        : shape === 1
                        ? 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%)'
                        : 'linear-gradient(90deg, rgba(200,160,96,0.5) 0%, rgba(255,255,255,0.9) 50%, rgba(200,160,96,0.5) 100%)',
                      clipPath: shape === 0
                        ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                        : shape === 1
                        ? 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
                        : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      filter: 'drop-shadow(0 4px 12px rgba(200,160,96,0.4))',
                    }}
                  />
                );
              })}

              {[...Array(50)].map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 70;
                return (
                  <motion.div
                    key={`shard-${i}`}
                    initial={{
                      x: '50vw',
                      y: '50vh',
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      x: `calc(50vw + ${Math.cos(angle) * distance}vw)`,
                      y: `calc(50vh + ${Math.sin(angle) * distance}vh)`,
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0],
                      rotate: Math.random() * 1080 - 540,
                    }}
                    transition={{
                      duration: 0.8 + Math.random() * 0.8,
                      delay: 0.08 + Math.random() * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute"
                    style={{
                      width: `${3 + Math.random() * 10}px`,
                      height: `${3 + Math.random() * 10}px`,
                      background: i % 4 === 0 ? '#C8A060' : i % 4 === 1 ? '#fff' : '#f0dca0',
                      borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '50% 0 50% 0',
                      boxShadow: '0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(200,160,96,0.5)',
                    }}
                  />
                );
              })}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.1, 1.05, 1.2],
                }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="absolute inset-0 bg-white"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at center, rgba(200,160,96,0.8) 0%, transparent 60%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="py-12 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #B22222 0%, #8B0000 100%)',
        }}
      >
        {/* CSS 装饰背景，替代 Strands 以节省 GPU 性能 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C8A060 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 50%)`,
        }} />

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

      <AnimatePresence>
        {showVideoModal && currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowVideoModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-12 right-0 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-yingge-red transition-colors"
              >
                <X size={22} className="text-white" />
              </motion.button>

              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <video
                    src={currentVideo.src}
                    autoPlay
                    controls
                    className="absolute inset-0 w-full h-full"
                    playsInline
                  />
                </div>
                <div className="p-6 bg-gradient-to-r from-yingge-dark to-yingge-dark/90">
                  <h3 className="font-serif font-bold text-xl text-white">
                    {currentVideo.title}
                  </h3>
                  <p className="text-white/50 text-sm mt-2">
                    英歌舞文化推广视频
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
