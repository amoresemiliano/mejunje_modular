'use client';

import React from 'react';

interface SectionHeroProps {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeIcon?: React.ReactNode;
  bgImage: string;
  noticeText?: string;
  children?: React.ReactNode;
}

export default function SectionHero({
  title,
  subtitle,
  badgeText,
  badgeIcon,
  bgImage,
  noticeText,
  children,
}: SectionHeroProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-mejunje-border bg-white shadow-atelier text-mejunje-carbon">
      {/* Background Image with Light Botanical / Atelier Focus */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 filter saturate-75 opacity-[0.16]"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Multi-layered Luminous Atelier Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-mejunje-blancocalido/70" />
      <div className="absolute inset-0 bg-mejunje-papel/20 backdrop-blur-[0.5px]" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          {/* Typewriter Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mejunje-papel text-mejunje-verdeprofundo text-[10px] font-typewriter tracking-widest uppercase border border-mejunje-borderarena">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-typewriter font-bold text-mejunje-carbon tracking-tight leading-snug">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-mejunje-secundario leading-relaxed max-w-2xl font-typewriter">
            {subtitle}
          </p>

          {noticeText && (
            <div className="inline-block mt-1 text-[10px] text-mejunje-verdeprofundo bg-mejunje-papel px-3 py-1 rounded-full border border-mejunje-border font-typewriter tracking-wider uppercase">
              {noticeText}
            </div>
          )}
        </div>

        {/* Action buttons / quick bar */}
        {children && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

