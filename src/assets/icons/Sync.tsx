import React from 'react';

const AlertBell = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <g>
          <polyline
            points="11 9 13 8.5 13.5 10.5"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13,8.5A6.76,6.76,0,0,1,7,13H7A6,6,0,0,1,1.36,9.05"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g>
          <polyline
            points="3 5 1 5.5 0.5 3.5"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1,5.5C1.84,3.2,4.42,1,7,1H7a6,6,0,0,1,5.64,4"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};

export default AlertBell;
