
import React from 'react';

const LeapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M15.75 2.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.41L9.47 12l5.03 7.59V18a.75.75 0 0 1 1.5 0v5.25a.75.75 0 0 1-1.5 0V19.59L8.97 12l5.03-7.59V4.41a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
    <path d="M11.25 12a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 1.5 0V11.25a.75.75 0 0 1-.75.75Z" />
  </svg>
);

export default LeapIcon;
