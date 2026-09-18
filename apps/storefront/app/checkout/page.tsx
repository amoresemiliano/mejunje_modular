"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/catalog";
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Sparkles, 
  ShoppingBag,
  Gift
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, total, subtotal, discountAmount, isFreeShipping, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
    address: "",
    apartment: "",
    city: "Ciudad Autónoma de Buenos Aires",
    province: "CABA",
    postalCode: "",
    shippingMethod: "moto-express", // 'moto-express' | 'correo-argentino' | 'retiro-atelier'
    paymentMethod: "mercadopago", // 'mercadopago' | 'transferencia' | 'tarjeta'
    orderNotes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeOrderNum = `MEJ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(fakeOrderNum);
    setIsSubmitted(true);
    clearCart();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-mejunje-sageLight border border-mejunje-sage text-mejunje-deepGreen flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-amber font-bold block">
            PEDIDO CONFIRMADO
          </span>
          <h1 className="font-typewriter text-3xl sm:text-4xl font-bold tracking-wide text-mejunje-charcoal">
            ¡GRACIAS POR TU COMPRA!
          </h1>
          <p className="font-editorial italic text-base text-mejunje-muted max-w-lg mx-auto">
            “tu orden fue ingresada en nuestro atelier. Ya estamos preparando tus aromas en papel crudo y lacre botánico.”
          </p>
        </div>

        <div className="bg-white border border-mejunje-border rounded-3xl p-8 text-left space-y-4 max-w-lg mx-auto shadow-sm font-typewriter text-xs">
          <div className="flex justify-between border-b border-mejunje-borderLight pb-3">
            <span className="text-mejunje-muted">NÚMERO DE ORDEN:</span>
            <strong className="text-mejunje-charcoal text-sm">{orderNumber}</strong>
          </div>
          <div className="flex justify-between border-b border-mejunje-borderLight pb-3">
            <span className="text-mejunje-muted">DESTINATARIO:</span>
            <span className="text-mejunje-charcoal font-bold">{formData.name}</span>
          </div>
          <div className="flex justify-between border-b border-mejunje-borderLight pb-3">
            <span className="text-mejunje-muted">DIRECCIÓN:</span>
            <span className="text-mejunje-charcoal">{formData.address}, {formData.city}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold text-mejunje-charcoal">
            <span>TOTAL PAGADO:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/tienda"
            className="inline-block px-8 py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-widest transition-colors shadow-md"
          >
            VOLVER AL ATELIER
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="font-typewriter text-2xl font-bold text-mejunje-charcoal">
          Tu carrito está vacío
        </h2>
        <p className="font-editorial italic text-sm text-mejunje-muted">
          Agregá algún aroma de botica antes de pasar por caja.
        </p>
        <Link
          href="/tienda"
          className="inline-block px-6 py-3 rounded-xl bg-mejunje-charcoal text-mejunje-paper font-typewriter text-xs font-bold"
        >
          EXPLORAR CATÁLOGO
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-mejunje-border pb-6 flex items-center justify-between">
        <div>
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-amber font-bold block mb-1">
            FINALIZAR PEDIDO
          </span>
          <h1 className="font-typewriter text-3xl font-bold tracking-wide text-mejunje-charcoal">
            CHECKOUT DEL ATELIER
          </h1>
        </div>
        <Link
          href="/carrito"
          className="font-typewriter text-xs font-bold text-mejunje-muted hover:text-mejunje-charcoal flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL CARRITO</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Form Inputs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Contact */}
          <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-typewriter text-sm font-bold uppercase tracking-widest text-mejunje-charcoal border-b border-mejunje-borderLight pb-3">
              1. INFORMACIÓN DE CONTACTO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Lucas Belgrano"
                  className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                />
              </div>

              <div>
                <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                  Email para confirmación *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tuemail@ejemplo.com"
                  className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                />
              </div>

              <div>
                <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54 11 ..."
                  className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping */}
          <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-typewriter text-sm font-bold uppercase tracking-widest text-mejunje-charcoal border-b border-mejunje-borderLight pb-3">
              2. DIRECCIÓN DE ENTREGA
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                    Calle y Número *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ej. Thames 1850"
                    className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
                <div>
                  <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                    Piso / Depto
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="3B"
                    className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
                <div>
                  <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                    Provincia *
                  </label>
                  <input
                    type="text"
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
                <div>
                  <label className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-muted block mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="C1414"
                    className="w-full px-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal focus:outline-none focus:border-mejunje-amber"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white border border-mejunje-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-typewriter text-sm font-bold uppercase tracking-widest text-mejunje-charcoal border-b border-mejunje-borderLight pb-3">
              3. MÉTODO DE PAGO
            </h3>
            
            <div className="space-y-3">
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === "mercadopago"
                    ? "bg-mejunje-paper border-mejunje-amber ring-1 ring-mejunje-amber"
                    : "bg-white border-mejunje-border hover:border-mejunje-amber"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mercadopago"
                    checked={formData.paymentMethod === "mercadopago"}
                    onChange={handleChange}
                    className="text-mejunje-amber focus:ring-mejunje-amber"
                  />
                  <div>
                    <strong className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                      MERCADO PAGO (Tarjetas de crédito, débito, dinero en cuenta)
                    </strong>
                    <span className="font-sans text-[11px] text-mejunje-muted">
                      Hasta 3 cuotas sin interés con tarjetas bancarias
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-mejunje-muted" />
              </label>

              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === "transferencia"
                    ? "bg-mejunje-paper border-mejunje-amber ring-1 ring-mejunje-amber"
                    : "bg-white border-mejunje-border hover:border-mejunje-amber"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transferencia"
                    checked={formData.paymentMethod === "transferencia"}
                    onChange={handleChange}
                    className="text-mejunje-amber focus:ring-mejunje-amber"
                  />
                  <div>
                    <strong className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                      TRANSFERENCIA BANCARIA DIRECTA (10% OFF EXTRA)
                    </strong>
                    <span className="font-sans text-[11px] text-mejunje-muted">
                      Te enviamos los datos bancarios por email para transferir
                    </span>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-mejunje-amber" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Confirm Button */}
        <div className="lg:col-span-5 bg-white border border-mejunje-border rounded-3xl p-8 shadow-sm space-y-6 sticky top-28">
          <h3 className="font-typewriter text-sm font-bold uppercase tracking-widest text-mejunje-charcoal border-b border-mejunje-border pb-3">
            DETALLE DEL PEDIDO
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs font-typewriter">
                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-mejunje-charcoal font-bold block truncate">
                    {item.quantity}x {item.name}
                  </span>
                  {item.isGiftWrapped && (
                    <span className="text-[10px] text-mejunje-amber flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Regalo preparado
                    </span>
                  )}
                </div>
                <span className="text-mejunje-charcoal font-bold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 font-typewriter text-xs border-t border-mejunje-borderLight pt-4">
            <div className="flex justify-between text-mejunje-muted">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-mejunje-deepGreen font-bold">
                <span>Descuento cupón ({appliedCoupon.code}):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-mejunje-muted">
              <span>Envío:</span>
              <span>{isFreeShipping ? "GRATIS" : formatPrice(4200)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-mejunje-charcoal pt-3 border-t border-mejunje-border">
              <span>TOTAL:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-widest transition-all duration-300 shadow-md active:scale-98"
          >
            CONFIRMAR Y FINALIZAR COMPRA
          </button>

          <div className="pt-2 flex items-center justify-center gap-2 text-center text-[11px] font-typewriter text-mejunje-muted">
            <ShieldCheck className="w-4 h-4 text-mejunje-deepGreen" />
            <span>Compra 100% protegida y garantizada</span>
          </div>
        </div>

      </form>

    </div>
  );
}
