import useFetchData from '@/hooks/useFetchData';
import { PeopleCard } from '../components/Card';
import { Award, Users, Star } from 'lucide-react';

const iconMap = {
  Award,
  Users,
  Star,
};

interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string;
  story: string;
  achievements: string[];
}

interface PeopleCategory {
  title: string;
  description: string;
  people: Person[];
}

interface PeopleData {
  introduction: string;
  categories: PeopleCategory[];
}

export function PeopleStories() {
  const { data: peopleData, loading } = useFetchData<PeopleData>('/people');

  if (loading || !peopleData) {
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
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20master%20portrait%20cultural%20heritage%20honor&image_size=landscape_16_9"
          alt="人物故事"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="font-serif font-bold text-3xl md:text-5xl text-white mb-2">
            人物故事
          </h1>
          <p className="text-yingge-gold">聆听传承人的感人故事</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              人物故事
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
            <p className="text-yingge-dark/60 mt-4 max-w-2xl mx-auto">
              {peopleData.introduction}
            </p>
          </div>

          {peopleData.categories.map((category, categoryIndex) => {
            const icons = ['Award', 'Users', 'Star'] as const;
            const Icon = iconMap[icons[categoryIndex]] || Award;
            
            return (
              <section key={category.title} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-yingge-gray rounded-full flex items-center justify-center mr-4">
                    <Icon size={24} className="text-yingge-red" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-yingge-dark">
                      {category.title}
                    </h3>
                    <p className="text-sm text-yingge-dark/60">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.people.map((person, personIndex) => (
                    <PeopleCard
                      key={person.id}
                      name={person.name}
                      role={person.role}
                      avatar={person.avatar}
                      story={person.story}
                      achievements={person.achievements}
                      className="animate-slide-up"
                      style={{ animationDelay: `${personIndex * 100}ms` }}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 bg-yingge-dark">
        <div className="container mx-auto text-center">
          <h2 className="font-serif font-bold text-3xl text-white mb-4">
            传承之路，任重道远
          </h2>
          <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full mb-8" />
          <p className="text-yingge-light/70 max-w-2xl mx-auto mb-8">
            每一位传承人都是英歌文化的守护者。他们用自己的青春和汗水，将这项珍贵的非物质文化遗产一代一代地传承下去。让我们向这些默默奉献的传承人致敬！
          </p>
          <button className="px-8 py-3 bg-yingge-gold text-yingge-red font-bold rounded-full hover:bg-yingge-cream transition-all duration-300 hover-scale-lg">
            了解更多传承故事
          </button>
        </div>
      </section>
    </div>
  );
}
