import React from 'react';

const Leads = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <circle cx={5} cy={3.75} r={2.25} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9.5,13.5H.5v-1a4.5,4.5,0,0,1,9,0Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9,1.5A2.25,2.25,0,0,1,9,6" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M10.6,8.19a4.5,4.5,0,0,1,2.9,4.2V13.5H12"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Leads;
