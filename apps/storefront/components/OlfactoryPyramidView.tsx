import React from "react";
import { OlfactoryPyramid } from "@/data/catalog";
import { Sparkles, Heart, Anchor } from "lucide-react";

interface OlfactoryPyramidViewProps {
  pyramid: OlfactoryPyramid;
  className?: string;
}

export const OlfactoryPyramidView: React.FC<OlfactoryPyramidViewProps> = ({
  pyramid,
  className = "",
}) => {
  return (
    <div className={`border border-mejunje-border rounded-xl p-5 bg-mejunje-paper/50 ${className}`}>
      <div className="flex items-center justify-between border-b border-mejunje-border/70 pb-3 mb-4">
        <h4 className="font-typewriter text-xs uppercase tracking-widest text-mejunje-charcoal font-bold">
          PIRÁMIDE OLFATIVA
        </h4>
        <span className="text-[10px] font-typewriter text-mejunje-muted uppercase tracking-wider">
          NOTAS & FIJACIÓN
        </span>
      </div>

      <div className="space-y-4">
        {/* Salida */}
        <div className="flex items-start gap-3.5 group">
          <div className="w-8 h-8 rounded-lg bg-mejunje-mustardLight text-mejunje-mustard flex items-center justify-center shrink-0 border border-mejunje-mustard/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-[11px] font-bold uppercase tracking-wider text-mejunje-charcoal">
                SALIDA
              </span>
              <span className="text-[10px] text-mejunje-muted font-typewriter">
                (Primeros 15 min · Impresión inicial)
              </span>
            </div>
            <p className="text-sm font-sans text-mejunje-ink mt-0.5 leading-relaxed">
              {pyramid.topNotes.join(" · ")}
            </p>
          </div>
        </div>

        {/* Corazón */}
        <div className="flex items-start gap-3.5 group">
          <div className="w-8 h-8 rounded-lg bg-mejunje-sageLight text-mejunje-sageDark flex items-center justify-center shrink-0 border border-mejunje-sage/30">
            <Heart className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-[11px] font-bold uppercase tracking-wider text-mejunje-charcoal">
                CORAZÓN
              </span>
              <span className="text-[10px] text-mejunje-muted font-typewriter">
                (2 a 4 horas · El alma y cuerpo del aroma)
              </span>
            </div>
            <p className="text-sm font-sans text-mejunje-ink mt-0.5 leading-relaxed">
              {pyramid.heartNotes.join(" · ")}
            </p>
          </div>
        </div>

        {/* Fondo */}
        <div className="flex items-start gap-3.5 group">
          <div className="w-8 h-8 rounded-lg bg-mejunje-amberLight text-mejunje-amberDark flex items-center justify-center shrink-0 border border-mejunje-amber/30">
            <Anchor className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-[11px] font-bold uppercase tracking-wider text-mejunje-charcoal">
                FONDO
              </span>
              <span className="text-[10px] text-mejunje-muted font-typewriter">
                (+6 horas · Fijación y memoria profunda)
              </span>
            </div>
            <p className="text-sm font-sans text-mejunje-ink mt-0.5 leading-relaxed">
              {pyramid.baseNotes.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
