/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy colors (keeping for compatibility)
        'primary-200': '#ffbf00',
        'primary-100': '#ffc929',
        'secondary-200': '#00b050',
        'secondary-100': '#0b1a78',

        // Dynamic theme colors using CSS variables
        theme: {
          primary: 'rgb(var(--theme-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-secondary) / <alpha-value>)',
          50: 'rgb(var(--theme-50) / <alpha-value>)',
          100: 'rgb(var(--theme-100) / <alpha-value>)',
          200: 'rgb(var(--theme-200) / <alpha-value>)',
          300: 'rgb(var(--theme-300) / <alpha-value>)',
          400: 'rgb(var(--theme-400) / <alpha-value>)',
          500: 'rgb(var(--theme-500) / <alpha-value>)',
          600: 'rgb(var(--theme-600) / <alpha-value>)',
          700: 'rgb(var(--theme-700) / <alpha-value>)',
          800: 'rgb(var(--theme-800) / <alpha-value>)',
          900: 'rgb(var(--theme-900) / <alpha-value>)',
        },

        // Global Pakiza Theme Colors (static)
        pakiza: {
          50: '#faf7ff',
          100: '#f3ecff',
          200: '#e9d9ff',
          300: '#d7b9ff',
          400: '#bf8dff',
          500: '#a855f7', // Primary purple
          600: '#9333ea',
          700: '#7c2d12',
          800: '#581c87',
          900: '#3b0764',
        },
        'pakiza-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'pakiza-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        pakiza: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        pakiza:
          '0 4px 6px -1px rgba(168, 85, 247, 0.1), 0 2px 4px -1px rgba(168, 85, 247, 0.06)',
        'pakiza-lg':
          '0 10px 15px -3px rgba(168, 85, 247, 0.1), 0 4px 6px -2px rgba(168, 85, 247, 0.05)',
        'pakiza-xl':
          '0 20px 25px -5px rgba(168, 85, 247, 0.1), 0 10px 10px -5px rgba(168, 85, 247, 0.04)',
      },
      backgroundImage: {
        'theme-gradient': 'var(--theme-gradient)',
        'theme-gradient-light': 'var(--theme-gradient-light)',
        'theme-card': 'var(--theme-card)',
        // Static gradients (fallback)
        'pakiza-gradient': 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
        'pakiza-gradient-r': 'linear-gradient(to right, #a855f7, #3b82f6)',
        'pakiza-gradient-light':
          'linear-gradient(135deg, #f3ecff 0%, #dbeafe 100%)',
        'pakiza-card': 'linear-gradient(135deg, #ffffff 0%, #f3ecff 100%)',
      },
      animation: {
        'pakiza-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pakiza-bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};
