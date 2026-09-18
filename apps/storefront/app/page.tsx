"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PRODUCTS, 
  BUNDLES, 
  BOTANICALS, 
  MOODS, 
  MOMENTS, 
  REVIEWS, 
  formatPrice, 
  Product 
} from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { useCart } from "@/context/CartContext";
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Flame, 
  Check, 
  Heart, 
  Feather, 
  ShoppingBag,
  Layers,
  Leaf
} from "lucide-react";

export default function HomePage() {
  const { addBundleToCart } = useCart();
  const [selectedMood, setSelectedMood] = useState<string>("mood_calma");
  const [selectedMoment, setSelectedMoment] = useState<number>(0);

  const activeMoodObj = MOODS.find((m) => m.id === selectedMood) || MOODS[0];
  const activeMoodProducts = PRODUCTS.filter((p) =>
    activeMoodObj.matchingSlugs.includes(p.slug)
  );

  const activeMomentObj = MOMENTS[selectedMoment];
  const activeMomentProducts = PRODUCTS.filter((p) =>
    activeMomentObj.slugs.includes(p.slug)
  );

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO SECTION: EDITORIAL MANIFESTO */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-14 lg:p-20 overflow-hidden shadow-sm">
            
            {/* Background botanical aura decorations */}
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-mejunje-amber/15 blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-mejunje-sage/15 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Typography & Manifesto */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-mejunje-border font-typewriter text-[10px] tracking-[0.25em] text-mejunje-charcoal uppercase shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-mejunje-terracotta animate-pulse" />
                  <span>BOTICA & ATELIER OLFATIVO · BUENOS AIRES</span>
                </div>

                <div className="space-y-2">
                  <h1 className="font-typewriter text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.18em] text-mejunje-charcoal leading-tight">
                    MEJUNJE
                  </h1>
                  <p className="font-editorial italic text-2xl sm:text-3xl text-mejunje-charcoal/90 leading-snug">
                    “historias de vida envueltas en perfume.”
                  </p>
                </div>

                <p className="font-sans text-sm sm:text-base text-mejunje-muted leading-relaxed max-w-xl">
                  En nuestro atelier de Buenos Aires elaboramos mezclas botánicas en lotes pequeños. Cera de soja pura vertida a mano en vidrio ámbar, pabilos de madera que crepitan y formulaciones complejas pensadas para transformar la memoria de tus espacios.
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    href="/tienda"
                    className="px-8 py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md active:scale-98"
                  >
                    <span>DESCUBRIR MEJUNJES</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/descubri-tu-aroma"
                    className="px-7 py-4 rounded-2xl bg-white hover:bg-mejunje-paper border border-mejunje-border text-mejunje-charcoal font-typewriter text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Compass className="w-4 h-4 text-mejunje-terracotta" />
                    <span>ENCONTRAR MI AROMA</span>
                  </Link>
                </div>

                {/* Micro Badges */}
                <div className="pt-4 grid grid-cols-3 gap-3 border-t border-mejunje-border/70 font-typewriter text-[10px] text-mejunje-muted tracking-wider">
                  <div>
                    <strong className="block text-mejunje-charcoal font-bold">100% VEGETAL</strong>
                    <span>Cera de soja & ratán</span>
                  </div>
                  <div>
                    <strong className="block text-mejunje-charcoal font-bold">PABILO MADERA</strong>
                    <span>Crepitar cálido</span>
                  </div>
                  <div>
                    <strong className="block text-mejunje-charcoal font-bold">LOTE LIMITADO</strong>
                    <span>Vertido en atelier</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Artwork */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-white rounded-3xl border border-mejunje-border p-6 shadow-editorial flex flex-col items-center justify-center">
                  <div className="absolute top-4 left-4 font-typewriter text-[10px] tracking-widest text-mejunje-muted">
                    LOTE N° 26
                  </div>
                  <div className="absolute top-4 right-4 font-typewriter text-[10px] tracking-widest text-mejunje-amber font-bold">
                    EDICIÓN EMBLEMÁTICA
                  </div>

                  <div className="w-full h-64 my-auto">
                    <ProductVisual
                      type="candle"
                      name="Vela Ámbar & Madera"
                      notes={["ámbar", "cedro", "vainilla"]}
                      accentColor="#C87D38"
                    />
                  </div>

                  <div className="w-full text-center border-t border-mejunje-borderLight pt-3">
                    <span className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                      Vela Botánica Ámbar & Madera
                    </span>
                    <span className="font-editorial italic text-[11px] text-mejunje-muted">
                      “un living de madera después de la lluvia.”
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. DESCUBRIMIENTO POR ESTADO DE ÁNIMO: ¿QUÉ QUERÉS SENTIR? */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-amber font-bold">
              NAVEGACIÓN EMOCIONAL
            </span>
            <h2 className="font-typewriter text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-mejunje-charcoal">
              ¿QUÉ QUERÉS SENTIR?
            </h2>
            <p className="font-editorial italic text-base text-mejunje-muted">
              Elegí el estado de ánimo que deseás invocar y descubrí los acordes botánicos correspondientes.
            </p>
          </div>

          {/* Mood Filter Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`px-5 py-3 rounded-2xl font-typewriter text-xs font-bold tracking-wider transition-all duration-300 shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? "bg-mejunje-charcoal text-mejunje-paper border-mejunje-charcoal shadow-md scale-105"
                      : "bg-white text-mejunje-charcoal border-mejunje-border hover:border-mejunje-amber hover:bg-mejunje-paper"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: mood.accentColor }}
                  />
                  <span>{mood.title}</span>
                </button>
              );
            })}
          </div>

          {/* Mood Editorial Quote Box */}
          <div className="bg-mejunje-paper/80 border border-mejunje-border rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto transition-all">
            <span className="font-typewriter text-[11px] tracking-widest text-mejunje-muted uppercase block mb-1">
              ATMÓSFERA SELECCIONADA: {activeMoodObj.title}
            </span>
            <p className="font-editorial italic text-lg sm:text-xl text-mejunje-charcoal font-medium">
              “{activeMoodObj.quote}”
            </p>
            <span className="font-sans text-xs text-mejunje-muted block mt-2">
              {activeMoodObj.subtitle}
            </span>
          </div>

          {/* Products for this Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMoodProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 font-typewriter text-xs font-bold text-mejunje-charcoal hover:text-mejunje-amber transition-colors border-b border-mejunje-charcoal pb-1"
            >
              <span>VER TODOS LOS AROMAS EN LA TIENDA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. COMPRAR POR MOMENTO */}
      <section className="bg-white border-y border-mejunje-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-terracotta font-bold block mb-1">
                RITUALES DE LA CASA
              </span>
              <h2 className="font-typewriter text-2xl sm:text-3xl font-bold tracking-wide text-mejunje-charcoal">
                COMPRAR POR MOMENTO
              </h2>
            </div>
            <p className="font-editorial italic text-sm text-mejunje-muted max-w-md">
              Aromas pensados para acompañar tus pequeños actos cotidianos.
            </p>
          </div>

          {/* Moments Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {MOMENTS.map((moment, idx) => {
              const isSelected = selectedMoment === idx;
              return (
                <button
                  key={moment.id}
                  onClick={() => setSelectedMoment(idx)}
                  className={`px-4 py-2.5 rounded-xl font-typewriter text-xs tracking-wider transition-all shrink-0 border ${
                    isSelected
                      ? "bg-mejunje-amber text-white border-mejunje-amber font-bold shadow-sm"
                      : "bg-mejunje-paper text-mejunje-charcoal border-mejunje-border hover:border-mejunje-amber"
                  }`}
                >
                  {moment.title}
                </button>
              );
            })}
          </div>

          {/* Active Moment Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-mejunje-paper/40 p-6 sm:p-8 rounded-3xl border border-mejunje-border">
            <div className="lg:col-span-4 space-y-4">
              <span className="font-typewriter text-xs tracking-widest text-mejunje-amber uppercase font-bold block">
                MOMENTO RECOMENDADO
              </span>
              <h3 className="font-typewriter text-2xl font-bold text-mejunje-charcoal">
                {activeMomentObj.title}
              </h3>
              <p className="font-editorial italic text-base text-mejunje-muted leading-relaxed">
                “{activeMomentObj.description}”
              </p>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 font-typewriter text-xs font-bold text-mejunje-charcoal hover:text-mejunje-amber transition-colors"
              >
                <span>EXPLORAR CATÁLOGO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeMomentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CATALOG PREVIEWS */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-mejunje-border pb-4">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-amber font-bold">
                SELECCIÓN DE AUTOR
              </span>
              <h2 className="font-typewriter text-2xl sm:text-3xl font-bold tracking-wide text-mejunje-charcoal mt-1">
                MEJUNJES EMBLEMÁTICOS
              </h2>
            </div>
            <Link
              href="/tienda"
              className="font-typewriter text-xs font-bold text-mejunje-charcoal hover:text-mejunje-amber flex items-center gap-1 transition-colors"
            >
              <span>VER TODOS LOS PRODUCTOS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. BUNDLES & SETS: MEJUNJES ARMADOS */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-terracotta font-bold">
              RITUALES COMPLETOS
            </span>
            <h2 className="font-typewriter text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-mejunje-charcoal">
              MEJUNJES ARMADOS
            </h2>
            <p className="font-editorial italic text-base text-mejunje-muted">
              Combinaciones pensadas por nuestros alquimistas para capas olfativas armónicas con beneficio exclusivo de atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white border border-mejunje-border rounded-3xl p-7 shadow-sm hover:shadow-cardHover transition-all flex flex-col justify-between relative group"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="font-typewriter text-[10px] font-bold px-3 py-1 rounded-full bg-mejunje-amber text-white tracking-wider">
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

                  <p className="font-sans text-xs text-mejunje-ink mt-4 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Checklist of included items */}
                  <div className="mt-5 pt-4 border-t border-mejunje-borderLight space-y-2">
                    <span className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block">
                      INCLUYE:
                    </span>
                    {bundle.productsIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-sans text-mejunje-charcoal">
                        <Check className="w-3.5 h-3.5 text-mejunje-deepGreen shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Add */}
                <div className="mt-6 pt-5 border-t border-mejunje-border flex items-center justify-between">
                  <div>
                    <span className="block font-typewriter text-[10px] text-mejunje-muted line-through">
                      {formatPrice(bundle.originalPrice)}
                    </span>
                    <span className="font-typewriter text-xl font-bold text-mejunje-charcoal">
                      {formatPrice(bundle.bundlePrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => addBundleToCart(bundle)}
                    className="px-5 py-3 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>SUMAR SET</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTÁNICOS: LO QUE HAY ADENTRO */}
      <section className="bg-mejunje-paper/50 border-y border-mejunje-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-deepGreen font-bold">
              PUREZA VEGETAL
            </span>
            <h2 className="font-typewriter text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-mejunje-charcoal">
              LO QUE HAY ADENTRO
            </h2>
            <p className="font-editorial italic text-base text-mejunje-muted">
              Aceites esenciales puros, resinas ancestrales e hidrolatos destilados sin sintéticos pesados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOTANICALS.map((botanical) => (
              <div
                key={botanical.id}
                className="bg-white border border-mejunje-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-typewriter text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-mejunje-paper text-mejunje-muted border border-mejunje-borderLight">
                      {botanical.family}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: botanical.accentColor }}
                    />
                  </div>

                  <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal">
                    {botanical.name}
                  </h3>
                  <p className="font-typewriter text-[10px] text-mejunje-muted italic">
                    {botanical.latinName}
                  </p>

                  <p className="font-sans text-xs text-mejunje-ink mt-3 leading-relaxed">
                    {botanical.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-mejunje-borderLight">
                  <span className="font-typewriter text-[10px] font-bold text-mejunje-charcoal block uppercase tracking-wider mb-1">
                    BENEFICIO:
                  </span>
                  <p className="font-sans text-xs text-mejunje-muted">
                    {botanical.benefits}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/aromas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-mejunje-border font-typewriter text-xs font-bold text-mejunje-charcoal hover:border-mejunje-amber hover:text-mejunje-amber transition-colors shadow-sm"
            >
              <Leaf className="w-4 h-4 text-mejunje-deepGreen" />
              <span>EXPLORAR EL UNIVERSO BOTÁNICO COMPLETO</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE QUIZ TEASER BANNER */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-mejunje-charcoal text-mejunje-paper rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-mejunje-amber/15 to-transparent pointer-events-none" />

            <div className="relative max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-mejunje-amber font-typewriter text-[10px] tracking-widest uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>EXPERIENCIA GUIADA · 4 PREGUNTAS</span>
              </div>

              <h2 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-white leading-tight">
                Descubrí tu mejunje ideal según tu espacio y emoción.
              </h2>

              <p className="font-editorial italic text-base sm:text-lg text-mejunje-paper/80 leading-relaxed">
                Respondé 4 preguntas breves sobre tus rincones favoritos, intensidad y sensaciones para obtener tu perfil olfativo personalizado con recomendación directa.
              </p>

              <div>
                <Link
                  href="/descubri-tu-aroma"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-mejunje-amber hover:bg-mejunje-amberDark text-white font-typewriter text-xs font-bold tracking-widest transition-all duration-300 shadow-lg active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>COMENZAR EL QUIZ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GIFTING STUDIO PROMO */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-12">
            <div className="lg:col-span-7 space-y-5">
              <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-terracotta font-bold">
                EXPERIENCIA DE REGALO
              </span>
              <h2 className="font-typewriter text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-mejunje-charcoal">
                Regalar Mejunje con mensaje a máquina.
              </h2>
              <p className="font-editorial italic text-base text-mejunje-muted leading-relaxed">
                Elegí la ocasión, el aroma y dejanos escribir tu mensaje en nuestra máquina de escribir vintage sobre papel de algodón de 300g, cerrado con sello de lacre botánico.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Cumpleaños", "Casa Nueva", "Gracias", "Pareja", "Amiga", "Empresa"].map((occ) => (
                  <span
                    key={occ}
                    className="px-3 py-1 bg-white border border-mejunje-border rounded-lg font-typewriter text-xs text-mejunje-charcoal"
                  >
                    {occ}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/regalos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-wider transition-colors shadow-sm"
                >
                  <Gift className="w-4 h-4" />
                  <span>ARMAR UN REGALO PERSONALIZADO</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-mejunje-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-mejunje-borderLight pb-3 flex justify-between items-center">
                <span className="font-typewriter text-[10px] text-mejunje-muted tracking-widest uppercase font-bold">
                  TARJETA EN PAPEL DE ALGODÓN
                </span>
                <span className="font-typewriter text-[10px] text-mejunje-amber font-bold">
                  LACRE SELLADO
                </span>
              </div>
              <div className="bg-mejunje-paper/60 p-5 rounded-xl border border-mejunje-border text-center space-y-2">
                <p className="font-typewriter text-xs text-mejunje-charcoal leading-relaxed font-bold">
                  “Que este aroma llene tus días de luz, calma y rincones cálidos.”
                </p>
                <p className="font-editorial italic text-xs text-mejunje-muted">
                  — Mecanografiado con tinta negra sobre papel crudo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ATELIER STORY & CRAFTSMANSHIP */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-amber font-bold">
                EL ATELIER DE BUENOS AIRES
              </span>
              <h2 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-mejunje-charcoal leading-tight">
                Materia, memoria y alquimia botánica.
              </h2>
              <div className="space-y-4 font-sans text-sm text-mejunje-ink leading-relaxed">
                <p>
                  MEJUNJE nació de una convicción simple: los aromas no son decorados inertes, sino catalizadores de recuerdos. En una ciudad vibrante como Buenos Aires, crear un aroma es diseñar un refugio.
                </p>
                <p>
                  No usamos parafinas derivadas del petróleo ni fragancias industriales masivas. Cada una de nuestras velas se vierte en vidrio de botica ámbar resistente al calor, con pabilos de madera reforestada que aseguran un quemado uniforme y limpio.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/atelier"
                  className="inline-flex items-center gap-2 font-typewriter text-xs font-bold text-mejunje-charcoal hover:text-mejunje-amber transition-colors border-b border-mejunje-charcoal pb-1"
                >
                  <span>CONOCÉ NUESTRA HISTORIA & PROCESO</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-white border border-mejunje-border rounded-2xl p-6 space-y-3">
                <span className="font-typewriter text-2xl font-bold text-mejunje-amber">01</span>
                <h4 className="font-typewriter text-xs font-bold text-mejunje-charcoal">
                  CERA DE SOJA 100% PURA
                </h4>
                <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
                  Punto de fusión bajo que conserva intactas las propiedades de los aceites esenciales sin humos tóxicos.
                </p>
              </div>

              <div className="bg-white border border-mejunje-border rounded-2xl p-6 space-y-3">
                <span className="font-typewriter text-2xl font-bold text-mejunje-sageDark">02</span>
                <h4 className="font-typewriter text-xs font-bold text-mejunje-charcoal">
                  PABILO DE MADERA
                </h4>
                <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
                  Crepita suavemente emulando una pequeña chimenea y abre el abanico aromático de forma balanceada.
                </p>
              </div>

              <div className="bg-white border border-mejunje-border rounded-2xl p-6 space-y-3">
                <span className="font-typewriter text-2xl font-bold text-mejunje-terracotta">03</span>
                <h4 className="font-typewriter text-xs font-bold text-mejunje-charcoal">
                  VIDRIO ÁMBAR DE BOTICA
                </h4>
                <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
                  Protege los aceites botánicos de la luz solar directa y puede reutilizarse infinitas veces en tu hogar.
                </p>
              </div>

              <div className="bg-white border border-mejunje-border rounded-2xl p-6 space-y-3">
                <span className="font-typewriter text-2xl font-bold text-mejunje-deepGreen">04</span>
                <h4 className="font-typewriter text-xs font-bold text-mejunje-charcoal">
                  ROTULADO A MÁQUINA
                </h4>
                <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
                  Etiquetas de papel de algodón táctil con numeración de lote y notas olfativas legibles.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. EDITORIAL REVIEWS */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-amber font-bold">
              VOCES DEL ATELIER
            </span>
            <h2 className="font-typewriter text-2xl sm:text-3xl font-bold tracking-wide text-mejunje-charcoal">
              HISTORIAS EN PRIMERA PERSONA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-mejunje-paper/50 border border-mejunje-border rounded-2xl p-7 flex flex-col justify-between space-y-6 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex text-mejunje-amber gap-1 text-xs">
                    {"★".repeat(review.stars)}
                  </div>
                  <p className="font-editorial italic text-base text-mejunje-charcoal leading-relaxed">
                    “{review.quote}”
                  </p>
                </div>

                <div className="pt-4 border-t border-mejunje-border flex items-center justify-between text-xs font-typewriter">
                  <div>
                    <strong className="text-mejunje-charcoal block">{review.author}</strong>
                    <span className="text-mejunje-muted text-[11px]">{review.location}</span>
                  </div>
                  <span className="text-mejunje-amber text-[10px] uppercase font-bold">
                    {review.productName.split(" ")[0]} {review.productName.split(" ")[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
