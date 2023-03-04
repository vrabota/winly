import React from 'react';

const AlertBell = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M7,.5a4.29,4.29,0,0,1,4.29,4.29c0,4.77,1.74,5.71,2.21,5.71H.5c.48,0,2.21-.95,2.21-5.71A4.29,4.29,0,0,1,7,.5Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5,12.33a1.55,1.55,0,0,0,3,0"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default AlertBell;
