"use client";

import React from "react";

export type GridColumns = 1 | 2 | 3 | 4 | 5;

interface GridControlsProps {
  columns: GridColumns;
  onChange: (cols: GridColumns) => void;
  className?: string;
}

export function GridControls({ columns, onChange, className = "" }: GridControlsProps) {
  const mobileOptions: GridColumns[] = [1, 2, 3];
  const desktopOptions: GridColumns[] = [5, 4, 3];

  const renderIcon = (num: GridColumns) => {
    const total = num;
    const barWidth = num === 1 ? 12 : 14 / total;
    const gap = num === 1 ? 0 : 1.8;
    const startX = (24 - (total * barWidth + (total - 1) * gap)) / 2;

    return (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        {Array.from({ length: total }).map((_, i) => (
          <rect
            key={i}
            x={startX + i * (barWidth + gap)}
            y="4"
            width={Math.max(barWidth, 1.1)}
            height="16"
            rx="0.5"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className={`inline-flex items-center gap-0.5 sm:gap-1 bg-white/70 dark:bg-black/60 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-border/60 shadow-sm ${className}`}>
      {/* Mobile Options (1, 2, or 3 Columns) */}
      <div className="flex sm:hidden items-center gap-1">
        {mobileOptions.map((num) => {
          const isActive = columns === num || (num === 2 && columns > 3);
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              title={`${num} ${num === 1 ? 'Column' : 'Columns'}`}
              aria-label={`${num} ${num === 1 ? 'Column' : 'Columns'}`}
              className={`p-1.5 rounded-lg transition-all duration-200 shrink-0 inline-flex ${
                isActive
                  ? "bg-gold text-black shadow-md scale-105"
                  : "text-text-muted hover:text-text-primary hover:bg-gold/15"
              }`}
            >
              {renderIcon(num)}
            </button>
          );
        })}
      </div>

      {/* Desktop Options (3, 4, 5 Columns) */}
      <div className="hidden sm:flex items-center gap-1">
        {desktopOptions.map((num) => {
          const isActive = columns === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              title={`${num} Columns`}
              aria-label={`${num} Columns`}
              className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 shrink-0 inline-flex ${
                isActive
                  ? "bg-gold text-black shadow-md scale-105"
                  : "text-text-muted hover:text-text-primary hover:bg-gold/15"
              }`}
            >
              {renderIcon(num)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getGridClass(columns: GridColumns): string {
  switch (columns) {
    case 1:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    case 2:
      return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
    case 3:
      return "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3";
    case 4:
      return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    case 5:
    default:
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
  }
}
