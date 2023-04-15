import React from 'react';

const Envelope = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" height={size} width={size} {...restProps}>
      <path
        d="M0.500 1.750 L13.500 1.750 L13.500 12.250 L0.500 12.250 Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M.5,3.015,6.355,7.956a1,1,0,0,0,1.29,0L13.5,3.015"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Envelope;
