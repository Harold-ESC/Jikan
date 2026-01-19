/**
 * ThemeToggle Component
 * 
 * Botón para cambiar entre modos de tema (automático, claro, oscuro).
 */

import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ themeMode, onToggle }) => {

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      default:
        return '🔄'; // auto
    }
  };

  const getThemeLabel = () => {
    if (themeMode === 'auto') return 'Automático';
    if (themeMode === 'light') return 'Claro';
    return 'Oscuro';
  };

  return (
    <button
      onClick={onToggle}
      className="theme-toggle-btn"
      title={`Modo: ${getThemeLabel()}`}
      aria-label={`Cambiar tema. Modo actual: ${getThemeLabel()}`}
    >
      <span className="theme-toggle-icon">
        {getThemeIcon()}
      </span>

      <span className="theme-toggle-text">
        {themeMode}
      </span>
    </button>
  );
};

export default ThemeToggle;
