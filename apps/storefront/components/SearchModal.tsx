"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, BOTANICALS, MOODS, formatPrice } from "@/data/catalog";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { ProductVisual } from "./ProductVisual";

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, addProductToCart } = useCart();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchFamily = p.aromaticFamily.toLowerCase().includes(q);
      const matchNotes = p.mainNotes.some((n) => n.toLowerCase().includes(q));
      const matchStory = p.shortStory.toLowerCase().includes(q) || p.feelsLike.toLowerCase().includes(q);
      const matchMoods = p.moodTags.some((m) => m.toLowerCase().includes(q));

      return matchName || matchCategory || matchFamily || matchNotes || matchStory || matchMoods;
    });
  }, [query]);

  const quickPills = [
    "bergamota",
    "cedro",
    "lavanda",
    "ámbar",
    "vainilla",
    "sándalo",
    "calma",
    "refugio",
    "velas",
    "difusores",
  ];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-mejunje-charcoal/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-16 sm:pt-24">
        <div className="relative w-full max-w-3xl bg-white border border-mejunje-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Search Input Bar */}
          <div className="p-6 border-b border-mejunje-border bg-mejunje-bg flex items-center gap-4">
            <Search className="w-6 h-6 text-mejunje-amber shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="probá con bergamota, madera, calma o lavanda…"
              autoFocus
              className="flex-1 bg-transparent border-none font-typewriter text-base sm:text-lg text-mejunje-charcoal placeholder-mejunje-muted focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-mejunje-muted hover:text-mejunje-charcoal p-1 font-typewriter text-xs"
              >
                LIMPIAR
              </button>
            )}
            <button
              onClick={closeSearch}
              className="p-2 rounded-xl text-mejunje-muted hover:text-mejunje-charcoal hover:bg-mejunje-paper transition-colors"
              aria-label="Cerrar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div className="px-6 py-3.5 bg-mejunje-paper/60 border-b border-mejunje-border flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="font-typewriter text-[10px] text-mejunje-muted uppercase tracking-wider shrink-0">
              POPULARES:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setQuery(pill)}
                className="px-3 py-1 rounded-full bg-white border border-mejunje-border text-mejunje-charcoal hover:border-mejunje-amber hover:text-mejunje-amber font-typewriter text-[11px] tracking-wide shrink-0 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="py-8 text-center space-y-6">
                <div>
                  <h4 className="font-typewriter text-xs font-bold uppercase tracking-[0.25em] text-mejunje-muted mb-3">
                    DESCUBRIMIENTO RÁPIDO
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                    {MOODS.slice(0, 4).map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => setQuery(mood.title.toLowerCase())}
                        className="p-3 rounded-2xl bg-mejunje-paper border border-mejunje-border hover:border-mejunje-amber text-left transition-all"
                      >
                        <span className="font-typewriter text-xs font-bold text-mejunje-charcoal block">
                          {mood.title}
                        </span>
                        <span className="font-editorial italic text-[11px] text-mejunje-muted line-clamp-1">
                          {mood.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-mejunje-borderLight">
                  <Link
                    href="/descubri-tu-aroma"
                    onClick={closeSearch}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mejunje-paper border border-mejunje-border font-typewriter text-xs text-mejunje-charcoal hover:text-mejunje-amber hover:border-mejunje-amber transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-mejunje-terracotta" />
                    <span>¿No sabés qué elegir? Hacé el Quiz de 4 pasos</span>
                  </Link>
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="font-typewriter text-sm text-mejunje-charcoal">
                  No encontramos mejunjes para “<strong>{query}</strong>”.
                </p>
                <p className="font-editorial italic text-xs text-mejunje-muted max-w-sm mx-auto">
                  Probá buscando por notas botánicas como <em>cedro, bergamota, lavanda, vainilla o ámbar</em>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-typewriter text-mejunje-muted pb-2 border-b border-mejunje-borderLight">
                  <span>RESULTADOS ({searchResults.length})</span>
                  <span>MEJUNJES ENCONTRADOS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-mejunje-border bg-mejunje-paper/30 hover:bg-mejunje-paper transition-all group"
                    >
                      <div className="w-16 h-20 bg-white rounded-xl p-1 flex items-center justify-center border border-mejunje-border shrink-0">
                        <ProductVisual
                          type={product.visualType}
                          name={product.name}
                          accentColor={product.accentColor}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-typewriter text-[9px] text-mejunje-muted uppercase block">
                          {product.categoryLabel} · {product.aromaticFamily}
                        </span>
                        <Link
                          href={`/producto/${product.slug}`}
                          onClick={closeSearch}
                          className="font-typewriter text-xs font-bold text-mejunje-charcoal group-hover:text-mejunje-amber transition-colors block truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="font-editorial italic text-[11px] text-mejunje-muted truncate mt-0.5">
                          {product.shortStory}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-mejunje-borderLight">
                          <span className="font-typewriter text-xs font-bold text-mejunje-charcoal">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            onClick={() => {
                              addProductToCart(product);
                              closeSearch();
                            }}
                            className="font-typewriter text-[10px] font-bold text-mejunje-amber hover:underline"
                          >
                            + AGREGAR
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-mejunje-paper border-t border-mejunje-border flex items-center justify-between text-xs font-typewriter text-mejunje-muted">
            <span>Presioná ESC para cerrar</span>
            <Link
              href="/tienda"
              onClick={closeSearch}
              className="text-mejunje-charcoal hover:text-mejunje-amber font-bold flex items-center gap-1"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
