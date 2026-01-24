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
    const sortedSchedule = [...schedule].sort((a, b) => a.start - b.start);

    sortedSchedule.forEach((item) => {
      const itemStartMinutes = item.start * 60; // Convertir horas a minutos
      const itemEndMinutes = item.end * 60;

      // Si hay un hueco antes de esta actividad, añadir tiempo vacío
      if (currentMinutes < itemStartMinutes) {
        fullSchedule.push({
          activity: 'Libre',
          color: '#e5e7eb',
          start: currentMinutes / 60,
          end: itemStartMinutes / 60,
          description: 'Tiempo libre',
          isEmpty: true
        });
      }

      // Añadir la actividad actual
      fullSchedule.push({
        ...item,
        start: itemStartMinutes / 60,
        end: itemEndMinutes / 60
      });
      currentMinutes = itemEndMinutes;
    });

    // Si quedan minutos al final del día, añadir tiempo vacío
    if (currentMinutes < TOTAL_MINUTES) {
      fullSchedule.push({
        activity: 'Libre',
        color: '#e5e7eb',
        start: currentMinutes / 60,
        end: 24,
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

  const formatTime = (hours) => {
    const hour = Math.floor(hours);
    const minutes = Math.round((hours - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const renderSlices = () =>
    fullSchedule.map((item, index) => {
      const startHours = item.start;
      const endHours = item.end;
      const durationHours = endHours - startHours;
      
      // Calcular el ángulo basado en la duración en horas
      const angle = (durationHours / 24) * 360;
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

      // Para actividades reales, necesitamos encontrar su índice original
      let originalIndex = -1;
      if (!item.isEmpty) {
        originalIndex = schedule.findIndex(a => 
          a.id === item.id || 
          (a.start === item.start && a.end === item.end && a.title === item.activity)
        );
      }

      const showLabel = durationHours >= 0.5; // Mostrar etiqueta si dura 30 min o más
      
      const sliceContent = (
        <>
          <path 
            d={path} 
            fill={item.color}
            stroke="white"
            strokeWidth="3"
            opacity={item.isEmpty ? "0.4" : "1"}
          />

          {showLabel && (
            <>
              <text
                x={label.x}
                y={label.y - 5}
                textAnchor="middle"
                fill="white"
                fontSize="18"
                fontWeight="bold"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  pointerEvents: 'none'
                }}
              >
                {item.title || item.activity}
              </text>

              <text
                x={label.x}
                y={label.y + 15}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="500"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  pointerEvents: 'none'
                }}
              >
                {formatTime(item.start)}-{formatTime(item.end)}
              </text>
            </>
          )}
        </>
      );

      currentAngle = endAngle;

      if (item.isEmpty) {
        return (
          <g
            key={`empty-${index}`}
            className="wheel-slice wheel-slice-empty"
          >
            {sliceContent}
          </g>
        );
      }

      return (
        <g
          key={`${item.id || item.title}-${index}`}
          className="wheel-slice wheel-slice-activity"
          onClick={(e) => {
            e.stopPropagation();
            onActivitySelect(item, originalIndex, e);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onActivitySelect(item, originalIndex, e);
          }}
          style={{ cursor: 'pointer' }}
        >
          {sliceContent}
          
          <title>
            {item.title || item.activity}
            {'\n'}
            {formatTime(item.start)} - {formatTime(item.end)}
            {'\n'}
            {item.description || 'Sin descripción'}
          </title>
        </g>
      );
    });

  return (
    <svg 
      viewBox="0 0 400 400" 
      className="wheel-svg"
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Segmentos del horario */}
      {renderSlices()}

      {/* Centro simple y limpio */}
      <circle 
        cx={CENTER} 
        cy={CENTER} 
        r="60" 
        fill="white"
        opacity="0.95"
      />

      <text
        x={CENTER}
        y={CENTER - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1e293b"
        fontSize="20"
        fontWeight="bold"
      >
        {currentDay}
      </text>
      
    </svg>
  );
};

export default PieChart;