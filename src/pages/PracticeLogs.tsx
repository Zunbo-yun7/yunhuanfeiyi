import { useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { Calendar, Pin, Eye } from 'lucide-react';
// React Bits 视觉增强组件
import { Aurora, ShinyText, BorderGlow } from '@/components/reactbits';

interface PracticeLog {
  id: number;
  title: string;
  content: string;
  image: string;
  is_top: number;
  created_at: string;
  updated_at: string;
}

export function PracticeLogs() {
  const { data: logs, loading } = useFetchData<PracticeLog[]>('/logs');
  const [selectedLog, setSelectedLog] = useState<PracticeLog | null>(null);

  if (loading || !logs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yingge-gray">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-yingge-dark/60">加载中...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-yingge-gray">
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20practice%20journey%20diary%20cultural%20heritage%20experience&image_size=landscape_16_9"
          alt="实践日志"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        {/* Aurora 极光波纹背景动画 */}
        <Aurora
          colorStops={['#B22222', '#C8A060', '#8B0000']}
          amplitude={1.2}
          speed={0.4}
          blend={0.45}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <ShinyText
            text="实践日志"
            speed={4}
            className="font-serif font-bold text-3xl md:text-5xl mb-2"
          />
          <p className="text-yingge-gold">记录我们的英歌文化探索之旅</p>
        </div>
      </section>

      <section id="practice" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              实践日志
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
            <p className="text-yingge-dark/60 mt-4">
              跟随我们的脚步，见证每一次与英歌文化的亲密接触
            </p>
          </div>

          <div className="space-y-6">
            {logs.map((log) => (
              <BorderGlow
                key={log.id}
                glowIntensity={0.7}
                borderColor={log.is_top ? '#B22222' : 'rgba(200, 160, 96, 0.35)'}
                glowColor={log.is_top ? '#B22222' : '#C8A060'}
                borderRadius={12}
                className={`bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  log.is_top ? 'ring-1 ring-yingge-red/30' : ''
                }`}
              >
                <div
                  onClick={() => setSelectedLog(log)}
                  className="flex flex-col md:flex-row"
                >
                  {log.image && (
                    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                      <img
                        src={log.image}
                        alt={log.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`flex-1 p-6 ${log.image ? 'md:w-2/3' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {log.is_top && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yingge-red text-white text-xs rounded-full">
                          <Pin size={12} />
                          置顶
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-yingge-dark/50 text-sm">
                        <Calendar size={14} />
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-yingge-dark mb-2">
                      {log.title}
                    </h3>
                    <p className="text-yingge-dark/60 line-clamp-2 mb-4">
                      {log.content}
                    </p>
                    <button className="inline-flex items-center gap-1 text-yingge-gold text-sm hover:text-yingge-red transition-colors">
                      <Eye size={14} />
                      查看详情
                    </button>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>

          {logs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-yingge-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-yingge-gold/50" />
              </div>
              <p className="text-yingge-dark/60">暂无实践日志</p>
            </div>
          )}
        </div>
      </section>

      {selectedLog && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedLog.image && (
              <div className="h-48 md:h-64 overflow-hidden">
                <img
                  src={selectedLog.image}
                  alt={selectedLog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {selectedLog.is_top && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yingge-red text-white text-xs rounded-full">
                    <Pin size={12} />
                    置顶
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-yingge-dark/50 text-sm">
                  <Calendar size={14} />
                  {formatDate(selectedLog.created_at)}
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-yingge-dark mb-4">
                {selectedLog.title}
              </h2>
              <div className="text-yingge-dark/80 leading-relaxed whitespace-pre-line">
                {selectedLog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeLogs;
