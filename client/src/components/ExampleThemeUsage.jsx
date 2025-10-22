// Example usage of the global theme system

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getButtonClasses,
  getCardClasses,
  getInputClasses,
} from '../utils/themeUtils';

const ExampleThemeUsage = () => {
  const { currentTheme, theme } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Theme System Example</h2>
      <p>Current Theme: {theme.name}</p>

      {/* Using theme utility functions */}
      <div className="space-y-4">
        <button className={getButtonClasses('primary', 'md')}>
          Primary Button
        </button>

        <button className={getButtonClasses('secondary', 'md')}>
          Secondary Button
        </button>

        <button className={getButtonClasses('outline', 'md')}>
          Outline Button
        </button>
      </div>

      {/* Using theme cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={getCardClasses('default')}>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Default Card</h3>
            <p className="text-gray-600">
              This card uses the default theme styling.
            </p>
          </div>
        </div>

        <div className={getCardClasses('gradient')}>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Gradient Card</h3>
            <p className="text-white/90">This card uses gradient styling.</p>
          </div>
        </div>
      </div>

      {/* Using theme inputs */}
      <div className="space-y-3">
        <input
          className={getInputClasses('default')}
          placeholder="Default input"
        />

        <input
          className={getInputClasses('success')}
          placeholder="Success input"
        />

        <input className={getInputClasses('error')} placeholder="Error input" />
      </div>

      {/* Using direct Tailwind classes with theme colors */}
      <div className="space-y-3">
        <div className="bg-pakiza-gradient p-4 rounded-lg text-white">
          Direct gradient background
        </div>

        <div className="bg-pakiza-card p-4 rounded-lg border border-pakiza-200">
          Theme card background
        </div>

        <div className="bg-pakiza-gradient-light p-4 rounded-lg">
          Light gradient background
        </div>
      </div>
    </div>
  );
};

export default ExampleThemeUsage;

/*
HOW TO USE THE GLOBAL THEME SYSTEM:

1. WRAP YOUR APP WITH THEMEPROVIDER (already done in App.jsx):
   <ThemeProvider>
     <your-app />
   </ThemeProvider>

2. USE THEME CONTEXT IN COMPONENTS:
   import { useTheme } from '../context/ThemeContext';
   const { currentTheme, changeTheme, theme } = useTheme();

3. USE UTILITY FUNCTIONS FOR CONSISTENT STYLING:
   import { getButtonClasses, getCardClasses } from '../utils/themeUtils';
   <button className={getButtonClasses('primary', 'lg')}>Button</button>

4. USE TAILWIND CLASSES WITH THEME COLORS:
   - bg-pakiza-gradient (main gradient)
   - bg-pakiza-gradient-light (light gradient) 
   - bg-pakiza-card (card gradient)
   - text-pakiza-500 (theme text color)
   - border-pakiza-300 (theme border)

5. CHANGE THEMES PROGRAMMATICALLY:
   const { changeTheme } = useTheme();
   changeTheme('green'); // 'pakiza', 'green', 'blue', 'orange'

6. ACCESS CURRENT THEME INFO:
   const { theme, currentTheme } = useTheme();
   console.log(theme.colors.primary); // Current theme primary color

7. USE THEME SELECTOR COMPONENT:
   import ThemeSelector from './ThemeSelector';
   <ThemeSelector /> // Dropdown to change themes

AVAILABLE THEMES:
- pakiza (purple-blue gradient)
- green (green-emerald gradient)  
- blue (blue-indigo gradient)
- orange (orange-red gradient)

THEME PERSISTENCE:
- Themes are automatically saved to localStorage
- Theme persists across browser sessions
- Theme is applied to document root for CSS variables

GLOBAL CSS CLASSES:
- All themes use .bg-pakiza-gradient but colors change based on theme
- CSS variables are updated dynamically: var(--pakiza-primary)
- Smooth transitions for theme changes
*/
