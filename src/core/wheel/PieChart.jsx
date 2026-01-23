/**
 * PieChart Component
 * 
 * Renderiza la rueda del horario usando SVG.
 */

const CENTER = 200;
const RADIUS = 180;
const LABEL_RADIUS = 120;

const PieChart = ({ schedule, currentDay, onActivitySelect }) => {

  // Función para crear un horario completo de 24 horas
  const createFullSchedule = (schedule) => {
    const fullSchedule = [];
    let currentHour = 0;

    // Ordenar el schedule por hora de inicio
    const sortedSchedule = [...schedule].sort((a, b) => a.start - b.start);

    sortedSchedule.forEach((item) => {
      // Si hay un hueco antes de esta actividad, añadir tiempo vacío
      if (currentHour < item.start) {
        fullSchedule.push({
          activity: 'Libre',
          color: '#e5e7eb', // Color gris claro para tiempo libre
          start: currentHour,
          end: item.start,
          description: 'Tiempo libre',
          isEmpty: true
        });
      }

      // Añadir la actividad actual
      fullSchedule.push(item);
      currentHour = item.end;
    });

    // Si quedan horas al final del día, añadir tiempo vacío
    if (currentHour < 24) {
      fullSchedule.push({
        activity: 'Libre',
        color: '#e5e7eb',
        start: currentHour,
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

  const renderSlices = () =>
    fullSchedule.map((item, index) => {
      const duration = item.end - item.start;
      const angle = (duration / 24) * 360;
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

      const tempCurrentAngle = currentAngle; // Guardar para el siguiente ciclo
      currentAngle = endAngle;

      // No mostrar etiqueta si el segmento es muy pequeño (menos de 30 minutos)
      const showLabel = duration >= 0.5;

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
              >
                {item.start}-{item.end}h
              </text>
            </>
          )}
        </g>
      );
    });

  return (
    <svg
      viewBox="0 0 400 400"
      className="wheel-svg"
    >
      {renderSlices()}

      {/* Centro */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r="60"
        className="wheel-center"
      />

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