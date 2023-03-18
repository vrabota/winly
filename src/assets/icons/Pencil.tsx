import React from 'react';

const Pencil = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <path
        d="M5,12.24.5,13.5,1.76,9,10,.8a1,1,0,0,1,1.43,0L13.2,2.58A1,1,0,0,1,13.2,4Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Pencil;
