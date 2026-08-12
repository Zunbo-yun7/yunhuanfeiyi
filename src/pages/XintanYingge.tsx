import useFetchData from '@/hooks/useFetchData';
import { Card } from '../components/Card';
import { MapPin, Award, Calendar, Video, Compass, Sun, Trees, Navigation } from 'lucide-react';
import { MiniMap } from '../components/MiniMap';
import { Strands, ShinyText, BorderGlow } from '@/components/reactbits';

interface VillageData {
  name: string;
  description: string;
  history: string;
  image: string;
  latitude: string;
  longitude: string;
  address: string;
  geoDescription: string;
  environment: string;
  climate: string;
  traffic: string;
}

interface TeamData {
  name: string;
  founded: string;
  description: string;
  achievements: string[];
  images: string[];
}

interface TrainingData {
  description: string;
  images: string[];
}

interface StoryItem {
  title: string;
  content: string;
  image: string;
}

interface TeamMember {
  name: string;
  age: number | null;
  mbti: string;
  college: string;
  grade: string;
  class: string;
  avatar: string;
  introduction: string;
}

interface XintanData {
  village: VillageData;
  team: TeamData;
  training: TrainingData;
  stories: StoryItem[];
  members: TeamMember[];
}

export function XintanYingge() {
  const { data: xintanData, loading } = useFetchData<XintanData>('/xintan');

  if (loading || !xintanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yingge-gray">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-yingge-dark/60">加载中...</p>
        </div>
      </div>
    );
  }

  const village = xintanData.village || { name: '', description: '', history: '', image: '', latitude: '', longitude: '', address: '', geoDescription: '', environment: '', climate: '', traffic: '' };
  const team = xintanData.team || { name: '', founded: '', description: '', achievements: [], images: [] };
  const training = xintanData.training || { description: '', images: [] };
  const stories = xintanData.stories || [];
  const members = xintanData.members || [];

  const geoCards = [
    {
      icon: Compass,
      title: '地理概况',
      content: village.geoDescription,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100',
    },
    {
      icon: Trees,
      title: '自然环境',
      content: village.environment,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100',
    },
    {
      icon: Sun,
      title: '气候条件',
      content: village.climate,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconBg: 'bg-orange-100',
    },
    {
      icon: Navigation,
      title: '交通指南',
      content: village.traffic,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100',
    },
  ];

  return (
    <div className="min-h-screen bg-yingge-gray">
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20village%20Xintan%20Puning%20cultural%20heritage%20landscape&image_size=landscape_16_9"
          alt="新坛村"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        {/* WebGL 流动光带背景动画，使用英歌主题色 */}
        <Strands
          colors={['#B22222', '#C8A060', '#8B0000', '#2C2C2C']}
          count={4}
          speed={0.3}
          amplitude={0.8}
          intensity={0.4}
          opacity={0.5}
          scale={2}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <ShinyText
            text="新坛英歌"
            speed={4}
            className="font-serif font-bold text-3xl md:text-5xl mb-2"
          />
          <p className="text-yingge-gold">探访新坛村的英歌传奇</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              新坛村
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <BorderGlow
              className="h-full min-h-[360px]"
              glowIntensity={0.5}
              glowColor="#C8A060"
              borderColor="rgba(200, 160, 96, 0.3)"
              borderRadius={16}
            >
              <div className="relative w-full h-full min-h-[360px]">
                <img
                  src={village.image}
                  alt={village.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white mb-2">
                    <MapPin size={20} className="text-yingge-gold" />
                    <span className="font-medium">{village.address}</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    坐标：东经 {village.longitude}°，北纬 {village.latitude}°
                  </p>
                </div>
              </div>
            </BorderGlow>

            <div className="flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <MapPin size={28} className="text-yingge-red mr-3" />
                <h3 className="font-serif font-bold text-3xl text-yingge-dark">
                  {village.name}
                </h3>
              </div>
              <p className="text-yingge-dark/80 leading-relaxed mb-6 text-lg">
                {village.description}
              </p>
              <p className="text-yingge-dark/70 leading-relaxed">
                {village.history}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              地理与环境
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
            <p className="text-yingge-dark/60 mt-4 max-w-2xl mx-auto">
              了解新坛村的地理位置、自然环境、气候条件及交通方式
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <MiniMap />
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {geoCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <BorderGlow
                      key={card.title}
                      className={`bg-white p-5 ${card.color} hover:shadow-md transition-shadow duration-300`}
                      glowIntensity={0.5}
                      glowColor="#C8A060"
                      borderColor="rgba(200, 160, 96, 0.3)"
                      borderRadius={12}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-lg mb-2">{card.title}</h3>
                          <p className="text-sm leading-relaxed opacity-90">{card.content}</p>
                        </div>
                      </div>
                    </BorderGlow>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              新坛英歌队
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <BorderGlow
            className="bg-white card-shadow p-8 mb-8"
            glowIntensity={0.5}
            glowColor="#C8A060"
            borderColor="rgba(200, 160, 96, 0.3)"
            borderRadius={16}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Calendar size={20} className="text-yingge-red mr-2" />
                <span className="text-yingge-dark">成立于 {team.founded}</span>
              </div>
              <div className="flex items-center">
                <Award size={20} className="text-yingge-gold mr-2" />
                <span className="text-yingge-dark">省级非物质文化遗产传承基地</span>
              </div>
            </div>
            <p className="text-yingge-dark/80 leading-relaxed mb-6">
              {team.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-yingge-gray rounded-lg"
                >
                  <div className="w-6 h-6 bg-yingge-red rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-yingge-dark">{achievement}</span>
                </div>
              ))}
            </div>
          </BorderGlow>

          {/* 奖状展示 */}
          <BorderGlow
            id="honors"
            className="bg-white card-shadow p-8 mb-8"
            glowIntensity={0.5}
            glowColor="#B22222"
            borderColor="rgba(178, 34, 34, 0.2)"
            borderRadius={16}
          >
            <div className="text-center mb-6">
              <h3 className="font-serif font-bold text-2xl text-yingge-dark mb-2">
                荣誉资质
              </h3>
              <div className="w-16 h-1 bg-yingge-gold mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 非遗传承基地牌匾 */}
              <div className="flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-yingge-gold/30 w-full">
                  <img
                    src="/images/certificates/certificate-intangible-heritage.jpg"
                    alt="揭阳市非物质文化遗产传承基地"
                    className="w-full h-auto object-contain bg-white"
                  />
                </div>
                <div className="mt-3 text-center">
                  <h4 className="font-bold text-yingge-dark">揭阳市非物质文化遗产传承基地</h4>
                  <p className="text-sm text-gray-500">揭阳市文化广电新闻出版局 · 2018年11月</p>
                </div>
              </div>

              {/* 金奖奖状 */}
              <div className="flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-yingge-gold/30 w-full">
                  <img
                    src="/images/certificates/certificate-gold-award.jpg"
                    alt="首届广东社区文化节金奖"
                    className="w-full h-auto object-contain bg-white"
                  />
                </div>
                <div className="mt-3 text-center">
                  <h4 className="font-bold text-yingge-dark">首届广东社区文化节金奖</h4>
                  <p className="text-sm text-gray-500">中共广东省委宣传部、广东省文化厅 · 2011年7月</p>
                </div>
              </div>

              {/* 市级代表性传承人 */}
              <div className="flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-yingge-gold/30 w-full">
                  <img
                    src="/images/certificates/chenjinyong.jpg"
                    alt="市级非物质文化遗产代表性传承人"
                    className="w-full h-auto object-contain bg-white"
                  />
                </div>
                <div className="mt-3 text-center">
                  <h4 className="font-bold text-yingge-dark">市级代表性传承人</h4>
                  <p className="text-sm text-gray-500">陈进勇 · 揭阳市文化广电新闻出版局 · 2017年10月</p>
                </div>
              </div>
            </div>
          </BorderGlow>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.images.map((image, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden h-64">
                <img
                  src={image}
                  alt={`英歌队照片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              训练场景
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <p className="text-yingge-dark/80 text-center max-w-2xl mx-auto mb-8">
            {training.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {training.images.map((image, index) => (
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
                  title={`训练场景 ${index + 1}`}
                  image={image}
                />
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section id="inheritance" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              传承故事
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <BorderGlow
                key={index}
                className="animate-slide-up"
                glowIntensity={0.5}
                glowColor="#B22222"
                borderColor="rgba(178, 34, 34, 0.2)"
                borderRadius={12}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card
                  title={story.title}
                  description={story.content}
                  image={story.image}
                />
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section id="members" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-yingge-dark mb-4">
              队伍成员
            </h2>
            <div className="w-20 h-1 bg-yingge-gold mx-auto rounded-full" />
            <p className="text-yingge-dark/60 mt-4 max-w-2xl mx-auto">
              认识我们团队的每一位成员，了解他们的故事和特长
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {members.map((member, index) => (
              <BorderGlow
                key={index}
                className="bg-white card-shadow hover:shadow-lg transition-shadow duration-300 animate-slide-up"
                glowIntensity={0.4}
                glowColor="#C8A060"
                borderColor="rgba(200, 160, 96, 0.3)"
                borderRadius={12}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {member.avatar ? (
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-yingge-red/10 to-yingge-gold/10 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yingge-gold rounded-full flex items-center justify-center">
                      <span className="text-yingge-red text-2xl sm:text-3xl font-bold">{member.name.charAt(0)}</span>
                    </div>
                  </div>
                )}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-yingge-dark">
                      {member.name}
                    </h3>
                    {member.mbti && (
                      <span className="px-2 py-0.5 bg-yingge-gold/20 text-yingge-gold text-xs font-medium rounded-full">
                        {member.mbti}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-2 text-xs">
                    {member.age && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-5 h-5 bg-yingge-red/10 rounded-full flex items-center justify-center text-yingge-red text-[10px]">🎂</span>
                        <span>{member.age}岁</span>
                      </div>
                    )}
                    {member.college && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-5 h-5 bg-yingge-gold/10 rounded-full flex items-center justify-center text-yingge-gold text-[10px]">🏛️</span>
                        <span className="truncate">{member.college}</span>
                      </div>
                    )}
                    {member.grade && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-[10px]">📚</span>
                        <span>{member.grade}</span>
                      </div>
                    )}
                    {member.class && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-[10px]">👥</span>
                        <span className="truncate">{member.class}</span>
                      </div>
                    )}
                  </div>
                  {member.introduction && (
                    <p className="text-yingge-dark/70 text-xs leading-relaxed border-t border-gray-100 pt-2 line-clamp-2">
                      {member.introduction}
                    </p>
                  )}
                </div>
              </BorderGlow>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-12 text-yingge-dark/40">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p>暂无成员信息</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default XintanYingge;
