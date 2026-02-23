import React from 'react';

export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 40,
    md: 64,
    lg: 120,
    xl: 200
  };

  const pxSize = sizeMap[size];

  return (
    <svg 
      width={pxSize} 
      height={pxSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-xl select-none"
      aria-label="Brave Ecom Logo"
      shapeRendering="geometricPrecision"
    >
      <defs>
        {/* Brand Gradient matching .bronze-gradient CSS */}
        <linearGradient id="bronzeBrand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d5a6" /> 
          <stop offset="45%" stopColor="#c79155" />
          <stop offset="100%" stopColor="#8b5e34" />
        </linearGradient>

        <linearGradient id="bronzeDark" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#8b5e34" /> 
           <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* Arrow Gradient - Brighter highlight for growth indicator */}
        <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f5d5a6" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f5d5a6" />
        </linearGradient>

        <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
           <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.4"/>
        </filter>
      </defs>

      {/* -- BACKGROUND: Dark Hexagon backing -- */}
      <path 
        d="M50 5 L90 27 V73 L50 95 L10 73 V27 Z" 
        fill="#0f172a" 
        fillOpacity="0.9"
        stroke="url(#bronzeDark)"
        strokeWidth="1"
      />

      {/* -- SHOPPING CART (Watermark Background) -- */}
      <g transform="translate(26, 32) scale(0.48)" opacity="0.25">
        <path 
          d="M0 0 H15 L25 60 H85" 
          stroke="#e2e8f0" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        <path 
          d="M25 60 L38 10 H90 L80 60 H25 Z" 
          stroke="#e2e8f0" 
          strokeWidth="6" 
          strokeLinejoin="round" 
          fill="none"
        />
        <circle cx="38" cy="75" r="7" fill="#e2e8f0" />
        <circle cx="78" cy="75" r="7" fill="#e2e8f0" />
      </g>

      {/* -- FRAME SEGMENTS (Hexagon Outline) -- */}
      <g stroke="url(#bronzeBrand)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#dropshadow)">
         <path d="M50 5 L90 27 V73 L50 95 L10 73 V27 Z" fill="none" />
      </g>
      
      {/* Inner Bevel Highlight (Thinner lines inside) for 3D effect */}
      <g stroke="url(#bronzeBrand)" strokeWidth="0.5" opacity="0.6">
        <path d="M50 8 L87 28 V72 L50 92 L13 72 V28 Z" fill="none" />
      </g>

      {/* -- BOLTS (Hexagons at corners) -- */}
      <g fill="url(#bronzeBrand)" filter="url(#dropshadow)">
         {[
           {x: 50, y: 5}, {x: 90, y: 27}, {x: 90, y: 73}, 
           {x: 50, y: 95}, {x: 10, y: 73}, {x: 10, y: 27}
         ].map((pt, i) => (
            <path key={i} transform={`translate(${pt.x}, ${pt.y}) scale(0.25)`} d="M0 -10 L8.66 -5 V5 L0 10 L-8.66 5 V-5 Z" />
         ))}
      </g>

      {/* -- ARROW (Growth) -- */}
      <g filter="url(#dropshadow)">
        {/* Shaft */}
        <path 
            d="M32 68 L68 32" 
            stroke="url(#arrowGrad)" 
            strokeWidth="6" 
            strokeLinecap="round" 
        />
        {/* Arrow Head - Dynamic Direction */}
        <path 
            d="M68 32 L68 50 L68 32 L50 32"
            stroke="url(#arrowGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};