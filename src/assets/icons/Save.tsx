import React from 'react';

const Save = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M13.5,12.5a1,1,0,0,1-1,1H1.5a1,1,0,0,1-1-1v-9l3-3h9a1,1,0,0,1,1,1Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={3.5}
          y={8.5}
          width={7}
          height={5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={4.5}
          y={0.5}
          width={6}
          height={4}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Save;
