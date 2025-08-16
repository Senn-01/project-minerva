/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brutal-black': '#000000',
        'brutal-white': '#FFFFFF',
        'brutal-yellow': '#FFD700',
        'brutal-red': '#FF0000',
        'brutal-blue': '#0000FF',
        'brutal-green': '#00FF00',
        'brutal-pink': '#FF69B4',
      },
      fontFamily: {
        'mono': ['Space Mono', 'monospace'],
        'display': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '4px 4px 0 rgba(0, 0, 0, 0.9)',
        'brutal': '8px 8px 0 rgba(0, 0, 0, 0.9)',
        'brutal-lg': '12px 12px 0 rgba(0, 0, 0, 0.9)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}