import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onClick?: () => void;
  aspectRatio?: string;
}

export function LazyImage({ src, alt, className = '', placeholder, onClick, aspectRatio = 'auto' }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const defaultPlaceholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5f5"/><circle cx="200" cy="150" r="20" fill="none" stroke="%23C8A060" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="1s" repeatCount="indefinite"/></circle></svg>';

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      style={{ aspectRatio }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-yingge-gray flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-yingge-gold/30 border-t-yingge-gold rounded-full animate-spin" />
        </div>
      )}
      
      {isInView && (
        <img
          src={placeholder || defaultPlaceholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ${
            onClick ? 'cursor-pointer' : ''
          } ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} hover:scale-105`}
          onLoad={handleLoad}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholder || defaultPlaceholder;
            setIsLoaded(true);
          }}
        />
      )}
      
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}
    </div>
  );
}
