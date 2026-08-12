import { useState, useEffect } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { EquipmentCard } from '../components/Card';
import { X, Info } from 'lucide-react';
import { Strands, ShinyText, BorderGlow } from '@/components/reactbits';

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  image: string;
  details?: string;
}

interface EquipmentCategory {
  category: string;
  items: EquipmentItem[];
}

type EquipmentData = EquipmentCategory[];

export function EquipmentGuide() {
  const { data: equipmentData, loading } = useFetchData<EquipmentData>('/equipment');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (equipmentData && equipmentData.length > 0 && !activeCategory) {
      setActiveCategory(equipmentData[0].category);
    }
  }, [equipmentData, activeCategory]);

  if (loading || !equipmentData) {
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
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20mask%20costume%20equipment%20cultural%20heritage&image_size=landscape_16_9"
          alt="脸谱与装备"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        {/* React Bits: Strands 流动光带背景动画 */}
        <Strands
          colors={['#B22222', '#C8A060', '#8B0000', '#2F4F4F']}
          count={4}
          speed={0.3}
          amplitude={0.8}
          intensity={0.4}
          opacity={0.5}
          scale={2}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <ShinyText
            text="脸谱与装备图鉴"
            speed={4}
            className="font-serif font-bold text-3xl md:text-5xl mb-2"
          />
          <p className="text-yingge-gold">欣赏精美的脸谱与装备</p>
        </div>
      </section>

      <section id="mask" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              装备分类
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="flex justify-center mb-8">
            {equipmentData.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={`px-6 py-2 mx-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.category
                    ? 'bg-yingge-red text-white'
                    : 'bg-white text-yingge-dark hover:bg-yingge-gray'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {equipmentData.map((category) => (
            <div
              id="costume"
              key={category.category}
              className={activeCategory === category.category ? 'block' : 'hidden'}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((item, index) => (
                  <BorderGlow
                    key={item.id}
                    glowIntensity={0.5}
                    borderColor="rgba(200, 160, 96, 0.3)"
                    glowColor="#C8A060"
                    borderRadius={12}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EquipmentCard
                      name={item.name}
                      description={item.description}
                      image={item.image}
                      onClick={() => setSelectedItem(item)}
                    />
                  </BorderGlow>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-yingge-gray rounded-full flex items-center justify-center hover:bg-yingge-red hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-serif font-bold text-2xl text-white">
                  {selectedItem.name}
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-3">
                <Info size={20} className="text-yingge-red mr-2" />
                <h4 className="font-serif font-bold text-lg text-yingge-dark">
                  简介
                </h4>
              </div>
              <p className="text-yingge-dark/70 mb-4">
                {selectedItem.description}
              </p>

              {selectedItem.details && (
                <>
                  <div className="flex items-center mb-3">
                    <Info size={20} className="text-yingge-gold mr-2" />
                    <h4 className="font-serif font-bold text-lg text-yingge-dark">
                      详细信息
                    </h4>
                  </div>
                  <p className="text-yingge-dark/70">
                    {selectedItem.details}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
