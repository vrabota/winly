import React from 'react';

const ShieldPerson = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <circle cx={5} cy={2.75} r={2.25} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M6,6.61A4.49,4.49,0,0,0,.5,11v1.5H6"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.67,13.47h0a.5.5,0,0,1-.34,0h0A4.48,4.48,0,0,1,7.5,9.31V8A.47.47,0,0,1,8,7.5H13A.47.47,0,0,1,13.5,8V9.31A4.48,4.48,0,0,1,10.67,13.47Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default ShieldPerson;
