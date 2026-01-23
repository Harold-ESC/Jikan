// core/wheel/PieChart.jsx
import { timeToMinutes, minutesToTime } from '../../utils/time';

const CENTER = 200;
const RADIUS = 180;
const LABEL_RADIUS = 120;
const TOTAL_MINUTES = 24 * 60; // 1440 minutos en un día

const PieChart = ({ schedule, currentDay, onActivitySelect }) => {

  /**
   * Crea un horario completo de 24 horas con espacios vacíos
   */
  const createFullSchedule = (schedule) => {
    const fullSchedule = [];
    let currentMinutes = 0;

    // Ordenar el schedule por hora de inicio
    const sortedSchedule = [...schedule].sort((a, b) => 
      timeToMinutes(a.start) - timeToMinutes(b.start)
    );

    sortedSchedule.forEach((item) => {
      const itemStartMinutes = timeToMinutes(item.start);
      const itemEndMinutes = timeToMinutes(item.end);

      // Si hay un hueco antes de esta actividad, añadir tiempo vacío
      if (currentMinutes < itemStartMinutes) {
        fullSchedule.push({
          activity: 'Libre',
          color: '#e5e7eb',
          start: minutesToTime(currentMinutes),
          end: minutesToTime(itemStartMinutes),
          description: 'Tiempo libre',
          isEmpty: true
        });
      }

      // Añadir la actividad actual
      fullSchedule.push(item);
      currentMinutes = itemEndMinutes;
    });

    // Si quedan minutos al final del día, añadir tiempo vacío
    if (currentMinutes < TOTAL_MINUTES) {
      fullSchedule.push({
        activity: 'Libre',
        color: '#e5e7eb',
        start: minutesToTime(currentMinutes),
        end: '24:00',
        description: 'Tiempo libre',
        isEmpty: true
      });
    }

    return fullSchedule;
  };

  const fullSchedule = createFullSchedule(schedule);
  let currentAngle = -90; // Empezar desde las 12 (arriba)

  const polarToCartesian = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad)
    };
  };

  const renderSlices = () =>
    fullSchedule.map((item, index) => {
      const startMinutes = timeToMinutes(item.start);
      const endMinutes = timeToMinutes(item.end);
      const durationMinutes = endMinutes - startMinutes;
      
      // Calcular el ángulo basado en la duración en minutos
      const angle = (durationMinutes / TOTAL_MINUTES) * 360;
      const endAngle = currentAngle + angle;

      const largeArcFlag = angle > 180 ? 1 : 0;

      const start = polarToCartesian(currentAngle, RADIUS);
      const end = polarToCartesian(endAngle, RADIUS);

      const path = `
        M ${CENTER} ${CENTER}
        L ${start.x} ${start.y}
        A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
        Z
      `;

      const labelAngle = currentAngle + angle / 2;
      const label = polarToCartesian(labelAngle, LABEL_RADIUS);

      currentAngle = endAngle;

      // No mostrar etiqueta si el segmento es muy pequeño (menos de 30 minutos)
      const showLabel = durationMinutes >= 30;

      return (
        <g
          key={`${item.activity}-${index}`}
          className={`wheel-slice ${item.isEmpty ? 'wheel-slice-empty' : ''}`}
          onClick={() => !item.isEmpty && onActivitySelect(item)}
          style={{ cursor: item.isEmpty ? 'default' : 'pointer' }}
        >
          <path 
            d={path} 
            fill={item.color}
            stroke="white"
            strokeWidth="2"
            opacity={item.isEmpty ? "0.3" : "0.9"}
          />

          {showLabel && (
            <>
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                className="wheel-label"
                fill={item.isEmpty ? "#9ca3af" : "white"}
              >
                {item.activity}
              </text>

              <text
                x={label.x}
                y={label.y + 18}
                textAnchor="middle"
                className="wheel-time"
                fill={item.isEmpty ? "#9ca3af" : "white"}
                fontSize="12"
              >
                {item.start}-{item.end}
              </text>
            </>
          )}
        </g>
      );
    });

  return (
    <svg viewBox="0 0 400 400" className="wheel-svg">
      {renderSlices()}

      {/* Centro */}
      <circle cx={CENTER} cy={CENTER} r="60" className="wheel-center" />

      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="middle"
        className="wheel-day"
      >
        {currentDay}
      </text>
    </svg>
  );
};

export default PieChart;