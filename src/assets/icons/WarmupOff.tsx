import React from 'react';

const WarmupOff = ({ size = 24, color = 'currentColor', ...restProps }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height={size} width={size} {...restProps}>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.2269 15.6441C10.8086 15.6764 10.3936 15.5486 10.0659 15.2866C9.73819 15.0246 9.52225 14.6479 9.46176 14.2327C8.83535 14.575 8.31977 15.0891 7.97572 15.7145C7.63166 16.34 7.47345 17.0507 7.51972 17.763C7.51972 18.3194 7.62932 18.8703 7.84225 19.3843C8.05519 19.8983 8.36729 20.3653 8.76074 20.7586C9.15419 21.152 9.62127 21.464 10.1353 21.6768C10.6494 21.8897 11.2003 21.9992 11.7566 21.999C12.8754 21.9839 13.9441 21.5327 14.7352 20.7415C15.0059 20.4709 15.2368 20.1677 15.424 19.8412"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.72742 7.72738C8.68624 6.14333 10.0027 4.80236 11.5742 3.8137C13.3005 2.72773 15.2766 2.10322 17.3134 2C16.2204 4.62499 16.1069 7.55529 16.9934 10.257L19.659 7.33283C20.6711 8.78656 21.2486 10.4983 21.324 12.2681C21.3994 14.0379 20.9696 15.7926 20.0847 17.3271C19.7535 17.9014 19.3637 18.4361 18.9233 18.9233"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.3271 20.934C14.7576 21.7553 12.9868 22.113 11.2216 21.9652C9.45644 21.8175 7.76974 21.1704 6.35864 20.0996C4.94754 19.0288 3.87034 17.5786 3.25289 15.9183C2.63545 14.258 2.50328 12.4563 2.87182 10.7237C3.04938 9.88895 3.33961 9.08688 3.73137 8.33826"
      />
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M22.955 22.955L1.04504 1.04504" />
    </svg>
  );
};

export default WarmupOff;