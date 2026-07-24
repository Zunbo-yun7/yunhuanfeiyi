import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import api from '@/lib/api';
import { ImageUploader } from '@/components/ImageUploader';

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  thumbnail_url: string;
  author: string;
  is_published: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export function AdminNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    thumbnail_url: '',
    author: '',
    is_published: false,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/news/admin');
      setArticles(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取新闻稿失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article?: NewsArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        content: article.content,
        summary: article.summary || '',
        thumbnail_url: article.thumbnail_url || '',
        author: article.author || '',
        is_published: article.is_published === 1,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        content: '',
        summary: '',
        thumbnail_url: '',
        author: '',
        is_published: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      summary: '',
      thumbnail_url: '',
      author: '',
      is_published: false,
    });
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });

    try {
      if (editingArticle) {
        await api.put(`/news/${editingArticle.id}`, formData);
        setMessage({ type: 'success', text: '新闻稿更新成功！' });
      } else {
        await api.post('/news', formData);
        setMessage({ type: 'success', text: '新闻稿创建成功！' });
      }
      handleCloseModal();
      fetchArticles();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || '保存失败' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇新闻稿吗？')) return;

    try {
      await api.delete(`/news/${id}`);
      setMessage({ type: 'success', text: '新闻稿删除成功！' });
      fetchArticles();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || '删除失败' });
    }
  };

  const handlePublish = async (id: number, publish: boolean) => {
    try {
      if (publish) {
        await api.post(`/news/${id}/publish`);
        setMessage({ type: 'success', text: '新闻稿已发布！' });
      } else {
        await api.post(`/news/${id}/unpublish`);
        setMessage({ type: 'success', text: '新闻稿已取消发布！' });
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
        <h1 className="text-2xl font-bold text-gray-800">新闻稿管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
        >
          <Plus size={18} />
          新建新闻稿
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">标题</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">作者</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">状态</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">发布时间</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">更新时间</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate font-medium text-gray-900">{article.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{article.author || '-'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {article.is_published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(article.published_at)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(article.updated_at)}
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handlePublish(article.id, !article.is_published)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title={article.is_published ? '取消发布' : '发布'}
                  >
                    {article.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
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
          <div className="py-12 text-center text-gray-500">暂无新闻稿</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingArticle ? '编辑新闻稿' : '新建新闻稿'}
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
                  placeholder="请输入新闻稿标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="请输入作者"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                  placeholder="请输入新闻稿简介"
                />
              </div>
              <div>
                <ImageUploader
                  label="缩略图"
                  value={formData.thumbnail_url}
                  onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                  placeholder="请输入新闻稿内容（支持HTML）"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-yingge-red border-gray-300 rounded focus:ring-yingge-gold"
                />
                <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
                  发布
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
                disabled={!formData.title || !formData.content}
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

export default AdminNews;
