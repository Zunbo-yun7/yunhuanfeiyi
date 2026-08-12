import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Pin, Eye, Save, RotateCcw, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

interface PracticeLog {
  id: number;
  title: string;
  content: string;
  image: string;
  is_top: number;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

export function AdminLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState<PracticeLog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    is_top: false,
    sort_order: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs');
      setLogs(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取日志失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLog(null);
    setFormData({
      title: '',
      content: '',
      image: '',
      is_top: false,
      sort_order: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (log: PracticeLog) => {
    setEditingLog(log);
    setFormData({
      title: log.title,
      content: log.content,
      image: log.image,
      is_top: log.is_top === 1,
      sort_order: log.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setMessage({ type: 'error', text: '标题和内容不能为空' });
      return;
    }

    try {
      if (editingLog) {
        await api.put(`/logs/${editingLog.id}`, formData);
        setMessage({ type: 'success', text: '更新成功！' });
      } else {
        await api.post('/logs', formData);
        setMessage({ type: 'success', text: '创建成功！' });
      }
      setShowModal(false);
      fetchLogs();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '操作失败' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条日志吗？')) return;

    try {
      await api.delete(`/logs/${id}`);
      setMessage({ type: 'success', text: '删除成功！' });
      fetchLogs();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const handleToggleTop = async (log: PracticeLog) => {
    try {
      await api.put(`/logs/${log.id}/top`, { is_top: !log.is_top });
      setMessage({ type: 'success', text: log.is_top ? '取消置顶成功！' : '置顶成功！' });
      fetchLogs();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '操作失败' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
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
        <h1 className="text-2xl font-bold text-gray-800">实践日志管理</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
        >
          <Plus size={18} />
          添加日志
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  图片
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {log.is_top && (
                        <Pin size={14} className="text-yingge-red" />
                      )}
                      <span className="font-medium text-gray-900">{log.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.image ? (
                      <img
                        src={log.image}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">无图片</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.is_top ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        已置顶
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        普通
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(log)}
                        className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-yingge-gold/10 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleTop(log)}
                        className={`p-2 rounded-lg transition-colors ${
                          log.is_top
                            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            : 'text-gray-400 hover:text-yingge-red hover:bg-yingge-red/10'
                        }`}
                        title={log.is_top ? '取消置顶' : '置顶'}
                      >
                        <Pin size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无日志，点击上方按钮添加</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingLog ? '编辑日志' : '添加日志'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="请输入日志标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                  placeholder="请输入日志内容"
                />
              </div>

              <ImageUploader
                label="图片（可选）"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                category="practice-logs"
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_top}
                    onChange={(e) => setFormData({ ...formData, is_top: e.target.checked })}
                    className="w-4 h-4 text-yingge-red border-gray-300 rounded focus:ring-yingge-gold"
                  />
                  <span className="text-sm text-gray-700">置顶</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                <Save size={16} />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;