/**
 * ScheduleWheelApp Component
 * 
 * Aplicación de horario circular que permite visualizar y gestionar
 * actividades diarias en un formato de rueda visual.
 * 
 */

import { useState } from 'react';

// Componentes personalizados
import PieChart from './core/wheel/PieChart';
import DetailView from './core/activities/DetailView';
import DaySelector from './core/common/DaySelector';
import Card from './core/activities/Card';
import Reminders from './core/stats/Reminders';
import Daily from './core/stats/Daily';
import Header from './core/common/Header';

// Utilidades
import { useClock } from './hooks/useClock';
import { useTheme } from './hooks/useTheme';
import { DAYS_OF_WEEK, INITIAL_SCHEDULES, INITIAL_REMINDERS } from './constants';

const App = () => {
  // Estados principales
  const [currentDay, setCurrentDay] = useState('Lunes');
  const [view, setView] = useState('main'); // 'main' | 'detail'
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [schedules] = useState(INITIAL_SCHEDULES);
  const [reminders] = useState(INITIAL_REMINDERS);

  // Hooks personalizados
  const currentTime = useClock();
  const { themeMode, toggleTheme, bgColor } = useTheme();

  /**
   * Obtiene la actividad actual según la hora y el día seleccionado
   */
  const getCurrentActivity = () => {
    const hours = currentTime.getHours();
    const schedule = schedules[currentDay] || [];
    return schedule.find(item => hours >= item.start && hours < item.end);
  };

  const currentActivity = getCurrentActivity();

  /**
   * Maneja la selección de una actividad para ver detalles
   */
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setView('detail');
  };

  /**
   * Regresa a la vista principal
   */
  const handleBackToMain = () => {
    setView('main');
    setSelectedActivity(null);
  };

  // Vista de detalles
  if (view === 'detail' && selectedActivity) {
    return (
      <DetailView
        activity={selectedActivity}
        day={currentDay}
        bgColor={bgColor}
        themeMode={themeMode}
        onBack={handleBackToMain}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Vista principal
  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgColor} p-6 transition-all duration-1000`}>
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <Header
          currentTime={currentTime}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
        />

        {/* Selector de días */}
        <DaySelector
          days={DAYS_OF_WEEK}
          currentDay={currentDay}
          onSelectDay={setCurrentDay}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rueda de horario */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
              <PieChart
                schedule={schedules[currentDay] || []}
                currentDay={currentDay}
                onActivitySelect={handleActivitySelect}
              />
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">
            {/* Actividad actual */}
            {currentActivity && (
              <Card activity={currentActivity} />
            )}

            {/* Recordatorios */}
            <Reminders
              reminders={reminders}
              onAddReminder={() => {/* Implementar lógica */ }}
            />

            {/* Estadísticas */}
            <Daily schedule={schedules[currentDay] || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;