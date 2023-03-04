import React from 'react';

const ContentChart = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <rect
          x={0.5}
          y={0.5}
          width={13}
          height={13}
          rx={1}
          transform="translate(14 14) rotate(180)"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={3} y1={3} x2={5} y2={3} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <line
          x1={3}
          y1={5.5}
          x2={7.5}
          y2={5.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="11.5 5.5 8.5 10.5 5 8.5 3 11.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default ContentChart;
