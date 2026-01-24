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
                fontSize="14"
                fontWeight="500"
              >
                {item.title || item.activity}
              </text>

              <text
                x={label.x}
                y={label.y + 18}
                textAnchor="middle"
                className="wheel-time"
                fill={item.isEmpty ? "#9ca3af" : "white"}
                fontSize="11"
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
          
          {/* Tooltip hover effect */}
          <path 
            d={path} 
            fill="transparent"
            stroke="transparent"
            strokeWidth="10"
            className="wheel-hitbox"
          />
          
          <title>
            {item.title || item.activity}\n
            {formatTime(item.start)} - {formatTime(item.end)}\n
            {item.description || 'Sin descripción'}
          </title>
        </g>
      );
    });

  // Función para renderizar las líneas de hora
  const renderHourLines = () => {
    const lines = [];
    for (let hour = 0; hour < 24; hour++) {
      const angle = -90 + (hour / 24) * 360;
      const start = polarToCartesian(angle, RADIUS - 10);
      const end = polarToCartesian(angle, RADIUS + 10);
      
      lines.push(
        <line
          key={`hour-line-${hour}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#ffffff40"
          strokeWidth="1"
          strokeDasharray={hour % 3 === 0 ? "none" : "5,5"}
        />
      );
      
      // Etiqueta de hora cada 3 horas
      if (hour % 3 === 0) {
        const labelPos = polarToCartesian(angle, RADIUS + 25);
        lines.push(
          <text
            key={`hour-label-${hour}`}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            fill="#ffffff80"
            fontSize="12"
            fontWeight="500"
          >
            {hour === 0 ? '24' : hour}h
          </text>
        );
      }
    }
    return lines;
  };

  return (
    <svg 
      viewBox="0 0 400 400" 
      className="wheel-svg"
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Fondo del círculo */}
      <circle 
        cx={CENTER} 
        cy={CENTER} 
        r={RADIUS + 5} 
        fill="rgba(255, 255, 255, 0.05)"
      />
      
      {/* Líneas de hora */}
      {renderHourLines()}
      
      {/* Segmentos */}
      {renderSlices()}

      {/* Centro con gradiente */}
      <defs>
        <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
        </radialGradient>
      </defs>
      
      <circle 
        cx={CENTER} 
        cy={CENTER} 
        r="70" 
        fill="url(#centerGradient)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="2"
      />
      
      <circle 
        cx={CENTER} 
        cy={CENTER} 
        r="60" 
        fill="rgba(0, 0, 0, 0.3)"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
      />

      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="middle"
        className="wheel-day"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        style={{ textTransform: 'uppercase' }}
      >
        {currentDay}
      </text>
      
      <text
        x={CENTER}
        y={CENTER + 28}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255, 255, 255, 0.7)"
        fontSize="12"
      >
        Horario
      </text>
    </svg>
  );
};

export default PieChart;