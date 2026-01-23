/**
 * DetailView Component
 * 
 * Vista detallada de una actividad seleccionada con información
 * completa, descripción y notas personales.
 */

import { useState } from 'react';
import { ChevronLeft, Clock, Calendar, FileText, AlertCircle } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { timeToMinutes, formatDuration } from '../../utils/time';

const DetailView = ({
  activity,
  day,
  bgColor,
  themeMode,
  onBack,
  onToggleTheme
}) => {
  const [notes, setNotes] = useState('');

  if (!activity) return null;

  // Calcular duración en minutos
  const startMinutes = timeToMinutes(activity.start);
  const endMinutes = timeToMinutes(activity.end);
  const durationMinutes = endMinutes - startMinutes;

  // Calcular porcentaje del día
  const percentageOfDay = ((durationMinutes / (24 * 60)) * 100).toFixed(1);

  // Verificar si es una actividad vacía
  const isEmpty = activity.isEmpty;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgColor} p-6 transition-all duration-1000`}
    >
      <div className="max-w-2xl mx-auto">

        {/* Barra superior */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="detail-back-btn"
            aria-label="Volver a vista principal"
          >
            <ChevronLeft size={20} />
            Volver
          </button>

          <ThemeToggle
            themeMode={themeMode}
            onToggle={onToggleTheme}
          />
        </div>

        {/* Contenido */}
        <div className="detail-card">

          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="detail-color"
              style={{ backgroundColor: activity.color }}
            />

            <h2 className="detail-title">
              {activity.activity}
            </h2>

            <p className="detail-time">
              <Clock size={18} />
              {activity.start} - {activity.end}
            </p>

            {isEmpty && (
              <div className="detail-empty-badge">
                <AlertCircle size={16} />
                Tiempo libre
              </div>
            )}
          </div>

          {/* Secciones */}
          <div className="detail-sections">

            <DetailBlock 
              title="Descripción" 
              icon={<FileText size={18} />}
            >
              <p className="detail-description">
                {activity.description || 'Sin descripción'}
              </p>
            </DetailBlock>

            <DetailBlock 
              title="Duración" 
              icon={<Clock size={18} />}
            >
              <div className="detail-duration-info">
                <div className="detail-duration-main">
                  {formatDuration(durationMinutes)}
                </div>
                <div className="detail-duration-stats">
                  <span className="detail-stat">
                    <strong>{durationMinutes}</strong> minutos
                  </span>
                  <span className="detail-stat">
                    <strong>{percentageOfDay}%</strong> del día
                  </span>
                </div>
              </div>
            </DetailBlock>

            <DetailBlock 
              title="Día" 
              icon={<Calendar size={18} />}
            >
              <p className="detail-day">{day}</p>
            </DetailBlock>

            {!isEmpty && (
              <DetailBlock 
                title="Notas personales" 
                icon={<FileText size={18} />}
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="detail-notes"
                  rows="6"
                  placeholder="Añade notas personales sobre esta actividad...
Ejemplos:
- Objetivos específicos
- Recursos necesarios
- Recordatorios importantes
- Reflexiones o aprendizajes"
                />
                
                <div className="detail-notes-actions">
                  <button 
                    className="detail-notes-btn detail-notes-btn--save"
                    disabled={!notes.trim()}
                  >
                    Guardar notas
                  </button>
                  <button 
                    className="detail-notes-btn detail-notes-btn--clear"
                    onClick={() => setNotes('')}
                    disabled={!notes}
                  >
                    Limpiar
                  </button>
                </div>
              </DetailBlock>
            )}

            {/* Información adicional para actividades largas */}
            {durationMinutes >= 120 && !isEmpty && (
              <DetailBlock 
                title=" Sugerencias" 
                icon={<AlertCircle size={18} />}
              >
                <div className="detail-suggestions">
                  <p className="detail-suggestion">
                    Esta es una actividad larga. Considera tomar descansos cada 50-60 minutos.
                  </p>
                  {durationMinutes >= 180 && (
                    <p className="detail-suggestion">
                      Planifica momentos para hidratarte y comer algo ligero.
                    </p>
                  )}
                  {durationMinutes >= 240 && (
                    <p className="detail-suggestion">
                      Incluye pausas activas para mantener tu concentración y energía.
                    </p>
                  )}
                </div>
              </DetailBlock>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailBlock = ({ title, icon, children }) => (
  <div className="detail-block">
    <h3 className="detail-block__title">
      {icon && <span className="detail-block__icon">{icon}</span>}
      {title}
    </h3>
    <div className="detail-block__content">
      {children}
    </div>
  </div>
);

export default DetailView;