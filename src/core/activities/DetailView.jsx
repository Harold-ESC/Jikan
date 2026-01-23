/**
 * DetailView Component
 * 
 * Vista detallada de una actividad seleccionada con información
 * completa, descripción y notas personales.
 */

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

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

  const duration = activity.end - activity.start;

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
              {activity.start} - {activity.end}
            </p>
          </div>

          {/* Secciones */}
          <div className="detail-sections">

            <DetailBlock title="Descripción">
              {activity.description}
            </DetailBlock>

            <DetailBlock title="Duración">
              {duration} horas
            </DetailBlock>

            <DetailBlock title="Notas">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="detail-notes"
                rows="4"
                placeholder="Añade notas personales sobre esta actividad..."
              />
            </DetailBlock>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailBlock = ({ title, children }) => (
  <div className="detail-block">
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
);

export default DetailView;
