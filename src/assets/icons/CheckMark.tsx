import React from 'react';

const CheckMark = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M4,8,6.05,9.64a.48.48,0,0,0,.4.1.5.5,0,0,0,.34-.24L10,4"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={7} cy={7} r={6.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default CheckMark;
