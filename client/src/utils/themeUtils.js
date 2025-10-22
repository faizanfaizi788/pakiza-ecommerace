import { useTheme } from '../context/ThemeContext';

// Theme utility functions
export const useThemeClasses = () => {
  const { getThemeClasses, currentTheme } = useTheme();
  return getThemeClasses();
};

// Component-specific theme classes
export const getButtonClasses = (variant = 'primary', size = 'md') => {
  const baseClasses =
    'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-pakiza-gradient text-white hover:shadow-pakiza-lg focus:ring-pakiza-500',
    secondary:
      'bg-gradient-to-r from-pakiza-blue-500 to-pakiza-blue-600 text-white hover:shadow-lg focus:ring-pakiza-blue-500',
    outline:
      'border-2 border-pakiza-500 text-pakiza-500 hover:bg-pakiza-500 hover:text-white focus:ring-pakiza-500',
    ghost: 'text-pakiza-500 hover:bg-pakiza-50 focus:ring-pakiza-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    warning:
      'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

export const getCardClasses = (variant = 'default') => {
  const baseClasses = 'rounded-xl shadow-lg transition-all duration-300';

  const variantClasses = {
    default: 'bg-pakiza-card border border-pakiza-200 hover:shadow-pakiza-xl',
    gradient: 'bg-pakiza-gradient text-white shadow-pakiza-lg',
    light: 'bg-pakiza-gradient-light border border-pakiza-100',
    white: 'bg-white border border-gray-200 hover:shadow-xl',
  };

  return `${baseClasses} ${variantClasses[variant]}`;
};

export const getInputClasses = (state = 'default') => {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';

  const stateClasses = {
    default: 'border-gray-300 focus:ring-pakiza-500 focus:border-pakiza-500',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
  };

  return `${baseClasses} ${stateClasses[state]}`;
};

export const getHeaderClasses = () => {
  return 'bg-pakiza-gradient shadow-pakiza-lg';
};

export const getPageClasses = () => {
  return 'min-h-screen bg-pakiza-gradient-light';
};

// Theme-aware component HOC
export const withTheme = (Component) => {
  return (props) => {
    const themeClasses = useThemeClasses();
    return <Component {...props} themeClasses={themeClasses} />;
  };
};

// Global theme CSS classes for dynamic styling
export const globalThemeClasses = {
  // Backgrounds
  'bg-theme-primary': 'var(--pakiza-primary)',
  'bg-theme-secondary': 'var(--pakiza-secondary)',

  // Text colors
  'text-theme-primary': 'var(--pakiza-primary)',
  'text-theme-secondary': 'var(--pakiza-secondary)',

  // Borders
  'border-theme-primary': 'var(--pakiza-primary)',
  'border-theme-secondary': 'var(--pakiza-secondary)',
};
