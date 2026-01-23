/**
 * Constantes de la aplicación
 * 
 * Fuente única de datos iniciales
 */

export const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const INITIAL_SCHEDULES = {
  Lunes: [
    {
      activity: '睡眠',
      color: '#4ade80',
      start: 0,
      end: 7,
      description: 'Descanso nocturno'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: 7,
      end: 8,
      description: 'Desayuno'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: 8,
      end: 12,
      description: 'Clases universitarias'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: 12,
      end: 13,
      description: 'Almuerzo'
    },
    {
      activity: '勉強',
      color: '#60a5fa',
      start: 13,
      end: 18,
      description: 'Estudio y programación'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: 18,
      end: 19,
      description: 'Cena'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: 19,
      end: 22,
      description: 'Proyectos personales'
    },
    {
      activity: '睡眠',
      color: '#4ade80',
      start: 22,
      end: 24,
      description: 'Prepararse para dormir'
    }
  ],

  Martes: [
    {
      activity: '睡眠',
      color: '#4ade80',
      start: 0,
      end: 7,
      description: 'Descanso nocturno'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: 7,
      end: 8,
      description: 'Desayuno'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: 8,
      end: 13,
      description: 'Clases universitarias'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: 13,
      end: 14,
      description: 'Almuerzo'
    },
    {
      activity: '勉強',
      color: '#60a5fa',
      start: 14,
      end: 19,
      description: 'Laboratorio'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: 19,
      end: 20,
      description: 'Cena'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: 20,
      end: 23,
      description: 'Estudio'
    },
    {
      activity: '睡眠',
      color: '#4ade80',
      start: 23,
      end: 24,
      description: 'Dormir'
    },
  ],  
  Jueves: [
    {
      activity: '睡眠',
      color: '#4ade80',
      start: 2,
      end: 6,
      description: 'Descanso nocturno'
    }
  ]
};

export const INITIAL_REMINDERS = [
  {
    id: 1,
    text: 'Revisar proyecto de programación',
    time: '20:00'
  },
  {
    id: 2,
    text: 'Preparar material para clase',
    time: '07:30'
  }
];
