
import React from 'react';

const PlayerShipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-.269 0-.53.04- .783.118l-7.5 3A.75.75 0 0 0 3 6.138V17.5a.75.75 0 0 0 .375.65l7.5 4a.75.75 0 0 0 .75 0l7.5-4a.75.75 0 0 0 .375-.65V6.138a.75.75 0 0 0-.717-.77L12.783 2.368A.75.75 0 0 0 12 2.25Zm0 2.643 6.093 2.437L12 9.428 5.907 7.33 12 4.893Z"
      clipRule="evenodd"
    />
  </svg>
);

export default PlayerShipIcon;
