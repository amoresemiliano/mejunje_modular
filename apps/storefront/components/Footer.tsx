"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Heart, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useCart();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Por favor ingresá un email válido");
      return;
    }
    setSubscribed(true);
    showToast("¡Te suscribiste a las Cartas del Atelier!");
  };

  return (
    <footer className="bg-mejunje-charcoal text-mejunje-paper pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section: Cartas del Atelier */}
        <div className="bg-white/5 rounded-3xl p-8 sm:p-12 border border-white/10 mb-16 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-mejunje-amber/10 blur-3xl pointer-events-none" />

          <div className="max-w-2xl">
            <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-amber block mb-2 font-bold">
              CARTAS DEL ATELIER
            </span>
            <h3 className="font-typewriter text-2xl sm:text-3xl font-bold tracking-wide text-white leading-tight mb-3">
              Aromas, pruebas, historias y novedades de MEJUNJE.
            </h3>
            <p className="font-editorial italic text-sm sm:text-base text-mejunje-paper/80 mb-6 leading-relaxed">
              Un correo mensual con notas de botánica, relatos porteños, lanzamientos de tirada limitada y descuentos exclusivos para la comunidad.
            </p>

            {subscribed ? (
              <div className="bg-mejunje-amber/20 border border-mejunje-amber/40 p-4 rounded-xl font-typewriter text-xs text-mejunje-amber tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>GRACIAS POR SUMARTE. REVISÁ TU CASILLA PARA TU CÓDIGO DE BIENVENIDA (15% OFF).</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mejunje-paper/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu correo electrónico..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-mejunje-paper/40 font-typewriter text-xs focus:outline-none focus:border-mejunje-amber transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-mejunje-amber hover:bg-mejunje-amberDark text-white font-typewriter text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-md shrink-0"
                >
                  <span>QUIERO RECIBIRLAS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Manifesto column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-typewriter text-3xl font-bold tracking-[0.3em] text-white">
                MEJUNJE
              </span>
              <span className="block font-typewriter text-[9px] tracking-[0.4em] text-mejunje-paper/60 uppercase">
                BOTICA · BUENOS AIRES
              </span>
            </Link>
            <p className="font-editorial italic text-sm text-mejunje-paper/70 leading-relaxed max-w-sm">
              “historias de vida envueltas en perfume.”
            </p>
            <p className="font-sans text-xs text-mejunje-paper/60 leading-relaxed max-w-sm">
              Velas de cera botánica vertidas a mano, difusores de ratán natural y brumas olfativas nacidas en el cruce entre la memoria, la botánica y el diseño porteño.
            </p>
            <div className="pt-2 font-typewriter text-[11px] text-mejunje-amber tracking-wider">
              Atelier en Colegiales / San Telmo · Hecho en Argentina
            </div>
          </div>

          {/* Column: Navegación */}
          <div>
            <h4 className="font-typewriter text-xs font-bold uppercase tracking-widest text-white mb-4">
              EXPLORAR
            </h4>
            <ul className="space-y-2.5 font-typewriter text-xs text-mejunje-paper/70">
              <li>
                <Link href="/tienda" className="hover:text-mejunje-amber transition-colors">
                  Tienda Completa
                </Link>
              </li>
              <li>
                <Link href="/aromas" className="hover:text-mejunje-amber transition-colors">
                  Familias Aromáticas
                </Link>
              </li>
              <li>
                <Link href="/colecciones" className="hover:text-mejunje-amber transition-colors">
                  Colecciones & Sets
                </Link>
              </li>
              <li>
                <Link href="/regalos" className="hover:text-mejunje-amber transition-colors">
                  Regalar Mejunje
                </Link>
              </li>
              <li>
                <Link href="/descubri-tu-aroma" className="hover:text-mejunje-amber transition-colors">
                  Quiz: Descubrí tu Aroma
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Atelier & Marca */}
          <div>
            <h4 className="font-typewriter text-xs font-bold uppercase tracking-widest text-white mb-4">
              EL ATELIER
            </h4>
            <ul className="space-y-2.5 font-typewriter text-xs text-mejunje-paper/70">
              <li>
                <Link href="/atelier" className="hover:text-mejunje-amber transition-colors">
                  Manifiesto & Historia
                </Link>
              </li>
              <li>
                <Link href="/aromas#botanicos" className="hover:text-mejunje-amber transition-colors">
                  Lo Que Hay Adentro
                </Link>
              </li>
              <li>
                <Link href="/atelier#proceso" className="hover:text-mejunje-amber transition-colors">
                  Cera de Soja & Pabilo
                </Link>
              </li>
              <li>
                <Link href="/atelier#sustentabilidad" className="hover:text-mejunje-amber transition-colors">
                  Frascos Reutilizables
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Ayuda & Contacto */}
          <div>
            <h4 className="font-typewriter text-xs font-bold uppercase tracking-widest text-white mb-4">
              AYUDA & CONTACTO
            </h4>
            <ul className="space-y-2.5 font-typewriter text-xs text-mejunje-paper/70">
              <li>
                <span className="text-white">WhatsApp:</span> +54 9 11 5824-3910
              </li>
              <li>
                <span className="text-white">Email:</span> hola@mejunje.ar
              </li>
              <li>
                <span className="text-white">Envíos:</span> Todo el país (Correo Argentino & Moto CABA)
              </li>
              <li className="pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-mejunje-amber hover:underline"
                >
                  @mejunje.ar ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-typewriter text-[11px] text-mejunje-paper/50">
          <div>
            © {new Date().getFullYear()} MEJUNJE AROMAS. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Buenos Aires, Argentina</span>
            <span>·</span>
            <span>Edición Web Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
