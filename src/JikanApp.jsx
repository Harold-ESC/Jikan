/**
 * ScheduleWheelApp Component
 * 
 * Aplicación de horario circular que permite visualizar y gestionar
 * actividades diarias en un formato de rueda visual.
 * 
 */

import { useState } from 'react';
import { supabase } from './lib/supabase';

// Componentes personalizados
import PieChart from './core/wheel/PieChart';
import DetailView from './core/activities/DetailView';
import DaySelector from './core/common/DaySelector';
import ActivityCard from './core/activities/Card';
import Reminders from './core/stats/Reminders';
import Daily from './core/stats/Daily';
import Header from './core/common/Header';

// Iconos
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

// Utilidades
import { useClock } from './hooks/useClock';
import { useTheme } from './hooks/useTheme';
import { DAYS_OF_WEEK, INITIAL_REMINDERS } from './utils/index';
import { useActivities } from './hooks/useActivities';

const App = ({ user }) => {
  // Estados principales
  const [currentDay, setCurrentDay] = useState('Lunes');
  const [view, setView] = useState('main'); // 'main' | 'detail' | 'edit'
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [editingActivityIndex, setEditingActivityIndex] = useState(null);
  const [tempActivity, setTempActivity] = useState({
    start: 9,
    end: 10,
    activity: '',
    description: '',
    color: '#7c5cff',
  });
  
  const { schedules, loading, reload } = useActivities(user);
  const [reminders] = useState(INITIAL_REMINDERS);

  // Hooks personalizados
  const currentTime = useClock();
  const { themeMode, toggleTheme, bgColor } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando tu horario…
      </div>
    );
  }

  // Función para manejar la eliminación de actividad
  const handleDeleteActivity = async (day, activityIndex) => {
    const schedule = schedules[day] || [];
    const activity = schedule[activityIndex];
    
    if (!activity?.id) {
      // Si no hay ID, es local, simplemente quitar del estado local
      console.log('No se puede eliminar actividad sin ID');
      return;
    }
    
    // Eliminar de Supabase
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activity.id);
    
    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }
    
    await reload();
  };

  // Función para guardar cambios en una actividad (crear o editar)
  const handleSaveActivity = async (day, originalActivity, updatedActivity) => {
    // Validación mínima
    if (updatedActivity.end <= updatedActivity.start) {
      alert('La hora de fin debe ser mayor a la de inicio');
      return;
    }

    if (!updatedActivity.activity.trim()) {
      alert('El nombre de la actividad es requerido');
      return;
    }

    const payload = {
      day_of_week: day,
      start_time: `${updatedActivity.start.toString().padStart(2, '0')}:00`,
      end_time: `${updatedActivity.end.toString().padStart(2, '0')}:00`,
      title: updatedActivity.activity,
      description: updatedActivity.description,
      color: updatedActivity.color,
      user_id: user.id,
    };

    let result;

    if (originalActivity?.id) {
      // UPDATE actividad existente
      result = await supabase
        .from('activities')
        .update(payload)
        .eq('id', originalActivity.id);
    } else {
      // INSERT (actividad nueva)
      result = await supabase
        .from('activities')
        .insert([payload]);
    }

    if (result.error) {
      alert('Error: ' + result.error.message);
      return;
    }

    await reload(); // refresca estado desde Supabase

    setView('main');
    setEditingActivity(null);
    setEditingDay(null);
    setEditingActivityIndex(null);
  };

  const handleAddActivity = (day) => {
    setEditingDay(day);
    setEditingActivity(null);
    setEditingActivityIndex(null);
    setTempActivity({
      start: 9,
      end: 10,
      activity: '',
      description: '',
      color: '#7c5cff',
    });
    setView('edit');
  };

  // Función para iniciar edición desde el PieChart
  const handleEditActivity = (activity, day, index) => {
    setEditingDay(day);
    setEditingActivity(activity);
    setEditingActivityIndex(index);
    setTempActivity({
      start: activity.start,
      end: activity.end,
      activity: activity.title,
      description: activity.description || '',
      color: activity.color || '#7c5cff',
    });
    setView('edit');
  };

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
   * Maneja la selección de una actividad para ver detalles o editar
   */
  const handleActivitySelect = (activity, index, event) => {
    // Si es click derecho, editar
    if (event?.button === 2 || event?.ctrlKey) {
      event.preventDefault();
      handleEditActivity(activity, currentDay, index);
      return;
    }
    
    // Click normal: ver detalles
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

  // Vista de edición
  if (view === 'edit') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgColor} p-6 transition-all duration-1000`}>
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => {
              setView('main');
              setEditingActivity(null);
              setEditingDay(null);
              setEditingActivityIndex(null);
            }}
            className="mb-4 flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
          >
            <ChevronLeft size={20} />
            Cancelar
          </button>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {editingActivity ? 'Editar Actividad' : ' Nueva Actividad'}
            </h2>
            
            <div className="space-y-6">
              {/* Nombre de la actividad */}
              <div>
                <label className="block text-sm font-semibold mb-2">Nombre de la actividad</label>
                <input
                  type="text"
                  value={tempActivity.activity}
                  onChange={(e) => setTempActivity({...tempActivity, activity: e.target.value})}
                  className="w-full bg-white/10 rounded-lg p-3 text-white placeholder-white/50 border border-white/20 focus:border-white/50 focus:outline-none"
                  placeholder="Ej: Estudio, Trabajo, Ejercicio, etc."
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold mb-2">Descripción</label>
                <textarea
                  value={tempActivity.description}
                  onChange={(e) => setTempActivity({...tempActivity, description: e.target.value})}
                  className="w-full bg-white/10 rounded-lg p-3 text-white placeholder-white/50 border border-white/20 focus:border-white/50 focus:outline-none"
                  rows="3"
                  placeholder="Describe tu actividad..."
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold mb-2">Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={tempActivity.color}
                    onChange={(e) => setTempActivity({...tempActivity, color: e.target.value})}
                    className="w-20 h-12 rounded-lg cursor-pointer bg-white/10 border border-white/20"
                  />
                  <div 
                    className="flex-1 h-12 rounded-lg border border-white/20"
                    style={{ backgroundColor: tempActivity.color }}
                  />
                  <input
                    type="text"
                    value={tempActivity.color}
                    onChange={(e) => setTempActivity({...tempActivity, color: e.target.value})}
                    className="w-28 bg-white/10 rounded-lg p-2 text-white text-sm border border-white/20 focus:border-white/50 focus:outline-none"
                    placeholder="#000000"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTempActivity({...tempActivity, color})}
                      className="w-10 h-10 rounded-lg border-2 border-white/20 hover:border-white/50 transition"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Hora de inicio</label>
                  <select
                    value={tempActivity.start}
                    onChange={(e) => setTempActivity({...tempActivity, start: parseInt(e.target.value)})}
                    className="w-full bg-white/10 rounded-lg p-3 text-white border border-white/20 focus:border-white/50 focus:outline-none cursor-pointer"
                  >
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i} className="bg-gray-800">
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Hora de fin</label>
                  <select
                    value={tempActivity.end}
                    onChange={(e) => setTempActivity({...tempActivity, end: parseInt(e.target.value)})}
                    className="w-full bg-white/10 rounded-lg p-3 text-white border border-white/20 focus:border-white/50 focus:outline-none cursor-pointer"
                  >
                    {Array.from({length: 25}, (_, i) => (
                      <option key={i} value={i} className="bg-gray-800">
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duración calculada */}
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-sm opacity-75">Duración total</p>
                <p className="text-2xl font-bold">
                  {tempActivity.end - tempActivity.start} hora{tempActivity.end - tempActivity.start !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleSaveActivity(editingDay, editingActivity, tempActivity)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {editingActivity ? 'Guardar cambios' : 'Crear actividad'}
                </button>
                {editingActivity && editingActivityIndex !== null && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
                        handleDeleteActivity(editingDay, editingActivityIndex);
                        setView('main');
                        setEditingActivity(null);
                        setEditingDay(null);
                        setEditingActivityIndex(null);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
            
            {/* Botón para añadir actividad */}
            <div className="mt-6 text-center">
              <button
                onClick={() => handleAddActivity(currentDay)}
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg transition inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Añadir actividad
              </button>
              <p className="text-white/60 text-sm mt-3">
                 Click derecho en una actividad para editarla
              </p>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4 lg:overflow-auto lg:max-h-[calc(100vh-200px)] custom-scrollbar">
            {/* Actividad actual */}
            {currentActivity && (
                <ActivityCard 
                  activity={currentActivity}
                  currentDay={currentDay}
                  currentTime={currentTime}
                  label="ACTIVIDAD ACTUAL"
                />
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