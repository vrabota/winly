import React from 'react';

const CalendarIcon = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M1.5,2.5a1,1,0,0,0-1,1v9a1,1,0,0,0,1,1h11a1,1,0,0,0,1-1v-9a1,1,0,0,0-1-1h-2"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={0.5}
          y1={6.5}
          x2={13.5}
          y2={6.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={3.5}
          y1={0.5}
          x2={3.5}
          y2={4.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={10.5}
          y1={0.5}
          x2={10.5}
          y2={4.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={3.5}
          y1={2.5}
          x2={8.5}
          y2={2.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CalendarIcon;
