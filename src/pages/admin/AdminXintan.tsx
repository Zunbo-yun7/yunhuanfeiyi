import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import ImageUploaderMultiple from '@/components/ImageUploaderMultiple';
import { SortableList, SortToggle } from '@/components/SortableList';

interface AchievementItem {
  id?: number;
  content: string;
  sort_order: number;
}

interface StoryItem {
  id?: number;
  title: string;
  content: string;
  image: string;
  sort_order: number;
}

interface TeamMemberItem {
  id?: number;
  name: string;
  age?: number;
  mbti: string;
  college: string;
  grade: string;
  class: string;
  avatar: string;
  introduction: string;
  sort_order: number;
}

export function AdminXintan() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    village: {
      name: '',
      description: '',
      history: '',
      image: '',
    },
    team: {
      name: '',
      founded: '',
      description: '',
      images: [] as string[],
    },
    teamImagesStr: '',
    achievements: [] as AchievementItem[],
    training: {
      description: '',
      images: [] as string[],
    },
    trainingImagesStr: '',
    stories: [] as StoryItem[],
    members: [] as TeamMemberItem[],
  });
  const [sortMode, setSortMode] = useState(false);

  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/xintan');
      const data = response.data;
      setFormData({
        ...data,
        teamImagesStr: data.team?.images?.join(',') || '',
        trainingImagesStr: data.training?.images?.join(',') || '',
        members: data.members || [],
      });
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
      await api.put('/xintan/village', formData.village);
      await api.put('/xintan/team', {
        ...formData.team,
        images: formData.teamImagesStr.split(',').filter(Boolean),
      });
      await api.put('/xintan/training', {
        ...formData.training,
        images: formData.trainingImagesStr.split(',').filter(Boolean),
      });
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

  const handleAchievementReorder = (achievements: AchievementItem[]) => {
    setFormData((prev) => ({ ...prev, achievements }));
    saveSortOrder(achievements, '/xintan/team/achievements');
  };

  const handleStoryReorder = (stories: StoryItem[]) => {
    setFormData((prev) => ({ ...prev, stories }));
    saveSortOrder(stories, '/xintan/stories');
  };

  const handleMemberReorder = (members: TeamMemberItem[]) => {
    setFormData((prev) => ({ ...prev, members }));
    saveSortOrder(members, '/xintan/team/members');
  };

  const openAddMember = () => {
    setEditingMember({ name: '', age: undefined, mbti: '', college: '', grade: '', class: '', avatar: '', introduction: '', sort_order: formData.members.length + 1 });
    setShowMemberModal(true);
  };

  const openEditMember = (item: TeamMemberItem) => {
    setEditingMember({ ...item });
    setShowMemberModal(true);
  };

  const saveMember = async () => {
    if (!editingMember) return;
    try {
      if (editingMember.id) {
        await api.put(`/xintan/team/members/${editingMember.id}`, editingMember);
      } else {
        await api.post('/xintan/team/members', editingMember);
      }
      setShowMemberModal(false);
      setEditingMember(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteMember = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/xintan/team/members/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddAchievement = () => {
    setEditingAchievement({ content: '', sort_order: formData.achievements.length + 1 });
    setShowAchievementModal(true);
  };

  const openEditAchievement = (item: AchievementItem) => {
    setEditingAchievement({ ...item });
    setShowAchievementModal(true);
  };

  const saveAchievement = async () => {
    if (!editingAchievement) return;
    try {
      if (editingAchievement.id) {
        await api.put(`/xintan/team/achievements/${editingAchievement.id}`, editingAchievement);
      } else {
        await api.post('/xintan/team/achievements', editingAchievement);
      }
      setShowAchievementModal(false);
      setEditingAchievement(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteAchievement = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/xintan/team/achievements/${id}`);
      fetchData();
      setMessage({ type: 'success', text: '删除成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '删除失败' });
    }
  };

  const openAddStory = () => {
    setEditingStory({ title: '', content: '', image: '', sort_order: formData.stories.length + 1 });
    setShowStoryModal(true);
  };

  const openEditStory = (item: StoryItem) => {
    setEditingStory({ ...item });
    setShowStoryModal(true);
  };

  const saveStory = async () => {
    if (!editingStory) return;
    try {
      if (editingStory.id) {
        await api.put(`/xintan/stories/${editingStory.id}`, editingStory);
      } else {
        await api.post('/xintan/stories', editingStory);
      }
      setShowStoryModal(false);
      setEditingStory(null);
      fetchData();
      setMessage({ type: 'success', text: '保存成功！' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '保存失败' });
    }
  };

  const deleteStory = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await api.delete(`/xintan/stories/${id}`);
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
        <h1 className="text-2xl font-bold text-gray-800">新坛英歌管理</h1>
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

      {sortMode && (
        <div className="mb-6 p-4 bg-yingge-gold/10 border border-yingge-gold/30 rounded-lg">
          <p className="text-yingge-gold text-sm font-medium">
            💡 排序模式已开启：将鼠标悬停在卡片左侧，拖动绿色手柄调整顺序
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">村庄信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">村庄名称</label>
              <input
                type="text"
                value={formData.village.name}
                onChange={(e) =>
                  setFormData({ ...formData, village: { ...formData.village, name: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">村庄描述</label>
              <textarea
                value={formData.village.description}
                onChange={(e) =>
                  setFormData({ ...formData, village: { ...formData.village, description: e.target.value } })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">村庄历史</label>
              <textarea
                value={formData.village.history}
                onChange={(e) =>
                  setFormData({ ...formData, village: { ...formData.village, history: e.target.value } })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                label="村庄图片"
                value={formData.village.image}
                onChange={(url) =>
                  setFormData({ ...formData, village: { ...formData.village, image: url } })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">英歌队信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">英歌队名称</label>
              <input
                type="text"
                value={formData.team.name}
                onChange={(e) =>
                  setFormData({ ...formData, team: { ...formData.team, name: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">成立时间</label>
              <input
                type="text"
                value={formData.team.founded}
                onChange={(e) =>
                  setFormData({ ...formData, team: { ...formData.team, founded: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">英歌队描述</label>
              <textarea
                value={formData.team.description}
                onChange={(e) =>
                  setFormData({ ...formData, team: { ...formData.team, description: e.target.value } })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploaderMultiple
                label="图片"
                value={formData.teamImagesStr}
                onChange={(urls) => setFormData({ ...formData, teamImagesStr: urls })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">英歌队成就</h2>
            <button
              onClick={openAddAchievement}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          </div>

          {sortMode ? (
            <SortableList
              items={formData.achievements}
              setItems={(achievements) => setFormData((prev) => ({ ...prev, achievements }))}
              onReorder={handleAchievementReorder}
              className="space-y-3"
            >
              {(item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-yingge-gold/10 text-yingge-gold font-bold rounded-full">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-1">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditAchievement(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => item.id && deleteAchievement(item.id)}
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
              {formData.achievements?.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-yingge-gold/10 text-yingge-gold font-bold rounded-full">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-1">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditAchievement(item)}
                      className="p-2 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => item.id && deleteAchievement(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.achievements?.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无数据</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">训练介绍</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">训练描述</label>
              <textarea
                value={formData.training.description}
                onChange={(e) =>
                  setFormData({ ...formData, training: { ...formData.training, description: e.target.value } })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div>
              <ImageUploaderMultiple
                label="训练图片"
                value={formData.trainingImagesStr}
                onChange={(urls) => setFormData({ ...formData, trainingImagesStr: urls })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">英歌故事</h2>
            <button
              onClick={openAddStory}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          </div>

          {sortMode ? (
            <SortableList
              items={formData.stories}
              setItems={(stories) => setFormData((prev) => ({ ...prev, stories }))}
              onReorder={handleStoryReorder}
              className="space-y-4"
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
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-2">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditStory(item)}
                      className="p-1.5 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => item.id && deleteStory(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="space-y-4">
              {formData.stories?.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-2">排序：{item.sort_order}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditStory(item)}
                      className="p-1.5 text-gray-500 hover:text-yingge-gold hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => item.id && deleteStory(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.stories?.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无数据</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">队伍成员</h2>
            <button
              onClick={openAddMember}
              className="flex items-center gap-2 px-3 py-1.5 bg-yingge-gold text-white rounded-lg hover:bg-yingge-gold/90 transition-colors text-sm"
            >
              <Plus size={16} />
              添加成员
            </button>
          </div>

          {sortMode ? (
            <SortableList<TeamMemberItem>
              items={formData.members}
              setItems={(members) => setFormData((prev) => ({ ...prev, members }))}
              onReorder={handleMemberReorder}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {(item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {item.avatar ? (
                    <div className="aspect-square bg-gray-100">
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <div className="w-16 h-16 bg-yingge-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-yingge-gold text-xl font-bold">{item.name.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      {item.mbti && (
                        <span className="text-xs px-2 py-0.5 bg-yingge-gold/20 text-yingge-gold rounded-full">
                          {item.mbti}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1 mb-2">
                      {item.age && <p>年龄：{item.age}</p>}
                      {item.college && <p>学院：{item.college}</p>}
                      {item.grade && <p>年级：{item.grade}</p>}
                      {item.class && <p>班级：{item.class}</p>}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.introduction}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditMember(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 size={12} />
                        编辑
                      </button>
                      <button
                        onClick={() => item.id && deleteMember(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={12} />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </SortableList>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.members?.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {item.avatar ? (
                    <div className="aspect-square bg-gray-100">
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <div className="w-16 h-16 bg-yingge-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-yingge-gold text-xl font-bold">{item.name.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      {item.mbti && (
                        <span className="text-xs px-2 py-0.5 bg-yingge-gold/20 text-yingge-gold rounded-full">
                          {item.mbti}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1 mb-2">
                      {item.age && <p>年龄：{item.age}</p>}
                      {item.college && <p>学院：{item.college}</p>}
                      {item.grade && <p>年级：{item.grade}</p>}
                      {item.class && <p>班级：{item.class}</p>}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.introduction}</p>
                  </div>
                </div>
              ))}
              {formData.members?.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">暂无数据</div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAchievementModal && editingAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingAchievement.id ? '编辑成就' : '添加成就'}
              </h3>
              <button
                onClick={() => { setShowAchievementModal(false); setEditingAchievement(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">成就内容</label>
                <textarea
                  value={editingAchievement.content}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingAchievement.sort_order}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAchievementModal(false); setEditingAchievement(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveAchievement}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showStoryModal && editingStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingStory.id ? '编辑故事' : '添加故事'}
              </h3>
              <button
                onClick={() => { setShowStoryModal(false); setEditingStory(null); }}
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
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={editingStory.content}
                  onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <ImageUploader
                  label="图片"
                  value={editingStory.image}
                  onChange={(url) => setEditingStory({ ...editingStory, image: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingStory.sort_order}
                  onChange={(e) => setEditingStory({ ...editingStory, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowStoryModal(false); setEditingStory(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveStory}
                className="flex-1 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-yingge-red/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showMemberModal && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingMember.id ? '编辑成员' : '添加成员'}
              </h3>
              <button
                onClick={() => { setShowMemberModal(false); setEditingMember(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                  <input
                    type="number"
                    value={editingMember.age || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, age: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MBTI</label>
                <input
                  type="text"
                  value={editingMember.mbti}
                  onChange={(e) => setEditingMember({ ...editingMember, mbti: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学院</label>
                <input
                  type="text"
                  value={editingMember.college}
                  onChange={(e) => setEditingMember({ ...editingMember, college: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年级</label>
                  <input
                    type="text"
                    value={editingMember.grade}
                    onChange={(e) => setEditingMember({ ...editingMember, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">班级</label>
                  <input
                    type="text"
                    value={editingMember.class}
                    onChange={(e) => setEditingMember({ ...editingMember, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <ImageUploader
                  label="头像"
                  value={editingMember.avatar}
                  onChange={(url) => setEditingMember({ ...editingMember, avatar: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自我介绍</label>
                <textarea
                  value={editingMember.introduction}
                  onChange={(e) => setEditingMember({ ...editingMember, introduction: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingMember.sort_order}
                  onChange={(e) => setEditingMember({ ...editingMember, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowMemberModal(false); setEditingMember(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveMember}
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

export default AdminXintan;
