
import React from 'react';

const SequenceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M3.75 3v18M8.25 3v18M12 3v18M15.75 3v18M20.25 3v18"
    />
  </svg>
);

export default SequenceIcon;
