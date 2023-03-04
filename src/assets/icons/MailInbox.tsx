import React from 'react';

const MailInbox = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" height={size} width={size} {...restProps}>
      <g>
        <rect
          x={0.5}
          y={0.5}
          width={13}
          height={13}
          rx={1}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M.5,8H4A1,1,0,0,1,5,9,2,2,0,0,0,9,9a1,1,0,0,1,1-1h3.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default MailInbox;
