import React from 'react';

const Trash = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <line
          x1={1}
          y1={3.5}
          x2={13}
          y2={3.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5,3.5h9a0,0,0,0,1,0,0v9a1,1,0,0,1-1,1h-7a1,1,0,0,1-1-1v-9A0,0,0,0,1,2.5,3.5Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5,3.5V3a2.5,2.5,0,0,1,5,0v.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Trash;
