"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Flame, Heart, Feather, ArrowRight, ShieldCheck } from "lucide-react";

export default function AtelierPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Editorial Header */}
      <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-16 text-center max-w-4xl mx-auto space-y-4 shadow-sm">
        <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-amber font-bold block">
          MANIFIESTO DE MARCA
        </span>
        <h1 className="font-typewriter text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-mejunje-charcoal">
          EL ATELIER DE BUENOS AIRES
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-mejunje-muted leading-relaxed max-w-2xl mx-auto">
          “mezcla, experimentación, memoria, materia, aroma, historias, botánica, bohemia y belleza imperfecta.”
        </p>
      </div>

      {/* Origin Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="font-typewriter text-xs uppercase tracking-[0.25em] text-mejunje-terracotta font-bold">
            EL ORIGEN
          </span>
          <h2 className="font-typewriter text-3xl font-bold text-mejunje-charcoal leading-tight">
            Nacidos en las tardes lentas del Río de la Plata.
          </h2>
          <div className="space-y-4 font-sans text-sm text-mejunje-ink leading-relaxed">
            <p>
              MEJUNJE surge de la necesidad de rescatar la artesanía aromática frente a la homogeneización de las fragancias industriales. En nuestro taller porteño, cada fórmula se ensaya con paciencia de alquimista: combinamos extractos botánicos puros, maderas nobles y resinas aromáticas hasta encontrar ese acorde irrepetible.
            </p>
            <p>
              La palabra <em>mejunje</em> remite a la mezcla popular, al preparado casero, a la poción que la abuela guardaba en un frasco de vidrio en la alacena. Honramos esa herencia con un diseño contemporáneo, editorial y sin pretensiones snob.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-mejunje-border rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-muted font-bold block">
            NUESTRA FILOSOFÍA EN 4 PRINCIPIOS
          </span>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="font-typewriter text-sm font-bold text-mejunje-amber">01</span>
              <div>
                <strong className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                  CERO PARAFINA, CERO DERIVADOS PETROLEROS
                </strong>
                <p className="font-sans text-xs text-mejunje-muted mt-0.5">
                  Utilizamos exclusivamente cera de soja vegetal 100% biodegradable de bajo punto de fusión.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-typewriter text-sm font-bold text-mejunje-sageDark">02</span>
              <div>
                <strong className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                  PABILOS DE MADERA DE MANEJO SOSTENIBLE
                </strong>
                <p className="font-sans text-xs text-mejunje-muted mt-0.5">
                  El pabilo de madera aporta una llama ancha y uniforme que produce un sutil sonido de chimenea.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-typewriter text-sm font-bold text-mejunje-terracotta">03</span>
              <div>
                <strong className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                  FRASCOS DE VIDRIO ÁMBAR ETERNOS
                </strong>
                <p className="font-sans text-xs text-mejunje-muted mt-0.5">
                  Diseñados para limpiarse fácilmente con agua tibia y convertirse en floreros o especieros.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-typewriter text-sm font-bold text-mejunje-deepGreen">04</span>
              <div>
                <strong className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                  TIPOGRAFÍA MECANOGRAFIADA & ALGODÓN
                </strong>
                <p className="font-sans text-xs text-mejunje-muted mt-0.5">
                  Etiquetas numeradas a mano con tinta y papel libre de ácido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candle Care Ritual Guide */}
      <div id="proceso" className="bg-white border border-mejunje-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-amber font-bold">
            GUÍA DE USO
          </span>
          <h3 className="font-typewriter text-2xl sm:text-3xl font-bold text-mejunje-charcoal">
            EL RITUAL DEL ENCENDIDO PERFECTO
          </h3>
          <p className="font-editorial italic text-sm text-mejunje-muted">
            Cuidados sencillos para extender la vida útil de tus velas botánicas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-mejunje-paper/50 p-6 rounded-2xl border border-mejunje-border space-y-2">
            <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">1. La primer quema</span>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Dejá la vela encendida hasta que la cera se derrita en toda la superficie hasta los bordes del frasco (aprox. 2 horas). Esto previene el efecto túnel.
            </p>
          </div>

          <div className="bg-mejunje-paper/50 p-6 rounded-2xl border border-mejunje-border space-y-2">
            <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">2. El pabilo</span>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Antes de volver a encenderla, retirale con la yema de los dedos la ceniza quemada del extremo del pabilo de madera.
            </p>
          </div>

          <div className="bg-mejunje-paper/50 p-6 rounded-2xl border border-mejunje-border space-y-2">
            <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">3. Las corrientes</span>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Mantené la vela alejada de corrientes de aire directas para asegurar una llama estable y sin humo negro.
            </p>
          </div>

          <div className="bg-mejunje-paper/50 p-6 rounded-2xl border border-mejunje-border space-y-2">
            <span className="font-typewriter text-lg font-bold text-mejunje-charcoal">4. Reutilizar</span>
            <p className="font-sans text-xs text-mejunje-muted leading-relaxed">
              Cuando quede 1 cm de cera en la base, lavá el frasco con agua caliente y jabón. ¡Tu frasco ámbar está listo para una nueva vida!
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center space-y-4 pt-4">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-mejunje-charcoal hover:bg-mejunje-amber text-white font-typewriter text-xs font-bold tracking-widest transition-colors shadow-md"
        >
          <span>CONOCÉ LA COLECCIÓN DE BOTICA</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
