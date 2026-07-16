import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Emblem3D } from './Emblem3D';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const navItems = [
  { id: 'home', label: '网站首页', path: '/' },
  { id: 'about', label: '认识英歌', path: '/about' },
  { id: 'xintan', label: '新坛英歌', path: '/xintan' },
  { id: 'actions', label: '动作图谱', path: '/actions' },
  { id: 'equipment', label: '脸谱装备', path: '/equipment' },
  { id: 'mask-diy', label: '脸谱DIY', path: '/mask-diy' },
  { id: 'schedule', label: '演出时间表', path: '/schedule' },
  { id: 'stories', label: '人物故事', path: '/stories' },
  { id: 'logs', label: '实践日志', path: '/logs' },
  { id: 'guide', label: 'AI导游', path: '/guide' },
];

export function Navbar({ title, subtitle }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  
  const navButtonsRef = useRef<HTMLButtonElement[]>([]);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  {title}
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
                  className={`relative h-full px-6 text-sm font-medium transition-all duration-300 overflow-hidden group ${
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

            <div className="hidden md:flex items-center space-x-2">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="搜索..."
                  className="w-48 px-3 py-1.5 pr-8 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-yingge-gold focus:bg-white/20 transition-all duration-300"
                />
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
