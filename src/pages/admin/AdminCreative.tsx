import { useState, useEffect } from 'react';
import { RotateCcw, Plus, Edit2, Trash2, X, Star, StarOff, Upload, ChevronLeft, ChevronRight, Crown, Sticker } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

interface CategoryItem {
  id: number;
  name: string;
  sort_order: number;
}

interface ProductItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
  detail_images: string[];
  price: number;
  badge: string;
  is_featured: boolean;
  is_sold_out: boolean;
  sort_order: number;
}

interface StickerItem {
  id: number;
  name: string;
  description: string;
  image: string;
  sort_order: number;
}

export function AdminCreative() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    categories: [] as CategoryItem[],
    products: [] as ProductItem[],
  });

  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // 表情包相关状态
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [editingSticker, setEditingSticker] = useState<Partial<StickerItem> | null>(null);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [stickerUploading, setStickerUploading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStickers();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/creative/admin');
      setFormData(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取数据失败' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStickers = async () => {
    try {
      const response = await api.get('/creative/stickers');
      setStickers(response.data);
    } catch (err: any) {
      console.error('获取表情包失败:', err);
    }
  };

  const handleReset = () => {
    fetchData();
    setMessage({ type: '', text: '' });
  };

  const openAddCategory = () => {
    setEditingCategory({ name: '', sort_order: formData.categories.length + 1 });
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
        await api.put(`/creative/categories/${editingCategory.id}`, editingCategory);
      } else {
        await api.post('/creative/categories', editingCategory);
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
    if (!confirm('确定要删除这个分类吗？删除后该分类下的商品也会被删除。')) return;
    try {
      await api.delete(`/creative/categories/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddProduct = () => {
    setEditingProduct({
      category_id: formData.categories[0]?.id || 0,
      name: '',
      description: '',
      image: '',
      detail_images: [],
      price: 0,
      badge: '',
      is_featured: false,
      is_sold_out: false,
      sort_order: formData.products.length + 1,
    });
    setShowProductModal(true);
  };

  const openEditProduct = (item: ProductItem) => {
    setEditingProduct({
      ...item,
      detail_images: Array.isArray(item.detail_images) ? [...item.detail_images] : [],
    } as Partial<ProductItem>);
    setShowProductModal(true);
  };

  const toggleFeatured = async (item: ProductItem) => {
    try {
      await api.put(`/creative/products/${item.id}`, { is_featured: !item.is_featured });
      fetchData();
      setMessage({ type: 'success', text: item.is_featured ? '已取消精选' : '已设为精选' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '操作失败' });
    }
  };

  const toggleSoldOut = async (item: ProductItem) => {
    try {
      await api.put(`/creative/products/${item.id}`, { is_sold_out: !item.is_sold_out });
      fetchData();
      setMessage({ type: 'success', text: item.is_sold_out ? '已恢复库存' : '已设为售罄' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '操作失败' });
    }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    try {
      if (editingProduct.id) {
        await api.put(`/creative/products/${editingProduct.id}`, editingProduct);
      } else {
        await api.post('/creative/products', editingProduct);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('确定要删除这个商品吗？')) return;
    try {
      await api.delete(`/creative/products/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  // ==================== 表情包管理函数 ====================

  const openAddSticker = () => {
    setEditingSticker({
      name: '',
      description: '',
      image: '',
      sort_order: stickers.length + 1,
    });
    setShowStickerModal(true);
  };

  const openEditSticker = (item: StickerItem) => {
    setEditingSticker({ ...item });
    setShowStickerModal(true);
  };

  const handleStickerImageUpload = async (file: File) => {
    if (!file) return;
    setStickerUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setEditingSticker((prev) => prev ? { ...prev, image: res.data.url } : prev);
      } else {
        setMessage({ type: 'error', text: '图片上传失败' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '图片上传失败' });
    } finally {
      setStickerUploading(false);
    }
  };

  const saveSticker = async () => {
    if (!editingSticker) return;
    if (!editingSticker.name || !editingSticker.image) {
      setMessage({ type: 'error', text: '名称和图片不能为空' });
      return;
    }
    try {
      if (editingSticker.id) {
        await api.put(`/creative/stickers/${editingSticker.id}`, {
          name: editingSticker.name,
          description: editingSticker.description,
          image: editingSticker.image,
          sort_order: editingSticker.sort_order,
        });
      } else {
        await api.post('/creative/stickers', {
          name: editingSticker.name,
          description: editingSticker.description,
          image: editingSticker.image,
          sort_order: editingSticker.sort_order,
        });
      }
      setShowStickerModal(false);
      setEditingSticker(null);
      fetchStickers();
      setMessage({ type: 'success', text: '表情包保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteSticker = async (id: number) => {
    if (!confirm('确定要删除这个表情包吗？')) return;
    try {
      await api.delete(`/creative/stickers/${id}`);
      fetchStickers();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const getCategoryName = (categoryId: number) => {
    const cat = formData.categories.find((c) => c.id === categoryId);
    return cat?.name || '未分类';
  };

  const groupedProducts = formData.categories
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      category,
      products: formData.products
        .filter((item) => item.category_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));

  const uncategorizedProducts = formData.products
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
        <h1 className="text-2xl font-bold text-gray-800">文创商品管理</h1>
        <div className="flex gap-2">
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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {formData.categories?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.products.filter((p) => p.category_id === item.id).length} 件商品
                  </p>
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

          {formData.categories?.length === 0 && (
            <div className="text-center py-8 text-gray-400">暂无分类</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={openAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
            >
              <Plus size={18} />
              添加商品
            </button>
          </div>

          {groupedProducts.map((group) => (
            <div key={group.category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{group.category.name}</h3>
                  <span className="text-sm text-gray-500">{group.products.length} 件商品</span>
                </div>
              </div>
              <div className="p-6">
                {group.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.products.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-square bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className={`w-full h-full object-cover ${item.is_sold_out ? 'opacity-60' : ''}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              无图片
                            </div>
                          )}
                          {item.is_sold_out && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="px-3 py-1.5 bg-gray-800/80 text-white text-xs font-bold rounded">
                                已售罄
                              </span>
                            </div>
                          )}
                          {item.is_featured && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-yingge-gold text-white text-xs rounded-full font-medium">
                              精选
                            </div>
                          )}
                          {item.badge && !item.is_sold_out && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-yingge-red text-white text-xs rounded-full">
                              {item.badge}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                            {item.is_sold_out ? (
                              <span className="text-gray-400 font-bold text-sm line-through whitespace-nowrap ml-2">
                                ¥{item.price}
                              </span>
                            ) : (
                              <span className="text-yingge-red font-bold text-sm whitespace-nowrap ml-2">
                                ¥{item.price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => toggleSoldOut(item)}
                              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                                item.is_sold_out
                                  ? 'text-gray-600 border-gray-400 bg-gray-100'
                                  : 'text-orange-500 border-orange-300 hover:bg-orange-50'
                              }`}
                            >
                              {item.is_sold_out ? '恢复库存' : '设为售罄'}
                            </button>
                            <button
                              onClick={() => toggleFeatured(item)}
                              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                                item.is_featured
                                  ? 'text-yingge-gold border-yingge-gold bg-yingge-gold/5'
                                  : 'text-gray-500 border-gray-200 hover:border-yingge-gold hover:text-yingge-gold'
                              }`}
                            >
                              {item.is_featured ? <Star size={12} className="fill-current" /> : <StarOff size={12} />}
                              {item.is_featured ? '精选中' : '设精选'}
                            </button>
                            <button
                              onClick={() => openEditProduct(item)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Edit2 size={12} />
                              编辑
                            </button>
                            <button
                              onClick={() => item.id && deleteProduct(item.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={12} />
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">该分类暂无商品</div>
                )}
              </div>
            </div>
          ))}

          {uncategorizedProducts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">未分类</h3>
                  <span className="text-sm text-gray-500">{uncategorizedProducts.length} 件商品</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {uncategorizedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            无图片
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                        <span className="text-yingge-red font-bold text-sm">¥{item.price}</span>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => openEditProduct(item)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 size={12} />
                            编辑
                          </button>
                          <button
                            onClick={() => item.id && deleteProduct(item.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
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

          {formData.products?.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-400">暂无商品，点击上方按钮添加</p>
            </div>
          )}
        </div>

        {/* 表情包管理 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sticker size={20} className="text-yingge-red" />
                <h3 className="font-semibold text-gray-800">表情包管理</h3>
                <span className="text-sm text-gray-500">{stickers.length} 张</span>
              </div>
              <button
                onClick={openAddSticker}
                className="flex items-center gap-2 px-3 py-1.5 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors text-sm"
              >
                <Plus size={16} />
                添加表情包
              </button>
            </div>
          </div>
          <div className="p-6">
            {stickers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stickers.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          无图片
                        </div>
                      )}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yingge-gold text-yingge-dark text-xs font-bold rounded">
                        {item.sort_order}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => openEditSticker(item)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 size={12} />
                          编辑
                        </button>
                        <button
                          onClick={() => deleteSticker(item.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} />
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Sticker size={40} className="mx-auto mb-3 opacity-30" />
                <p>暂无表情包，点击上方按钮添加</p>
              </div>
            )}
          </div>
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
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="如：手办模型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingCategory.sort_order || 0}
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

      {showProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingProduct.id ? '编辑商品' : '添加商品'}
              </h3>
              <button
                onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属分类</label>
                <select
                  value={editingProduct.category_id || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category_id: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                >
                  {formData.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="请输入商品名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                  placeholder="请输入商品描述"
                />
              </div>
              <div>
                <ImageUploader
                  label="主图（商品列表展示）"
                  value={editingProduct.image || ''}
                  onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                  category="creative-products"
                />
              </div>
              <div>
                <MultiImageUploader
                  label="细节图（最多9张，详情页可滑动浏览）"
                  images={editingProduct.detail_images || []}
                  onChange={(imgs) => setEditingProduct({ ...editingProduct, detail_images: imgs })}
                  category="creative-products"
                  maxCount={9}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格 (元)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签 (可选)</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                    placeholder="如：热销、新品"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="w-4 h-4 text-yingge-red focus:ring-yingge-red rounded"
                  />
                  <span className="text-sm text-gray-700">设为首页精选</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_sold_out || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_sold_out: e.target.checked })}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">已售罄</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingProduct.sort_order || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveProduct}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 表情包编辑弹窗 */}
      {showStickerModal && editingSticker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingSticker.id ? '编辑表情包' : '添加表情包'}
              </h3>
              <button
                onClick={() => { setShowStickerModal(false); setEditingSticker(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">表情包名称</label>
                <input
                  type="text"
                  value={editingSticker.name || ''}
                  onChange={(e) => setEditingSticker({ ...editingSticker, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  placeholder="如：加油打气"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editingSticker.description || ''}
                  onChange={(e) => setEditingSticker({ ...editingSticker, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                  placeholder="表情包的描述文字"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">表情包图片</label>
                {editingSticker.image ? (
                  <div className="relative">
                    <img
                      src={editingSticker.image}
                      alt="预览"
                      className="w-full aspect-square object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => setEditingSticker({ ...editingSticker, image: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center py-8 ${stickerUploading ? 'border-yingge-gold bg-yingge-gold/5' : 'border-gray-300 bg-gray-50 hover:border-yingge-gold hover:bg-yingge-gold/5'}`}>
                    {stickerUploading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-gray-500 text-sm">上传中...</span>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-yingge-gold/10 rounded-full mb-2">
                          <Upload size={20} className="text-yingge-gold" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">点击上传表情包图片</p>
                        <p className="text-xs text-gray-400 mt-1">支持 JPG/PNG/WebP，最大 10MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleStickerImageUpload(e.target.files[0])}
                      disabled={stickerUploading}
                    />
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingSticker.sort_order || 0}
                  onChange={(e) => setEditingSticker({ ...editingSticker, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowStickerModal(false); setEditingSticker(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveSticker}
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

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxCount?: number;
  category?: string;
}

function MultiImageUploader({
  images,
  onChange,
  label = '细节图',
  maxCount = 9,
  category = 'default',
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxCount - images.length;
    if (remaining <= 0) {
      setError(`最多只能上传 ${maxCount} 张图片`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const fileArray = Array.from(files).slice(0, remaining);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} 超过 10MB 限制`);
        return;
      }
      if (!validTypes.includes(file.type)) {
        setError(`${file.name} 格式不支持`);
        return;
      }
      validFiles.push(file);
    }

    setError('');
    setUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', category);
        const res = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          uploaded.push(res.data.url);
        }
      }
      const next = [...images, ...uploaded].slice(0, maxCount);
      onChange(next);
    } catch (err: any) {
      setError(err.response?.data?.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const handleMove = (idx: number, dir: number) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= images.length) return;
    const next = [...images];
    [next[idx], next[ni]] = [next[ni], next[idx]];
    onChange(next);
  };

  const handleSetAsCover = (idx: number) => {
    // 通知父组件：设置主图由父组件自己的 image state 处理，这里仅复制到剪贴板提示
    alert(`请将此图（第${idx + 1}张）复制为主图：\n${images[idx]}`);
  };

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <span className="text-xs text-gray-400">
            {images.length}/{maxCount}
          </span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white group"
            >
              <img src={url} alt={`细节${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(i, -1)}
                  disabled={i === 0}
                  className="p-1 bg-white/90 rounded-full hover:bg-white disabled:opacity-30"
                  title="前移"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(i, 1)}
                  disabled={i === images.length - 1}
                  className="p-1 bg-white/90 rounded-full hover:bg-white disabled:opacity-30"
                  title="后移"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="删除"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yingge-gold text-yingge-dark text-xs font-bold rounded">
                {i + 1}
              </div>
            </div>
          ))}

          {images.length < maxCount && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-yingge-gold hover:bg-yingge-gold/5 cursor-pointer flex flex-col items-center justify-center text-gray-400 transition-all">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-yingge-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={20} className="mb-1" />
                  <span className="text-xs">上传</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      )}

      {images.length === 0 && (
        <label
          className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center py-8 ${
            uploading
              ? 'border-yingge-gold bg-yingge-gold/5'
              : 'border-gray-300 bg-gray-50 hover:border-yingge-gold hover:bg-yingge-gold/5'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-gray-500 text-sm">上传中...</span>
            </>
          ) : (
            <>
              <div className="p-2 bg-yingge-gold/10 rounded-full mb-2">
                <Upload size={20} className="text-yingge-gold" />
              </div>
              <p className="text-sm text-gray-600 font-medium">点击选择细节图（可多选）</p>
              <p className="text-xs text-gray-400 mt-1">或拖拽到此处，最多 {maxCount} 张</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={uploading}
          />
        </label>
      )}

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default AdminCreative;
