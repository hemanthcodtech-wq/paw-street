import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showText = true, className = '', to = '/' }) {
  const imgSizeClasses = {
    sm: 'h-6 sm:h-7 max-w-[120px]',
    md: 'h-8 sm:h-8.5 max-w-[155px] sm:max-w-[170px]',
    lg: 'h-9 sm:h-9.5 md:h-10 max-w-[180px] sm:max-w-[200px]',
    xl: 'h-11 sm:h-13 max-w-[240px]'
  };

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <img
        src="/logo.png"
        alt="PAW NEAR - The Paw Street"
        className={`w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${imgSizeClasses[size]}`}
      />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="group focus:outline-none inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
