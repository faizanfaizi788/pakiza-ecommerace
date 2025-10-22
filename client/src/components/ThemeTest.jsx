import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BsCart4 } from 'react-icons/bs';
import { FaUser, FaSearch } from 'react-icons/fa';

const ThemeTest = () => {
  const { currentTheme, changeTheme, themes } = useTheme();

  return (
    <div className="p-6 space-y-8 bg-theme-gradient-light min-h-screen">
      <div className="design-card text-center">
        <h1 className="design-text text-4xl mb-4 text-theme-800">🎨 Complete Design System Test</h1>
        <p className="design-text text-theme-600">
          Watch how the ENTIRE app design transforms with each theme!
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="design-card">
        <h2 className="design-text text-2xl mb-4 text-theme-700">Choose Your Design Style:</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(themes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => changeTheme(themeName)}
              className={`design-button ${
                currentTheme === themeName 
                  ? 'bg-theme-500 text-white' 
                  : 'bg-theme-100 text-theme-700 hover:bg-theme-200'
              }`}
            >
              <div className="text-center">
                <div className="design-text text-lg">{themes[themeName].name}</div>
                <div className="design-text text-sm opacity-75">{themes[themeName].style}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Design Showcase */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mock Header */}
        <div className="design-card">
          <h3 className="design-text text-xl mb-4 text-theme-700">Header Style</h3>
          <div className="flex items-center justify-between p-4 bg-white rounded border">
            <div className="design-text text-lg font-bold text-theme-800">Pakiza</div>
            <div className="flex items-center gap-4">
              <div className="design-button flex items-center gap-2 bg-theme-gradient text-white">
                <FaSearch />
                <span>Search</span>
              </div>
              <div className="design-button flex items-center gap-2 bg-theme-gradient text-white">
                <BsCart4 />
                <span>Cart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Product Cards */}
        <div className="design-card">
          <h3 className="design-text text-xl mb-4 text-theme-700">Product Cards</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="design-card bg-theme-card p-4 space-y-2">
                <div className="h-20 bg-theme-200 rounded"></div>
                <div className="design-text font-semibold text-theme-800">Product {i}</div>
                <div className="design-text text-theme-600">$99.99</div>
                <button className="design-button w-full bg-theme-500 text-white">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Showcase */}
        <div className="design-card">
          <h3 className="design-text text-xl mb-4 text-theme-700">Typography & Text</h3>
          <div className="space-y-2">
            <h1 className="design-text text-3xl text-theme-800">Large Heading</h1>
            <h2 className="design-text text-2xl text-theme-700">Medium Heading</h2>
            <p className="design-text text-theme-600">
              Regular paragraph text that shows the typography style for each theme.
            </p>
            <small className="design-text text-sm text-theme-500">Small text example</small>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="design-card">
          <h3 className="design-text text-xl mb-4 text-theme-700">Button Styles</h3>
          <div className="space-y-4">
            <button className="design-button bg-theme-500 text-white">Primary Button</button>
            <button className="design-button border-2 border-theme-500 text-theme-500">
              Secondary Button
            </button>
            <button className="design-button bg-theme-gradient text-white">
              Gradient Button
            </button>
          </div>
        </div>
      </div>

      {/* Current Theme Info */}
      <div className="design-card">
        <h3 className="design-text text-xl mb-4 text-theme-700">Current Theme Details</h3>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h4 className="design-text font-semibold text-theme-800">Theme: {themes[currentTheme].name}</h4>
            <p className="design-text text-theme-600">Style: {themes[currentTheme].style}</p>
          </div>
          <div>
            <h4 className="design-text font-semibold text-theme-800">Design Properties:</h4>
            <ul className="design-text text-sm text-theme-600 space-y-1">
              <li>Border Radius: {themes[currentTheme].design.borderRadius}</li>
              <li>Spacing: {themes[currentTheme].design.spacing}</li>
              <li>Typography: {themes[currentTheme].design.typography}</li>
              <li>Layout: {themes[currentTheme].design.layoutStyle}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="design-card text-center">
        <p className="design-text text-theme-600">
          🎉 Each theme completely transforms the design language of the entire application!
        </p>
      </div>
    </div>
  );
};

export default ThemeTest;
        <p>Primary: {themes[currentTheme].colors.primary}</p>
        <p>Secondary: {themes[currentTheme].colors.secondary}</p>
      </div>
    </div>
  );
};

export default ThemeTest;
