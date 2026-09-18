"use client";

import React, { useState } from "react";
import { PRODUCTS, BUNDLES, formatPrice } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { Gift, Sparkles, Check, ArrowRight, Heart, Feather, ShoppingBag } from "lucide-react";
import { ProductVisual } from "@/components/ProductVisual";

export default function RegalosPage() {
  const { addProductToCart, addBundleToCart } = useCart();
  const [selectedOccasion, setSelectedOccasion] = useState("Cumpleaños");
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [giftNote, setGiftNote] = useState("Que este aroma te acompañe en tus momentos de calma e inspiración.");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");

  const occasions = [
    "Cumpleaños",
    "Casa Nueva / Mudanza",
    "Agradecimiento",
    "Amor & Pareja",
    "Mimo Personal",
    "Fin de Año / Corporativo",
  ];

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const handleAddGiftToCart = () => {
    const fullNote = `${recipientName ? `Para ${recipientName}:\n` : ""}${giftNote}${senderName ? `\n\nCon cariño, ${senderName}` : ""}`;
    addProductToCart(selectedProduct, 1, true, fullNote);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-3 shadow-sm">
        <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-terracotta font-bold block">
          EXPERIENCIA DE ATELIER
        </span>
        <h1 className="font-typewriter text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-mejunje-charcoal">
          REGALAR MEJUNJE
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-mejunje-muted leading-relaxed">
          “envolver un perfume con una carta mecanografiada en papel de algodón de 300g y sellada con lacre botánico.”
        </p>
      </div>

      {/* Interactive Gift Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Step 1 & 2: Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Occasion */}
          <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-mejunje-charcoal text-mejunje-paper font-typewriter text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal">
                ELEGÍ LA OCASIÓN
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {occasions.map((occ) => {
                const isSelected = selectedOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`p-3 rounded-xl border text-xs font-typewriter tracking-wide transition-all ${
                      isSelected
                        ? "bg-mejunje-charcoal text-mejunje-paper border-mejunje-charcoal font-bold shadow-sm"
                        : "bg-mejunje-paper text-mejunje-charcoal border-mejunje-border hover:border-mejunje-amber"
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Scent */}
          <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-mejunje-charcoal text-mejunje-paper font-typewriter text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal">
                ELEGÍ EL AROMA PRINCIPAL
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {PRODUCTS.slice(0, 6).map((p) => {
                const isSelected = selectedProductId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? "bg-mejunje-paper border-mejunje-amber shadow-sm ring-1 ring-mejunje-amber"
                        : "bg-white border-mejunje-border hover:border-mejunje-amber"
                    }`}
                  >
                    <div className="w-12 h-14 bg-mejunje-paper rounded-lg p-1 shrink-0 flex items-center justify-center border border-mejunje-borderLight">
                      <ProductVisual
                        type={p.visualType}
                        name={p.name}
                        accentColor={p.accentColor}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-typewriter text-[9px] text-mejunje-muted uppercase block truncate">
                        {p.categoryLabel}
                      </span>
                      <strong className="font-typewriter text-xs text-mejunje-charcoal block truncate">
                        {p.name}
                      </strong>
                      <span className="font-typewriter text-xs text-mejunje-amber font-bold block">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Typewriter Dedication */}
          <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-mejunje-charcoal text-mejunje-paper font-typewriter text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal">
                DEDICATORIA A MÁQUINA DE ESCRIBIR
              </h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-typewriter text-[10px] text-mejunje-muted block uppercase tracking-wider mb-1">
                    Nombre del destinatario:
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej. Sofía"
                    className="w-full px-3 py-2 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
                <div>
                  <label className="font-typewriter text-[10px] text-mejunje-muted block uppercase tracking-wider mb-1">
                    Tu nombre (Remitente):
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ej. Lucas"
                    className="w-full px-3 py-2 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
              </div>

              <div>
                <label className="font-typewriter text-[10px] text-mejunje-muted block uppercase tracking-wider mb-1">
                  Mensaje personalizado:
                </label>
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Escribí aquí tu mensaje..."
                  rows={3}
                  maxLength={180}
                  className="w-full p-3 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber resize-none"
                />
                <span className="text-[9px] font-typewriter text-mejunje-subtle text-right block">
                  {giftNote.length}/180 caracteres
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Typewriter Card Preview */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 shadow-cardHover space-y-6">
            
            <div className="flex items-center justify-between border-b border-mejunje-border pb-3">
              <span className="font-typewriter text-[10px] tracking-widest text-mejunje-muted uppercase font-bold">
                VISTA PREVIA DEL REGALO
              </span>
              <span className="font-typewriter text-[10px] text-mejunje-amber font-bold">
                INCLUIDO SIN CARGO
              </span>
            </div>

            {/* Cotton Paper Vintage Card Mockup */}
            <div className="bg-white border border-mejunje-border p-6 rounded-2xl shadow-inner relative space-y-4">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-mejunje-terracotta/20 border border-mejunje-terracotta/40 flex items-center justify-center">
                <span className="font-typewriter text-[9px] font-bold text-mejunje-terracotta">M</span>
              </div>

              <div className="space-y-1 font-typewriter text-xs text-mejunje-charcoal">
                <span className="text-[10px] text-mejunje-muted uppercase tracking-widest block">
                  OCASIÓN: {selectedOccasion.toUpperCase()}
                </span>
                {recipientName && (
                  <p className="font-bold pt-1">Querida/o {recipientName},</p>
                )}
                <p className="font-typewriter leading-relaxed pt-2 italic">
                  “{giftNote || "Tu mensaje mecanografiado aparecerá aquí..."}”
                </p>
                {senderName && (
                  <p className="text-right pt-3 font-bold">— {senderName}</p>
                )}
              </div>

              <div className="pt-4 border-t border-mejunje-borderLight flex items-center justify-between font-typewriter text-[9px] text-mejunje-subtle">
                <span>PAPEL DE ALGODÓN 300G</span>
                <span>LACRE BOTÁNICO</span>
              </div>
            </div>

            {/* Selected Product Summary */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-14 h-16 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center border border-mejunje-border">
                <ProductVisual
                  type={selectedProduct.visualType}
                  name={selectedProduct.name}
                  accentColor={selectedProduct.accentColor}
                />
              </div>
              <div>
                <span className="font-typewriter text-[9px] text-mejunje-muted uppercase block">
                  {selectedProduct.categoryLabel}
                </span>
                <strong className="font-typewriter text-xs text-mejunje-charcoal block">
                  {selectedProduct.name}
                </strong>
                <span className="font-typewriter text-sm font-bold text-mejunje-charcoal block">
                  {formatPrice(selectedProduct.price)}
                </span>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddGiftToCart}
              className="w-full py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <Gift className="w-4 h-4" />
              <span>AGREGAR REGALO AL CARRITO · {formatPrice(selectedProduct.price)}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-center text-xs font-typewriter text-mejunje-muted">
              <Check className="w-3.5 h-3.5 text-mejunje-deepGreen" />
              <span>Embalaje especial acolchado y aroma de cortesía</span>
            </div>
          </div>
        </div>

      </div>

      {/* Preset Gift Bundles */}
      <div className="pt-10 border-t border-mejunje-border space-y-8">
        <div className="text-center space-y-2">
          <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-terracotta font-bold">
            ¿PREFERÍS UN SET YA ARMADO?
          </span>
          <h2 className="font-typewriter text-2xl sm:text-3xl font-bold text-mejunje-charcoal">
            SETS DE REGALO DEL ATELIER
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-mejunje-border rounded-3xl p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="font-typewriter text-[9px] text-mejunje-muted uppercase tracking-widest block mb-1">
                  {bundle.tag}
                </span>
                <h4 className="font-typewriter text-lg font-bold text-mejunje-charcoal">
                  {bundle.title}
                </h4>
                <p className="font-editorial italic text-xs text-mejunje-muted mt-1">
                  {bundle.subtitle}
                </p>
                <p className="font-sans text-xs text-mejunje-ink mt-3">
                  {bundle.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-mejunje-border flex items-center justify-between">
                <div>
                  <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">
                    {formatPrice(bundle.bundlePrice)}
                  </span>
                </div>
                <button
                  onClick={() => addBundleToCart(bundle)}
                  className="px-4 py-2 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-white font-typewriter text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>SUMAR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
