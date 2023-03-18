import React from 'react';

const FireExit = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M4,2.53a.34.34,0,0,0-.34,0,.22.22,0,0,0,0,.29c1,1.74,1.26,4.21-.17,5.56A4.69,4.69,0,0,1,2.2,6.73a3.3,3.3,0,0,0-1.7,3A4,4,0,0,0,4.75,13.5,3.88,3.88,0,0,0,9,9.69C9.11,7.16,7.33,4,4,2.53Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.87,9.69a1.69,1.69,0,0,1-1.7,1.69"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="11.5 0.5 13.5 2.5 11.5 4.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={13.5}
          y1={2.5}
          x2={9}
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

export default FireExit;
