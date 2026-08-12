import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Save, MousePointer2, Square, ExternalLink,
  Eye, EyeOff, ChevronUp, ChevronDown, Edit3, X, Copy,
  Image as ImageIcon, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

interface Hotspot {
  id: number;
  label: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  target_url: string;
  target_type: 'internal' | 'external';
  poster_image: string;
  sort_order: number;
  is_active: boolean;
}

type DragMode = 'none' | 'creating' | 'moving' | 'resizing';

interface DragState {
  mode: DragMode;
  hotspotId: number | null;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  handle?: 'nw' | 'ne' | 'sw' | 'se';
}

export function AdminPoster() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [posterImage, setPosterImage] = useState('/images/poster.png');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    mode: 'none', hotspotId: null, startX: 0, startY: 0,
    origX: 0, origY: 0, origW: 0, origH: 0
  });
  const dragStateRef = useRef<DragState>(dragState);

  const editorRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  const setDragStateAndRef = (next: DragState) => {
    dragStateRef.current = next;
    setDragState(next);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/poster/admin/all');
      setHotspots(res.data);
      if (res.data.length > 0 && res.data[0].poster_image) {
        setPosterImage(res.data[0].poster_image);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || '获取热点数据失败' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const getPercent = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const rect = stage.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    };
  };

  const handleEditorMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const pct = getPercent(e.clientX, e.clientY);
    const newHotspot: Hotspot = {
      id: Date.now(),
      label: '新热点',
      description: '',
      x: Math.round(pct.x * 10) / 10,
      y: Math.round(pct.y * 10) / 10,
      w: 0,
      h: 0,
      target_url: '/creative',
      target_type: 'internal',
      poster_image: posterImage,
      sort_order: hotspots.length,
      is_active: true,
    };
    setHotspots([...hotspots, newHotspot]);
    setSelectedId(newHotspot.id);
    setDragStateAndRef({
      mode: 'creating',
      hotspotId: newHotspot.id,
      startX: pct.x,
      startY: pct.y,
      origX: pct.x,
      origY: pct.y,
      origW: 0,
      origH: 0,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const ds = dragStateRef.current;
    if (ds.mode === 'none' || !stageRef.current) return;
    const pct = getPercent(e.clientX, e.clientY);

    setHotspots((prev) => prev.map((hs) => {
      if (hs.id !== ds.hotspotId) return hs;

      if (ds.mode === 'creating') {
        const x = Math.min(ds.startX, pct.x);
        const y = Math.min(ds.startY, pct.y);
        const w = Math.abs(pct.x - ds.startX);
        const h = Math.abs(pct.y - ds.startY);
        return { ...hs, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10 };
      }

      if (ds.mode === 'moving') {
        const dx = pct.x - ds.startX;
        const dy = pct.y - ds.startY;
        let newX = ds.origX + dx;
        let newY = ds.origY + dy;
        newX = Math.max(0, Math.min(100 - hs.w, newX));
        newY = Math.max(0, Math.min(100 - hs.h, newY));
        return { ...hs, x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 };
      }

      if (ds.mode === 'resizing') {
        let newW = ds.origW;
        let newH = ds.origH;
        let newX = ds.origX;
        let newY = ds.origY;
        const handle = ds.handle;

        if (handle === 'se') {
          newW = Math.max(2, pct.x - ds.origX);
          newH = Math.max(2, pct.y - ds.origY);
        } else if (handle === 'ne') {
          newW = Math.max(2, pct.x - ds.origX);
          newH = Math.max(2, ds.origY + ds.origH - pct.y);
          newY = pct.y;
        } else if (handle === 'sw') {
          newW = Math.max(2, ds.origX + ds.origW - pct.x);
          newH = Math.max(2, pct.y - ds.origY);
          newX = pct.x;
        } else if (handle === 'nw') {
          newW = Math.max(2, ds.origX + ds.origW - pct.x);
          newH = Math.max(2, ds.origY + ds.origH - pct.y);
          newX = pct.x;
          newY = pct.y;
        }
        return {
          ...hs,
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          w: Math.round(newW * 10) / 10,
          h: Math.round(newH * 10) / 10,
        };
      }
      return hs;
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    const ds = dragStateRef.current;
    if (ds.mode === 'creating') {
      setHotspots((prev) => prev.filter((hs) => {
        if (hs.id !== ds.hotspotId) return true;
        return hs.w > 1 && hs.h > 1;
      }));
    }
    setDragStateAndRef({ mode: 'none', hotspotId: null, startX: 0, startY: 0, origX: 0, origY: 0, origW: 0, origH: 0 });
  }, []);

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const hasDrag = dragState.mode !== 'none';
    if (hasDrag) {
      window.addEventListener('mousemove', handleMouseMove, true);
      window.addEventListener('mouseup', handleMouseUp, true);
      window.addEventListener('selectstart', prevent, true);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('selectstart', prevent, true);
    };
  }, [handleMouseMove, handleMouseUp, dragState.mode]);

  const startMove = (e: React.MouseEvent, hs: Hotspot) => {
    e.stopPropagation();
    e.preventDefault();
    const pct = getPercent(e.clientX, e.clientY);
    setSelectedId(hs.id);
    setDragStateAndRef({
      mode: 'moving',
      hotspotId: hs.id,
      startX: pct.x,
      startY: pct.y,
      origX: hs.x,
      origY: hs.y,
      origW: hs.w,
      origH: hs.h,
    });
  };

  const startResize = (e: React.MouseEvent, hs: Hotspot, handle: 'nw' | 'ne' | 'sw' | 'se') => {
    e.stopPropagation();
    e.preventDefault();
    const pct = getPercent(e.clientX, e.clientY);
    setSelectedId(hs.id);
    setDragStateAndRef({
      mode: 'resizing',
      hotspotId: hs.id,
      startX: pct.x,
      startY: pct.y,
      origX: hs.x,
      origY: hs.y,
      origW: hs.w,
      origH: hs.h,
      handle,
    });
  };

  const updateHotspot = (id: number, updates: Partial<Hotspot>) => {
    setHotspots((prev) => prev.map((hs) => (hs.id === id ? { ...hs, ...updates } : hs)));
  };

  const deleteHotspot = (id: number) => {
    setHotspots((prev) => prev.filter((hs) => hs.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const hs of hotspots) {
        const payload = {
          label: hs.label,
          description: hs.description,
          x: hs.x, y: hs.y, w: hs.w, h: hs.h,
          target_url: hs.target_url,
          target_type: hs.target_type,
          poster_image: posterImage,
          sort_order: hs.sort_order,
          is_active: hs.is_active,
        };

        if (hs.id > 1000000000) {
          await api.post('/poster/admin', payload);
        } else {
          await api.put(`/poster/admin/${hs.id}`, payload);
        }
      }

      const origIds = hotspots.map((h) => h.id);
      const allRowsRes = await api.get('/poster/admin/all');
      const serverIds = allRowsRes.data.map((r: Hotspot) => r.id);
      for (const sid of serverIds) {
        if (!origIds.includes(sid)) {
          try { await api.delete(`/poster/admin/${sid}`); } catch {}
        }
      }

      showMessage('success', '保存成功！');
      fetchData();
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setPosterImage(url);
    setHotspots(hotspots.map((hs) => ({ ...hs, poster_image: url })));
    setShowUploader(false);
    showMessage('success', '海报图片已更新');
  };

  const selectedHotspot = hotspots.find((h) => h.id === selectedId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-yingge-gold/20 border-t-yingge-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-yingge-dark font-serif">海报热点管理</h1>
          <p className="text-yingge-dark/50 text-sm mt-1">在海报上绘制热点区域，配置跳转链接</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </motion.div>
          )}
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-yingge-dark hover:border-yingge-gold hover:text-yingge-gold transition-all text-sm"
          >
            <Upload className="w-4 h-4" />
            更换海报
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-yingge-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存全部'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左侧编辑器 */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4 text-sm text-yingge-dark/60">
              <MousePointer2 className="w-4 h-4" />
              <span>在海报上按住鼠标左键拖动，绘制热点区域</span>
              <span className="text-yingge-dark/30">|</span>
              <span>点击热点选中，拖动移动，拖拽角点调整大小</span>
            </div>

            <div
              ref={editorRef}
              className="relative bg-gray-100 rounded-lg select-none"
              style={{ cursor: 'crosshair', maxWidth: '100%', width: '100%' }}
              onMouseDown={handleEditorMouseDown}
            >
              <div
                ref={stageRef}
                className="relative w-full mx-auto"
                style={{
                  aspectRatio: imgSize.w && imgSize.h
                    ? `${imgSize.w}/${imgSize.h}`
                    : '3/4',
                }}
              >
                <img
                  ref={imgRef}
                  src={posterImage}
                  alt="海报"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  draggable={false}
                  onLoad={(e) => {
                    setImgSize({
                      w: e.currentTarget.naturalWidth,
                      h: e.currentTarget.naturalHeight,
                    });
                    setImageLoaded(true);
                  }}
                />

                {imageLoaded &&
                  hotspots.map((hs) => (
                    <div
                      key={hs.id}
                      className={`absolute transition-colors ${
                        dragState.hotspotId === hs.id ? '' : 'cursor-move'
                      }`}
                      style={{
                        left: `${hs.x}%`,
                        top: `${hs.y}%`,
                        width: `${hs.w}%`,
                        height: `${hs.h}%`,
                        backgroundColor:
                          selectedId === hs.id
                            ? 'rgba(200, 160, 96, 0.25)'
                            : 'rgba(178, 34, 34, 0.1)',
                        border: `2px dashed ${
                          selectedId === hs.id ? '#C8A060' : '#B22222'
                        }`,
                        borderRadius: 4,
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        startMove(e, hs);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(hs.id);
                      }}
                    >
                      <div className="absolute -top-6 left-0 px-2 py-0.5 bg-yingge-dark/90 text-white text-xs rounded whitespace-nowrap">
                        {hs.is_active ? hs.label : `[已禁用] ${hs.label}`}
                      </div>

                      {selectedId === hs.id && (
                        <>
                          {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
                            <div
                              key={handle}
                              className="absolute w-3 h-3 bg-white border-2 border-yingge-gold rounded-sm"
                              style={{
                                top: handle.includes('n') ? -6 : undefined,
                                bottom: handle.includes('s') ? -6 : undefined,
                                left: handle.includes('w') ? -6 : undefined,
                                right: handle.includes('e') ? -6 : undefined,
                                cursor:
                                  handle === 'nw' || handle === 'se'
                                    ? 'nwse-resize'
                                    : 'nesw-resize',
                              }}
                              onMouseDown={(e) => startResize(e, hs, handle)}
                            />
                          ))}
                        </>
                      )}

                      {selectedId === hs.id && (
                        <div className="absolute -top-6 right-0 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHotspot(hs.id);
                            }}
                            className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* 热点列表 */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-yingge-dark mb-2">
                <Square className="w-4 h-4" />
                热点列表 ({hotspots.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {hotspots.length === 0 && (
                  <p className="text-yingge-dark/40 text-xs py-2 text-center">暂无热点，在海报上拖动鼠标绘制</p>
                )}
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => setSelectedId(hs.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                      selectedId === hs.id
                        ? 'bg-yingge-gold/20 text-yingge-dark border border-yingge-gold/40'
                        : 'hover:bg-gray-50 text-yingge-dark/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium truncate">{hs.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        hs.target_type === 'external' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {hs.target_type === 'external' ? '外部' : '内部'}
                      </span>
                      {!hs.is_active && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">已禁用</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateHotspot(hs.id, { is_active: !hs.is_active }); }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title={hs.is_active ? '禁用' : '启用'}
                      >
                        {hs.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteHotspot(hs.id); }}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
            <h3 className="font-medium text-yingge-dark mb-4">热点属性</h3>

            {!selectedHotspot ? (
              <div className="text-center py-12 text-yingge-dark/40 text-sm">
                <Edit3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                选择一个热点进行编辑
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-yingge-dark/60 mb-1">标签名称</label>
                  <input
                    type="text"
                    value={selectedHotspot.label}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-yingge-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-yingge-dark/60 mb-1">描述（可选）</label>
                  <textarea
                    value={selectedHotspot.description}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-yingge-gold focus:outline-none resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-yingge-dark/60 mb-1">跳转类型</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateHotspot(selectedHotspot.id, { target_type: 'internal' })}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedHotspot.target_type === 'internal'
                          ? 'bg-yingge-red text-white'
                          : 'bg-gray-100 text-yingge-dark/60 hover:bg-gray-200'
                      }`}
                    >
                      内部页面
                    </button>
                    <button
                      onClick={() => updateHotspot(selectedHotspot.id, { target_type: 'external' })}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        selectedHotspot.target_type === 'external'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-yingge-dark/60 hover:bg-gray-200'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      外部链接
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-yingge-dark/60 mb-1">
                    {selectedHotspot.target_type === 'internal' ? '路由路径' : '外部链接 URL'}
                  </label>
                  <input
                    type="text"
                    value={selectedHotspot.target_url}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { target_url: e.target.value })}
                    placeholder={selectedHotspot.target_type === 'internal' ? '/creative?scroll=stickers' : 'https://...'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-yingge-gold focus:outline-none font-mono"
                  />
                  {selectedHotspot.target_type === 'internal' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {[
                        { label: '表情包', url: '/creative?scroll=stickers' },
                        { label: 'IP形象', url: '/creative?scroll=mascot' },
                        { label: '文创周边', url: '/creative?scroll=products' },
                        { label: 'AI导游', url: '/guide' },
                      ].map((p) => (
                        <button
                          key={p.url}
                          onClick={() => updateHotspot(selectedHotspot.id, { target_url: p.url })}
                          className="px-2 py-1 text-[10px] bg-gray-100 hover:bg-yingge-gold/20 text-yingge-dark/60 rounded"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-yingge-dark/60 mb-1">X (%)</label>
                    <input
                      type="number"
                      value={selectedHotspot.x}
                      onChange={(e) => updateHotspot(selectedHotspot.id, { x: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:border-yingge-gold focus:outline-none"
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-yingge-dark/60 mb-1">Y (%)</label>
                    <input
                      type="number"
                      value={selectedHotspot.y}
                      onChange={(e) => updateHotspot(selectedHotspot.id, { y: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:border-yingge-gold focus:outline-none"
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-yingge-dark/60 mb-1">宽 (%)</label>
                    <input
                      type="number"
                      value={selectedHotspot.w}
                      onChange={(e) => updateHotspot(selectedHotspot.id, { w: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:border-yingge-gold focus:outline-none"
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-yingge-dark/60 mb-1">高 (%)</label>
                    <input
                      type="number"
                      value={selectedHotspot.h}
                      onChange={(e) => updateHotspot(selectedHotspot.id, { h: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:border-yingge-gold focus:outline-none"
                      step={0.5}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateHotspot(selectedHotspot.id, { is_active: !selectedHotspot.is_active })}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedHotspot.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {selectedHotspot.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {selectedHotspot.is_active ? '已启用' : '已禁用'}
                  </button>
                  <button
                    onClick={() => deleteHotspot(selectedHotspot.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    删除
                  </button>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] text-yingge-dark/40 leading-relaxed">
                    提示：坐标为百分比值（0-100），相对于海报图片尺寸。修改后点击"保存全部"生效。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 图片上传弹窗 */}
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowUploader(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-yingge-dark">更换海报图片</h3>
                <button onClick={() => setShowUploader(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-yingge-dark/60 mb-4">建议尺寸：纵向海报图，支持 JPG/PNG 格式</p>
              <ImageUploader
                category="sanxiaxiang"
                onChange={handleImageUpload}
                value={posterImage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
