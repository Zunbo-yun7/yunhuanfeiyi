import { useState } from 'react';
import { Navigate, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAdminStore from '@/store/admin';
import {
  Home,
  BookOpen,
  MapPin,
  Move,
  Smile,
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  FileText,
  Calendar,
  Newspaper,
  MessageCircle,
  Gift,
  Map as ImageMap,
} from 'lucide-react';

const menuItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/home', label: '首页管理', icon: Home },
  { path: '/admin/news', label: '新闻稿管理', icon: Newspaper },
  { path: '/admin/wechat', label: '公众号文章', icon: MessageCircle },
  { path: '/admin/about', label: '认识英歌', icon: BookOpen },
  { path: '/admin/xintan', label: '新坛英歌', icon: MapPin },
  { path: '/admin/actions', label: '动作图谱', icon: Move },
  { path: '/admin/equipment', label: '脸谱装备', icon: Smile },
  { path: '/admin/people', label: '人物故事', icon: Users },
  { path: '/admin/schedules', label: '演出时间表', icon: Calendar },
  { path: '/admin/logs', label: '实践日志', icon: FileText },
  { path: '/admin/creative', label: '文创商品', icon: Gift },
  { path: '/admin/poster', label: '海报热点', icon: ImageMap },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, admin } = useAdminStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 侧边栏 - 桌面端（sticky固定，外层仍占位，不遮挡内容） */}
      <aside className="hidden md:flex md:flex-col w-64 bg-yingge-dark text-white sticky top-0 h-screen overflow-y-auto flex-shrink-0 z-20">
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <h1 className="font-serif font-bold text-xl text-yingge-gold">云焕非遗</h1>
          <p className="text-sm text-white/60 mt-1">管理后台</p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-yingge-gold/20 text-yingge-gold border-r-4 border-yingge-gold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-yingge-gold/20 rounded-full flex items-center justify-center">
              <span className="text-yingge-gold font-bold">{admin?.username?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{admin?.username}</p>
              <p className="text-xs text-white/50">管理员</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 移动端顶栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-yingge-dark text-white">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-serif font-bold text-lg text-yingge-gold">云焕非遗</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="absolute top-full left-0 right-0 bg-yingge-dark border-t border-white/10">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 ${
                    isActive ? 'bg-yingge-gold/20 text-yingge-gold' : 'text-white/70'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-6 py-3 text-white/70 border-t border-white/10"
            >
              <LogOut size={20} />
              <span>退出登录</span>
            </button>
          </div>
        )}
      </div>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0 max-h-screen overflow-auto pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
