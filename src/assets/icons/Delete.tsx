import React from 'react';

const Delete = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <line
          x1={13.5}
          y1={0.5}
          x2={0.5}
          y2={13.5}
          fill="none"
          strokeWidth={1}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={0.5}
          y1={0.5}
          x2={13.5}
          y2={13.5}
          fill="none"
          strokeWidth={1}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Delete;
