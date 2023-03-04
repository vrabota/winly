import React from 'react';

const MailSign = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <path
          d="M10.05,7A3,3,0,1,1,7,4,3,3,0,0,1,10.05,7Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.05,7V8.3c0,3.49,5.47.2,2.6-4.54A6.59,6.59,0,0,0,7,.5,6.5,6.5,0,1,0,9.52,13"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default MailSign;
