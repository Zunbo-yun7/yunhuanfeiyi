import { useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { ActionCard } from '../components/Card';
import { Play, Info, X } from 'lucide-react';
import { Aurora, ShinyText, BorderGlow } from '@/components/reactbits';

interface ActionItem {
  id: string;
  name: string;
  pinyin: string;
  description: string;
  videoUrl: string;
  image: string;
  meaning: string;
}

interface ActionsData {
  introduction: string;
  actions: ActionItem[];
}

export function ActionAtlas() {
  const { data: actionsData, loading } = useFetchData<ActionsData>('/actions');
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  if (loading || !actionsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yingge-gray">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-yingge-dark/60">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yingge-gray">
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20movement%20dynamic%20action%20Chinese%20traditional%20culture&image_size=landscape_16_9"
          alt="动作图谱"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        {/* React Bits: Aurora 极光波纹背景动画 */}
        <Aurora
          colorStops={['#B22222', '#C8A060', '#8B0000']}
          amplitude={1.2}
          speed={0.4}
          blend={0.45}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <ShinyText
            text="动作图谱"
            speed={4}
            className="font-serif font-bold text-3xl md:text-5xl mb-2"
          />
          <p className="text-yingge-gold">学习英歌的经典动作</p>
        </div>
      </section>

      <section id="classic" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              动作图谱
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
            <p className="text-yingge-dark/60 mt-4">
              {actionsData.introduction}
            </p>
          </div>

          <div className="space-y-6">
            {actionsData.actions.map((action, index) => (
              <BorderGlow
                key={action.id}
                glowIntensity={0.5}
                borderColor="rgba(200, 160, 96, 0.3)"
                glowColor="#C8A060"
                borderRadius={16}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ActionCard
                  title={action.name}
                  subtitle={action.pinyin}
                  description={action.description}
                  image={action.image}
                  onClick={() => setSelectedAction(action)}
                />
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {selectedAction && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedAction(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAction(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-yingge-gray rounded-full flex items-center justify-center hover:bg-yingge-red hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="relative">
              <img
                src={selectedAction.image}
                alt={selectedAction.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-serif font-bold text-2xl text-white">
                  {selectedAction.name}
                </h3>
                <p className="text-yingge-gold">{selectedAction.pinyin}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <Play size={20} className="text-yingge-red mr-2" />
                <h4 className="font-serif font-bold text-lg text-yingge-dark">
                  动作演示
                </h4>
              </div>
              <div className="bg-black rounded-xl overflow-hidden mb-6">
                <div className="video-container">
                  <img
                    src={selectedAction.image}
                    alt={selectedAction.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 bg-yingge-gold rounded-full flex items-center justify-center">
                      <Play size={28} className="text-yingge-red ml-1" fill="currentColor" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <Info size={20} className="text-yingge-red mr-2" />
                <h4 className="font-serif font-bold text-lg text-yingge-dark">
                  动作说明
                </h4>
              </div>
              <p className="text-yingge-dark/70 mb-4">
                {selectedAction.description}
              </p>

              <div className="flex items-center mb-3">
                <Info size={20} className="text-yingge-gold mr-2" />
                <h4 className="font-serif font-bold text-lg text-yingge-dark">
                  精神内涵
                </h4>
              </div>
              <p className="text-yingge-dark/70">
                {selectedAction.meaning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
