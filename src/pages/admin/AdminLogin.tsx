import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import useAdminStore from '@/store/admin';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminStore();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yingge-red to-yingge-dark px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yingge-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-yingge-red" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-yingge-dark mb-2">管理员登录</h1>
          <p className="text-yingge-dark/60 text-sm">英歌文化数字展示平台管理后台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-yingge-dark mb-2">用户名</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-yingge-dark/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-yingge-dark/20 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none transition-all"
                placeholder="请输入用户名"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yingge-dark mb-2">密码</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-yingge-dark/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-yingge-dark/20 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none transition-all"
                placeholder="请输入密码"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yingge-red text-white font-bold rounded-lg hover:bg-yingge-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>

        <p className="text-center text-yingge-dark/40 text-xs mt-6">
          默认账号：admin / admin123
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
