
import React from 'react';

const LeapGameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5h.008v.008H12V4.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h.008v.008H3.75V12Zm16.5 0h.008v.008h-.008V12Z" />
  </svg>
);

export default LeapGameIcon;
