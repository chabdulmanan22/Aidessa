/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F8E7C9',
          50: '#FFFCF5',
          100: '#FDF7EB',
          200: '#F8E7C9',
          300: '#EED5AF',
          400: '#E4C294',
          500: '#D6AE78',
        },
        forest: {
          DEFAULT: '#064E3B',
          hover: '#043C2D',
          dark: '#032B20',
          light: '#0B6851',
          subtle: '#064E3B15',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#064E3B',
          600: '#053e2f',
          700: '#043629',
          800: '#032b20',
          900: '#021f17',
          950: '#01140e',
        },
        ocean: {
          highlight: '#064E3B',
          teal: '#0A6C53',
          mid: '#064E3B',
          deep: '#F8E7C9',
          abyss: '#EED7AF',
        },
      },
      backgroundImage: {
        'matte-cream': 'linear-gradient(to bottom, #F8E7C9, #F5E2BE)',
        'matte-card': 'linear-gradient(to bottom right, #FFFDF9, #F8E7C9)',
      },
      fontFamily: {
        editorial: ['"Instrument Serif"', '"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },


      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}