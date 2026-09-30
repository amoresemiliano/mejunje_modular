"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export const DemoModeBanner: React.FC = () => {
  return (
    <div className="bg-mejunje-paper border border-mejunje-amber/40 rounded-2xl p-3 sm:p-4 text-center shadow-sm max-w-4xl mx-auto my-4 animate-in fade-in">
      <div className="flex items-center justify-center gap-2 font-typewriter text-xs font-bold text-mejunje-amber tracking-widest uppercase">
        <Sparkles className="w-4 h-4 text-mejunje-amber" />
        <span>DATOS DE DEMOSTRACIÓN · MODO DEMO ACTIVO</span>
      </div>
      <p className="font-editorial italic text-xs text-mejunje-muted mt-1">
        Se muestran productos de ejemplo sintéticos. Configure NEXT_PUBLIC_DATA_MODE=live para consultar el catálogo persistente de producción.
      </p>
    </div>
  );
};
