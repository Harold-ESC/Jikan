/**
 * Hook useTheme
 * 
 * Gestiona la lógica del tema (automático, claro, oscuro) y proporciona
 * utilidades relacionadas.
 * 
 */

import { useState } from 'react';

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState('auto');

  /**
   * Determina si es noche basado en la hora actual
   */
  const isNightTime = () => {
    const hours = new Date().getHours();
    return hours >= 20 || hours < 6;
  };

  /**
   * Determina si el modo oscuro está activo
   */
  const isDarkMode = () => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return isNightTime(); // modo auto
  };

  /**
   * Cambia al siguiente modo de tema
   */
  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  /**
   * Obtiene la clase de gradient según el tema
   */
  const bgColor = isDarkMode()
    ? 'from-indigo-900 via-purple-900 to-pink-900'
    : 'from-blue-400 via-cyan-400 to-teal-400';

  return {
    themeMode,
    toggleTheme,
    isDarkMode,
    bgColor,
    isNightTime
  };
};