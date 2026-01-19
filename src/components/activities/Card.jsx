/**
 * Card Component
 * 
 * Tarjeta que muestra la actividad actual del día.
 */

import { Calendar } from 'lucide-react';

const Card = ({ activity, label = "ACTIVIDAD ACTUAL" }) => {
  if (!activity) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Calendar size={18} />
        ACTIVIDAD ACTUAL
      </h3>
      <div
        className="w-16 h-16 rounded-full mb-3"
        style={{ backgroundColor: activity.color }}
      />
      <h2 className="text-2xl font-bold mb-2">{activity.activity}</h2>
      <p className="opacity-90 mb-3">{activity.description}</p>
      <p className="text-sm opacity-75">
        {activity.start}:00 - {activity.end}:00
      </p>
    </div>
  );
};

export default Card;
