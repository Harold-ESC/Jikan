/**
 * ActivityCard Component
 * 
 * Tarjeta que muestra la actividad actual del día.
 */

import { Calendar } from 'lucide-react';

const ActivityCard = ({ activity, label = "ACTIVIDAD ACTUAL" }) => {
  if (!activity) return null;

  return (
    <div className="activity-card">
      <h3 className="activity-card__title">
        <Calendar size={18} />
        {label}
      </h3>

      <div
        className="activity-card__color"
        style={{ backgroundColor: activity.color }}
      />

      <h2 className="activity-card__name">
        {activity.activity}
      </h2>

      <p className="activity-card__description">
        {activity.description}
      </p>

      <p className="activity-card__time">
        {activity.start}:00 - {activity.end}:00
      </p>
    </div>
  );
};

export default ActivityCard;
