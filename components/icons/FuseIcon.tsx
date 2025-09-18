
import React from 'react';

const FuseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
            d="M13.5 10.5V21M4.5 10.5v10.5M4.5 10.5a7.5 7.5 0 0 1 15 0v10.5a7.5 7.5 0 0 1-15 0Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5V3a1.5 1.5 0 0 0-3 0v7.5"
        />
    </svg>
);

export default FuseIcon;
