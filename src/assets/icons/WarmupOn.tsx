import React from 'react';

const WarmupOn = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M21.51,14A9.5,9.5,0,1,1,5.91,6.72a9.35,9.35,0,0,0,1.88,3.45A9.48,9.48,0,0,0,9,5.5,10.07,10.07,0,0,0,7.69.5C14.77,1.63,18.47,8.75,18,13a9.14,9.14,0,0,0,3.11-1.73A9.37,9.37,0,0,1,21.51,14Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.66,12.5a.26.26,0,0,1,.3.08.29.29,0,0,1,0,.31,4.19,4.19,0,0,0-.32,4.44,2.6,2.6,0,0,0,1-1.26.25.25,0,0,1,.14-.16.22.22,0,0,1,.21,0A3.69,3.69,0,0,1,16,19.5a3.92,3.92,0,0,1-4,4,4,4,0,0,1-4-4.11A7.56,7.56,0,0,1,12.66,12.5Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default WarmupOn;
