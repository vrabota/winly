import React from 'react';

const StopIcon = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <rect
        x={0.5}
        y={0.52}
        width={13}
        height={13}
        rx={1}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StopIcon;
