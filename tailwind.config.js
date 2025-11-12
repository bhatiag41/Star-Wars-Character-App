/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        'sw-gold': '#FFE81F',
        'sw-deep-gold': '#D4AF37',
        'sw-amber': '#FFA500',
        
        // Backgrounds (all black variations)
        'sw-void': '#000000',
        'sw-space': '#0A0A0A',
        'sw-dark': '#0f0f0f',
        'sw-darker': '#1a1a1a',
        'sw-charcoal': '#2a2a2a',
        
        // Accents (minimal blue)
        'sw-blue': '#4BD5EE',      // Use sparingly
        'sw-red': '#DC143C',
        'sw-orange': '#FF6B35',
        
        // Text
        'sw-white': '#FFFFFF',
        'sw-light': '#E8E8E8',
        'sw-dim': '#808080',
        'sw-border': '#333333',
        
        // Legacy support (mapped to new colors)
        'sw-yellow': '#FFE81F',
        'sw-nebula': '#1a1a1a',
        'sw-gold': '#D4AF37',
        'sw-rebellion': '#DC143C',
        'sw-empire': '#1a1a1a',
        'sw-jedi': '#4BD5EE',
        'sw-sith': '#DC143C',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 232, 31, 0.5)',
        'glow-gold-lg': '0 0 40px rgba(255, 232, 31, 0.6)',
        'glow-blue': '0 0 15px rgba(75, 213, 238, 0.3)',
        'glow-red': '0 0 20px rgba(220, 20, 60, 0.4)',
        'glow-yellow': '0 0 20px rgba(255,232,31,0.5)',
        'glow-orange': '0 0 20px rgba(255,107,53,0.5)',
      },
      animation: {
        'header-appear': 'headerAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'letter-appear': 'letterAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        headerAppear: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px) scale(0.9)',
            filter: 'blur(10px)',
          },
          '60%': {
            opacity: '1',
            transform: 'translateY(0) scale(1.05)',
            filter: 'blur(0)',
          },
          '100%': {
            transform: 'scale(1)',
          }
        },
        letterAppear: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 232, 31, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 232, 31, 0.6)' },
        }
      },
    },
  },
  plugins: [],
}

