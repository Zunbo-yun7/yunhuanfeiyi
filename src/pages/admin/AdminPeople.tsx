import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import { SortableList, SortToggle } from '@/components/SortableList';

interface CategoryItem {
  id?: number;
  title: string;
  description: string;
  sort_order: number;
}

interface PersonItem {
  id?: number;
  category_id: number;
  name: string;
  role: string;
  avatar: string;
  story: string;
  achievements: string[];
  sort_order: number;
}

export function AdminPeople() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    introduction: '',
    categories: [] as CategoryItem[],
    people: [] as PersonItem[],
  });
  const [sortMode, setSortMode] = useState(false);

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<(PersonItem & { achievementsStr: string }) | null>(null);
  const [showPersonModal, setShowPersonModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/people');
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
      await api.put('/people/introduction', { introduction: formData.introduction });
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

  const handleCategoryReorder = (categories: CategoryItem[]) => {
    setFormData((prev) => ({ ...prev, categories }));
    saveSortOrder(categories, '/people/categories');
  };

  const handlePersonReorder = (people: PersonItem[]) => {
    setFormData((prev) => ({ ...prev, people }));
    saveSortOrder(people, '/people/people');
  };

  const openAddCategory = () => {
    setEditingCategory({ title: '', description: '', sort_order: formData.categories.length + 1 });
    setShowCategoryModal(true);
  };

  const openEditCategory = (item: CategoryItem) => {
    setEditingCategory({ ...item });
    setShowCategoryModal(true);
  };

  const saveCategory = async () => {
    if (!editingCategory) return;
    try {
      if (editingCategory.id) {
        await api.put(`/people/categories/${editingCategory.id}`, editingCategory);
      } else {
        await api.post('/people/categories', editingCategory);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？删除后该分类下的人物可能会受影响。')) return;
    try {
      await api.delete(`/people/categories/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddPerson = () => {
    setEditingPerson({
      category_id: formData.categories[0]?.id || 0,
      name: '',
      role: '',
      avatar: '',
      story: '',
      achievements: [],
      achievementsStr: '',
      sort_order: formData.people.length + 1,
    });
    setShowPersonModal(true);
  };

  const openEditPerson = (item: PersonItem) => {
    setEditingPerson({
      ...item,
      achievementsStr: item.achievements?.join(',') || '',
    });
    setShowPersonModal(true);
  };

  const savePerson = async () => {
    if (!editingPerson) return;
    const payload = {
      ...editingPerson,
      achievements: editingPerson.achievementsStr.split(',').filter(Boolean),
    };
    delete (payload as any).achievementsStr;
    try {
      if (editingPerson.id) {
        await api.put(`/people/people/${editingPerson.id}`, payload);
      } else {
        await api.post('/people/people', payload);
      }
      setShowPersonModal(false);
      setEditingPerson(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deletePerson = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/people/people/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const getCategoryName = (categoryId: number) => {
    const cat = formData.categories.find((c) => c.id === categoryId);
    return cat?.title || '未分类';
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
        <h1 className="text-2xl font-bold text-gray-800">人物故事管理</h1>
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">人物故事简介</h2>
          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">人物分类</h2>
            <button
              onClick={openAddCategory}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加分类
            </button>
          </div>

          {sortMode ? (
            <SortableList<CategoryItem>
              items={formData.categories}
              setItems={(categories) => setFormData((prev) => ({ ...prev, categories }))}
              onReorder={handleCategoryReorder}
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
                      onClick={() => openEditCategory(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => item.id && deleteCategory(item.id)}
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
              {formData.categories?.map((item) => (
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
                      onClick={() => openEditCategory(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => item.id && deleteCategory(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.categories?.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无分类</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">人物列表</h2>
            <button
              onClick={openAddPerson}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加人物
            </button>
          </div>

          {sortMode ? (
            <SortableList<PersonItem>
              items={formData.people}
              setItems={(people) => setFormData((prev) => ({ ...prev, people }))}
              onReorder={handlePersonReorder}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 p-4">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-lg font-medium">{item.name?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                      <p className="text-sm text-yingge-gold">{item.role}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                        {getCategoryName(item.category_id)}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-500 line-clamp-2">{item.story}</p>
                    {item.achievements?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">成就：</p>
                        <div className="flex flex-wrap gap-1">
                          {item.achievements.slice(0, 3).map((a, idx) => (
                            <span key={idx} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                              {a}
                            </span>
                          ))}
                          {item.achievements.length > 3 && (
                            <span className="text-xs text-gray-400">+{item.achievements.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditPerson(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={() => item.id && deletePerson(item.id)}
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
              {formData.people?.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 p-4">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-lg font-medium">{item.name?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                      <p className="text-sm text-yingge-gold">{item.role}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                        {getCategoryName(item.category_id)}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-500 line-clamp-2">{item.story}</p>
                    {item.achievements?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">成就：</p>
                        <div className="flex flex-wrap gap-1">
                          {item.achievements.slice(0, 3).map((a, idx) => (
                            <span key={idx} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                              {a}
                            </span>
                          ))}
                          {item.achievements.length > 3 && (
                            <span className="text-xs text-gray-400">+{item.achievements.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditPerson(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={() => item.id && deletePerson(item.id)}
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

          {formData.people?.length === 0 && (
            <div className="text-center py-12 text-gray-400">暂无人物，点击上方按钮添加</div>
          )}
        </div>
      </div>

      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingCategory.id ? '编辑分类' : '添加分类'}
              </h3>
              <button
                onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类标题</label>
                <input
                  type="text"
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类描述</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingCategory.sort_order}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveCategory}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showPersonModal && editingPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingPerson.id ? '编辑人物' : '添加人物'}
              </h3>
              <button
                onClick={() => { setShowPersonModal(false); setEditingPerson(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属分类</label>
                <select
                  value={editingPerson.category_id}
                  onChange={(e) => setEditingPerson({ ...editingPerson, category_id: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                >
                  {formData.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={editingPerson.name}
                    onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                  <input
                    type="text"
                    value={editingPerson.role}
                    onChange={(e) => setEditingPerson({ ...editingPerson, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <ImageUploader
                  label="头像"
                  value={editingPerson.avatar}
                  onChange={(url) => setEditingPerson({ ...editingPerson, avatar: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">人物故事</label>
                <textarea
                  value={editingPerson.story}
                  onChange={(e) => setEditingPerson({ ...editingPerson, story: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">成就（多个用逗号分隔）</label>
                <textarea
                  value={editingPerson.achievementsStr}
                  onChange={(e) => setEditingPerson({ ...editingPerson, achievementsStr: e.target.value })}
                  rows={3}
                  placeholder="例如：非遗传承人,优秀表演奖,先进工作者"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingPerson.sort_order}
                  onChange={(e) => setEditingPerson({ ...editingPerson, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowPersonModal(false); setEditingPerson(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={savePerson}
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

export default AdminPeople;
