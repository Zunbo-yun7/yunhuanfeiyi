import { useState, useEffect } from 'react';
import { RotateCcw, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import { SortableList, SortToggle } from '@/components/SortableList';

interface CategoryItem {
  id: number;
  category: string;
  sort_order: number;
}

interface EquipmentItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
  details: string;
  sort_order: number;
}

export function AdminEquipment() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    categories: [] as CategoryItem[],
    items: [] as EquipmentItem[],
  });
  const [sortMode, setSortMode] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<EquipmentItem> | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/equipment/admin');
      setFormData(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取数据失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchData();
    setMessage({ type: '', text: '' });
  };

  const saveSortOrder = async (items: any[], type: 'categories' | 'items') => {
    try {
      for (const item of items) {
        if (item.id) {
          await api.put(`/equipment/${type}/${item.id}`, { sort_order: item.sort_order });
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
    saveSortOrder(categories, 'categories');
  };

  const handleItemReorder = (items: EquipmentItem[]) => {
    setFormData((prev) => ({ ...prev, items }));
    saveSortOrder(items, 'items');
  };

  const openAddCategory = () => {
    setEditingCategory({ category: '', sort_order: formData.categories.length + 1 });
    setShowCategoryModal(true);
  };

  const openEditCategory = (item: CategoryItem) => {
    setEditingCategory({ ...item } as Partial<CategoryItem>);
    setShowCategoryModal(true);
  };

  const saveCategory = async () => {
    if (!editingCategory) return;
    try {
      if (editingCategory.id) {
        await api.put(`/equipment/categories/${editingCategory.id}`, editingCategory);
      } else {
        await api.post('/equipment/categories', editingCategory);
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
    if (!confirm('确定要删除这个分类吗？删除后该分类下的物品可能会受影响。')) return;
    try {
      await api.delete(`/equipment/categories/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddItem = () => {
    setEditingItem({
      category_id: formData.categories[0]?.id || 0,
      name: '',
      description: '',
      image: '',
      details: '',
      sort_order: formData.items.length + 1,
    });
    setShowItemModal(true);
  };

  const openEditItem = (item: EquipmentItem) => {
    setEditingItem({ ...item } as Partial<EquipmentItem>);
    setShowItemModal(true);
  };

  const saveItem = async () => {
    if (!editingItem) return;
    try {
      if (editingItem.id) {
        await api.put(`/equipment/items/${editingItem.id}`, editingItem);
      } else {
        await api.post('/equipment/items', editingItem);
      }
      setShowItemModal(false);
      setEditingItem(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/equipment/items/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const getCategoryName = (categoryId: number) => {
    const cat = formData.categories.find((c) => c.id === categoryId);
    return cat?.category || '未分类';
  };

  // 按分类分组并排序物品
  const groupedItems = formData.categories
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      category,
      items: formData.items
        .filter((item) => item.category_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));

  // 未分类的物品
  const uncategorizedItems = formData.items
    .filter((item) => !formData.categories.some((c) => c.id === item.category_id))
    .sort((a, b) => a.sort_order - b.sort_order);

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
        <h1 className="text-2xl font-bold text-gray-800">脸谱装备管理</h1>
        <div className="flex gap-2">
          <SortToggle enabled={sortMode} onChange={setSortMode} />
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={18} />
            重置
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">分类管理</h2>
            <button
              onClick={openAddCategory}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加分类
            </button>
          </div>

          {sortMode ? (
            <SortableList
              items={formData.categories}
              setItems={(categories) => setFormData((prev) => ({ ...prev, categories }))}
              onReorder={handleCategoryReorder}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{item.category}</h3>
                    <p className="text-xs text-gray-400 mt-1">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditCategory(item)}
                      className="p-1.5 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => item.id && deleteCategory(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.categories?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{item.category}</h3>
                    <p className="text-xs text-gray-400 mt-1">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditCategory(item)}
                      className="p-1.5 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => item.id && deleteCategory(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.categories?.length === 0 && (
            <div className="text-center py-8 text-gray-400">暂无分类</div>
          )}
        </div>

        <div className="space-y-6">
          {/* 添加物品按钮 */}
          <div className="flex justify-end">
            <button
              onClick={openAddItem}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加物品
            </button>
          </div>

          {/* 按分类展示物品 */}
          {groupedItems.map((group) => (
            <div key={group.category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{group.category.category}</h3>
                  <span className="text-sm text-gray-500">{group.items.length} 件物品</span>
                </div>
              </div>
              <div className="p-6">
                {group.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {item.image && (
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <span className="text-xs text-gray-400">排序：{item.sort_order}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                          {item.details && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.details}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => openEditItem(item)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Edit2 size={14} />
                              编辑
                            </button>
                            <button
                              onClick={() => item.id && deleteItem(item.id)}
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
                ) : (
                  <div className="text-center py-8 text-gray-400">该分类暂无物品</div>
                )}
              </div>
            </div>
          ))}

          {/* 未分类物品 */}
          {uncategorizedItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">未分类</h3>
                  <span className="text-sm text-gray-500">{uncategorizedItems.length} 件物品</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uncategorizedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {item.image && (
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <span className="text-xs text-gray-400">排序：{item.sort_order}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                        {item.details && (
                          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.details}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => openEditItem(item)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 size={14} />
                            编辑
                          </button>
                          <button
                            onClick={() => item.id && deleteItem(item.id)}
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
              </div>
            </div>
          )}

          {/* 无任何物品 */}
          {formData.items?.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-400">暂无物品，点击上方按钮添加</p>
            </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  value={editingCategory.category}
                  onChange={(e) => setEditingCategory({ ...editingCategory, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
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

      {showItemModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingItem.id ? '编辑物品' : '添加物品'}
              </h3>
              <button
                onClick={() => { setShowItemModal(false); setEditingItem(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属分类</label>
                <select
                  value={editingItem.category_id}
                  onChange={(e) => setEditingItem({ ...editingItem, category_id: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                >
                  {formData.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">物品名称</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <ImageUploader
                  label="图片"
                  value={editingItem.image}
                  onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详情</label>
                <textarea
                  value={editingItem.details}
                  onChange={(e) => setEditingItem({ ...editingItem, details: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingItem.sort_order}
                  onChange={(e) => setEditingItem({ ...editingItem, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowItemModal(false); setEditingItem(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveItem}
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

export default AdminEquipment;