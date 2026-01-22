/**
 * DailyStats Component
 * 
 * Sección de estadísticas diarias del horario.
 */

import { BarChart3 } from 'lucide-react';

const Daily = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  // Cálculos
  const totalHours = schedule.reduce(
    (sum, item) => sum + (item.end - item.start),
    0
  );

  const activityCount = schedule.length;

  const averageActivityDuration =
    Math.round((totalHours / activityCount) * 10) / 10;

  return (
    <section className="stats-card">
      <h3 className="stats-card__title">
        <BarChart3 size={18} />
        ESTADÍSTICAS
      </h3>

      <div className="stats-grid">
        <StatItem
          label="Horas programadas"
          value={`${totalHours}h`}
        />
        <StatItem
          label="Actividades"
          value={activityCount}
        />
        <StatItem
          label="Promedio por actividad"
          value={`${averageActivityDuration}h`}
        />
      </div>
    </section>
  );
};

const StatItem = ({ label, value }) => (
  <div className="stat-item">
    <p className="stat-item__label">{label}</p>
    <p className="stat-item__value">{value}</p>
  </div>
);

export default Daily;
