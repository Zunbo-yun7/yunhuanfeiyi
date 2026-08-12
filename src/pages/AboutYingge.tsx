import useFetchData from '@/hooks/useFetchData';
import { Card } from '../components/Card';
import { History, Star, Award, Users } from 'lucide-react';
import { Aurora, ShinyText, BorderGlow } from '@/components/reactbits';

const iconMap = {
  History,
  Star,
  Award,
  Users,
};

interface HistoryItem {
  year: string;
  event: string;
}

interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

interface PuningFeature {
  title: string;
  description: string;
}

interface AboutData {
  introduction: string;
  history: HistoryItem[];
  features: FeatureItem[];
  puningFeatures: PuningFeature[];
}

export function AboutYingge() {
  const { data: aboutData, loading } = useFetchData<AboutData>('/about');

  if (loading || !aboutData) {
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
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20red%20costumes%20dynamic%20cultural&image_size=landscape_16_9"
          alt="英歌舞"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        {/* 极光波纹背景动画，使用英歌主题色 */}
        <Aurora
          colorStops={['#B22222', '#C8A060', '#8B0000']}
          amplitude={1.2}
          speed={0.4}
          blend={0.4}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <ShinyText
            text="认识英歌"
            speed={4}
            className="font-serif font-bold text-3xl md:text-5xl mb-2"
          />
          <p className="text-yingge-gold">探索英歌文化的起源与发展</p>
        </div>
      </section>

      <section id="intro" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              文化简介
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>
          <BorderGlow
            className="bg-white card-shadow p-8 md:p-12"
            glowIntensity={0.5}
            glowColor="#C8A060"
            borderColor="rgba(200, 160, 96, 0.3)"
            borderRadius={16}
          >
            <p className="text-yingge-dark/80 leading-relaxed text-lg">
              {aboutData.introduction}
            </p>
          </BorderGlow>
        </div>
      </section>

      <section id="history" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              发展历史
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-yingge-gold transform md:-translate-x-1/2" />
            
            <div className="space-y-8">
              {aboutData.history.map((item, index) => (
                <div
                  key={index}
                  id={`history-${item.year.includes('明') ? 'ming' : item.year.includes('清') ? 'qing' : item.year.includes('民国') ? 'minguo' : 'modern'}`}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col`}
                >
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-yingge-red rounded-full border-4 border-yingge-gold transform md:-translate-x-1/2 z-10" />
                  
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <BorderGlow
                      className={`bg-white card-shadow p-6 ${index % 2 === 0 ? 'md:ml-auto' : ''}`}
                      glowIntensity={0.4}
                      glowColor="#B22222"
                      borderColor="rgba(178, 34, 34, 0.2)"
                      borderRadius={12}
                    >
                      <div className="font-serif font-bold text-2xl text-yingge-red mb-2">
                        {item.year}
                      </div>
                      <p className="text-yingge-dark/70">{item.event}</p>
                    </BorderGlow>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="art" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              艺术特色
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData.features.map((feature, index) => (
              <BorderGlow
                key={index}
                className="animate-slide-up"
                glowIntensity={0.5}
                glowColor="#C8A060"
                borderColor="rgba(200, 160, 96, 0.3)"
                borderRadius={12}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                />
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section id="schools" className="py-16 px-4 bg-gradient-to-b from-yingge-light to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              普宁英歌特色
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.puningFeatures.map((feature, index) => {
              const icons = ['Award', 'Star', 'History', 'Users'] as const;
              const Icon = iconMap[icons[index]] || Star;
              return (
                <BorderGlow
                  key={index}
                  className="bg-white card-shadow p-6 text-center hover:card-shadow-hover transition-all duration-300 animate-slide-up"
                  glowIntensity={0.5}
                  glowColor="#B22222"
                  borderColor="rgba(178, 34, 34, 0.2)"
                  borderRadius={12}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-yingge-gray rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-yingge-red" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-yingge-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-yingge-dark/60">{feature.description}</p>
                </BorderGlow>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
