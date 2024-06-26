import React from 'react';

const PartyIcon = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M11.85,13.2,5.17,10.71a1.25,1.25,0,0,1-.48-2.05L8.88,4.47A1.26,1.26,0,0,1,10.94,5l2.48,6.68A1.22,1.22,0,0,1,11.85,13.2Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.05,7.13a2.06,2.06,0,0,1,1.46-.21"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.33,4.28A2.1,2.1,0,0,1,4,2.83"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.63.72A4.72,4.72,0,0,0,6.76,4"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={1} cy={3.28} r={0.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default PartyIcon;
