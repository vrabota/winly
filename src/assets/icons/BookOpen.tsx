import React from 'react';

const BookOpen = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M7,13.5a9.26,9.26,0,0,0-5.61-2.95,1,1,0,0,1-.89-1V1.5A1,1,0,0,1,.85.74,1,1,0,0,1,1.64.51,9.3,9.3,0,0,1,7,3.43Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7,13.5a9.26,9.26,0,0,1,5.61-2.95,1,1,0,0,0,.89-1V1.5a1,1,0,0,0-.35-.76,1,1,0,0,0-.79-.23A9.3,9.3,0,0,0,7,3.43Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default BookOpen;
