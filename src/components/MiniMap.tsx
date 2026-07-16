import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Location {
  name: string;
  lat: number;
  lng: number;
  type: 'city' | 'district' | 'village';
}

const JIEYANG_BOUNDARY = {
  minLng: 115.6,
  maxLng: 116.63,
  minLat: 22.88,
  maxLat: 23.77,
};

const LOCATIONS: Location[] = [
  { name: '揭阳', lat: 23.53, lng: 116.35, type: 'city' },
  { name: '普宁', lat: 23.30, lng: 116.18, type: 'city' },
  { name: '惠来', lat: 23.05, lng: 116.38, type: 'district' },
  { name: '揭西', lat: 23.45, lng: 115.80, type: 'district' },
  { name: '揭东', lat: 23.57, lng: 116.45, type: 'district' },
  { name: '榕城', lat: 23.53, lng: 116.36, type: 'district' },
  { name: '新坛村', lat: 23.30, lng: 116.18, type: 'village' },
];

function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const { minLng, maxLng, minLat, maxLat } = JIEYANG_BOUNDARY;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return { x, y };
}

export function MiniMap() {
  const mapRef = useRef<SVGSVGElement>(null);
  const mapWidth = 400;
  const mapHeight = 300;

  useEffect(() => {
    if (!mapRef.current) return;
    const svg = mapRef.current;

    const pulseDot = svg.querySelector('#pulse-dot');
    const pulseRing = svg.querySelector('#pulse-ring');

    if (pulseDot && pulseRing) {
      const newtan = LOCATIONS.find(l => l.name === '新坛村')!;
      const pos = latLngToXY(newtan.lat, newtan.lng, mapWidth, mapHeight);

      let startTime: number | null = null;
      const animate = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = (now - startTime) / 1000;

        const pulseScale = 1 + Math.sin(elapsed * 2.5) * 0.15;
        (pulseDot as SVGGraphicsElement).setAttribute(
          'transform',
          `translate(${pos.x}, ${pos.y}) scale(${pulseScale})`
        );

        const ringScale = 1 + (elapsed % 2) * 0.8;
        const ringOpacity = Math.max(0, 1 - (elapsed % 2) * 0.5);
        (pulseRing as SVGGraphicsElement).setAttribute(
          'transform',
          `translate(${pos.x}, ${pos.y}) scale(${ringScale})`
        );
        (pulseRing as SVGGraphicsElement).setAttribute('opacity', String(ringOpacity));

        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, []);

  const newtanPos = latLngToXY(23.30, 116.18, mapWidth, mapHeight);

  return (
    <div className="relative bg-gradient-to-br from-yingge-gray to-yingge-gold/5 rounded-2xl p-6 overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-yingge-gold/40 flex items-center justify-center">
          <span className="text-yingge-gold text-xs font-bold">N</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Navigation size={18} className="text-yingge-red" />
          <h4 className="font-serif font-bold text-lg text-yingge-dark">地理位置</h4>
        </div>
        <p className="text-sm text-yingge-dark/60">
          广东省揭阳市普宁市流沙东街道新坛村
        </p>
        <p className="text-xs text-yingge-dark/40 mt-1">
          坐标：东经 116.18°，北纬 23.30°
        </p>
      </div>

      <div className="relative w-full aspect-[4/3] bg-white/70 rounded-xl overflow-hidden shadow-inner">
        <svg
          ref={mapRef}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B3E5FC" />
              <stop offset="100%" stopColor="#81D4FA" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8E1" />
              <stop offset="100%" stopColor="#FFECB3" />
            </linearGradient>
            <linearGradient id="cityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7043" />
              <stop offset="100%" stopColor="#F4511E" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="wavePattern" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
              <path d="M0,5 Q5,0 10,5 T20,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width={mapWidth} height={mapHeight} fill="url(#seaGrad)" />
          <rect x={mapWidth * 0.35} y={mapHeight * 0.2} width={mapWidth * 0.7} height={mapHeight * 0.8} fill="url(#wavePattern)" opacity="0.5" />

          <path
            d={`M ${mapWidth * 0.15} ${mapHeight * 0.35} 
               Q ${mapWidth * 0.2} ${mapHeight * 0.25} ${mapWidth * 0.25} ${mapHeight * 0.22}
               Q ${mapWidth * 0.35} ${mapHeight * 0.18} ${mapWidth * 0.45} ${mapHeight * 0.2}
               Q ${mapWidth * 0.55} ${mapHeight * 0.22} ${mapWidth * 0.65} ${mapHeight * 0.18}
               Q ${mapWidth * 0.75} ${mapHeight * 0.15} ${mapWidth * 0.85} ${mapHeight * 0.2}
               Q ${mapWidth * 0.92} ${mapHeight * 0.3} ${mapWidth * 0.95} ${mapHeight * 0.45}
               Q ${mapWidth * 0.92} ${mapHeight * 0.6} ${mapWidth * 0.85} ${mapHeight * 0.7}
               Q ${mapWidth * 0.75} ${mapHeight * 0.8} ${mapWidth * 0.6} ${mapHeight * 0.85}
               Q ${mapWidth * 0.45} ${mapHeight * 0.88} ${mapWidth * 0.3} ${mapHeight * 0.85}
               Q ${mapWidth * 0.2} ${mapHeight * 0.8} ${mapWidth * 0.12} ${mapHeight * 0.7}
               Q ${mapWidth * 0.08} ${mapHeight * 0.55} ${mapWidth * 0.1} ${mapHeight * 0.45}
               Z`}
            fill="url(#landGrad)"
            stroke="#FFB74D"
            strokeWidth="2.5"
          />

          <ellipse cx={mapWidth * 0.5} cy={mapHeight * 0.55} rx={mapWidth * 0.18} ry={mapHeight * 0.12} fill="rgba(255,255,255,0.3)" />
          <text x={mapWidth * 0.5} y={mapHeight * 0.58} textAnchor="middle" fill="#9E9E9E" fontSize="8">河流</text>

          {LOCATIONS.map((loc) => {
            const pos = latLngToXY(loc.lat, loc.lng, mapWidth, mapHeight);
            if (loc.name === '新坛村') return null;

            const isCity = loc.type === 'city';
            const radius = isCity ? 6 : 4;
            const fontSize = isCity ? 11 : 9;
            const fontWeight = isCity ? '700' : '400';
            const color = isCity ? '#E65100' : '#795548';

            return (
              <g key={loc.name}>
                <circle cx={pos.x} cy={pos.y} r={radius} fill="white" stroke={color} strokeWidth="2" />
                <circle cx={pos.x} cy={pos.y} r={isCity ? 2.5 : 1.5} fill={color} />
                <text
                  x={pos.x}
                  y={pos.y - radius - 6}
                  textAnchor="middle"
                  fill={color}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  fontFamily="sans-serif"
                >
                  {loc.name}
                </text>
              </g>
            );
          })}

          <g id="pulse-ring">
            <circle r="14" fill="none" stroke="#DC2626" strokeWidth="2.5" opacity="0.7" />
          </g>

          <g id="pulse-dot">
            <circle r="8" fill="#DC2626" filter="url(#glow)" />
            <circle r="3.5" fill="white" />
          </g>

          <g transform={`translate(${newtanPos.x + 18}, ${newtanPos.y - 15})`}>
            <rect
              x="0" y="0"
              width="85" height="42"
              rx="8"
              fill="rgba(220,38,38,0.98)"
              stroke="#F0DCA0"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            <polygon points="15,42 25,42 20,48" fill="rgba(220,38,38,0.98)" />
            <text x="8" y="16" fill="#F0DCA0" fontSize="12" fontWeight="700" fontFamily="serif">
              新坛村
            </text>
            <text x="8" y="32" fill="rgba(255,255,255,0.9)" fontSize="8">
              Xintan Village
            </text>
          </g>

          <g transform={`translate(${mapWidth * 0.05}, ${mapHeight * 0.88})`}>
            <rect width="70" height="22" rx="5" fill="rgba(255,255,255,0.9)" stroke="#FFB74D" strokeWidth="1" />
            <line x1="8" y1="11" x2="62" y2="11" stroke="#616161" strokeWidth="1" strokeLinecap="round" />
            <circle cx="8" cy="11" r="2" fill="#616161" />
            <circle cx="35" cy="11" r="2" fill="#616161" />
            <circle cx="62" cy="11" r="2" fill="#616161" />
            <text x="16" y="18" fill="#424242" fontSize="7">0</text>
            <text x="38" y="18" fill="#424242" fontSize="7">30</text>
            <text x="58" y="18" fill="#424242" fontSize="7">60km</text>
          </g>

          <g transform={`translate(${mapWidth * 0.82}, ${mapHeight * 0.08})`}>
            <text x="0" y="12" fill="#5D4037" fontSize="12" fontWeight="700" fontFamily="serif">
              揭阳市
            </text>
            <text x="0" y="24" fill="#795548" fontSize="8">Jieyang City</text>
          </g>

          <g transform={`translate(${mapWidth * 0.05}, ${mapHeight * 0.08})`}>
            <rect width="60" height="35" rx="4" fill="rgba(255,255,255,0.9)" stroke="#FFB74D" strokeWidth="1" />
            <text x="6" y="14" fill="#424242" fontSize="7" fontWeight="600">图例</text>
            <circle cx="10" cy="23" r="3" fill="white" stroke="#E65100" strokeWidth="1.5" />
            <circle cx="13" cy="23" r="1.5" fill="#E65100" />
            <text x="20" y="26" fill="#5D4037" fontSize="6">县级市</text>
            <circle cx="10" cy="31" r="2" fill="white" stroke="#795548" strokeWidth="1.5" />
            <circle cx="11" cy="31" r="1" fill="#795548" />
            <text x="20" y="34" fill="#5D4037" fontSize="6">区县</text>
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-xs text-yingge-dark/70">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white border-2 border-orange-600 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
          </div>
          <span>县级市（普宁、揭阳）</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-white border border-gray-600 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
          </div>
          <span>区县（惠来、揭西、揭东、榕城）</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span>新坛村（目标位置）</span>
        </div>
      </div>
    </div>
  );
}

export default MiniMap;
