import { useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  MapPin,
  Move,
  Smile,
  Users,
  Edit,
  FileText,
} from 'lucide-react';

const modules = [
  { path: '/admin/home', label: '首页管理', icon: Home, color: 'bg-red-500' },
  { path: '/admin/about', label: '认识英歌', icon: BookOpen, color: 'bg-amber-500' },
  { path: '/admin/xintan', label: '新坛英歌', icon: MapPin, color: 'bg-green-500' },
  { path: '/admin/actions', label: '动作图谱', icon: Move, color: 'bg-blue-500' },
  { path: '/admin/equipment', label: '脸谱装备', icon: Smile, color: 'bg-purple-500' },
  { path: '/admin/people', label: '人物故事', icon: Users, color: 'bg-pink-500' },
  { path: '/admin/logs', label: '实践日志', icon: FileText, color: 'bg-indigo-500' },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">欢迎使用管理后台</h1>
        <p className="text-gray-500">管理英歌文化数字展示平台的所有内容</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.path}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <Edit size={18} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{module.label}</h3>
              <p className="text-sm text-gray-500">点击进入管理页面</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">快速操作</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2 bg-yingge-gold text-yingge-red font-medium rounded-lg hover:bg-yingge-gold/90 transition-colors"
          >
            查看前台页面
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
