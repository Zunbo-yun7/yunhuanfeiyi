import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, MapPin, Clock, Users, Music, ChevronRight,
  AlertCircle, X, Sparkles, Play, Hourglass, ChevronLeft
} from 'lucide-react';
import api from '@/lib/api';
import { FadeInUp } from '@/components/Animated/FadeInUp';
// React Bits 视觉增强组件
import { Strands, ShinyText } from '@/components/reactbits';

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
}

type ComputedStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

interface ScheduleWithStatus extends Schedule {
  computedStatus: ComputedStatus;
  isUrgent: boolean;
  minutesUntilStart: number;
  minutesUntilEnd: number;
}

const statusConfig = {
  upcoming: {
    label: '即将开始',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    timelineColor: 'bg-blue-400',
    cardGradient: 'from-blue-50 to-white',
    icon: Hourglass
  },
  ongoing: {
    label: '正在进行',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    timelineColor: 'bg-green-400',
    cardGradient: 'from-green-50 to-white',
    icon: Play
  },
  completed: {
    label: '已结束',
    color: 'bg-gray-400',
    textColor: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    timelineColor: 'bg-gray-300',
    cardGradient: 'from-gray-50 to-white',
    icon: Clock
  },
  cancelled: {
    label: '已取消',
    color: 'bg-red-400',
    textColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    timelineColor: 'bg-red-300',
    cardGradient: 'from-red-50 to-white',
    icon: AlertCircle
  }
};

// 计算演出状态
const computeScheduleStatus = (schedule: Schedule): ScheduleWithStatus => {
  const now = new Date().getTime();
  const start = new Date(schedule.performance_time).getTime();
  const end = start + (schedule.duration || 60) * 60 * 1000;

  // 手动取消优先级最高
  if (schedule.status === 'cancelled') {
    return {
      ...schedule,
      computedStatus: 'cancelled',
      isUrgent: false,
      minutesUntilStart: Math.floor((start - now) / 60000),
      minutesUntilEnd: Math.floor((end - now) / 60000)
    };
  }

  let computedStatus: ComputedStatus;
  if (now >= start && now <= end) {
    computedStatus = 'ongoing';
  } else if (now < start) {
    computedStatus = 'upcoming';
  } else {
    computedStatus = 'completed';
  }

  // 1小时内即将开始或正在进行 = 紧急
  const isUrgent =
    (computedStatus === 'ongoing') ||
    (computedStatus === 'upcoming' && start - now <= 60 * 60 * 1000);

  return {
    ...schedule,
    computedStatus,
    isUrgent,
    minutesUntilStart: Math.floor((start - now) / 60000),
    minutesUntilEnd: Math.floor((end - now) / 60000)
  };
};

// 格式化时间差
const formatTimeDiff = (minutes: number): string => {
  if (minutes <= 0) return '已开始';
  if (minutes < 60) return `${minutes}分钟后`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}后`;
  const days = Math.floor(hours / 24);
  return `${days}天后`;
};

export function PerformanceSchedule() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleWithStatus[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithStatus | null>(null);
  const [notificationClosed, setNotificationClosed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 日历状态
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDateScheduleModal, setShowDateScheduleModal] = useState(false);

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await api.get('/schedules');
      const rawSchedules: Schedule[] = response.data;
      const computed = rawSchedules.map(computeScheduleStatus);
      // 按演出时间排序
      computed.sort((a, b) =>
        new Date(a.performance_time).getTime() - new Date(b.performance_time).getTime()
      );
      setSchedules(computed);
    } catch (error) {
      console.error('获取演出时间表失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载 + 定时刷新（30秒）
  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(() => {
      fetchSchedules();
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSchedules]);

  // 每分钟更新当前时间（用于UI倒计时）
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (datetime: string) => {
    if (!datetime) return null;
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
      shortDate: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      fullDate: date.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      })
    };
  };

  const getStatusInfo = (status: ComputedStatus) => {
    return statusConfig[status];
  };

  // 紧急演出（1小时内即将开始或正在进行）
  const urgentSchedules = schedules.filter(s => s.isUrgent && s.computedStatus !== 'cancelled');
  const hasUrgent = urgentSchedules.length > 0 && !notificationClosed;

  // 按状态分组（用于统计）
  const groupedSchedules = {
    upcoming: schedules.filter(s => s.computedStatus === 'upcoming'),
    ongoing: schedules.filter(s => s.computedStatus === 'ongoing'),
    completed: schedules.filter(s => s.computedStatus === 'completed'),
    cancelled: schedules.filter(s => s.computedStatus === 'cancelled')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yingge-cream to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yingge-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yingge-cream to-white">
      {/* 顶部紧急通知条 - 显示在导航栏下方 */}
      {hasUrgent && (
        <div className="fixed top-[100px] left-0 right-0 z-40 bg-gradient-to-r from-yingge-red to-red-600 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto">
              <Sparkles className="w-5 h-5 animate-pulse flex-shrink-0" />
              <div className="flex items-center gap-4">
                {urgentSchedules.map((schedule) => {
                  const dateTime = formatDateTime(schedule.performance_time);
                  const StatusIcon = getStatusInfo(schedule.computedStatus).icon;
                  return (
                    <div key={schedule.id} className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <StatusIcon size={16} />
                      <span className="font-medium">{schedule.title}</span>
                      <span className="text-white/80">
                        {schedule.computedStatus === 'ongoing'
                          ? `正在进行中（还剩 ${Math.max(0, schedule.minutesUntilEnd)} 分钟）`
                          : `${formatTimeDiff(schedule.minutesUntilStart)}开始 · ${dateTime?.time}`
                        }
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => setNotificationClosed(true)}
              className="p-1 hover:bg-white/20 rounded flex-shrink-0 ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Hero 区域 */}
      <div className={`relative bg-gradient-to-r from-yingge-red to-red-700 text-white overflow-hidden ${hasUrgent ? 'pt-20 pb-12' : 'pt-12 pb-12'}`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        {/* Strands 流动光带背景动画 */}
        <Strands
          colors={['#C8A060', '#B22222', '#8B0000', '#FFD700']}
          count={4}
          speed={0.4}
          amplitude={1.2}
          thickness={0.6}
          glow={2.8}
          intensity={0.45}
          opacity={0.7}
          scale={1.8}
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <FadeInUp>
            <ShinyText
              text="演出时间表"
              speed={4}
              className="font-serif font-bold text-3xl md:text-5xl mb-2"
            />
            <p className="text-yingge-gold">英歌舞精彩演出，敬请期待</p>
            <p className="text-sm text-white/60 mt-2">
              共 {schedules.length} 场演出
              {groupedSchedules.ongoing.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-400/30 rounded-full text-xs">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {groupedSchedules.ongoing.length} 场进行中
                </span>
              )}
              {groupedSchedules.upcoming.length > 0 && (
                <span className="ml-2 text-white/60 text-xs">
                  {groupedSchedules.upcoming.length} 场即将开始
                </span>
              )}
            </p>
          </FadeInUp>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yingge-cream to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 横向时间线 */}
        {schedules.length > 0 && (
          <FadeInUp>
            <div id="timeline" className="mb-12">
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="text-yingge-gold" /> 演出时间线
              </h2>

              <div className="relative overflow-x-auto pb-4">
                {/* 时间轴线 */}
                <div className="relative flex items-start gap-6 min-w-max px-4">
                  {/* 背景线 */}
                  <div className="absolute top-6 left-4 right-4 h-0.5 bg-gray-200"></div>

                  {schedules.map((schedule, index) => {
                    const statusInfo = getStatusInfo(schedule.computedStatus);
                    const dateTime = formatDateTime(schedule.performance_time);
                    const StatusIcon = statusInfo.icon;
                    const isLast = index === schedules.length - 1;

                    return (
                      <div
                        key={schedule.id}
                        className="relative flex flex-col items-center w-36 sm:w-40 md:w-48 flex-shrink-0 cursor-pointer group"
                        onClick={() => setSelectedSchedule(schedule)}
                      >
                        {/* 节点圆点 */}
                        <div className={`
                          relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                          shadow-md transition-all duration-300 group-hover:scale-110
                          ${schedule.computedStatus === 'ongoing'
                            ? 'bg-green-500 ring-4 ring-green-200 animate-pulse'
                            : schedule.computedStatus === 'upcoming'
                              ? 'bg-blue-500 ring-4 ring-blue-200'
                              : schedule.computedStatus === 'cancelled'
                                ? 'bg-red-400 ring-4 ring-red-200'
                                : 'bg-gray-300 ring-4 ring-gray-100'
                          }
                        `}>
                          <StatusIcon size={20} className="text-white" />
                        </div>

                        {/* 连接线（到下一个节点） */}
                        {!isLast && (
                          <div className={`
                            absolute top-6 left-1/2 w-full h-0.5
                            ${statusInfo.timelineColor}
                          `} style={{ width: 'calc(100% + 1.5rem)', marginLeft: '1.5rem' }}></div>
                        )}

                        {/* 卡片 */}
                        <div className={`
                          mt-4 w-full bg-gradient-to-b ${statusInfo.cardGradient}
                          rounded-xl border-2 ${statusInfo.borderColor}
                          p-2 sm:p-3 transition-all duration-300
                          ${schedule.isUrgent ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}
                          ${schedule.computedStatus === 'completed' || schedule.computedStatus === 'cancelled' ? 'opacity-60' : ''}
                        `}>
                          {/* 状态标签 */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`
                              text-xs font-medium px-2 py-0.5 rounded-full
                              ${statusInfo.textColor} ${statusInfo.bgColor}
                            `}>
                              {schedule.computedStatus === 'ongoing' && (
                                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></span>
                              )}
                              {statusInfo.label}
                            </span>
                            {schedule.isUrgent && schedule.computedStatus === 'upcoming' && (
                              <span className="text-xs text-orange-500 font-medium">
                                {formatTimeDiff(schedule.minutesUntilStart)}
                              </span>
                            )}
                          </div>

                          {/* 日期时间 */}
                          <div className="text-center mb-2">
                            <div className="text-lg font-bold text-gray-800">{dateTime?.shortDate}</div>
                            <div className="text-sm text-gray-500">{dateTime?.time} · {dateTime?.weekday}</div>
                          </div>

                          {/* 标题 */}
                          <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 mb-2">
                            {schedule.title}
                          </h3>

                          {/* 地点 */}
                          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                            <MapPin size={12} />
                            <span className="truncate">{schedule.location}</span>
                          </div>

                          {/* 时长 */}
                          <div className="text-center text-xs text-gray-400 mt-1">
                            {schedule.duration}分钟
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 图例 */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>正在进行</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>即将开始</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span>已结束</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span>已取消</span>
                </div>
              </div>
            </div>
          </FadeInUp>
        )}

        {/* 日历+演出列表布局 */}
        <FadeInUp>
          <div id="calendar" className="mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="text-yingge-gold" /> 演出日历
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* 左侧日历 */}
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* 日历头部 */}
                <div className="bg-gradient-to-r from-yingge-red to-red-600 text-white px-4 py-2 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentDate(prev => {
                      const d = new Date(prev);
                      d.setMonth(d.getMonth() - 1);
                      return d;
                    })}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="text-sm font-serif font-bold">
                    {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                  </div>
                  <button
                    onClick={() => setCurrentDate(prev => {
                      const d = new Date(prev);
                      d.setMonth(d.getMonth() + 1);
                      return d;
                    })}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* 星期标题 */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                    <div key={day} className="py-1.5 text-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* 日期格子 */}
                <div className="grid grid-cols-7">
                  {(() => {
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                    const cells = [];

                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="h-9 md:h-10 border-b border-gray-100"></div>);
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const daySchedules = schedules.filter(s => s.performance_time.startsWith(dateStr));
                      const isToday = dateStr === todayStr;
                      const hasOngoing = daySchedules.some(s => s.computedStatus === 'ongoing');
                      const hasUpcoming = daySchedules.some(s => s.computedStatus === 'upcoming' && !hasOngoing);

                      cells.push(
                        <div
                          key={day}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowDateScheduleModal(true);
                          }}
                          className={`
                            h-9 md:h-10 p-1 border-b border-gray-100 cursor-pointer
                            hover:bg-gray-50 relative transition-colors text-center
                            ${isToday ? 'bg-yingge-red/10 ring-1 ring-yingge-red' : ''}
                            ${hasOngoing ? 'bg-green-50' : ''}
                            ${hasUpcoming && !hasOngoing ? 'bg-blue-50' : ''}
                          `}
                        >
                          <div className={`
                            inline-flex items-center justify-center text-xs font-medium
                            ${isToday ? 'bg-yingge-red text-white rounded-full w-5 h-5' : ''}
                            ${daySchedules.length > 0 && !isToday ? 'text-yingge-red font-bold' : 'text-gray-700'}
                          `}>
                            {day}
                          </div>

                          {/* 演出标记横条 */}
                          {daySchedules.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              {daySchedules.slice(0, 2).map((s, idx) => (
                                <div
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSchedule(s);
                                  }}
                                  className={`
                                    h-3 rounded-full cursor-pointer px-1 mx-auto max-w-full
                                    flex items-center justify-center
                                    ${s.computedStatus === 'ongoing' ? 'bg-green-500/20' : ''}
                                    ${s.computedStatus === 'upcoming' ? 'bg-blue-500/20' : ''}
                                    ${s.computedStatus === 'completed' ? 'bg-gray-400/20' : ''}
                                    ${s.computedStatus === 'cancelled' ? 'bg-red-400/20' : ''}
                                  `}
                                >
                                  <span className={`
                                    text-[9px] font-medium truncate max-w-[calc(100%-4px)]
                                    ${s.computedStatus === 'ongoing' ? 'text-green-700' : ''}
                                    ${s.computedStatus === 'upcoming' ? 'text-blue-700' : ''}
                                    ${s.computedStatus === 'completed' ? 'text-gray-500' : ''}
                                    ${s.computedStatus === 'cancelled' ? 'text-red-500 line-through' : ''}
                                  `}>
                                    {s.title}
                                  </span>
                                </div>
                              ))}
                              {daySchedules.length > 2 && (
                                <div className="text-[10px] text-gray-400 text-center">+{daySchedules.length - 2}场</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return cells;
                  })()}
                </div>
              </div>

              {/* 右侧演出列表 */}
              <div className="w-full lg:w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col self-start lg:max-h-[55vh]">
                <div className="bg-gradient-to-r from-yingge-red to-red-600 text-white px-4 py-2">
                  <h3 className="font-serif font-bold text-sm">近期演出</h3>
                  <p className="text-xs text-white/70 mt-0.5">点击查看详情</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {(() => {
                    const upcomingAndOngoing = schedules
                      .filter(s => s.computedStatus === 'ongoing' || s.computedStatus === 'upcoming')
                      .sort((a, b) => new Date(a.performance_time).getTime() - new Date(b.performance_time).getTime());

                    const allSchedules = schedules.sort((a, b) =>
                      new Date(b.performance_time).getTime() - new Date(a.performance_time).getTime()
                    );

                    const displayList = upcomingAndOngoing.length > 0 ? upcomingAndOngoing : allSchedules.slice(0, 10);

                    if (displayList.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-xs text-gray-400">暂无演出安排</p>
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-gray-100">
                        {displayList.map((schedule) => {
                          const dateTime = formatDateTime(schedule.performance_time);
                          const StatusIcon = getStatusInfo(schedule.computedStatus).icon;

                          return (
                            <div
                              key={schedule.id}
                              onClick={() => setSelectedSchedule(schedule)}
                              className={`
                                px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors
                                ${schedule.computedStatus === 'ongoing' ? 'bg-green-50/50' : ''}
                              `}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`
                                  mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                                  ${schedule.computedStatus === 'ongoing' ? 'bg-green-500 animate-pulse' : ''}
                                  ${schedule.computedStatus === 'upcoming' ? 'bg-blue-500' : ''}
                                  ${schedule.computedStatus === 'completed' ? 'bg-gray-400' : ''}
                                  ${schedule.computedStatus === 'cancelled' ? 'bg-red-400' : ''}
                                `} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <StatusIcon size={12} className={`
                                      ${schedule.computedStatus === 'ongoing' ? 'text-green-600' : ''}
                                      ${schedule.computedStatus === 'upcoming' ? 'text-blue-600' : ''}
                                      ${schedule.computedStatus === 'completed' ? 'text-gray-500' : ''}
                                      ${schedule.computedStatus === 'cancelled' ? 'text-red-500' : ''}
                                    `} />
                                    <span className="text-sm font-medium text-gray-800 truncate">{schedule.title}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {dateTime?.shortDate} {dateTime?.time}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                    <MapPin size={10} />
                                    <span className="truncate">{schedule.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* 日期演出列表模态框 */}
      {showDateScheduleModal && selectedDate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4" onClick={() => setShowDateScheduleModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg md:max-w-2xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-yingge-red to-red-600 text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl">
                  {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
                </h2>
                <p className="text-sm text-white/80">
                  {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][selectedDate.getDay()]}
                </p>
              </div>
              <button
                onClick={() => setShowDateScheduleModal(false)}
                className="hover:bg-white/20 p-1 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 90px)' }}>
              {(() => {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const dateSchedules = schedules.filter(s => s.performance_time.startsWith(dateStr));
                dateSchedules.sort((a, b) => new Date(a.performance_time).getTime() - new Date(b.performance_time).getTime());

                if (dateSchedules.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-400">当天暂无演出安排</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dateSchedules.map((schedule) => {
                      const dateTime = formatDateTime(schedule.performance_time);
                      const StatusIcon = getStatusInfo(schedule.computedStatus).icon;

                      return (
                        <div
                          key={schedule.id}
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setShowDateScheduleModal(false);
                          }}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg
                            ${schedule.computedStatus === 'ongoing' ? 'border-green-200 bg-green-50' : ''}
                            ${schedule.computedStatus === 'upcoming' ? 'border-blue-200 bg-blue-50' : ''}
                            ${schedule.computedStatus === 'completed' ? 'border-gray-200 bg-gray-50' : ''}
                            ${schedule.computedStatus === 'cancelled' ? 'border-red-200 bg-red-50' : ''}
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon size={16} className={`
                                  ${schedule.computedStatus === 'ongoing' ? 'text-green-600' : ''}
                                  ${schedule.computedStatus === 'upcoming' ? 'text-blue-600' : ''}
                                  ${schedule.computedStatus === 'completed' ? 'text-gray-500' : ''}
                                  ${schedule.computedStatus === 'cancelled' ? 'text-red-500' : ''}
                                `} />
                                <h3 className="font-medium text-gray-900">{schedule.title}</h3>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {dateTime?.time} · {schedule.duration}分钟
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {schedule.location}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="text-gray-400" />
                          </div>

                          {schedule.programs && schedule.programs.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Music size={14} />
                                <span>{schedule.programs.length} 个节目</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedSchedule(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg md:max-w-2xl max-h-[92vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`px-4 md:px-6 py-4 md:py-5 text-white ${
              selectedSchedule.computedStatus === 'ongoing'
                ? 'bg-gradient-to-r from-green-600 to-green-500'
                : selectedSchedule.computedStatus === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                  : selectedSchedule.computedStatus === 'cancelled'
                    ? 'bg-gradient-to-r from-red-600 to-red-500'
                    : 'bg-gradient-to-r from-gray-600 to-gray-500'
              }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif font-bold text-xl mb-2">{selectedSchedule.title}</h2>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDateTime(selectedSchedule.performance_time)?.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDateTime(selectedSchedule.performance_time)?.time}
                    </span>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium bg-white/20
                `}>
                  {selectedSchedule.computedStatus === 'ongoing' && (
                    <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1"></span>
                  )}
                  {getStatusInfo(selectedSchedule.computedStatus).label}
                </span>
              </div>
              {selectedSchedule.computedStatus === 'ongoing' && (
                <div className="mt-2 text-sm text-white/90">
                  还剩 {Math.max(0, selectedSchedule.minutesUntilEnd)} 分钟结束
                </div>
              )}
              {selectedSchedule.computedStatus === 'upcoming' && selectedSchedule.minutesUntilStart <= 60 && (
                <div className="mt-2 text-sm text-white/90">
                  {formatTimeDiff(selectedSchedule.minutesUntilStart)}开始
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 140px)' }}>
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">演出地点</div>
                    <div className="font-medium">{selectedSchedule.location}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">预计时长</div>
                    <div className="font-medium">{selectedSchedule.duration} 分钟</div>
                  </div>
                </div>

                {/* 节目单 */}
                {selectedSchedule.programs && selectedSchedule.programs.length > 0 && (
                  <div>
                    <h3 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
                      <Music className="text-yingge-gold" size={20} /> 节目单
                    </h3>
                    <div className="space-y-2">
                      {selectedSchedule.programs.map((program, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-yingge-red text-white flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{program.name}</div>
                            {program.duration > 0 && (
                              <div className="text-sm text-gray-500">{program.duration} 分钟</div>
                            )}
                            {program.description && (
                              <div className="text-sm text-gray-400 mt-1">{program.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 演职人员 */}
                {selectedSchedule.members && selectedSchedule.members.length > 0 && (
                  <div>
                    <h3 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
                      <Users className="text-yingge-gold" size={20} /> 演职人员
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSchedule.members.map((member, index) => (
                        <div key={index} className="bg-yingge-cream rounded-full px-4 py-2">
                          <span className="font-medium">{member.name}</span>
                          {member.role && <span className="text-gray-500 text-sm ml-1">({member.role})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 备注 */}
                {selectedSchedule.notes && (
                  <div>
                    <h3 className="font-serif font-bold text-lg mb-2">备注</h3>
                    <p className="text-gray-600 bg-amber-50 rounded-lg p-3">{selectedSchedule.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4">
              <button
                onClick={() => setSelectedSchedule(null)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceSchedule;
