import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import VideoUploader from '@/components/VideoUploader';
import { SortableList, SortToggle } from '@/components/SortableList';

interface ActionItem {
  id?: number;
  name: string;
  pinyin: string;
  description: string;
  videoUrl: string;
  image: string;
  meaning: string;
  sort_order: number;
}

export function AdminActions() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    introduction: '',
    actions: [] as ActionItem[],
  });
  const [sortMode, setSortMode] = useState(false);

  const [editingAction, setEditingAction] = useState<ActionItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/actions');
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
      await api.put('/actions/introduction', { introduction: formData.introduction });
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

  const saveSortOrder = async (items: ActionItem[]) => {
    try {
      for (const item of items) {
        if (item.id) {
          await api.put(`/actions/${item.id}`, { sort_order: item.sort_order });
        }
      }
      setMessage({ type: 'success', text: '排序已保存！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存排序失败' });
    }
  };

  const handleActionReorder = (items: ActionItem[]) => {
    setFormData((prev) => ({ ...prev, actions: items }));
    saveSortOrder(items);
  };

  const openAddAction = () => {
    setEditingAction({
      name: '',
      pinyin: '',
      description: '',
      videoUrl: '',
      image: '',
      meaning: '',
      sort_order: formData.actions.length + 1,
    });
    setShowActionModal(true);
  };

  const openEditAction = (item: ActionItem) => {
    setEditingAction({ ...item });
    setShowActionModal(true);
  };

  const saveAction = async () => {
    if (!editingAction) return;
    try {
      if (editingAction.id) {
        await api.put(`/actions/${editingAction.id}`, editingAction);
      } else {
        await api.post('/actions', editingAction);
      }
      setShowActionModal(false);
      setEditingAction(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteAction = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/actions/${id}`);
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
        <h1 className="text-2xl font-bold text-gray-800">动作图谱管理</h1>
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">动作图谱简介</h2>
          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">动作列表</h2>
            <button
              onClick={openAddAction}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加动作
            </button>
          </div>

          {sortMode ? (
            <SortableList<ActionItem>
              items={formData.actions}
              setItems={(actions) => setFormData((prev) => ({ ...prev, actions }))}
              onReorder={handleActionReorder}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {item.image && (
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.pinyin}</p>
                      </div>
                      <span className="text-xs text-gray-400">排序：{item.sort_order}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                    {item.meaning && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400">寓意：<span className="text-gray-600">{item.meaning}</span></p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditAction(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={() => item.id && deleteAction(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.actions?.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {item.image && (
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.pinyin}</p>
                      </div>
                      <span className="text-xs text-gray-400">排序：{item.sort_order}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                    {item.meaning && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400">寓意：<span className="text-gray-600">{item.meaning}</span></p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditAction(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={() => item.id && deleteAction(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.actions?.length === 0 && (
            <div className="text-center py-12 text-gray-400">暂无数据，点击上方按钮添加动作</div>
          )}
        </div>
      </div>

      {showActionModal && editingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingAction.id ? '编辑动作' : '添加动作'}
              </h3>
              <button
                onClick={() => { setShowActionModal(false); setEditingAction(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">动作名称</label>
                  <input
                    type="text"
                    value={editingAction.name}
                    onChange={(e) => setEditingAction({ ...editingAction, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">拼音</label>
                  <input
                    type="text"
                    value={editingAction.pinyin}
                    onChange={(e) => setEditingAction({ ...editingAction, pinyin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">动作描述</label>
                <textarea
                  value={editingAction.description}
                  onChange={(e) => setEditingAction({ ...editingAction, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">动作寓意</label>
                <textarea
                  value={editingAction.meaning}
                  onChange={(e) => setEditingAction({ ...editingAction, meaning: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <ImageUploader
                  label="图片"
                  value={editingAction.image}
                  onChange={(url) => setEditingAction({ ...editingAction, image: url })}
                />
              </div>
              <div>
                <VideoUploader
                  label="视频"
                  value={editingAction.videoUrl}
                  onChange={(url) => setEditingAction({ ...editingAction, videoUrl: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingAction.sort_order}
                  onChange={(e) => setEditingAction({ ...editingAction, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowActionModal(false); setEditingAction(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveAction}
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

export default AdminActions;
