import React from 'react';

const Pause = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <rect
          x={0.5}
          y={0.5}
          width={4.5}
          height={13}
          rx={1}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x={9}
          y={0.5}
          width={4.5}
          height={13}
          rx={1}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Pause;
