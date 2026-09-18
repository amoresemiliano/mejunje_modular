"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, formatPrice } from "@/data/catalog";
import { ProductVisual } from "@/components/ProductVisual";
import { IntensityScale } from "@/components/IntensityScale";
import { OlfactoryPyramidView } from "@/components/OlfactoryPyramidView";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Gift, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Flame, 
  Heart,
  Plus,
  Minus
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-typewriter text-3xl font-bold text-mejunje-charcoal">
          Aroma no encontrado
        </h1>
        <p className="font-editorial italic text-mejunje-muted">
          El mejunje que estás buscando no existe o fue retirado del atelier.
        </p>
        <Link
          href="/tienda"
          className="inline-block px-6 py-3 rounded-xl bg-mejunje-charcoal text-mejunje-paper font-typewriter text-xs font-bold"
        >
          VOLVER A LA TIENDA
        </Link>
      </div>
    );
  }

  const { addProductToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const companionProducts = PRODUCTS.filter((p) =>
    product.companionProductSlugs.includes(p.slug)
  );

  const handleAddToCart = () => {
    addProductToCart(product, quantity, isGiftWrapped, giftNote);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Back breadcrumb link */}
      <div className="flex items-center gap-2 font-typewriter text-xs text-mejunje-muted">
        <Link href="/tienda" className="hover:text-mejunje-amber flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>TIENDA</span>
        </Link>
        <span>/</span>
        <span className="uppercase">{product.categoryLabel}</span>
        <span>/</span>
        <span className="text-mejunje-charcoal font-bold">{product.name}</span>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Visual Artwork Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-white border border-mejunje-border rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center overflow-hidden">
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
              {product.badge && (
                <span className="font-typewriter text-[10px] font-bold px-3 py-1 rounded-full bg-mejunje-charcoal text-mejunje-paper">
                  {product.badge}
                </span>
              )}
              <span className="font-typewriter text-[10px] px-3 py-1 rounded-full bg-mejunje-paper border border-mejunje-border text-mejunje-charcoal">
                {product.aromaticFamily}
              </span>
            </div>

            <div className="w-full h-80 sm:h-96 my-4">
              <ProductVisual
                type={product.visualType}
                name={product.name}
                notes={product.mainNotes}
                accentColor={product.accentColor}
                size="lg"
              />
            </div>

            <div className="w-full border-t border-mejunje-borderLight pt-4 text-center">
              <span className="font-typewriter text-[11px] text-mejunje-muted tracking-widest uppercase">
                FRASCO DE VIDRIO ÁMBAR DE BOTICA · REUTILIZABLE
              </span>
            </div>
          </div>

          {/* Sensory Guarantees */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-mejunje-paper/60 border border-mejunje-border rounded-2xl text-center font-typewriter text-[10px] text-mejunje-muted">
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-4 h-4 text-mejunje-amber" />
              <span className="text-mejunje-charcoal font-bold">100% CERA VEGETAL</span>
              <span>Sin parafinas</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Flame className="w-4 h-4 text-mejunje-terracotta" />
              <span className="text-mejunje-charcoal font-bold">PABILO DE MADERA</span>
              <span>Crepitar suave</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-mejunje-deepGreen" />
              <span className="text-mejunje-charcoal font-bold">ENVÍOS SEGUROS</span>
              <span>Embalaje térmico</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Details & Buy Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-amber font-bold">
                {product.categoryLabel} · {product.aromaticFamily}
              </span>
              <span className="font-typewriter text-xs text-mejunje-deepGreen font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-mejunje-deepGreen inline-block" />
                LOTE ATELIER DISPONIBLE ({product.stock} un.)
              </span>
            </div>

            <h1 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-mejunje-charcoal leading-tight">
              {product.name}
            </h1>

            {/* Short story */}
            <p className="font-editorial italic text-lg sm:text-xl text-mejunje-muted mt-2 leading-relaxed">
              “{product.shortStory}”
            </p>
          </div>

          {/* Pricing & Size */}
          <div className="flex items-baseline gap-4 py-3 border-y border-mejunje-border">
            <span className="font-typewriter text-3xl font-bold text-mejunje-charcoal">
              {formatPrice(product.price)}
            </span>
            <span className="font-typewriter text-xs text-mejunje-muted">
              {product.sizeVolume}
            </span>
          </div>

          {/* Poetic description */}
          <div className="space-y-2">
            <p className="font-sans text-sm text-mejunje-ink leading-relaxed">
              {product.poeticDescription}
            </p>
          </div>

          {/* “A QUÉ HUELE” Box */}
          <div className="bg-mejunje-paper border border-mejunje-border rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mejunje-terracotta" />
              <h4 className="font-typewriter text-xs font-bold uppercase tracking-widest text-mejunje-charcoal">
                A QUÉ HUELE
              </h4>
            </div>
            <p className="font-editorial italic text-base text-mejunje-charcoal leading-relaxed">
              “{product.feelsLike}”
            </p>
          </div>

          {/* Visual Intensity Scale */}
          <div className="bg-white border border-mejunje-border rounded-2xl p-4">
            <IntensityScale intensity={product.intensity} />
          </div>

          {/* Olfactory Pyramid Component */}
          <OlfactoryPyramidView pyramid={product.pyramid} />

          {/* Ideal Rooms Tags */}
          <div className="space-y-2">
            <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-muted block">
              ESPACIOS RECOMENDADOS:
            </span>
            <div className="flex flex-wrap gap-2">
              {product.idealForRooms.map((room) => (
                <span
                  key={room}
                  className="px-3 py-1 rounded-xl bg-white border border-mejunje-border text-mejunje-charcoal font-typewriter text-xs"
                >
                  {room}
                </span>
              ))}
            </div>
          </div>

          {/* Gifting toggle with typewriter note input */}
          <div className="p-4 bg-mejunje-paper/80 border border-mejunje-border rounded-2xl space-y-3">
            <button
              onClick={() => setIsGiftWrapped(!isGiftWrapped)}
              className="flex items-center gap-2 font-typewriter text-xs font-bold text-mejunje-charcoal hover:text-mejunje-amber transition-colors w-full text-left"
            >
              <Gift className="w-4 h-4 text-mejunje-amber" />
              <span>
                {isGiftWrapped
                  ? "✓ Preparar para regalo con tarjeta mecanografiada"
                  : "+ ¿Es un regalo? Sumar envoltorio y dedicatoria (sin cargo)"}
              </span>
            </button>

            {isGiftWrapped && (
              <div className="pt-2 border-t border-mejunje-border space-y-2 animate-in fade-in">
                <label className="font-typewriter text-[11px] text-mejunje-charcoal block font-bold uppercase tracking-wider">
                  Mensaje para la tarjeta de algodón:
                </label>
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Escribí aquí tu dedicatoria... (máx 150 caracteres)"
                  maxLength={150}
                  rows={2}
                  className="w-full bg-white border border-mejunje-border rounded-xl p-3 font-typewriter text-xs text-mejunje-ink focus:outline-none focus:border-mejunje-amber resize-none"
                />
                <span className="text-[10px] font-typewriter text-mejunje-muted text-right block">
                  {giftNote.length}/150 caracteres
                </span>
              </div>
            )}
          </div>

          {/* Action: Quantity + Add to Cart Button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Quantity */}
            <div className="flex items-center justify-between sm:justify-center border border-mejunje-border rounded-2xl bg-white px-4 py-3 shrink-0 gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-mejunje-muted hover:text-mejunje-charcoal transition-colors"
                aria-label="Disminuir"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-typewriter text-base font-bold text-mejunje-charcoal min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-mejunje-muted hover:text-mejunje-charcoal transition-colors"
                aria-label="Aumentar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Main CTA */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 px-8 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-sm font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>AGREGAR A MI MEJUNJE · {formatPrice(product.price * quantity)}</span>
            </button>
          </div>

        </div>
      </div>

      {/* COMBINA CON / COMPLETÁ EL RITUAL SECTION */}
      {companionProducts.length > 0 && (
        <div className="pt-12 border-t border-mejunje-border space-y-8">
          <div className="space-y-2">
            <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-terracotta font-bold">
              COMPLETÁ EL RITUAL
            </span>
            <h2 className="font-typewriter text-2xl sm:text-3xl font-bold tracking-wide text-mejunje-charcoal">
              COMBINA CON
            </h2>
            <p className="font-editorial italic text-sm text-mejunje-muted">
              Capas olfativas sugeridas por el atelier para potenciar la armonía del espacio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companionProducts.map((companion) => (
              <ProductCard key={companion.id} product={companion} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
