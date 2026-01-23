/**
 * Header Component
 * 
 * Encabezado de la aplicación con título, hora actual y control de tema.
 */

import { Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = ({ currentTime, themeMode, onToggleTheme }) => {

  const timeString = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="app-header">

      <div className="app-header__top">
        <div className="flex-1" />

        <h1 className="app-header__title">
          Jikan Maru
        </h1>

        <div className="flex-1 flex justify-end">
          <ThemeToggle
            themeMode={themeMode}
            onToggle={onToggleTheme}
          />
        </div>
      </div>

      <div className="app-header__time">
        <span>{timeString}</span>
      </div>

    </header>
  );
};

export default Header;
