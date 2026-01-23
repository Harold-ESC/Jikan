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
      start: "00:00",
      end: "07:00",
      description: 'Descanso nocturno'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: "07:00",
      end: "08:00",
      description: 'Desayuno'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: "08:00",
      end: "12:00",
      description: 'Clases universitarias'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: "12:00",
      end: "13:00",
      description: 'Almuerzo'
    },
    {
      activity: '勉強',
      color: '#60a5fa',
      start: "13:00",
      end: "18:00",
      description: 'Estudio y programación'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: "18:00",
      end: "19:00",
      description: 'Cena'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: "19:00",
      end: "22:00",
      description: 'Proyectos personales'
    },
    {
      activity: '睡眠',
      color: '#4ade80',
      start: "22:00",
      end: "24:00",
      description: 'Prepararse para dormir'
    }
  ],

  Martes: [
    {
      activity: '睡眠',
      color: '#4ade80',
      start: "00:00",
      end: "07:00",
      description: 'Descanso nocturno'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: "07:00",
      end: "08:00",
      description: 'Desayuno'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: "08:00",
      end: "13:00",
      description: 'Clases universitarias'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: "13:00",
      end: "14:00",
      description: 'Almuerzo'
    },
    {
      activity: '勉強',
      color: '#60a5fa',
      start: "14:00",
      end: "19:00",
      description: 'Laboratorio'
    },
    {
      activity: '食事',
      color: '#fb923c',
      start: "19:00",
      end: "20:00",
      description: 'Cena'
    },
    {
      activity: '勉強',
      color: '#3b82f6',
      start: "20:00",
      end: "23:00",
      description: 'Estudio'
    },
    {
      activity: '睡眠',
      color: '#4ade80',
      start: "23:00",
      end: "24:00",
      description: 'Dormir'
    },
  ],  
  Jueves: [
    {
      activity: '睡眠',
      color: '#4ade80',
      start: "02:00",
      end: "06:00",
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
