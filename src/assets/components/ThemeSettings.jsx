import React from "react";
import { useTheme } from "../context/ThemeContext";
import { primaryBgClass, primaryTextClass } from "../styles/tailwind_styles";

const ThemeSettings = () => {
  const { theme, setTheme, isDarkMode } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light Mode", icon: "☀️" },
    { value: "dark", label: "Dark Mode", icon: "🌙" },
  ];

  const handleThemeChange = (selectedTheme) => {
    if (selectedTheme === "system") {
      // Remove saved preference and use system default
      localStorage.removeItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    } else {
      setTheme(selectedTheme);
    }
  };

  const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) return "system";
    return savedTheme;
  };

  return (
    <div className={`${primaryBgClass} p-6 rounded-lg shadow-md`}>
      <h3 className={`${primaryTextClass} text-lg font-semibold mb-4`}>
        Theme Preferences
      </h3>

      <div className="space-y-3">
        {themeOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
              ${
                getCurrentTheme() === option.value
                  ? "border-primary-green bg-primary-green/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-primary-green/50"
              }`}
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={getCurrentTheme() === option.value}
              onChange={() => handleThemeChange(option.value)}
              className="sr-only"
            />
            <span className="text-2xl mr-3">{option.icon}</span>
            <div className="flex-1">
              <div className={`${primaryTextClass} font-medium`}>
                {option.label}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {option.value === "light" && "Always use light theme"}
                {option.value === "dark" && "Always use dark theme"}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;
