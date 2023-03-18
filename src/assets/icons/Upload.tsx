import React from 'react';

const Upload = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <line
          x1={6.5}
          y1={7.5}
          x2={6.5}
          y2={13.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="4.5 9.5 6.5 7.5 8.5 9.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12,8.1A3,3,0,1,0,8.35,3.41,4,4,0,0,0,.5,4.5,4,4,0,0,0,1.38,7"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Upload;
