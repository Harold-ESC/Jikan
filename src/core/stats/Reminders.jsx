/**
 * Reminders Component
 * 
 * Sección de recordatorios con lista y opción para añadir nuevos.
 */

import { Bell, Plus } from 'lucide-react';

const Reminders = ({ reminders = [], onAddReminder }) => {

  return (
    <section className="reminders-card">

      <h3 className="reminders-title">
        <Bell size={18} />
        RECORDATORIOS
      </h3>

      <div className="reminders-list">
        {reminders.length === 0 && (
          <p className="reminders-empty">
            No hay recordatorios aún
          </p>
        )}

        {reminders.map(reminder => (
          <div
            key={reminder.id}
            className="reminder-item"
          >
            <p className="reminder-text">
              {reminder.text}
            </p>

            <p className="reminder-time">
              {reminder.time}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onAddReminder}
        className="reminders-add-btn"
        aria-label="Añadir nuevo recordatorio"
      >
        <Plus size={16} />
        Añadir recordatorio
      </button>

    </section>
  );
};

export default Reminders;
