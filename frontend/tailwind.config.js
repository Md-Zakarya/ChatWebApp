/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
=======
  darkMode: 'class',
>>>>>>> feature/darkmode-bugfix
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
<<<<<<< HEAD
    extend: {},
  },
  plugins: [],
=======
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0edff', 
          200: '#c7ddff',
          300: '#9ec2ff',
          400: '#769eff',
          500: '#4d74ff',
          600: '#3a51ff',
          700: '#2e3fff',
          800: '#2b36e5',
          900: '#2832bc',
        },
        dark: {
          800: '#1a1b23',
          900: '#15161c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pop': 'pop 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 10px -3px rgba(0,0,0,0.1)',
        'strong': '0 8px 30px rgba(0,0,0,0.12)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
>>>>>>> feature/darkmode-bugfix
}