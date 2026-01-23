// utils/timeUtils.js

/**
 * Convierte una cadena HH:mm a minutos desde medianoche
 */
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convierte minutos desde medianoche a cadena HH:mm
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Convierte minutos a fracción decimal de hora
 */
export const minutesToHours = (minutes) => {
  return minutes / 60;
};

/**
 * Obtiene el tiempo actual en minutos desde medianoche
 */
export const getCurrentMinutes = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * Formatea la duración en formato legible
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};