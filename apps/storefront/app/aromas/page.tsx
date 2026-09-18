"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BOTANICALS, PRODUCTS, formatPrice } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Leaf, Sparkles, ArrowRight, Sun, TreePine, Flower, Flame, Compass, Wind, Heart } from "lucide-react";

export default function AromasPage() {
  const [selectedBotanicalId, setSelectedBotanicalId] = useState<string>("ing_bergamota");

  const activeBotanical =
    BOTANICALS.find((b) => b.id === selectedBotanicalId) || BOTANICALS[0];
  const relatedProducts = PRODUCTS.filter((p) =>
    activeBotanical.matchingProductSlugs.includes(p.slug)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-3 shadow-sm">
        <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-deepGreen font-bold block">
          ENCICLOPEDIA SENSORIAL
        </span>
        <h1 className="font-typewriter text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-mejunje-charcoal">
          LO QUE HAY ADENTRO
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-mejunje-muted leading-relaxed max-w-xl mx-auto">
          “la nobleza de la botánica pura: extractos destilados al vapor, resinas milenarias y maderas nobles sin artificios químicos.”
        </p>
      </div>

      {/* Interactive Botanical Grid Explorer */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="font-typewriter text-xs tracking-widest text-mejunje-amber uppercase font-bold">
            SELECCIONÁ UN INGREDIENTE BOTÁNICO
          </span>
          <h2 className="font-typewriter text-2xl font-bold text-mejunje-charcoal">
            NOTAS PRINCIPALES DEL ATELIER
          </h2>
        </div>

        {/* Botanical Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BOTANICALS.map((botanical) => {
            const isSelected = selectedBotanicalId === botanical.id;
            return (
              <button
                key={botanical.id}
                onClick={() => setSelectedBotanicalId(botanical.id)}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-mejunje-charcoal text-mejunje-paper border-mejunje-charcoal shadow-md scale-105"
                    : "bg-white text-mejunje-charcoal border-mejunje-border hover:border-mejunje-amber hover:bg-mejunje-paper"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full mb-1"
                  style={{ backgroundColor: botanical.accentColor }}
                />
                <span className="font-typewriter text-xs font-bold tracking-wide">
                  {botanical.name}
                </span>
                <span className="font-typewriter text-[9px] text-mejunje-muted uppercase truncate w-full">
                  {botanical.family}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Botanical Focus Card */}
        <div className="bg-white border border-mejunje-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: activeBotanical.accentColor }}
                />
                <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-muted font-bold">
                  {activeBotanical.family} · ORIGEN: {activeBotanical.originNote}
                </span>
              </div>

              <h3 className="font-typewriter text-3xl font-bold text-mejunje-charcoal">
                {activeBotanical.name}
              </h3>
              <p className="font-typewriter text-xs italic text-mejunje-muted">
                {activeBotanical.latinName}
              </p>

              <p className="font-sans text-sm sm:text-base text-mejunje-ink leading-relaxed pt-2">
                {activeBotanical.description}
              </p>

              <div className="p-4 bg-mejunje-paper rounded-2xl border border-mejunje-border space-y-1">
                <span className="font-typewriter text-[11px] font-bold text-mejunje-charcoal uppercase tracking-wider block">
                  PROPIEDADES EMOCIONALES & BIENESTAR:
                </span>
                <p className="font-editorial italic text-sm text-mejunje-muted">
                  “{activeBotanical.benefits}”
                </p>
              </div>
            </div>

            {/* Related products */}
            <div className="lg:col-span-6 space-y-4">
              <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-charcoal font-bold block">
                MEJUNJES QUE CONTIENEN {activeBotanical.name}:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Olfactory Families Guide */}
      <div className="pt-10 border-t border-mejunje-border space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-typewriter text-xs tracking-widest text-mejunje-terracotta uppercase font-bold">
            ARQUITECTURA DE PERFUMERÍA
          </span>
          <h2 className="font-typewriter text-2xl sm:text-3xl font-bold text-mejunje-charcoal">
            LAS FAMILIAS OLFATIVAS DE MEJUNJE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-mejunje-paper border border-mejunje-border rounded-2xl p-6 space-y-2">
            <h4 className="font-typewriter text-base font-bold text-mejunje-amber">AMADERADOS & RESINAS</h4>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Maderas secas, cortezas añejas, ámbar fósil y benjuí. Estructuran el ambiente con peso, abrigo y sensación de hogar.
            </p>
          </div>

          <div className="bg-mejunje-paper border border-mejunje-border rounded-2xl p-6 space-y-2">
            <h4 className="font-typewriter text-base font-bold text-mejunje-sageDark">VERDES & BOTÁNICOS</h4>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Hojas machacadas, salvia, lavanda, pino y musgo. Oxigenan los pulmones y aportan la sensación de una ventana abierta tras la lluvia.
            </p>
          </div>

          <div className="bg-mejunje-paper border border-mejunje-border rounded-2xl p-6 space-y-2">
            <h4 className="font-typewriter text-base font-bold text-mejunje-mustard">CÍTRICOS LUMINOSOS</h4>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Bergamota prensada en frío, cáscaras amargas y neroli. Disipan el cansancio mental y despiertan la alegría matutina.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
