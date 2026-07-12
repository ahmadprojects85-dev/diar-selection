import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  useFullLogo?: boolean;
}

export function Logo({ className = "", width = 200, height = 200, useFullLogo = true }: LogoProps) {
  const imageSrc = "/brand-logo.png";

  return (
    <Image 
      src={imageSrc} 
      alt="Diar Selection Logo" 
      width={width} 
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );
}
