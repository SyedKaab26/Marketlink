import React from 'react';

export const ProduceIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11C3 6.03 7.03 2 12 2z"/>
    <path d="M12 2v9"/>
    <path d="M7 6l5 5"/>
  </svg>
);

export const PlantIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a6 6 0 0 0-6-6H3v3a6 6 0 0 0 6 6h3"/>
    <path d="M12 14a6 6 0 0 1 6 6h3v-3a6 6 0 0 0-6-6h-3"/>
    <path d="M12 22V2"/>
  </svg>
);

export const PreparedIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

export const BakeryIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A6 6 0 0 1 12 6a6 6 0 0 1 6 7.87"/>
    <path d="M3 13.87V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.13"/>
    <path d="M12 6v14"/>
  </svg>
);

export const MeatIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4a3 3 0 0 1 3 3v2a6 6 0 0 1-6 6H9.5A5.5 5.5 0 0 1 4 9.5V8a4 4 0 0 1 4-4h8z"/>
    <path d="M6.5 15A6.5 6.5 0 0 0 13 21.5h1a5.5 5.5 0 0 0 5.5-5.5v-1"/>
  </svg>
);

export const DairyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8v4H8z"/>
    <path d="M6 6h12l1.5 4v11a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V10L6 6z"/>
    <line x1="6" y1="12" x2="18" y2="12"/>
  </svg>
);
