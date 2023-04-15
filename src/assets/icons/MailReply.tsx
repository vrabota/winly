import React from 'react';

const MailReply = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" height={size} width={24} {...restProps}>
      <path
        d="M13.5,12.5C10.577,10.027,9.858,9,7,9H5.5v3L.5,6.5l5-5v3h1C11.5,4.5,12.5,9.5,13.5,12.5Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MailReply;
