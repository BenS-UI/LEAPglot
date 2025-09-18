
import React from 'react';

const DisconnectIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.05 4.95a7.5 7.5 0 1 0 9.9 9.9M3.75 3.75L20.25 20.25"
    />
  </svg>
);

export default DisconnectIcon;
