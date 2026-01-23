/**
 * DailyStats Component
 * 
 * Sección de estadísticas diarias del horario.
 */

import { BarChart3 } from 'lucide-react';
import { timeToMinutes, formatDuration } from '../../utils/time';

const Daily = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  // Cálculos en minutos
  const totalMinutes = schedule.reduce((sum, item) => {
    const startMinutes = timeToMinutes(item.start);
    const endMinutes = timeToMinutes(item.end);
    return sum + (endMinutes - startMinutes);
  }, 0);

  const activityCount = schedule.length;

  const averageActivityMinutes = Math.round(totalMinutes / activityCount);

  // Agrupar por tipo de actividad
  const activityStats = {};
  schedule.forEach(item => {
    const startMinutes = timeToMinutes(item.start);
    const endMinutes = timeToMinutes(item.end);
    const duration = endMinutes - startMinutes;
    
    if (activityStats[item.activity]) {
      activityStats[item.activity] += duration;
    } else {
      activityStats[item.activity] = duration;
    }
  });

  // Encontrar la actividad más larga
  const longestActivity = Object.entries(activityStats).reduce(
    (max, [activity, minutes]) => 
      minutes > max.minutes ? { activity, minutes } : max,
    { activity: '', minutes: 0 }
  );

  return (
    <section className="stats-card">
      <h3 className="stats-card__title">
        <BarChart3 size={18} />
        ESTADÍSTICAS
      </h3>

      <div className="stats-grid">
        <StatItem
          label="Tiempo programado"
          value={formatDuration(totalMinutes)}
        />
        <StatItem
          label="Actividades"
          value={activityCount}
        />
        <StatItem
          label="Promedio por actividad"
          value={formatDuration(averageActivityMinutes)}
        />
        {longestActivity.activity && (
          <StatItem
            label="Actividad más larga"
            value={`${longestActivity.activity} ${formatDuration(longestActivity.minutes)}`}
          />
        )}
        <StatItem
          label="Desglose por actividad"
          value= {Object.entries(activityStats)
            .sort(([, a], [, b]) => b - a) // Ordenar por duración descendente
            .map(([activity, minutes]) => (
              <div key={activity} className="activity-breakdown__item">
                {activity} {formatDuration(minutes)}
              </div>
            ))}
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