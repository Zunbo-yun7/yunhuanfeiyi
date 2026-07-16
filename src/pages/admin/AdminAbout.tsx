import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import { SortableList, SortToggle } from '@/components/SortableList';

interface HistoryItem {
  id?: number;
  year: string;
  event: string;
  sort_order: number;
}

interface FeatureItem {
  id?: number;
  title: string;
  description: string;
  image: string;
  sort_order: number;
}

interface PuningFeatureItem {
  id?: number;
  title: string;
  description: string;
  sort_order: number;
}

export function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    introduction: '',
    history: [] as HistoryItem[],
    features: [] as FeatureItem[],
    puningFeatures: [] as PuningFeatureItem[],
  });
  const [sortMode, setSortMode] = useState(false);

  const [editingHistory, setEditingHistory] = useState<HistoryItem | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingPuningFeature, setEditingPuningFeature] = useState<PuningFeatureItem | null>(null);
  const [showPuningFeatureModal, setShowPuningFeatureModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/about');
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
      await api.put('/about/introduction', { introduction: formData.introduction });
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

  const saveSortOrder = async (items: any[], endpoint: string) => {
    try {
      for (const item of items) {
        if (item.id) {
          await api.put(`${endpoint}/${item.id}`, { sort_order: item.sort_order });
        }
      }
      setMessage({ type: 'success', text: '排序已保存！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存排序失败' });
    }
  };

  const handleHistoryReorder = (items: HistoryItem[]) => {
    setFormData((prev) => ({ ...prev, history: items }));
    saveSortOrder(items, '/about/history');
  };

  const handleFeatureReorder = (items: FeatureItem[]) => {
    setFormData((prev) => ({ ...prev, features: items }));
    saveSortOrder(items, '/about/features');
  };

  const handlePuningFeatureReorder = (items: PuningFeatureItem[]) => {
    setFormData((prev) => ({ ...prev, puningFeatures: items }));
    saveSortOrder(items, '/about/puning-features');
  };

  const openAddHistory = () => {
    setEditingHistory({ year: '', event: '', sort_order: formData.history.length + 1 });
    setShowHistoryModal(true);
  };

  const openEditHistory = (item: HistoryItem) => {
    setEditingHistory({ ...item });
    setShowHistoryModal(true);
  };

  const saveHistory = async () => {
    if (!editingHistory) return;
    try {
      if (editingHistory.id) {
        await api.put(`/about/history/${editingHistory.id}`, editingHistory);
      } else {
        await api.post('/about/history', editingHistory);
      }
      setShowHistoryModal(false);
      setEditingHistory(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteHistory = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/about/history/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddFeature = () => {
    setEditingFeature({ title: '', description: '', image: '', sort_order: formData.features.length + 1 });
    setShowFeatureModal(true);
  };

  const openEditFeature = (item: FeatureItem) => {
    setEditingFeature({ ...item });
    setShowFeatureModal(true);
  };

  const saveFeature = async () => {
    if (!editingFeature) return;
    try {
      if (editingFeature.id) {
        await api.put(`/about/features/${editingFeature.id}`, editingFeature);
      } else {
        await api.post('/about/features', editingFeature);
      }
      setShowFeatureModal(false);
      setEditingFeature(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteFeature = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/about/features/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddPuningFeature = () => {
    setEditingPuningFeature({ title: '', description: '', sort_order: formData.puningFeatures.length + 1 });
    setShowPuningFeatureModal(true);
  };

  const openEditPuningFeature = (item: PuningFeatureItem) => {
    setEditingPuningFeature({ ...item });
    setShowPuningFeatureModal(true);
  };

  const savePuningFeature = async () => {
    if (!editingPuningFeature) return;
    try {
      if (editingPuningFeature.id) {
        await api.put(`/about/puning-features/${editingPuningFeature.id}`, editingPuningFeature);
      } else {
        await api.post('/about/puning-features', editingPuningFeature);
      }
      setShowPuningFeatureModal(false);
      setEditingPuningFeature(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deletePuningFeature = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/about/puning-features/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
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
        <h1 className="text-2xl font-bold text-gray-800">认识英歌管理</h1>
        <div className="flex gap-2">
          <SortToggle enabled={sortMode} onChange={setSortMode} />
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
            {saving ? '保存中...' : '保存简介'}
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

      {sortMode && (
        <div className="mb-6 p-4 bg-yingge-gold/10 border border-yingge-gold/30 rounded-lg">
          <p className="text-yingge-gold text-sm font-medium">
            💡 排序模式已开启：将鼠标悬停在卡片左侧，拖动绿色手柄调整顺序
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">英歌简介</h2>
          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">历史时间线</h2>
            <button
              onClick={openAddHistory}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          </div>

          {sortMode ? (
            <SortableList
              items={formData.history}
              setItems={(history) => setFormData((prev) => ({ ...prev, history }))}
              onReorder={handleHistoryReorder}
              className="space-y-3"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-20 text-center">
                    <span className="text-lg font-bold text-yingge-red">{item.year}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{item.event}</p>
                    <p className="text-sm text-gray-400 mt-1">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditHistory(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="space-y-3">
              {formData.history?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-20 text-center">
                    <span className="text-lg font-bold text-yingge-red">{item.year}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{item.event}</p>
                    <p className="text-sm text-gray-400 mt-1">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditHistory(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.history?.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无数据</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">特色列表</h2>
            <button
              onClick={openAddFeature}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          </div>

          {sortMode ? (
            <SortableList
              items={formData.features}
              setItems={(features) => setFormData((prev) => ({ ...prev, features }))}
              onReorder={handleFeatureReorder}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-2">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditFeature(item)}
                      className="p-1.5 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteFeature(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.features?.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-2">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditFeature(item)}
                      className="p-1.5 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteFeature(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {formData.features?.length === 0 && (
            <div className="text-center py-8 text-gray-400">暂无数据</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">普宁特色</h2>
            <button
              onClick={openAddPuningFeature}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          </div>

          {sortMode ? (
            <SortableList
              items={formData.puningFeatures}
              setItems={(puningFeatures) => setFormData((prev) => ({ ...prev, puningFeatures }))}
              onReorder={handlePuningFeatureReorder}
              className="space-y-3"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-2">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPuningFeature(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deletePuningFeature(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="space-y-3">
              {formData.puningFeatures?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-2">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPuningFeature(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deletePuningFeature(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.puningFeatures?.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无数据</div>
              )}
            </div>
          )}
        </div>
      </div>

      {showHistoryModal && editingHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingHistory.id ? '编辑历史' : '添加历史'}
              </h3>
              <button
                onClick={() => { setShowHistoryModal(false); setEditingHistory(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年代</label>
                <input
                  type="text"
                  value={editingHistory.year}
                  onChange={(e) => setEditingHistory({ ...editingHistory, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">事件</label>
                <textarea
                  value={editingHistory.event}
                  onChange={(e) => setEditingHistory({ ...editingHistory, event: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingHistory.sort_order}
                  onChange={(e) => setEditingHistory({ ...editingHistory, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowHistoryModal(false); setEditingHistory(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveHistory}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeatureModal && editingFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingFeature.id ? '编辑特色' : '添加特色'}
              </h3>
              <button
                onClick={() => { setShowFeatureModal(false); setEditingFeature(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={editingFeature.title}
                  onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editingFeature.description}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <ImageUploader
                  label="图片"
                  value={editingFeature.image}
                  onChange={(url) => setEditingFeature({ ...editingFeature, image: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingFeature.sort_order}
                  onChange={(e) => setEditingFeature({ ...editingFeature, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowFeatureModal(false); setEditingFeature(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveFeature}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showPuningFeatureModal && editingPuningFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingPuningFeature.id ? '编辑普宁特色' : '添加普宁特色'}
              </h3>
              <button
                onClick={() => { setShowPuningFeatureModal(false); setEditingPuningFeature(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={editingPuningFeature.title}
                  onChange={(e) => setEditingPuningFeature({ ...editingPuningFeature, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editingPuningFeature.description}
                  onChange={(e) => setEditingPuningFeature({ ...editingPuningFeature, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingPuningFeature.sort_order}
                  onChange={(e) => setEditingPuningFeature({ ...editingPuningFeature, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowPuningFeatureModal(false); setEditingPuningFeature(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={savePuningFeature}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAbout;