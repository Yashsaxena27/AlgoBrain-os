/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'var(--bg-surface-0)',
          1: 'var(--bg-surface-1)',
          2: 'var(--bg-surface-2)',
          3: 'var(--bg-surface-3)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        accent: {
          violet: '#635BFF',   // Refined, soothing Stripe/Linear brand violet
          cyan: '#0EA5E9',     // Refined AI signal
          emerald: '#10B981',  // Soothing emerald
          amber: '#F59E0B',    // Warm amber
          rose: '#F43F5E',     // Soft rose
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'glass-sm': 'var(--shadow-glass-sm)',
        'glass-md': 'var(--shadow-glass-md)',
        'glow-violet': '0 0 24px -4px rgba(99, 91, 255, 0.25)',
        'glow-cyan': '0 0 24px -4px rgba(14, 165, 233, 0.25)',
        'glow-emerald': '0 0 24px -4px rgba(16, 185, 129, 0.25)',
        'glow-rose': '0 0 24px -4px rgba(244, 63, 94, 0.28)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'orb-pulse': 'orbPulse 3s infinite ease-in-out',
        'fade-in': 'fadeIn 160ms ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
