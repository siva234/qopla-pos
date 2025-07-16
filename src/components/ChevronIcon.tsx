import React from 'react';

type ChevronIconProps = {
  isCollapsed: boolean;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ isCollapsed }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${
        isCollapsed ? '-rotate-90' : 'rotate-0'
      }`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};