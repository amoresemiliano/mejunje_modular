"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS, ProductCategory, OlfactoryFamily, formatPrice } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TiendaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [selectedFamily, setSelectedFamily] = useState<string>("TODAS");
  const [selectedIntensity, setSelectedIntensity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "intensity">("featured");

  const categories = [
    { id: "TODOS", label: "TODOS LOS AROMAS" },
    { id: "VELAS", label: "VELAS" },
    { id: "DIFUSORES", label: "DIFUSORES" },
    { id: "HOME_SPRAYS", label: "HOME SPRAYS" },
    { id: "TEXTILES", label: "PERFUMES TEXTILES" },
    { id: "SETS", label: "SETS & BLENDS" },
  ];

  const families = [
    "TODAS",
    "Amaderado",
    "Cítrico",
    "Floral",
    "Verde & Herbal",
    "Especiado",
    "Gourmand",
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== "TODOS" && p.category !== selectedCategory) {
        return false;
      }
      // Family filter
      if (selectedFamily !== "TODAS" && p.aromaticFamily !== selectedFamily) {
        return false;
      }
      // Intensity filter
      if (selectedIntensity !== null && p.intensity !== selectedIntensity) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchNotes = p.mainNotes.some((n) => n.toLowerCase().includes(q));
        const matchStory = p.shortStory.toLowerCase().includes(q) || p.feelsLike.toLowerCase().includes(q);
        if (!matchName && !matchNotes && !matchStory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "intensity") return b.intensity - a.intensity;
      return a.isBestseller ? -1 : 1;
    });
  }, [selectedCategory, selectedFamily, selectedIntensity, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "TODOS" ||
    selectedFamily !== "TODAS" ||
    selectedIntensity !== null ||
    searchQuery.trim() !== "";

  const clearFilters = () => {
    setSelectedCategory("TODOS");
    setSelectedFamily("TODAS");
    setSelectedIntensity(null);
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Editorial */}
      <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-12 space-y-4 text-center max-w-4xl mx-auto shadow-sm">
        <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-mejunje-amber font-bold block">
          CATÁLOGO DEL ATELIER
        </span>
        <h1 className="font-typewriter text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-mejunje-charcoal">
          BOTICA & MEJUNJES
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-mejunje-muted max-w-xl mx-auto leading-relaxed">
          “velas de cera botánica, difusores de ratán natural y brumas olfativas para transformar la memoria de tus espacios.”
        </p>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl font-typewriter text-xs font-bold tracking-wider transition-all duration-300 shrink-0 border ${
                isSelected
                  ? "bg-mejunje-charcoal text-mejunje-paper border-mejunje-charcoal shadow-md"
                  : "bg-white text-mejunje-charcoal border-mejunje-border hover:border-mejunje-amber hover:bg-mejunje-paper"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white border border-mejunje-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search bar inside Tienda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mejunje-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por aroma, nota o sensación…"
              className="w-full pl-10 pr-4 py-2.5 bg-mejunje-paper border border-mejunje-border rounded-xl font-typewriter text-xs text-mejunje-charcoal placeholder-mejunje-muted focus:outline-none focus:border-mejunje-amber"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mejunje-muted hover:text-mejunje-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Family & Intensity selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Olfactory family dropdown */}
            <div className="flex items-center gap-1.5 font-typewriter text-xs text-mejunje-muted">
              <span>FAMILIA:</span>
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="bg-mejunje-paper border border-mejunje-border rounded-xl px-3 py-2 font-typewriter text-xs text-mejunje-charcoal font-bold focus:outline-none focus:border-mejunje-amber"
              >
                {families.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Intensity filter */}
            <div className="flex items-center gap-1.5 font-typewriter text-xs text-mejunje-muted">
              <span>INTENSIDAD:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() =>
                      setSelectedIntensity(selectedIntensity === lvl ? null : lvl)
                    }
                    className={`w-7 h-7 rounded-lg font-typewriter text-xs font-bold transition-all border ${
                      selectedIntensity === lvl
                        ? "bg-mejunje-amber text-white border-mejunje-amber"
                        : "bg-mejunje-paper border-mejunje-border text-mejunje-charcoal hover:border-mejunje-amber"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 font-typewriter text-xs text-mejunje-muted">
              <ArrowUpDown className="w-3.5 h-3.5 text-mejunje-amber" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-mejunje-paper border border-mejunje-border rounded-xl px-3 py-2 font-typewriter text-xs text-mejunje-charcoal font-bold focus:outline-none focus:border-mejunje-amber"
              >
                <option value="featured">Recomendados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="intensity">Mayor Intensidad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active filter badges & reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-mejunje-borderLight text-xs font-typewriter">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-mejunje-muted">Filtros activos:</span>
              {selectedCategory !== "TODOS" && (
                <span className="px-2.5 py-1 rounded-full bg-mejunje-paper border border-mejunje-border text-mejunje-charcoal font-bold flex items-center gap-1">
                  Cat: {selectedCategory}
                  <button onClick={() => setSelectedCategory("TODOS")}>
                    <X className="w-3 h-3 text-mejunje-muted hover:text-mejunje-clayRed" />
                  </button>
                </span>
              )}
              {selectedFamily !== "TODAS" && (
                <span className="px-2.5 py-1 rounded-full bg-mejunje-paper border border-mejunje-border text-mejunje-charcoal font-bold flex items-center gap-1">
                  Familia: {selectedFamily}
                  <button onClick={() => setSelectedFamily("TODAS")}>
                    <X className="w-3 h-3 text-mejunje-muted hover:text-mejunje-clayRed" />
                  </button>
                </span>
              )}
              {selectedIntensity !== null && (
                <span className="px-2.5 py-1 rounded-full bg-mejunje-paper border border-mejunje-border text-mejunje-charcoal font-bold flex items-center gap-1">
                  Nivel: {selectedIntensity}/5
                  <button onClick={() => setSelectedIntensity(null)}>
                    <X className="w-3 h-3 text-mejunje-muted hover:text-mejunje-clayRed" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-mejunje-paper border border-mejunje-border text-mejunje-charcoal font-bold flex items-center gap-1">
                  “{searchQuery}”
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3 text-mejunje-muted hover:text-mejunje-clayRed" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="text-mejunje-clayRed hover:underline font-bold text-[11px]"
            >
              LIMPIAR TODOS
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-mejunje-border rounded-3xl p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-mejunje-paper flex items-center justify-center text-mejunje-muted mx-auto border border-mejunje-border">
            <Filter className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="font-typewriter text-lg font-bold text-mejunje-charcoal">
            No se encontraron mejunjes con los filtros aplicados
          </h3>
          <p className="font-editorial italic text-sm text-mejunje-muted max-w-md mx-auto">
            Probá quitando algunos filtros o buscando por acordes botánicos generales.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 rounded-xl bg-mejunje-charcoal text-mejunje-paper hover:bg-mejunje-amber font-typewriter text-xs font-bold tracking-wider transition-colors"
          >
            RESTAURAR FILTROS
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-typewriter text-mejunje-muted px-2">
            <span>MOSTRANDO {filteredProducts.length} MEJUNJES</span>
            <span>ENVÍO A TODO EL PAÍS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Quiz Banner at the bottom */}
      <div className="bg-mejunje-paper border border-mejunje-border rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <span className="font-typewriter text-xs uppercase tracking-widest text-mejunje-terracotta font-bold block">
          ¿DUDAS CON LA ELECCIÓN?
        </span>
        <h3 className="font-typewriter text-2xl font-bold text-mejunje-charcoal">
          Dejá que nuestro quiz te recomiende tu aroma ideal
        </h3>
        <p className="font-editorial italic text-sm text-mejunje-muted max-w-lg mx-auto">
          En solo 4 preguntas analizamos tu espacio, gustos y estado de ánimo para darte una recomendación exacta de botica.
        </p>
        <div>
          <Link
            href="/descubri-tu-aroma"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-mejunje-charcoal hover:bg-mejunje-amber text-mejunje-paper font-typewriter text-xs font-bold tracking-wider transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-mejunje-amber" />
            <span>HACER EL QUIZ OLFATIVO</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
