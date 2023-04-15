import React from 'react';

const Play = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <path
        d="M1.5,12.35a1.14,1.14,0,0,0,.63,1,1.24,1.24,0,0,0,1.22,0L12,8A1.11,1.11,0,0,0,12,6L3.35.69a1.24,1.24,0,0,0-1.22,0,1.14,1.14,0,0,0-.63,1Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Play;
