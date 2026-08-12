import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  hueShift?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColors[8];
  uniform int uColorCount;
  uniform int uCount;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uWaviness;
  uniform float uThickness;
  uniform float uGlow;
  uniform float uTaper;
  uniform float uSpread;
  uniform float uHueShift;
  uniform float uIntensity;
  uniform float uSaturation;
  uniform float uOpacity;
  uniform float uScale;
  uniform bool uGlass;
  uniform float uRefraction;
  uniform float uDispersion;
  uniform float uGlassSize;

  vec3 hueShift(vec3 color, float shift) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(shift);
    return color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle);
  }

  vec3 saturationAdjust(vec3 color, float sat) {
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(vec3(luma), color, sat);
  }

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  vec2 strandOffset(float i, float t) {
    float phase = i * 0.7 + t * uSpeed;
    float y = sin(phase) * 0.3 * uAmplitude;
    float x = cos(phase * 0.5 + i * 1.3) * 0.15 * uAmplitude;
    return vec2(x, y);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= uResolution.x / uResolution.y;
    uv /= uScale;

    float t = uTime * 0.5;
    vec3 col = vec3(0.0);
    float totalWeight = 0.0;

    for (int i = 0; i < 16; i++) {
      if (i >= uCount) break;
      float fi = float(i);
      float spreadOffset = (fi - float(uCount - 1) * 0.5) * 0.15 * uSpread;

      vec2 strandUv = uv;
      strandUv.y -= spreadOffset;

      vec2 offset = strandOffset(fi, t);
      strandUv -= offset;

      float wave = sin(strandUv.x * uWaviness * 10.0 + t * uSpeed * 2.0 + fi * 2.0) * 0.05;
      float dist = abs(strandUv.y + wave);

      float thickness = uThickness * 0.03;
      float strand = smoothstep(thickness * (1.0 + uGlow), thickness * 0.3, dist);

      float taper = 1.0 - pow(abs(strandUv.x) * 0.8, uTaper);
      taper = clamp(taper, 0.0, 1.0);

      strand *= taper;

      vec3 strandColor = uColors[i < uColorCount ? i : i - uColorCount * (i / uColorCount)];
      strandColor = hueShift(strandColor, uHueShift + fi * 0.2);
      strandColor = saturationAdjust(strandColor, uSaturation);

      col += strandColor * strand * uIntensity;
      totalWeight += strand;
    }

    col = col / max(totalWeight, 0.001);
    col *= uOpacity;

    if (uGlass) {
      vec2 glassUv = vUv - 0.5;
      float glassDist = length(glassUv) / uGlassSize;
      float glass = 1.0 - smoothstep(0.3, 0.5, glassDist);

      float angle = atan(glassUv.y, glassUv.x);
      float dispersion = sin(angle * 3.0 + uTime) * uDispersion * 0.1;
      col.r += dispersion;
      col.b -= dispersion;

      col *= 1.0 + glass * uRefraction * 0.3;
      col += vec3(0.1) * glass * uRefraction;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Strands({
  colors = ['#B22222', '#C8A060', '#2F4F4F', '#8B0000'],
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  hueShift = 0,
  intensity = 0.6,
  saturation = 1,
  opacity = 1,
  scale = 1.5,
  glass = false,
  refraction = 1,
  dispersion = 1,
  glassSize = 1,
  className = '',
  style,
}: StrandsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    };

    const colorArray: number[] = [];
    const palette = colors.length > 0 ? colors : ['#FF4242', '#7C3AED', '#06B6D4', '#EAB308'];
    for (let i = 0; i < 8; i++) {
      const c = hexToRgb(palette[i % palette.length]);
      colorArray.push(...c);
    }

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uColors: { value: colorArray },
        uColorCount: { value: palette.length },
        uCount: { value: count },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaviness: { value: waviness },
        uThickness: { value: thickness },
        uGlow: { value: glow },
        uTaper: { value: taper },
        uSpread: { value: spread },
        uHueShift: { value: hueShift },
        uIntensity: { value: intensity },
        uSaturation: { value: saturation },
        uOpacity: { value: opacity },
        uScale: { value: scale },
        uGlass: { value: glass },
        uRefraction: { value: refraction },
        uDispersion: { value: dispersion },
        uGlassSize: { value: glassSize },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colors, count, speed, amplitude, waviness, thickness, glow, taper, spread, hueShift, intensity, saturation, opacity, scale, glass, refraction, dispersion, glassSize]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
