import { useState } from 'react';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ title, description, image, children, onClick, className = '', style }: CardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotate({
      x: (y - rect.height / 2) / 15,
      y: (rect.width / 2 - x) / 15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl card-shadow transition-all duration-300 overflow-hidden card-hover-effect ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {image && (
        <div className="relative h-48 overflow-hidden glow-effect">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-serif font-bold text-xl text-yingge-dark mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-yingge-dark/70 mb-4 line-clamp-2">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ActionCard({ title, subtitle, description, image, onClick, className = '', style }: ActionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-stretch">
        <div className="w-28 md:w-36 flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yingge-red/10 to-yingge-gold/10" />
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-yingge-gold rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-baseline mb-2">
            <h3 className="font-serif font-bold text-lg md:text-xl text-yingge-dark">{title}</h3>
            {subtitle && (
              <span className="ml-3 text-xs text-yingge-gold font-medium tracking-wide">
                {subtitle}
              </span>
            )}
          </div>
          <p className="text-sm text-yingge-dark/60 leading-relaxed line-clamp-2">{description}</p>
          <div className="mt-3 flex items-center text-yingge-red text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>查看详情</span>
            <svg className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yingge-gold via-yingge-red to-yingge-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

interface PeopleCardProps {
  name: string;
  role: string;
  avatar: string;
  story: string;
  achievements: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function PeopleCard({ name, role, avatar, story, achievements, className = '', style }: PeopleCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotate({
      x: (y - rect.height / 2) / 20,
      y: (rect.width / 2 - x) / 20,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className={`bg-white rounded-xl card-shadow overflow-hidden card-hover-effect ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-4 border-yingge-gold"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yingge-gold rounded-full border-2 border-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-serif font-bold text-xl text-yingge-dark">{name}</h3>
            <p className="text-sm text-yingge-red">{role}</p>
          </div>
        </div>
        <p className="text-sm text-yingge-dark/70 leading-relaxed mb-4">{story}</p>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-yingge-gray text-yingge-dark text-xs rounded-full hover:bg-yingge-gold/20 transition-colors duration-300"
            >
              {achievement}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface EquipmentCardProps {
  name: string;
  description: string;
  image: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function EquipmentCard({ name, description, image, onClick, className = '', style }: EquipmentCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotate({
      x: (y - rect.height / 2) / 15,
      y: (rect.width / 2 - x) / 15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl card-shadow overflow-hidden card-hover-effect transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative glow-effect">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h3 className="font-serif font-bold text-lg text-white">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-yingge-dark/70 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
