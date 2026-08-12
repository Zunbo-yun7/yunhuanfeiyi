import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, CornerDownLeft, Bot, FileText, BookOpen, Tag } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Emblem3D } from './Emblem3D';
import { ShinyText } from '@/components/reactbits';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

interface SearchableItem {
  id: string;
  label: string;
  path: string;
  sectionId?: string;
  parent: string;
  keywords: string[];
  description: string;
  type: 'page' | 'section';
}

const searchableItems: SearchableItem[] = [
  { id: 'home', label: '网站首页', path: '/', parent: '', keywords: ['首页', '主页', 'home', '网站', '首页概览'], description: '平台首页，展示英歌文化全貌', type: 'page' },
  { id: 'about', label: '认识英歌', path: '/about', parent: '', keywords: ['认识', '英歌', '历史', '起源', '流派', 'about', '简介', '文化'], description: '了解英歌舞的历史渊源与流派', type: 'page' },
  { id: 'xintan', label: '新坛英歌', path: '/xintan', parent: '', keywords: ['新坛', '普宁', '队伍', 'xintan', '英歌队'], description: '新坛英歌队介绍与传承故事', type: 'page' },
  { id: 'actions', label: '动作图谱', path: '/actions', parent: '', keywords: ['动作', '图谱', '招式', '阵法', 'actions', '动作图解'], description: '英歌舞经典动作与阵法图解', type: 'page' },
  { id: 'equipment', label: '脸谱装备', path: '/equipment', parent: '', keywords: ['脸谱', '装备', '服饰', '道具', 'equipment', '脸谱色彩'], description: '英歌舞脸谱色彩与装备详解', type: 'page' },
  { id: 'creative', label: '文创周边', path: '/creative', parent: '', keywords: ['文创', '周边', '吉祥物', 'AR', 'creative', '文创产品'], description: '吉祥物展示、AR体验与文创产品', type: 'page' },
  { id: 'mask-diy', label: '脸谱DIY', path: '/mask-diy', parent: '', keywords: ['脸谱', 'DIY', '设计', '创作', 'mask', '在线设计'], description: '在线DIY专属英歌脸谱', type: 'page' },
  { id: 'schedule', label: '演出时间表', path: '/schedule', parent: '', keywords: ['演出', '时间', 'schedule', '表演', '排期', '日历'], description: '英歌舞演出排期与地点', type: 'page' },
  { id: 'stories', label: '人物故事', path: '/stories', parent: '', keywords: ['人物', '故事', '传承人', '人物故事', 'stories'], description: '英歌传承人的坚守故事', type: 'page' },
  { id: 'logs', label: '实践日志', path: '/logs', parent: '', keywords: ['实践', '日志', '三下乡', '调研', 'logs'], description: '团队三下乡实践记录', type: 'page' },
  { id: 'guide', label: 'AI导游', path: '/guide', parent: '', keywords: ['AI', '导游', '问答', '智能', '机器人', 'guide', 'AI问答'], description: 'AI智能问答，随时解答英歌疑问', type: 'page' },

  { id: 'about-intro', label: '文化简介', path: '/about', sectionId: 'intro', parent: '认识英歌', keywords: ['简介', '文化', '英歌简介', '概述', '介绍'], description: '英歌舞的文化内涵与基本介绍', type: 'section' },
  { id: 'about-history', label: '发展历史', path: '/about', sectionId: 'history', parent: '认识英歌', keywords: ['历史', '起源', '发展', '演变', '朝代', '明代', '清代', '民国', '现代', '起源时间'], description: '从明代起源到现代的英歌发展史', type: 'section' },
  { id: 'about-history-ming', label: '明代起源', path: '/about', sectionId: 'history-ming', parent: '认识英歌', keywords: ['明代', '起源', '广东', '普宁', '400年', '源头'], description: '英歌舞起源于广东普宁，距今约400年历史', type: 'section' },
  { id: 'about-history-qing', label: '清代传播', path: '/about', sectionId: 'history-qing', parent: '认识英歌', keywords: ['清代', '传播', '潮汕', '流派', '发展期'], description: '英歌舞在潮汕地区广泛传播，形成多个流派', type: 'section' },
  { id: 'about-history-minguo', label: '民国鼎盛', path: '/about', sectionId: 'history-minguo', parent: '认识英歌', keywords: ['民国', '鼎盛', '民俗', '活动', '兴盛'], description: '英歌舞发展鼎盛，成为潮汕地区重要的民俗活动', type: 'section' },
  { id: 'about-history-modern', label: '现代传承', path: '/about', sectionId: 'history-modern', parent: '认识英歌', keywords: ['现代', '非遗', '国家级', '传承', '保护', '2006'], description: '英歌舞被列入国家级非物质文化遗产名录', type: 'section' },
  { id: 'about-art', label: '艺术特色', path: '/about', sectionId: 'art', parent: '认识英歌', keywords: ['艺术', '特色', '风格', '表演', '形式', '唱腔'], description: '英歌舞的艺术风格与表演特色', type: 'section' },
  { id: 'about-schools', label: '流派分支', path: '/about', sectionId: 'schools', parent: '认识英歌', keywords: ['流派', '分支', '英歌流派', '普宁', '潮阳'], description: '英歌舞的主要流派与分支', type: 'section' },
  { id: 'about-value', label: '文化价值', path: '/about', sectionId: 'value', parent: '认识英歌', keywords: ['价值', '文化', '意义', '遗产', '传承价值'], description: '英歌舞的文化价值与传承意义', type: 'section' },

  { id: 'xintan-team', label: '队伍介绍', path: '/xintan', sectionId: 'team', parent: '新坛英歌', keywords: ['队伍', '新坛队', '英歌队', '团队', '阵容'], description: '新坛英歌队的基本信息与团队介绍', type: 'section' },
  { id: 'xintan-inheritance', label: '传承故事', path: '/xintan', sectionId: 'inheritance', parent: '新坛英歌', keywords: ['传承', '故事', '传承人', '世代', '坚守', '传承故事'], description: '新坛英歌队的世代传承故事', type: 'section' },
  { id: 'xintan-repertoire', label: '经典曲目', path: '/xintan', sectionId: 'repertoire', parent: '新坛英歌', keywords: ['曲目', '经典', '表演', '节目单', '传统曲目'], description: '新坛英歌队的经典表演曲目', type: 'section' },
  { id: 'xintan-members', label: '队伍阵容', path: '/xintan', sectionId: 'members', parent: '新坛英歌', keywords: ['阵容', '成员', '队员', '角色', '表演阵容'], description: '新坛英歌队的成员阵容与角色', type: 'section' },
  { id: 'xintan-honors', label: '荣誉成果', path: '/xintan', sectionId: 'honors', parent: '新坛英歌', keywords: ['荣誉', '成果', '奖项', '获奖', '成就'], description: '新坛英歌队获得的荣誉与成果', type: 'section' },

  { id: 'actions-classic', label: '经典动作', path: '/actions', sectionId: 'classic', parent: '动作图谱', keywords: ['动作', '经典', '招式', '步伐', '手势', '动作图谱'], description: '英歌舞的经典动作与招式图解', type: 'section' },
  { id: 'actions-formation', label: '阵法图解', path: '/actions', sectionId: 'formation', parent: '动作图谱', keywords: ['阵法', '阵型', '布局', '图解', '阵法图谱'], description: '英歌舞的阵法与阵型图解', type: 'section' },

  { id: 'equip-mask', label: '脸谱色彩', path: '/equipment', sectionId: 'mask', parent: '脸谱装备', keywords: ['脸谱', '色彩', '颜色', '脸谱颜色', '脸谱样式'], description: '英歌舞脸谱的色彩搭配与含义', type: 'section' },
  { id: 'equip-costume', label: '装备详解', path: '/equipment', sectionId: 'costume', parent: '脸谱装备', keywords: ['装备', '服饰', '道具', '服装', '装备介绍'], description: '英歌舞的服饰装备与道具详解', type: 'section' },

  { id: 'creative-mascot', label: '3D吉祥物', path: '/creative', sectionId: 'mascot', parent: '文创周边', keywords: ['吉祥物', '3D', '英歌小将', 'IP', '形象'], description: '英歌小将3D吉祥物展示', type: 'section' },
  { id: 'creative-ar', label: 'AR体验', path: '/creative', sectionId: 'ar', parent: '文创周边', keywords: ['AR', '增强现实', '体验', 'Kivicube', 'AR体验'], description: 'AR文创体验，让吉祥物走进现实', type: 'section' },
  { id: 'creative-products', label: '文创产品', path: '/creative', sectionId: 'products', parent: '文创周边', keywords: ['文创', '产品', '周边', '商品', '纪念品'], description: '英歌主题文创产品展示', type: 'section' },

  { id: 'mask-color', label: '选择颜色', path: '/mask-diy', sectionId: 'color', parent: '脸谱DIY', keywords: ['颜色', '色彩', '调色', '配色', '选择颜色'], description: '为DIY脸谱选择色彩', type: 'section' },
  { id: 'mask-pattern', label: '花纹样式', path: '/mask-diy', sectionId: 'pattern', parent: '脸谱DIY', keywords: ['花纹', '样式', '图案', '纹饰', '花纹样式'], description: '选择脸谱的花纹与样式', type: 'section' },
  { id: 'mask-region', label: '脸谱区域', path: '/mask-diy', sectionId: 'region', parent: '脸谱DIY', keywords: ['区域', '脸谱区域', '部位', '区域划分'], description: '脸谱的各个装饰区域', type: 'section' },
  { id: 'mask-classic', label: '经典谱式', path: '/mask-diy', sectionId: 'classic', parent: '脸谱DIY', keywords: ['经典', '谱式', '模板', '传统', '经典谱式'], description: '英歌舞的经典脸谱谱式', type: 'section' },
  { id: 'mask-3d', label: '3D预览', path: '/mask-diy', sectionId: 'preview', parent: '脸谱DIY', keywords: ['3D', '预览', '立体', '效果', '3D预览'], description: 'DIY脸谱的3D预览效果', type: 'section' },

  { id: 'schedule-timeline', label: '演出时间线', path: '/schedule', sectionId: 'timeline', parent: '演出时间表', keywords: ['时间线', '演出时间', '近期演出', '演出排期'], description: '横向展示的演出时间线视图', type: 'section' },
  { id: 'schedule-calendar', label: '演出日历', path: '/schedule', sectionId: 'calendar', parent: '演出时间表', keywords: ['日历', '演出日历', '日期', '月份', '日历视图'], description: '以日历形式展示演出安排', type: 'section' },

  { id: 'stories-people', label: '传承人故事', path: '/stories', sectionId: 'people', parent: '人物故事', keywords: ['传承人', '故事', '人物', '大师', '传承人故事'], description: '英歌传承人的个人故事与经历', type: 'section' },

  { id: 'logs-practice', label: '三下乡日志', path: '/logs', sectionId: 'practice', parent: '实践日志', keywords: ['三下乡', '实践', '日志', '调研', '记录'], description: '三下乡社会实践的日志记录', type: 'section' },

  { id: 'home-teams', label: '闯·舞阵', path: '/', sectionId: 'teams', parent: '网站首页', keywords: ['舞阵', '队伍', '英歌队', '闯舞阵', '首页队伍'], description: '首页英歌队伍展示板块', type: 'section' },
  { id: 'home-show', label: '英歌展演', path: '/', sectionId: 'show', parent: '网站首页', keywords: ['展演', '表演', '演出', '视频', '英歌展演'], description: '首页英歌展演视频板块', type: 'section' },
  { id: 'home-notice', label: '通知公告', path: '/', sectionId: 'notice', parent: '网站首页', keywords: ['通知', '公告', '新闻', '动态', '通知公告'], description: '首页通知公告板块', type: 'section' },
  { id: 'home-formations', label: '识·阵法', path: '/', sectionId: 'formations', parent: '网站首页', keywords: ['阵法', '阵型', '识阵法', '阵法展示'], description: '首页阵法展示板块', type: 'section' },
  { id: 'home-creative', label: '取·神器', path: '/', sectionId: 'creative', parent: '网站首页', keywords: ['神器', '文创', '吉祥物', '取神器'], description: '首页文创神器展示板块', type: 'section' },
  { id: 'home-practice', label: '行·足迹', path: '/', sectionId: 'practice', parent: '网站首页', keywords: ['足迹', '实践', '行足迹', '足迹展示'], description: '首页实践足迹板块', type: 'section' },
  { id: 'home-challenge', label: '困·境', path: '/', sectionId: 'challenge', parent: '网站首页', keywords: ['困境', '挑战', '传承困境', '困难', '现状'], description: '首页展示传承困境板块', type: 'section' },
  { id: 'home-innovation', label: '破·局', path: '/', sectionId: 'innovation', parent: '网站首页', keywords: ['破局', '创新', '数字化', '解决方案', '破局之道'], description: '首页数字化创新方案板块', type: 'section' },
];

export function Navbar({ title, subtitle }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navButtonsRef = useRef<HTMLButtonElement[]>([]);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = useMemo(() => {
    return (query: string): SearchableItem[] => {
      if (!query.trim()) return [];
      const q = query.toLowerCase().trim();
      const results: SearchableItem[] = [];
      const seen = new Set<string>();

      for (const item of searchableItems) {
        const labelMatch = item.label.toLowerCase().includes(q);
        const keywordMatch = item.keywords.some((kw) => kw.toLowerCase().includes(q));
        const descMatch = item.description.toLowerCase().includes(q);
        const idMatch = item.id.toLowerCase().includes(q);

        if ((labelMatch || keywordMatch || descMatch || idMatch) && !seen.has(item.id)) {
          seen.add(item.id);
          results.push(item);
        }
      }

      results.sort((a, b) => {
        const aLabelMatch = a.label.toLowerCase().includes(q) ? 0 : 1;
        const bLabelMatch = b.label.toLowerCase().includes(q) ? 0 : 1;
        if (aLabelMatch !== bLabelMatch) return aLabelMatch - bLabelMatch;

        const aTypeOrder = a.type === 'page' ? 0 : 1;
        const bTypeOrder = b.type === 'page' ? 0 : 1;
        if (aTypeOrder !== bTypeOrder) return aTypeOrder - bTypeOrder;

        const aKeywordMatch = a.keywords.some((kw) => kw.toLowerCase() === q) ? 0 : 1;
        const bKeywordMatch = b.keywords.some((kw) => kw.toLowerCase() === q) ? 0 : 1;
        return aKeywordMatch - bKeywordMatch;
      });

      return results;
    };
  }, []);

  useEffect(() => {
    const results = performSearch(searchQuery);
    setSearchResults(results);
    setActiveResultIndex(0);
  }, [searchQuery, performSearch]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setActiveResultIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResultIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleSelectResult(searchResults[activeResultIndex]);
      } else if (searchQuery.trim()) {
        navigate('/guide');
        setIsSearchFocused(false);
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSelectResult = (item: SearchableItem) => {
    if (item.sectionId) {
      navigate(`${item.path}#${item.sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(item.sectionId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('search-highlight');
          setTimeout(() => el.classList.remove('search-highlight'), 2000);
        }
      }, 300);
    } else {
      navigate(item.path);
    }
    setIsSearchFocused(false);
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  const handleNavClick = (path: string) => {
    const buttonIndex = navItems.findIndex(item => item.path === path);
    const button = navButtonsRef.current[buttonIndex];
    if (button) {
      setActiveButton(path);
      setTimeout(() => setActiveButton(null), 300);
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  const navItems = searchableItems
    .filter((i) => i.type === 'page')
    .map(({ id, label, path }) => ({ id, label, path }));

  const showDropdown = isSearchFocused;
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-yingge-dark-red/98 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className={`bg-gradient-to-r from-yingge-dark-red via-yingge-red to-yingge-dark-red text-white transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-3 md:py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center cursor-pointer transition-transform duration-500 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
              onClick={() => handleNavClick('/')}
            >
              <div className={`mr-3 md:mr-4 transition-transform duration-500 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}>
                <Emblem3D size={isScrolled ? 40 : 48} />
              </div>
              <div>
                <h1 className={`font-serif font-bold tracking-wider transition-all duration-500 ${
                  isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-3xl'
                }`}>
                  <ShinyText text={title} speed={4} />
                </h1>
                {subtitle && (
                  <p className={`text-yingge-gold tracking-widest transition-all duration-500 ${
                    isScrolled ? 'text-xs' : 'text-xs md:text-sm'
                  }`}>
                    {subtitle.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-sm">
              <a href="#" className="hover:text-yingge-gold transition-colors duration-300">设为首页</a>
              <span className="text-white/30">|</span>
              <a href="#" className="hover:text-yingge-gold transition-colors duration-300">加入收藏</a>
              <span className="text-white/30">|</span>
              <a href="#" className="hover:text-yingge-gold transition-colors duration-300">无障碍浏览</a>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-yingge-red border-t border-yingge-gold/30 transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}>
            <div className="hidden md:flex items-center h-full">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  ref={(el) => { if (el) navButtonsRef.current[index] = el; }}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative h-full px-4 lg:px-6 text-sm font-medium transition-all duration-300 overflow-hidden group ${
                    isActive(item.path)
                      ? 'bg-yingge-dark-red text-yingge-gold'
                      : 'text-white hover:bg-yingge-dark-red/50 hover:text-yingge-gold'
                  } ${activeButton === item.path ? 'scale-95' : 'scale-100'}`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ${
                    isActive(item.path) ? 'bg-yingge-gold' : 'bg-yingge-gold scale-x-0 group-hover:scale-x-100'
                  }`} />
                  {index < navItems.length - 1 && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-white/20" />
                  )}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-2" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="搜索页面、内容..."
                  className={`w-40 lg:w-48 pl-8 pr-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-yingge-gold focus:bg-white/20 transition-all duration-300 ${
                    isSearchFocused ? 'w-56 lg:w-64' : ''
                  }`}
                />

                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-hidden bg-white rounded-xl shadow-2xl z-50 border border-yingge-gold/20 flex flex-col">
                    {hasSearchQuery ? (
                      searchResults.length > 0 ? (
                        <>
                          <div className="px-3 py-2 text-xs text-yingge-dark/40 border-b border-yingge-dark/5 bg-yingge-gray/30 flex items-center justify-between flex-shrink-0">
                            <span>找到 {searchResults.length} 个结果</span>
                            <div className="flex items-center gap-2">
                              <kbd className="px-1.5 py-0.5 bg-white rounded border border-yingge-dark/10 text-[10px] leading-none">↑↓</kbd>
                              <span>切换</span>
                              <kbd className="px-1.5 py-0.5 bg-white rounded border border-yingge-dark/10 text-[10px] leading-none">↵</kbd>
                              <span>跳转</span>
                            </div>
                          </div>
                          <div className="overflow-y-auto flex-1">
                            {searchResults.map((item, index) => (
                              <button
                                key={item.id}
                                onClick={() => handleSelectResult(item)}
                                onMouseEnter={() => setActiveResultIndex(index)}
                                className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors duration-150 ${
                                  index === activeResultIndex
                                    ? 'bg-yingge-red/5 border-l-2 border-yingge-red'
                                    : 'border-l-2 border-transparent hover:bg-yingge-gray/30'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  index === activeResultIndex
                                    ? 'bg-yingge-red/10 text-yingge-red'
                                    : 'bg-yingge-dark/5 text-yingge-dark/40'
                                }`}>
                                  {item.type === 'page' ? (
                                    <FileText className="w-4 h-4" />
                                  ) : (
                                    <BookOpen className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-yingge-dark truncate">{item.label}</span>
                                    {item.type === 'section' && (
                                      <>
                                        <span className="text-yingge-dark/30 text-xs">·</span>
                                        <span className="text-xs text-yingge-red/70 truncate">
                                          <Tag className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />
                                          {item.parent}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xs text-yingge-dark/50 truncate mt-0.5">
                                    {item.description}
                                  </div>
                                </div>
                                {index === activeResultIndex && (
                                  <CornerDownLeft className="w-3.5 h-3.5 text-yingge-red/50 flex-shrink-0 mt-1" />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-6 px-4 text-center flex-shrink-0">
                          <p className="text-sm text-yingge-dark/50 mb-3">未找到匹配的内容</p>
                          <button
                            onClick={() => {
                              navigate('/guide');
                              setIsSearchFocused(false);
                              setSearchQuery('');
                              searchInputRef.current?.blur();
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yingge-red/10 text-yingge-red text-sm hover:bg-yingge-red/20 transition-colors"
                          >
                            <Bot className="w-4 h-4" />
                            在 AI 导游中搜索"{searchQuery}"
                          </button>
                        </div>
                      )
                    ) : (
                      <>
                        <div className="px-3 py-2 text-xs text-yingge-dark/40 border-b border-yingge-dark/5 bg-yingge-gray/30 flex-shrink-0">
                          热门推荐 · 点击直接跳转
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {searchableItems.filter(i => i.type === 'page').slice(0, 8).map((item, index) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              onMouseEnter={() => setActiveResultIndex(index)}
                              className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors duration-150 ${
                                index === activeResultIndex
                                  ? 'bg-yingge-red/5 border-l-2 border-yingge-red'
                                  : 'border-l-2 border-transparent hover:bg-yingge-gray/30'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                index === activeResultIndex
                                  ? 'bg-yingge-red/10 text-yingge-red'
                                  : 'bg-yingge-dark/5 text-yingge-dark/40'
                              }`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-yingge-dark truncate">{item.label}</div>
                                <div className="text-xs text-yingge-dark/50 truncate">{item.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-yingge-dark-red/50 rounded transition-all duration-300"
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMenuOpen ? (
                <X size={22} className="transition-transform duration-300 rotate-90" />
              ) : (
                <Menu size={22} className="transition-transform duration-300" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden overflow-hidden border-t border-yingge-gold/20 transition-all duration-400 ${
              isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-yingge-dark-red text-yingge-gold'
                    : 'text-white hover:bg-yingge-dark-red/50 hover:text-yingge-gold'
                }`}
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: isMenuOpen ? `${index * 80}ms` : '0ms',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
