'use client';

import React from 'react';

/**
 * Discrete neutral archive monogram for MEJUNJE Atelier
 */
export function MejunjeMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center font-typewriter font-bold text-mejunje-carbon ${className}`}>
      <span className="text-base tracking-tighter">[ M ]</span>
    </div>
  );
}

/**
 * Botanical asterisk / seal symbol
 */
export function LotusIcon({ className = "w-4 h-4" }: { className?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; leafColor?: string }) {
  return (
    <span className={`font-typewriter text-xs font-bold tracking-widest text-mejunje-verdeseco ${className}`}>
      ✻
    </span>
  );
}

/**
 * Official MEJUNJE Antique Typewriter Wordmark & Header Component
 */
export function LotusLogoHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Discrete Analog Monogram Stamp */}
      <div className="w-8 h-8 rounded-xl bg-mejunje-papel p-1 flex items-center justify-center border border-mejunje-border text-mejunje-verdeprofundo shadow-xs transition-transform group-hover:scale-105">
        <span className="font-typewriter font-bold text-xs tracking-tighter text-mejunje-verdeprofundo">
          [M]
        </span>
      </div>

      {/* Wordmark and Editorial Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-typewriter font-bold text-base sm:text-lg tracking-[0.24em] text-mejunje-carbon group-hover:text-mejunje-verdeseco transition-colors">
            MEJUNJE
          </span>
          <span className="text-[9px] font-typewriter tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border">
            Atelier
          </span>
        </div>
        <p className="font-typewriter text-[9px] text-mejunje-secundario tracking-widest uppercase">
          Atelier de Aromas · Buenos Aires
        </p>
      </div>
    </div>
  );
}

export default LotusLogoHeader;
