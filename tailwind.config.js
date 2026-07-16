/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'yingge-red': '#B22222',
        'yingge-dark-red': '#8B0000',
        'yingge-gold': '#C8A060',
        'yingge-dark-gold': '#A67C3D',
        'yingge-dark': '#2C2C2C',
        'yingge-light': '#F9F6F0',
        'yingge-cream': '#FFF8E7',
        'yingge-brown': '#8B4513',
        'yingge-gray': '#F5F5F5',
        'yingge-border': '#E5E5E5',
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'Songti SC', 'serif'],
        'sans': ['Noto Sans SC', 'PingFang SC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
