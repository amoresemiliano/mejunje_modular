"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/catalog";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Gift, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Tag 
} from "lucide-react";
import { ProductVisual } from "./ProductVisual";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
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
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput("");
    }
  };

  const freeShippingPercent = Math.min(100, Math.round(((40000 - amountForFreeShipping) / 40000) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-mejunje-charcoal/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-mejunje-bg border-l border-mejunje-border shadow-drawer flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-mejunje-border bg-white flex items-center justify-between">
            <div>
              <span className="font-typewriter text-[10px] tracking-[0.3em] text-mejunje-amber uppercase block font-bold">
                TU MEJUNJE EN CONSTRUCCIÓN
              </span>
              <h2 className="font-typewriter text-lg font-bold text-mejunje-charcoal tracking-wide mt-0.5">
                CARRITO ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-mejunje-muted hover:text-mejunje-charcoal hover:bg-mejunje-paper transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping bar */}
          <div className="bg-mejunje-paper px-6 py-3 border-b border-mejunje-border">
            <div className="flex justify-between items-center text-xs font-typewriter mb-1.5">
              <span className="text-mejunje-charcoal font-semibold">
                {isFreeShipping ? (
                  <span className="text-mejunje-deepGreen flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Envío gratis alcanzado en CABA!
                  </span>
                ) : (
                  <span>
                    Te faltan <strong className="text-mejunje-amber">{formatPrice(amountForFreeShipping)}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="text-mejunje-muted">{freeShippingPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-mejunje-borderLight rounded-full overflow-hidden">
              <div
                className="h-full bg-mejunje-amber transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-mejunje-paper flex items-center justify-center text-mejunje-muted border border-mejunje-border">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h3 className="font-typewriter text-base font-bold text-mejunje-charcoal">
                    Tu frasco está vacío
                  </h3>
                  <p className="font-editorial italic text-xs text-mejunje-muted mt-1 leading-relaxed max-w-xs">
                    “un rincón sin perfume es una historia que todavía no comenzó a escribirse.”
                  </p>
                </div>
                <Link
                  href="/tienda"
                  onClick={closeCart}
                  className="px-6 py-3 rounded-xl bg-mejunje-charcoal text-mejunje-paper hover:bg-mejunje-amber font-typewriter text-xs font-bold tracking-widest transition-colors shadow-sm"
                >
                  EXPLORAR CATÁLOGO
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-mejunje-border rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative group"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Visual miniature */}
                    <div className="w-16 h-20 bg-mejunje-paper rounded-xl shrink-0 p-1 flex items-center justify-center border border-mejunje-borderLight overflow-hidden">
                      <ProductVisual
                        type={item.visualType || "candle"}
                        name={item.name}
                        accentColor={item.accentColor}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-muted">
                          {item.categoryLabel}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-mejunje-subtle hover:text-mejunje-clayRed transition-colors p-1"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-typewriter text-xs font-bold text-mejunje-charcoal truncate">
                        {item.name}
                      </h4>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="font-typewriter text-sm font-bold text-mejunje-charcoal">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        {/* Quantity selector */}
                        <div className="flex items-center border border-mejunje-border rounded-lg bg-mejunje-paper/60">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-mejunje-muted hover:text-mejunje-charcoal transition-colors"
                            aria-label="Disminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-typewriter text-xs font-bold text-mejunje-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-mejunje-muted hover:text-mejunje-charcoal transition-colors"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gift wrapping toggle */}
                  <div className="pt-2 border-t border-mejunje-borderLight flex flex-col gap-2">
                    <button
                      onClick={() => toggleGiftWrap(item.id)}
                      className={`flex items-center gap-1.5 text-[11px] font-typewriter tracking-wide transition-colors ${
                        item.isGiftWrapped
                          ? "text-mejunje-amber font-bold"
                          : "text-mejunje-muted hover:text-mejunje-charcoal"
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>
                        {item.isGiftWrapped
                          ? "✓ Envuelto para regalo (sin costo)"
                          : "+ Preparar para regalo con tarjeta"}
                      </span>
                    </button>

                    {item.isGiftWrapped && (
                      <div className="bg-mejunje-paper/80 p-2.5 rounded-xl border border-mejunje-border text-xs space-y-1.5 animate-in fade-in">
                        <label className="font-typewriter text-[10px] text-mejunje-charcoal font-bold block uppercase tracking-wider">
                          Dedicatoria escrita a máquina:
                        </label>
                        <textarea
                          value={item.giftNote || ""}
                          onChange={(e) => setGiftNote(item.id, e.target.value)}
                          placeholder="Escribí tu mensaje aquí... (máx 150 caracteres)"
                          maxLength={150}
                          rows={2}
                          className="w-full bg-white border border-mejunje-borderLight rounded-lg p-2 font-typewriter text-xs text-mejunje-ink focus:outline-none focus:border-mejunje-amber resize-none"
                        />
                        <span className="text-[9px] font-typewriter text-mejunje-subtle text-right block">
                          {(item.giftNote || "").length}/150 caracteres
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-mejunje-border bg-white space-y-4">
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-mejunje-sageLight border border-mejunje-sage/40 px-3 py-2 rounded-xl text-xs font-typewriter text-mejunje-deepGreen">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Cupón <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discountPercent}% OFF)</span>
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
                      placeholder="Cupón de descuento (e.g. MEJUNJE10)"
                      className="flex-1 px-3 py-2 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal uppercase focus:outline-none focus:border-mejunje-amber"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-mejunje-paper border border-mejunje-border hover:bg-mejunje-charcoal hover:text-white font-typewriter text-xs font-bold rounded-xl transition-colors"
                    >
                      APLICAR
                    </button>
                  </form>
                )}
              </div>

              {/* Subtotal summary */}
              <div className="space-y-1.5 font-typewriter text-xs border-t border-mejunje-borderLight pt-3">
                <div className="flex justify-between text-mejunje-muted">
                  <span>Subtotal productos:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-mejunje-deepGreen font-bold">
                    <span>Descuento ({appliedCoupon.discountPercent}%):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-mejunje-muted">
                  <span>Envío:</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-mejunje-deepGreen font-bold">GRATIS</span>
                    ) : (
                      formatPrice(4200)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-mejunje-charcoal pt-2 border-t border-mejunje-border">
                  <span>TOTAL ESTIMADO:</span>
                  <span className="text-mejunje-charcoal">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper text-center font-typewriter text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <span>INICIAR COMPRA</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/carrito"
                  onClick={closeCart}
                  className="w-full py-2.5 rounded-xl border border-mejunje-border text-mejunje-charcoal text-center font-typewriter text-xs font-semibold hover:bg-mejunje-paper transition-colors block"
                >
                  VER DETALLE COMPLETO DEL CARRITO
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
