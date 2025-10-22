import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoColorPalette, IoCheckmark } from 'react-icons/io5';

const ThemeSelector = () => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = {
    pakiza: 'from-purple-500 to-blue-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-indigo-500',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-theme-300 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <IoColorPalette className="text-theme-500" size={18} />
        <span className="text-sm font-medium text-gray-700">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
          <h3 className="font-semibold text-gray-800 mb-3">Choose Theme</h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  changeTheme(key);
                  setIsOpen(false);
                }}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                  currentTheme === key
                    ? 'border-theme-500 bg-theme-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-full h-8 rounded-md bg-gradient-to-r ${themeColors[key]} mb-2`}
                ></div>
                <p className="text-xs font-medium text-gray-700">
                  {theme.name}
                </p>

                {currentTheme === key && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-theme-500 rounded-full flex items-center justify-center">
                    <IoCheckmark className="text-white" size={12} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Theme changes will be applied globally across the entire
              application.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
