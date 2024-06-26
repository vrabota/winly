import React from 'react';

const LinkBroken = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M3.14,7.13,1.27,9a2.65,2.65,0,0,0,0,3.74h0a2.65,2.65,0,0,0,3.74,0l1.11-1.11"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9,9.5h1.86A2.64,2.64,0,0,0,13.5,6.86h0a2.64,2.64,0,0,0-2.64-2.64H8.22"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={7}
          y1={0.5}
          x2={6.5}
          y2={2.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={0.5}
          y1={3.5}
          x2={2.5}
          y2={4.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={3} y1={0.5} x2={4} y2={2.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default LinkBroken;
