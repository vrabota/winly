import React from 'react';

const HelpIcon = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <circle cx={7} cy={7} r={6.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M5.5,5.5A1.5,1.5,0,1,1,7,7V8"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7,9.5a.75.75,0,1,0,.75.75A.76.76,0,0,0,7,9.5Z" fill={color} />
      </g>
    </svg>
  );
};

export default HelpIcon;
