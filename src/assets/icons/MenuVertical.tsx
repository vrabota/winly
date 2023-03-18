import React from 'react';

const MenuVertical = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <circle cx={7} cy={2} r={1.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={7} cy={7} r={1.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={7} cy={12} r={1.5} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default MenuVertical;
