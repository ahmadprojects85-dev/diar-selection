import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  useFullLogo?: boolean;
  isNav?: boolean;
}

export function Logo({ className = "", width = 200, height = 200, useFullLogo = true, isNav = false }: LogoProps) {
  const imageSrc = isNav ? "/nav-logo.png?v=10" : "/brand-logo.png?v=10";

  return (
    <img 
      src={imageSrc} 
      alt="Diar Selection Logo" 
      width={width} 
      height={height}
      className={`object-contain ${className}`}
    />
  );
}
