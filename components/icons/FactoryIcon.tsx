
import React from 'react';

const FactoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M15 3.75a.75.75 0 0 1 .75.75v14.25a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
    <path
      d="M9.75 6.75a.75.75 0 0 0-1.5 0v10.5a.75.75 0 0 0 1.5 0V6.75Z"
    />
    <path
      d="M20.25 12a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 1.5 0v-5.25Z"
    />
    <path
      d="M3.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-5.25Z"
    />
  </svg>
);

export default FactoryIcon;
