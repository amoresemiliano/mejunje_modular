"use client";

import React from "react";
import Link from "next/link";
import { Product, formatPrice } from "@/data/catalog";
import { ProductVisual } from "./ProductVisual";
import { IntensityScale } from "./IntensityScale";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const { addProductToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addProductToCart(product, 1);
  };

  return (
    <div
      className={`group relative bg-white border border-mejunje-border rounded-2xl overflow-hidden shadow-sm hover:shadow-cardHover transition-all duration-500 flex flex-col justify-between ${className}`}
    >
      {/* Top Banner / Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
        {product.badge ? (
          <span className="font-typewriter text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-mejunje-charcoal text-mejunje-paper shadow-sm">
            {product.badge}
          </span>
        ) : (
          <span className="font-typewriter text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-full bg-mejunje-paper/90 text-mejunje-muted border border-mejunje-border/60">
            {product.aromaticFamily}
          </span>
        )}

        <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-muted px-2 py-0.5 rounded bg-white/80 backdrop-blur-sm border border-mejunje-borderLight">
          {product.categoryLabel}
        </span>
      </div>

      {/* Visual Area with Link */}
      <Link
        href={`/producto/${product.slug}`}
        className="block relative w-full pt-8 pb-4 px-6 bg-mejunje-paper/30 group-hover:bg-mejunje-paper/60 transition-colors duration-500 overflow-hidden"
      >
        <div className="h-56 w-full flex items-center justify-center">
          <ProductVisual
            type={product.visualType}
            name={product.name}
            notes={product.mainNotes}
            accentColor={product.accentColor}
          />
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Notes summary */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {product.mainNotes.map((note, idx) => (
              <span
                key={idx}
                className="font-typewriter text-[10px] text-mejunje-muted tracking-tight"
              >
                {note}
                {idx < product.mainNotes.length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>

          {/* Product Name */}
          <Link href={`/producto/${product.slug}`} className="block group-hover:text-mejunje-amber transition-colors">
            <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal tracking-wide leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short sensory story */}
          <p className="font-editorial italic text-xs text-mejunje-muted mt-1.5 line-clamp-2 leading-relaxed">
            “{product.shortStory}”
          </p>

          {/* Size / Volume */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-typewriter text-mejunje-subtle">
            <span>{product.sizeVolume}</span>
          </div>

          {/* Intensity bar */}
          <div className="mt-3 pt-3 border-t border-mejunje-borderLight/80">
            <IntensityScale intensity={product.intensity} showLabel={false} />
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-4 pt-3.5 border-t border-mejunje-border/70 flex items-center justify-between gap-3">
          <div>
            <span className="block font-typewriter text-[9px] text-mejunje-muted uppercase tracking-wider">
              VALOR
            </span>
            <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/producto/${product.slug}`}
              className="p-2 rounded-xl border border-mejunje-border text-mejunje-muted hover:text-mejunje-charcoal hover:border-mejunje-charcoal transition-all"
              title="Ver detalles del aroma"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-mejunje-charcoal text-mejunje-paper hover:bg-mejunje-amber hover:text-white transition-all duration-300 font-typewriter text-xs font-bold tracking-wider active:scale-95 shadow-sm"
              title="Agregar al carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>AGREGAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
