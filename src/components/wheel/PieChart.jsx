/**
 * PieChart Component
 * 
 * Renderiza la rueda del horario usando SVG.
 */

const CENTER = 200;
const RADIUS = 180;
const LABEL_RADIUS = 120;

const PieChart = ({ schedule, currentDay, onActivitySelect }) => {

  let currentAngle = -90;

  const polarToCartesian = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad)
    };
  };

  const renderSlices = () =>
    schedule.map((item, index) => {
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

      currentAngle = endAngle;

      return (
        <g
          key={index}
          className="wheel-slice"
          onClick={() => onActivitySelect(item)}
        >
          <path d={path} fill={item.color} />

          <text
            x={label.x}
            y={label.y}
            textAnchor="middle"
            className="wheel-label"
          >
            {item.activity}
          </text>

          <text
            x={label.x}
            y={label.y + 18}
            textAnchor="middle"
            className="wheel-time"
          >
            {item.start}-{item.end}h
          </text>
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
