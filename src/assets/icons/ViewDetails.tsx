import React from 'react';

const ViewDetails = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M13.23,6.33a1,1,0,0,1,0,1.34C12.18,8.8,9.79,11,7,11S1.82,8.8.77,7.67a1,1,0,0,1,0-1.34C1.82,5.2,4.21,3,7,3S12.18,5.2,13.23,6.33Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={7} cy={7} r={2} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default ViewDetails;
