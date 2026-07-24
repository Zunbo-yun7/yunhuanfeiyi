import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Pin, PinOff, Save, X } from 'lucide-react';
import api from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';

interface WechatArticle {
  id: number;
  title: string;
  wechat_account: string;
  wechat_url: string;
  summary: string;
  thumbnail_url: string;
  published_at: string;
  is_top: number;
  created_at: string;
  updated_at: string;
}

export function AdminWechat() {
  const [articles, setArticles] = useState<WechatArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<WechatArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    wechat_account: '',
    wechat_url: '',
    summary: '',
    thumbnail_url: '',
    published_at: '',
    is_top: false,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/wechat');
      setArticles(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取公众号文章失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article?: WechatArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        wechat_account: article.wechat_account,
        wechat_url: article.wechat_url,
        summary: article.summary || '',
        thumbnail_url: article.thumbnail_url || '',
        published_at: article.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : '',
        is_top: article.is_top === 1,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        wechat_account: '',
        wechat_url: '',
        summary: '',
        thumbnail_url: '',
        published_at: new Date().toISOString().slice(0, 16),
        is_top: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      wechat_account: '',
      wechat_url: '',
      summary: '',
      thumbnail_url: '',
      published_at: new Date().toISOString().slice(0, 16),
      is_top: false,
    });
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });

    try {
      if (editingArticle) {
        await api.put(`/wechat/${editingArticle.id}`, formData);
        setMessage({ type: 'success', text: '公众号文章更新成功！' });
      } else {
        await api.post('/wechat', formData);
        setMessage({ type: 'success', text: '公众号文章创建成功！' });
      }
      handleCloseModal();
      fetchArticles();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || '保存失败' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇公众号文章吗？')) return;

    try {
      await api.delete(`/wechat/${id}`);
      setMessage({ type: 'success', text: '公众号文章删除成功！' });
      fetchArticles();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || '删除失败' });
    }
  };

  const handleTop = async (id: number, top: boolean) => {
    try {
      if (top) {
        await api.post(`/wechat/${id}/top`);
        setMessage({ type: 'success', text: '文章已置顶！' });
      } else {
        await api.post(`/wechat/${id}/untop`);
        setMessage({ type: 'success', text: '文章已取消置顶！' });
      }
      fetchArticles();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || '操作失败' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1 className="text-2xl font-bold text-gray-800">公众号文章管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
        >
          <Plus size={18} />
          添加文章
        </button>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">置顶</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">标题</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">公众号</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">发布时间</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {article.is_top && (
                    <Pin size={18} className="text-yingge-gold" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate font-medium text-gray-900">{article.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{article.wechat_account}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(article.published_at)}
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleTop(article.id, !article.is_top)}
                    className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-yellow-50 rounded-lg transition-colors"
                    title={article.is_top ? '取消置顶' : '置顶'}
                  >
                    {article.is_top ? <PinOff size={18} /> : <Pin size={18} />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(article)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="py-12 text-center text-gray-500">暂无公众号文章</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingArticle ? '编辑公众号文章' : '添加公众号文章'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="请输入文章标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公众号名称 *</label>
                <input
                  type="text"
                  value={formData.wechat_account}
                  onChange={(e) => setFormData({ ...formData, wechat_account: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="请输入公众号名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公众号链接 *</label>
                <input
                  type="text"
                  value={formData.wechat_url}
                  onChange={(e) => setFormData({ ...formData, wechat_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="请输入公众号文章链接"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发布时间 *</label>
                <input
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                  placeholder="请输入文章简介"
                />
              </div>
              <div>
                <ImageUploader
                  label="缩略图"
                  value={formData.thumbnail_url}
                  onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_top"
                  checked={formData.is_top}
                  onChange={(e) => setFormData({ ...formData, is_top: e.target.checked })}
                  className="w-4 h-4 text-yingge-red border-gray-300 rounded focus:ring-yingge-gold"
                />
                <label htmlFor="is_top" className="ml-2 text-sm font-medium text-gray-700">
                  置顶
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.wechat_account || !formData.wechat_url || !formData.published_at}
                className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWechat;
