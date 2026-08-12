import { useState, useEffect } from 'react';
import {
  Save, Plus, Edit2, Trash2, X, Calendar, MapPin, Clock, Users, Music,
  ChevronDown, ChevronUp, AlertCircle, MapPinned, UserPlus, Repeat
} from 'lucide-react';
import api from '@/lib/api';
import { SortableList } from '@/components/SortableList';

interface Program {
  id?: number;
  name: string;
  duration: number;
  description: string;
}

interface Member {
  id?: number;
  name: string;
  role: string;
}

interface Schedule {
  id?: number;
  title: string;
  performance_time: string;
  location: string;
  duration: number;
  status: string;
  notes: string;
  programs: Program[];
  members: Member[];
  sort_order: number;
}

interface LocationItem {
  id: number;
  name: string;
  address: string;
}

interface CastMemberItem {
  id: number;
  name: string;
  role: string;
  phone: string;
}

interface Recurrence {
  enabled: boolean;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  days: number[];
  endDate: string;
  count: number;
}

const emptySchedule: Schedule = {
  title: '',
  performance_time: '',
  location: '',
  duration: 60,
  status: 'upcoming',
  notes: '',
  programs: [],
  members: [],
  sort_order: 0
};

const emptyRecurrence: Recurrence = {
  enabled: false,
  frequency: 'weekly',
  days: [],
  endDate: '',
  count: 4
};

const emptyLocation: LocationItem = { id: 0, name: '', address: '' };
const emptyCastMember: CastMemberItem = { id: 0, name: '', role: '', phone: '' };

const weekDays = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 0, label: '周日' },
];

const freqOptions = [
  { value: 'weekly', label: '每周' },
  { value: 'biweekly', label: '每两周' },
  { value: 'monthly', label: '每月' },
];

// 自动计算演出状态（前端展示用）
const computeAutoStatus = (schedule: Schedule): { label: string; color: string } => {
  if (schedule.status === 'cancelled') {
    return { label: '已取消', color: 'bg-red-100 text-red-700' };
  }
  const now = new Date().getTime();
  const start = new Date(schedule.performance_time).getTime();
  const end = start + (schedule.duration || 60) * 60 * 1000;

  if (now >= start && now <= end) {
    return { label: '正在进行', color: 'bg-green-100 text-green-700' };
  }
  if (now < start) {
    const minsUntil = Math.floor((start - now) / 60000);
    if (minsUntil <= 60) {
      return { label: `即将开始（${minsUntil}分钟后）`, color: 'bg-orange-100 text-orange-700' };
    }
    return { label: '即将演出', color: 'bg-blue-100 text-blue-700' };
  }
  return { label: '已结束', color: 'bg-gray-100 text-gray-700' };
};

export function AdminSchedules() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [recurrence, setRecurrence] = useState<Recurrence>(emptyRecurrence);

  // 地点库
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);

  // 演职人员库
  const [castMembers, setCastMembers] = useState<CastMemberItem[]>([]);
  const [showCastModal, setShowCastModal] = useState(false);
  const [editingCastMember, setEditingCastMember] = useState<CastMemberItem | null>(null);
  const [selectedCastIds, setSelectedCastIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchSchedules();
    fetchLocations();
    fetchCastMembers();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: '获取数据失败' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get('/schedule-locations');
      setLocations(response.data);
    } catch (error) {
      console.error('获取地点失败:', error);
    }
  };

  const fetchCastMembers = async () => {
    try {
      const response = await api.get('/schedule-cast');
      setCastMembers(response.data);
    } catch (error) {
      console.error('获取演职人员失败:', error);
    }
  };

  const handleSave = async () => {
    if (!editingSchedule) return;

    if (!editingSchedule.title || !editingSchedule.performance_time || !editingSchedule.location) {
      setMessage({ type: 'error', text: '请填写演出名称、时间和地点' });
      return;
    }

    try {
      setSaving(true);
      const payload: any = { ...editingSchedule };

      // 周期性设置只在新建时生效
      if (!editingSchedule.id && recurrence.enabled) {
        payload.recurrence = recurrence;
      }

      if (editingSchedule.id) {
        await api.put(`/schedules/${editingSchedule.id}`, payload);
        setMessage({ type: 'success', text: '更新成功' });
      } else {
        const response = await api.post('/schedules', payload);
        if (response.data.count) {
          setMessage({ type: 'success', text: `成功创建 ${response.data.count} 场演出` });
        } else {
          setMessage({ type: 'success', text: '创建成功' });
        }
      }
      setShowModal(false);
      setEditingSchedule(null);
      setRecurrence(emptyRecurrence);
      setSelectedCastIds(new Set());
      fetchSchedules();
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这场演出吗？')) return;
    try {
      await api.delete(`/schedules/${id}`);
      setMessage({ type: 'success', text: '删除成功' });
      fetchSchedules();
    } catch (err: any) {
      const msg = err.response?.status === 401
        ? '登录已过期，请重新登录'
        : err.response?.data?.message || '删除失败，请稍后重试';
      setMessage({ type: 'error', text: msg });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleReorder = async (items: any[]) => {
    try {
      const order = items.map((item, index) => ({ id: String(item.id), sort_order: index }));
      await api.put('/schedules/reorder', { order });
    } catch (error) {
      console.error('排序失败', error);
    }
  };

  // 地点管理
  const saveLocation = async () => {
    if (!editingLocation || !editingLocation.name) return;
    try {
      if (editingLocation.id) {
        await api.put(`/schedule-locations/${editingLocation.id}`, editingLocation);
      } else {
        await api.post('/schedule-locations', editingLocation);
      }
      setEditingLocation(null);
      fetchLocations();
    } catch (error) {
      console.error('保存地点失败:', error);
    }
  };

  const deleteLocation = async (id: number) => {
    if (!confirm('确定删除该地点？')) return;
    try {
      await api.delete(`/schedule-locations/${id}`);
      fetchLocations();
    } catch (error) {
      console.error('删除地点失败:', error);
    }
  };

  // 演职人员库管理
  const saveCastMember = async () => {
    if (!editingCastMember || !editingCastMember.name) return;
    try {
      if (editingCastMember.id) {
        await api.put(`/schedule-cast/${editingCastMember.id}`, editingCastMember);
      } else {
        await api.post('/schedule-cast', editingCastMember);
      }
      setEditingCastMember(null);
      fetchCastMembers();
    } catch (error) {
      console.error('保存演职人员失败:', error);
    }
  };

  const deleteCastMember = async (id: number) => {
    if (!confirm('确定删除该人员？')) return;
    try {
      await api.delete(`/schedule-cast/${id}`);
      fetchCastMembers();
    } catch (error) {
      console.error('删除演职人员失败:', error);
    }
  };

  // 从人员库添加人员到演出
  const addCastToSchedule = (member: CastMemberItem) => {
    if (!editingSchedule) return;
    const exists = editingSchedule.members.some(m => m.name === member.name);
    if (exists) return;
    setEditingSchedule({
      ...editingSchedule,
      members: [...editingSchedule.members, { name: member.name, role: member.role }]
    });
  };

  // 周期设置辅助
  const toggleDay = (day: number) => {
    setRecurrence(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  const addProgram = () => {
    if (!editingSchedule) return;
    setEditingSchedule({
      ...editingSchedule,
      programs: [...editingSchedule.programs, { name: '', duration: 0, description: '' }]
    });
  };

  const updateProgram = (index: number, field: keyof Program, value: string | number) => {
    if (!editingSchedule) return;
    const newPrograms = [...editingSchedule.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    setEditingSchedule({ ...editingSchedule, programs: newPrograms });
  };

  const removeProgram = (index: number) => {
    if (!editingSchedule) return;
    setEditingSchedule({
      ...editingSchedule,
      programs: editingSchedule.programs.filter((_, i) => i !== index)
    });
  };

  const addMember = () => {
    if (!editingSchedule) return;
    setEditingSchedule({
      ...editingSchedule,
      members: [...editingSchedule.members, { name: '', role: '' }]
    });
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    if (!editingSchedule) return;
    const newMembers = [...editingSchedule.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setEditingSchedule({ ...editingSchedule, members: newMembers });
  };

  const removeMember = (index: number) => {
    if (!editingSchedule) return;
    setEditingSchedule({
      ...editingSchedule,
      members: editingSchedule.members.filter((_, i) => i !== index)
    });
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return '';
    return new Date(datetime).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yingge-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-yingge-red">演出时间表管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理英歌舞演出的时间、地点、节目和演职人员信息</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingSchedule({ ...emptySchedule });
              setRecurrence(emptyRecurrence);
              setSelectedCastIds(new Set());
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={18} /> 添加演出
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* 快捷管理入口 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <MapPinned size={16} /> 地点库
        </button>
        <button
          onClick={() => setShowCastModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserPlus size={16} /> 演职人员库
        </button>
      </div>

      <SortableList
        items={schedules.map(s => ({ id: String(s.id), ...s }))}
        setItems={(items) => setSchedules(items as Schedule[])}
        onReorder={handleReorder}
      >
        {(schedule) => {
          const isExpanded = expandedIds.has(schedule.id);
          const autoStatus = computeAutoStatus(schedule as Schedule);
          return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(schedule.id)}
              >
                <button className="text-gray-400 hover:text-gray-600">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{schedule.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${autoStatus.color}`}>
                      {autoStatus.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {formatDateTime((schedule as Schedule).performance_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {schedule.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {schedule.duration}分钟
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSchedule({ ...schedule, id: Number(schedule.id) });
                      setRecurrence(emptyRecurrence);
                      setSelectedCastIds(new Set());
                      setShowModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(Number(schedule.id));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                  {schedule.programs && schedule.programs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                        <Music size={16} /> 节目单
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {schedule.programs.map((p, i) => (
                          <div key={i} className="bg-white p-2 rounded border border-gray-200">
                            <div className="font-medium text-sm">{p.name}</div>
                            {p.duration > 0 && <div className="text-xs text-gray-500">{p.duration}分钟</div>}
                            {p.description && <div className="text-xs text-gray-400 mt-1">{p.description}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {schedule.members && schedule.members.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                        <Users size={16} /> 演职人员
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {schedule.members.map((m, i) => (
                          <div key={i} className="bg-white px-3 py-1 rounded-full border border-gray-200 text-sm">
                            {m.name}
                            {m.role && <span className="text-gray-400 ml-1">({m.role})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {schedule.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">备注</h4>
                      <p className="text-sm text-gray-600">{schedule.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
      </SortableList>

      {/* 编辑/新增模态框 */}
      {showModal && editingSchedule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-yingge-red text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl">
                {editingSchedule.id ? '编辑演出' : '添加演出'}
              </h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">演出名称 *</label>
                  <input
                    type="text"
                    value={editingSchedule.title}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-red/20 focus:border-yingge-red"
                    placeholder="例：2025年春节英歌舞专场演出"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">演出时间 *</label>
                  <input
                    type="datetime-local"
                    value={editingSchedule.performance_time ? editingSchedule.performance_time.slice(0, 16) : ''}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, performance_time: e.target.value + ':00' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-red/20 focus:border-yingge-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">演出地点 *</label>
                  <div className="flex gap-2">
                    <select
                      value={locations.find(l => l.name === editingSchedule.location)?.id || ''}
                      onChange={(e) => {
                        const loc = locations.find(l => l.id === Number(e.target.value));
                        if (loc) setEditingSchedule({ ...editingSchedule, location: loc.name });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-red/20 focus:border-yingge-red text-sm"
                    >
                      <option value="">快速选择地点库...</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={editingSchedule.location}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-red/20 focus:border-yingge-red mt-2"
                    placeholder="例：揭阳市普宁新坛村文化广场"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">预计时长（分钟）</label>
                  <input
                    type="number"
                    value={editingSchedule.duration}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-red/20 focus:border-yingge-red"
                    min="1"
                  />
                </div>

                <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                  <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-700">状态将根据演出时间自动计算</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="cancelled"
                    checked={editingSchedule.status === 'cancelled'}
                    onChange={(e) => setEditingSchedule({
                      ...editingSchedule,
                      status: e.target.checked ? 'cancelled' : 'upcoming'
                    })}
                    className="w-4 h-4 text-yingge-red border-gray-300 rounded focus:ring-yingge-red"
                  />
                  <label htmlFor="cancelled" className="text-sm text-gray-700 cursor-pointer">
                    标记为已取消
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={editingSchedule.notes}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yingge-red/20 focus:border-yingge-red"
                    rows={2}
                    placeholder="其他补充说明..."
                  />
                </div>
              </div>

              {/* 周期性设置（仅新建时显示） */}
              {!editingSchedule.id && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="recurrence"
                      checked={recurrence.enabled}
                      onChange={(e) => setRecurrence({ ...recurrence, enabled: e.target.checked })}
                      className="w-4 h-4 text-yingge-red border-gray-300 rounded focus:ring-yingge-red"
                    />
                    <label htmlFor="recurrence" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <Repeat size={16} /> 设置为固定周期节目
                    </label>
                  </div>

                  {recurrence.enabled && (
                    <div className="space-y-3 pl-7">
                      <div className="flex items-center gap-4">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">重复频率</label>
                          <select
                            value={recurrence.frequency}
                            onChange={(e) => setRecurrence({ ...recurrence, frequency: e.target.value as any })}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            {freqOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">重复次数</label>
                          <input
                            type="number"
                            value={recurrence.count}
                            onChange={(e) => setRecurrence({ ...recurrence, count: Number(e.target.value) })}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="1"
                            max="52"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">结束日期（可选）</label>
                          <input
                            type="date"
                            value={recurrence.endDate}
                            onChange={(e) => setRecurrence({ ...recurrence, endDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {recurrence.frequency !== 'monthly' && (
                        <div>
                          <label className="text-xs text-gray-500 mb-2 block">重复日</label>
                          <div className="flex flex-wrap gap-2">
                            {weekDays.map(day => (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() => toggleDay(day.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                  recurrence.days.includes(day.value)
                                    ? 'bg-yingge-red text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-400">
                        将以演出时间作为首次时间，按设置自动批量生成后续演出。
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 节目单 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">节目单</label>
                  <button type="button" onClick={addProgram} className="text-sm text-yingge-red hover:text-red-700 flex items-center gap-1">
                    <Plus size={16} /> 添加节目
                  </button>
                </div>
                <div className="space-y-2">
                  {editingSchedule.programs.map((program, index) => (
                    <div key={index} className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={program.name}
                          onChange={(e) => updateProgram(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-1"
                          placeholder="节目名称"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={program.duration}
                            onChange={(e) => updateProgram(index, 'duration', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="时长"
                            min="0"
                          />
                          <input
                            type="text"
                            value={program.description}
                            onChange={(e) => updateProgram(index, 'description', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="简介（可选）"
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeProgram(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 演职人员 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">演职人员</label>
                  <button type="button" onClick={addMember} className="text-sm text-yingge-red hover:text-red-700 flex items-center gap-1">
                    <Plus size={16} /> 手动添加人员
                  </button>
                </div>

                {/* 从人员库快速添加 */}
                {castMembers.length > 0 && (
                  <div className="mb-3 bg-gray-50 rounded-lg p-3">
                    <label className="text-xs text-gray-500 mb-2 block">从人员库快速添加</label>
                    <div className="flex flex-wrap gap-2">
                      {castMembers.map(member => {
                        const isAdded = editingSchedule.members.some(m => m.name === member.name);
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => addCastToSchedule(member)}
                            disabled={isAdded}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              isAdded
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-yingge-red hover:text-yingge-red'
                            }`}
                          >
                            {member.name}
                            {member.role && <span className="text-gray-400 ml-1">({member.role})</span>}
                            {isAdded && <span className="ml-1">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {editingSchedule.members.map((member, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-20 px-1 py-0.5 border border-gray-300 rounded text-sm"
                        placeholder="姓名"
                      />
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                        className="w-24 px-1 py-0.5 border border-gray-300 rounded text-sm"
                        placeholder="角色"
                      />
                      <button type="button" onClick={() => removeMember(index)} className="text-red-500 hover:text-red-700">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-yingge-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                ) : (
                  <Save size={18} />
                )}
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 地点库管理模态框 */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="bg-yingge-red text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl flex items-center gap-2">
                <MapPinned size={20} /> 地点库管理
              </h2>
              <button onClick={() => { setShowLocationModal(false); setEditingLocation(null); }} className="hover:bg-white/20 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              {/* 添加/编辑地点 */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={editingLocation?.name || ''}
                  onChange={(e) => setEditingLocation({ ...(editingLocation || emptyLocation), name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="地点名称"
                />
                <input
                  type="text"
                  value={editingLocation?.address || ''}
                  onChange={(e) => setEditingLocation({ ...(editingLocation || emptyLocation), address: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="详细地址（可选）"
                />
                <button
                  onClick={saveLocation}
                  className="px-3 py-2 bg-yingge-red text-white rounded-lg text-sm hover:bg-red-700"
                >
                  {editingLocation?.id ? '更新' : '添加'}
                </button>
              </div>

              {/* 地点列表 */}
              <div className="space-y-2">
                {locations.map(loc => (
                  <div key={loc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <div className="font-medium text-sm">{loc.name}</div>
                      {loc.address && <div className="text-xs text-gray-500">{loc.address}</div>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingLocation(loc)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteLocation(loc.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {locations.length === 0 && (
                  <div className="text-center text-gray-400 py-8 text-sm">暂无地点，请添加</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 演职人员库管理模态框 */}
      {showCastModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="bg-yingge-red text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl flex items-center gap-2">
                <UserPlus size={20} /> 演职人员库管理
              </h2>
              <button onClick={() => { setShowCastModal(false); setEditingCastMember(null); }} className="hover:bg-white/20 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              {/* 添加/编辑人员 */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input
                  type="text"
                  value={editingCastMember?.name || ''}
                  onChange={(e) => setEditingCastMember({ ...(editingCastMember || emptyCastMember), name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="姓名"
                />
                <input
                  type="text"
                  value={editingCastMember?.role || ''}
                  onChange={(e) => setEditingCastMember({ ...(editingCastMember || emptyCastMember), role: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="角色（可选）"
                />
                <input
                  type="text"
                  value={editingCastMember?.phone || ''}
                  onChange={(e) => setEditingCastMember({ ...(editingCastMember || emptyCastMember), phone: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="电话（可选）"
                />
              </div>
              <button
                onClick={saveCastMember}
                className="w-full px-3 py-2 bg-yingge-red text-white rounded-lg text-sm hover:bg-red-700 mb-4"
              >
                {editingCastMember?.id ? '更新人员' : '添加人员'}
              </button>

              {/* 人员列表 */}
              <div className="space-y-2">
                {castMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-sm">{member.name}</div>
                      {member.role && <div className="text-xs text-gray-500">{member.role}</div>}
                      {member.phone && <div className="text-xs text-gray-400">{member.phone}</div>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCastMember(member)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteCastMember(member.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {castMembers.length === 0 && (
                  <div className="text-center text-gray-400 py-8 text-sm">暂无人员，请添加</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSchedules;
