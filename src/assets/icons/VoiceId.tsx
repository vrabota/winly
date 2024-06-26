import React from 'react';

const VoiceId = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path d="M.5,4V1.5a1,1,0,0,1,1-1H4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M13.5,4V1.5a1,1,0,0,0-1-1H10"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M.5,10v2.5a1,1,0,0,0,1,1H4" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M13.5,10v2.5a1,1,0,0,1-1,1H10"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="1 7.5 3.5 7.5 5 3.5 7 9 9 5 10.5 7.5 13 7.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default VoiceId;
