// utils/time.js

// Convertir hora en formato HH:MM a minutos
export const timeToMinutes = (time) => {
  if (typeof time === 'number') {
    return time * 60;
  }
  
  if (typeof time === 'string') {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  }
  
  return 0;
};

// Convertir minutos a hora en formato HH:MM
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Formatear hora (número o string) a formato HH:MM
export const formatHour = (hour) => {
  if (typeof hour === 'number') {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  if (typeof hour === 'string') {
    if (hour.includes(':')) {
      const [h, m] = hour.split(':');
      return `${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
    }
    return `${hour.padStart(2, '0')}:00`;
  }
  
  return '00:00';
};

// Calcular duración en horas entre dos horas
export const calculateDuration = (start, end) => {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return (endMinutes - startMinutes) / 60;
};

// Verificar si una hora está dentro de un rango
export const isTimeInRange = (time, start, end) => {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} minuto${mins !== 1 ? 's' : ''}`;
  } else if (mins === 0) {
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours}h ${mins}m`;
  }
};