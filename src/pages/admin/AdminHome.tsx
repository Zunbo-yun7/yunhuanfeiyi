import { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import VideoUploader from '@/components/VideoUploader';

export function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      backgroundImage: '',
      videoUrl: '',
    },
    projectIntro: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/home');
      setFormData(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取数据失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/home', formData);
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchData();
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">首页管理</h1>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={18} />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hero 区域</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <VideoUploader
                label="视频（可选）"
                value={formData.hero.videoUrl}
                onChange={(url) =>
                  setFormData({ ...formData, hero: { ...formData.hero, videoUrl: url } })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
              <input
                type="text"
                value={formData.hero.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">描述文字</label>
              <textarea
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value } })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                label="背景图片"
                value={formData.hero.backgroundImage}
                onChange={(url) =>
                  setFormData({ ...formData, hero: { ...formData.hero, backgroundImage: url } })
                }
                category="home-data"
              />
            </div>
            <div className="md:col-span-2">
              <VideoUploader
                label="视频（可选）"
                value={formData.hero.videoUrl}
                onChange={(url) =>
                  setFormData({ ...formData, hero: { ...formData.hero, videoUrl: url } })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">项目介绍</h2>
          <textarea
            value={formData.projectIntro}
            onChange={(e) => setFormData({ ...formData, projectIntro: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;