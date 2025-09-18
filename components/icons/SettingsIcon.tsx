
import React from 'react';

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226l.006-.002 2.722-.908a1.875 1.875 0 0 1 2.32 1.48l.005.018.908 2.722c.217.55.16 1.173-.15 1.666l-4.5 6.75a1.875 1.875 0 0 1-2.902 0l-4.5-6.75a1.875 1.875 0 0 1-.15-1.666l.908-2.722.005-.018a1.875 1.875 0 0 1 2.32-1.48l2.722.908.006.002Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18.75a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6Z"
    />
  </svg>
);

export default SettingsIcon;
