import React from 'react';

const Contacted = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M12,13.5H2a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1H12a1,1,0,0,1,1,1v11A1,1,0,0,1,12,13.5Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={4}
          y1={0.5}
          x2={4}
          y2={13.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={7.5} y1={4} x2={9.5} y2={4} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default Contacted;
