import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#050506',
          elevated: '#0c0c0e',
          surface: '#111113',
          card: '#161619',
          border: 'rgba(255,255,255,0.06)',
          borderHover: 'rgba(255,255,255,0.12)',
        },
        accent: {
          DEFAULT: '#10b981',
          hover: '#059669',
          muted: 'rgba(16,185,129,0.15)',
          glow: 'rgba(16,185,129,0.25)',
        },
        muted: {
          DEFAULT: '#71717a',
          foreground: '#a1a1aa',
        },
        danger: '#ef4444',
        gold: '#f59e0b',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(16,185,129,0.2)',
        glow: '0 0 40px -10px rgba(16,185,129,0.3)',
        'card': '0 1px 0 0 rgba(255,255,255,0.04)',
        'card-hover': '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px -4px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 0%, rgba(16,185,129,0.08) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(16,185,129,0.04) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
