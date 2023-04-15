import React from 'react';

const Cursor = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <path
        d="M13.15,5.45a.5.5,0,0,0,0-1L1.83.56A1,1,0,0,0,.56,1.83L4.5,13.16a.5.5,0,0,0,1,0L7.5,7.5Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Cursor;
