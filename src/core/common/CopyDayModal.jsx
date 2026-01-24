/**
 * CopyDayModal Component
 * 
 * Modal para copiar todas las actividades de un día a otro
 */

import { X, Copy } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../utils/index';

const CopyDayModal = ({ 
  isOpen, 
  onClose, 
  currentDay, 
  schedules, 
  onCopyDay 
}) => {
  if (!isOpen) return null;

  const handleCopy = (sourceDay) => {
    onCopyDay(sourceDay, currentDay);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Copiar actividades a {currentDay}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-white/80 mb-6">
          Selecciona el día del cual quieres copiar todas las actividades:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {DAYS_OF_WEEK.filter(day => day !== currentDay).map(day => {
            const activityCount = schedules[day]?.length || 0;
            
            return (
              <button
                key={day}
                onClick={() => handleCopy(day)}
                disabled={activityCount === 0}
                className={`
                  p-4 rounded-xl text-left transition
                  ${activityCount === 0 
                    ? 'bg-white/5 opacity-50 cursor-not-allowed' 
                    : 'bg-white/20 hover:bg-white/30'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">{day}</span>
                  {activityCount > 0 && <Copy size={18} className="opacity-60" />}
                </div>
                
                {activityCount > 0 ? (
                  <>
                    <p className="text-sm opacity-80 mb-2">
                      {activityCount} actividad{activityCount !== 1 ? 'es' : ''}
                    </p>
                    
                    {/* Preview de las actividades */}
                    <div className="space-y-1">
                      {schedules[day].slice(0, 3).map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs opacity-70">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: activity.color }}
                          />
                          <span className="truncate">
                            {activity.title} ({activity.start}:00-{activity.end}:00)
                          </span>
                        </div>
                      ))}
                      {activityCount > 3 && (
                        <p className="text-xs opacity-60 pl-5">
                          +{activityCount - 3} más...
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm opacity-60">Sin actividades</p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex gap-3">
            <div className="text-yellow-300 mt-0.5">⚠️</div>
            <div className="text-sm">
              <p className="font-semibold mb-1">Advertencia:</p>
              <p className="opacity-90">
                Esto reemplazará todas las actividades actuales de {currentDay} con las del día seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyDayModal;