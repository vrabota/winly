import React from 'react';

const DownloadWebsite = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <line x1={7} y1={7} x2={7} y2={13.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <polyline
          points="4.5 11 7 13.5 9.5 11"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5,13.5h-1a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1h11a1,1,0,0,1,1,1v11a1,1,0,0,1-1,1h-1"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={0.5}
          y1={3.5}
          x2={13.5}
          y2={3.5}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default DownloadWebsite;
