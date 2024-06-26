import React from 'react';

const SadFace = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.7 10.5C4.2 8.7 6.1 7.6 8 8.1C9.1 8.4 10 9.3 10.4 10.5"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.85 5.45C4.71193 5.45 4.6 5.33807 4.6 5.2C4.6 5.06193 4.71193 4.95 4.85 4.95"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.85 5.45C4.98807 5.45 5.1 5.33807 5.1 5.2C5.1 5.06193 4.98807 4.95 4.85 4.95"
      />
      <g>
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.24999 5.45C9.11192 5.45 8.99999 5.33807 8.99999 5.2C8.99999 5.06193 9.11192 4.95 9.24999 4.95"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.24999 5.45C9.38806 5.45 9.49999 5.33807 9.49999 5.2C9.49999 5.06193 9.38806 4.95 9.24999 4.95"
        />
      </g>
    </svg>
  );
};

export default SadFace;
