import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  pakiza: {
    name: 'Modern Purple',
    colors: {
      primary: '#a855f7',
      secondary: '#3b82f6',
      50: '250 247 255',
      100: '243 236 255',
      200: '233 217 255',
      300: '215 185 255',
      400: '191 141 255',
      500: '168 85 247',
      600: '147 51 234',
      700: '124 45 18',
      800: '88 28 135',
      900: '59 7 100',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
      gradientLight: 'linear-gradient(135deg, #f3ecff 0%, #dbeafe 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #f3ecff 100%)',
    },
  },
  green: {
    name: 'Classic Green',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      50: '236 253 245',
      100: '209 250 229',
      200: '167 243 208',
      300: '110 231 183',
      400: '52 211 153',
      500: '16 185 129',
      600: '5 150 105',
      700: '4 120 87',
      800: '6 95 70',
      900: '6 78 59',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      gradientLight: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
    },
  },
  blue: {
    name: 'Minimal Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      50: '239 246 255',
      100: '219 234 254',
      200: '191 219 254',
      300: '147 197 253',
      400: '96 165 250',
      500: '59 130 246',
      600: '37 99 235',
      700: '29 78 216',
      800: '30 64 175',
      900: '30 58 138',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      gradientLight: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
    },
  },
  orange: {
    name: 'Bold Orange',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      50: '255 247 237',
      100: '255 237 213',
      200: '254 215 170',
      300: '253 186 116',
      400: '251 146 60',
      500: '249 115 22',
      600: '234 88 12',
      700: '194 65 12',
      800: '154 52 18',
      900: '124 45 18',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      gradientLight: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('pakiza-theme') || 'pakiza';
  });

  useEffect(() => {
    console.log('🎨 Applying theme:', currentTheme);
    localStorage.setItem('pakiza-theme', currentTheme);

    // Apply theme to document root
    const root = document.documentElement;
    const theme = themes[currentTheme];

    console.log('🎨 Theme colors:', theme.colors);

    // Set all CSS custom properties for dynamic theming (colors only)
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
      console.log(`🎨 Set CSS variable --theme-${key}:`, value);
    });

    // Set background images
    root.style.setProperty('--theme-gradient', theme.colors.gradient);
    root.style.setProperty(
      '--theme-gradient-light',
      theme.colors.gradientLight
    );
    root.style.setProperty('--theme-card', theme.colors.card);

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme}`);

    // Force re-render by updating a data attribute
    document.body.setAttribute('data-theme', currentTheme);

    console.log('🎨 Theme applied successfully');
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    console.log('🎨 Changing theme to:', themeName);
    console.log('🎨 Available themes:', Object.keys(themes));
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      console.log('🎨 Theme updated successfully to:', themeName);
    } else {
      console.error('🎨 Theme not found:', themeName);
    }
  };

  const getThemeClasses = () => {
    const theme = themes[currentTheme];
    return {
      primary: 'bg-theme-500',
      secondary: 'bg-theme-secondary',
      text: 'text-theme-800',
      light: 'bg-theme-50',
      button: {
        primary: 'bg-theme-500 hover:bg-theme-600 text-white',
        secondary: 'bg-theme-secondary hover:bg-theme-600 text-white',
        outline:
          'border-theme-500 text-theme-500 hover:bg-theme-500 hover:text-white',
      },
      gradient: {
        primary: 'bg-theme-gradient',
        light: 'bg-theme-gradient-light',
        card: 'bg-theme-card',
      },
    };
  };

  const value = {
    currentTheme,
    themes,
    changeTheme,
    getThemeClasses,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
