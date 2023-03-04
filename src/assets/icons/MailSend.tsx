import React from 'react';

const MailSend = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" height={size} width={size} {...restProps}>
      <path
        d="M5.818,10.992,8,13.171a1.124,1.124,0,0,0,1.861-.439L13.442,1.979A1.123,1.123,0,0,0,12.021.558L1.268,4.142A1.124,1.124,0,0,0,.829,6L3.57,8.744l-.093,3.465Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.121 0.782L3.57 8.744" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default MailSend;
