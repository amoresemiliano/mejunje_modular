"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/catalog";
import { ProductVisual } from "@/components/ProductVisual";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  ArrowLeft 
} from "lucide-react";

export default function CarritoPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    toggleGiftWrap,
    setGiftNote,
    subtotal,
    discountAmount,
    total,
    isFreeShipping,
    amountForFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput("");
    }
  };

  const freeShippingPercent = Math.min(
    100,
    Math.round(((40000 - amountForFreeShipping) / 40000) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-mejunje-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-amber font-bold block mb-1">
            TU SELECCIÓN OLFATIVA
          </span>
          <h1 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-mejunje-charcoal">
            CARRITO DE COMPRAS
          </h1>
        </div>
        <Link
          href="/tienda"
          className="font-typewriter text-xs font-bold text-mejunje-muted hover:text-mejunje-amber flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SEGUIR EXPLORANDO LA TIENDA</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-mejunje-border rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-mejunje-paper flex items-center justify-center text-mejunje-muted mx-auto border border-mejunje-border">
            <ShoppingBag className="w-10 h-10 stroke-1" />
          </div>
          <div>
            <h2 className="font-typewriter text-xl font-bold text-mejunje-charcoal">
              Tu carrito está vacío
            </h2>
            <p className="font-editorial italic text-sm text-mejunje-muted mt-1 leading-relaxed">
              “un rincón sin perfume es una historia que todavía no comenzó a escribirse.”
            </p>
          </div>
          <Link
            href="/tienda"
            className="inline-block px-8 py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-widest transition-colors shadow-md"
          >
            EXPLORAR CATÁLOGO
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Alert banner */}
            <div className="bg-mejunje-paper border border-mejunje-border rounded-2xl p-5">
              <div className="flex justify-between items-center text-xs font-typewriter mb-2">
                <span className="text-mejunje-charcoal font-semibold">
                  {isFreeShipping ? (
                    <span className="text-mejunje-deepGreen flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> ¡Tenés envío bonificado sin costo en CABA y GBA!
                    </span>
                  ) : (
                    <span>
                      Sumá <strong className="text-mejunje-amber">{formatPrice(amountForFreeShipping)}</strong> más para envío bonificado
                    </span>
                  )}
                </span>
                <span className="text-mejunje-muted font-bold">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-2 bg-mejunje-borderLight rounded-full overflow-hidden">
                <div
                  className="h-full bg-mejunje-amber transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* List */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-mejunje-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-20 h-24 bg-mejunje-paper rounded-2xl p-1.5 flex items-center justify-center border border-mejunje-border shrink-0">
                    <ProductVisual
                      type={item.visualType || "candle"}
                      name={item.name}
                      accentColor={item.accentColor}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="font-typewriter text-[10px] text-mejunje-muted uppercase tracking-wider block">
                      {item.categoryLabel}
                    </span>
                    <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal truncate">
                      {item.name}
                    </h3>
                    <span className="font-typewriter text-xs text-mejunje-muted block">
                      Precio unitario: {formatPrice(item.price)}
                    </span>

                    {/* Gift note display/toggle */}
                    <button
                      onClick={() => toggleGiftWrap(item.id)}
                      className={`text-xs font-typewriter flex items-center gap-1 pt-1 ${
                        item.isGiftWrapped
                          ? "text-mejunje-amber font-bold"
                          : "text-mejunje-muted hover:text-mejunje-charcoal"
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>
                        {item.isGiftWrapped
                          ? "✓ Envuelto para regalo con dedicatoria"
                          : "+ Sumar empaque para regalo"}
                      </span>
                    </button>

                    {item.isGiftWrapped && (
                      <div className="pt-2">
                        <textarea
                          value={item.giftNote || ""}
                          onChange={(e) => setGiftNote(item.id, e.target.value)}
                          placeholder="Dedicatoria mecanografiada en tarjeta..."
                          rows={2}
                          maxLength={150}
                          className="w-full bg-mejunje-paper border border-mejunje-border rounded-xl p-2 font-typewriter text-xs text-mejunje-ink focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-mejunje-borderLight">
                  {/* Quantity */}
                  <div className="flex items-center border border-mejunje-border rounded-xl bg-mejunje-paper">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 text-mejunje-muted hover:text-mejunje-charcoal transition-colors"
                      aria-label="Disminuir"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-typewriter text-sm font-bold text-mejunje-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 text-mejunje-muted hover:text-mejunje-charcoal transition-colors"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <span className="font-typewriter text-base font-bold text-mejunje-charcoal min-w-[90px] text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-mejunje-muted hover:text-mejunje-clayRed transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary Box */}
          <div className="lg:col-span-4 bg-white border border-mejunje-border rounded-3xl p-8 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-typewriter text-base font-bold uppercase tracking-widest text-mejunje-charcoal border-b border-mejunje-border pb-3">
              RESUMEN DEL PEDIDO
            </h3>

            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-mejunje-sageLight border border-mejunje-sage/40 px-3.5 py-2.5 rounded-xl text-xs font-typewriter text-mejunje-deepGreen">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    <span><strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-mejunje-clayRed font-bold hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código de cupón"
                    className="flex-1 px-3 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal uppercase focus:outline-none focus:border-mejunje-amber"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-mejunje-charcoal text-white rounded-xl font-typewriter text-xs font-bold hover:bg-mejunje-amber transition-colors"
                  >
                    APLICAR
                  </button>
                </form>
              )}
            </div>

            {/* Price list */}
            <div className="space-y-2.5 font-typewriter text-xs border-t border-mejunje-borderLight pt-4">
              <div className="flex justify-between text-mejunje-muted">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} productos):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-mejunje-deepGreen font-bold">
                  <span>Descuento cupón:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-mejunje-muted">
                <span>Costo de envío estimado:</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-mejunje-deepGreen font-bold">GRATIS</span>
                  ) : (
                    formatPrice(4200)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-mejunje-charcoal pt-4 border-t border-mejunje-border">
                <span>TOTAL A PAGAR:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <span>CONTINUAR AL CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
