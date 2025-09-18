
import React from 'react';

const ChessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2a3 3 0 0 0-3 3v1h-2a1 1 0 0 0-1 1v2h10V7a1 1 0 0 0-1-1h-2V5a3 3 0 0 0-3-3zM8 12v3H6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2v-3h-8zM4 22h16v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1z" />
  </svg>
);

export default ChessIcon;
