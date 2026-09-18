"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS, BUNDLES, formatPrice } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { Sparkles, ArrowRight, Check, ShoppingBag } from "lucide-react";

export default function ColeccionesPage() {
  const { addBundleToCart } = useCart();

  const collections = [
    {
      title: "MADERAS & RESINAS",
      tagline: "El refugio cálido de las casas antiguas",
      description: "Cedro del Atlas, sándalo puro, ámbar fósil y notas ahumadas. Una colección pensada para living, bibliotecas y momentos de recogimiento.",
      accentColor: "#9E5A20",
      products: PRODUCTS.filter((p) => p.aromaticFamily === "Amaderado" || p.aromaticFamily === "Especiado"),
    },
    {
      title: "CÍTRICOS & ENERGÍA",
      tagline: "Luz de mañana entrando por los ventanales",
      description: "Bergamota de Calabria, té verde matcha y neroli fresco. Aromas que limpian el aire y despiertan el pensamiento creativo.",
      accentColor: "#D4A346",
      products: PRODUCTS.filter((p) => p.aromaticFamily === "Cítrico"),
    },
    {
      title: "BOSQUE & HIERBAS SILVESTRES",
      tagline: "La respiración pura de la tierra húmeda",
      description: "Lavanda serrana, musgo de roble, pino patagónico y eucalipto. Un baño de clorofila para reconectar con lo esencial.",
      accentColor: "#2E3D2F",
      products: PRODUCTS.filter((p) => p.aromaticFamily === "Verde & Herbal"),
    },
    {
      title: "FLORES NOCTURNAS & NOSTALGIA",
      tagline: "Pétalos oscuros, misterio y linos tibios",
      description: "Rosa de mayo, vainilla bourbon y azahar. Fragancias íntimas que perduran en prendas y sábanas.",
      accentColor: "#9E4738",
      products: PRODUCTS.filter((p) => p.aromaticFamily === "Floral" || p.aromaticFamily === "Gourmand"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-3 shadow-sm">
        <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-amber font-bold block">
          CURADURÍA TEMÁTICA
        </span>
        <h1 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-mejunje-charcoal">
          COLECCIONES & RITUALES
        </h1>
        <p className="font-editorial italic text-base text-mejunje-muted leading-relaxed">
          “universos olfativos concebidos para convivir en perfecta armonía dentro de un mismo hogar.”
        </p>
      </div>

      {/* Bundles highlight row */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-mejunje-border pb-3">
          <div>
            <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-terracotta font-bold">
              SETS EMBLEMÁTICOS
            </span>
            <h2 className="font-typewriter text-2xl font-bold text-mejunje-charcoal">
              MEJUNJES ARMADOS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-mejunje-border rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative"
            >
              <div className="absolute top-4 right-4">
                <span className="font-typewriter text-[10px] font-bold px-3 py-1 rounded-full bg-mejunje-amber text-white">
                  {bundle.badge}
                </span>
              </div>

              <div>
                <span className="font-typewriter text-[10px] text-mejunje-muted tracking-widest uppercase block mb-1">
                  {bundle.tag}
                </span>
                <h3 className="font-typewriter text-xl font-bold text-mejunje-charcoal">
                  {bundle.title}
                </h3>
                <p className="font-editorial italic text-xs text-mejunje-muted mt-1">
                  {bundle.subtitle}
                </p>
                <p className="font-sans text-xs text-mejunje-ink mt-3 leading-relaxed">
                  {bundle.description}
                </p>

                <div className="mt-4 pt-3 border-t border-mejunje-borderLight space-y-1.5">
                  {bundle.productsIncluded.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-sans text-mejunje-charcoal">
                      <Check className="w-3.5 h-3.5 text-mejunje-deepGreen shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-mejunje-border flex items-center justify-between">
                <div>
                  <span className="block font-typewriter text-[10px] text-mejunje-muted line-through">
                    {formatPrice(bundle.originalPrice)}
                  </span>
                  <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">
                    {formatPrice(bundle.bundlePrice)}
                  </span>
                </div>
                <button
                  onClick={() => addBundleToCart(bundle)}
                  className="px-4 py-2.5 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-white font-typewriter text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>SUMAR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thematic Collections */}
      <div className="space-y-16 pt-8">
        {collections.map((col, idx) => (
          <div key={idx} className="space-y-6 pt-8 border-t border-mejunje-border">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <span
                  className="font-typewriter text-xs uppercase tracking-widest font-bold block"
                  style={{ color: col.accentColor }}
                >
                  COLECCIÓN N° 0{idx + 1}
                </span>
                <h3 className="font-typewriter text-2xl sm:text-3xl font-bold text-mejunje-charcoal">
                  {col.title}
                </h3>
                <p className="font-editorial italic text-sm text-mejunje-muted">
                  “{col.tagline}”
                </p>
                <p className="font-sans text-xs text-mejunje-ink pt-1">
                  {col.description}
                </p>
              </div>

              <Link
                href="/tienda"
                className="font-typewriter text-xs font-bold text-mejunje-charcoal hover:text-mejunje-amber flex items-center gap-1 shrink-0"
              >
                <span>VER EN LA TIENDA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {col.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
