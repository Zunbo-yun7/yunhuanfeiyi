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
      onClick={onClick}
      className={`bg-gradient-to-br from-yingge-cream to-white rounded-xl card-shadow transition-all duration-300 overflow-hidden card-hover-effect ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 overflow-hidden glow-effect">
          <img
            src={image}
            alt={title}
            className="w-full h-48 md:h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h3 className="font-serif font-bold text-xl text-yingge-dark mb-1">{title}</h3>
          {subtitle && (
            <p className="text-sm text-yingge-gold font-medium mb-3">{subtitle}</p>
          )}
          <p className="text-sm text-yingge-dark/70 leading-relaxed">{description}</p>
        </div>
      </div>
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
