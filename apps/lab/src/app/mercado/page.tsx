'use client';

import React, { useState } from 'react';
import { useKamelo } from '@/context/KameloContext';
import { MarketBenchmark, MarketQuery } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import SectionHero from '@/components/SectionHero';
import {
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  BarChart3,
  Play,
  Search,
  Sparkles,
  SlidersHorizontal,
  Save,
  CheckSquare,
  Square,
  Package,
  FlaskConical,
  MapPin,
  Globe,
  Info,
  Copy,
  Trash2,
  Edit3,
  RotateCcw,
  ChevronDown,
  X,
} from '@/components/Icons';

export default function MercadoPage() {
  const {
    catalogProducts,
    ingredients,
    marketQueries,
    marketBenchmarks,
    addMarketQuery,
    updateMarketQuery,
    deleteMarketQuery,
    duplicateMarketQuery,
    toggleMarketQueryStatus,
    runMarketQueries,
    updateBenchmarkPrice,
    showToast,
  } = useKamelo();

  // ---------------------------------------------------------------------------
  // NEW MARKET QUERY STATE
  // ---------------------------------------------------------------------------
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedSupplyIds, setSelectedSupplyIds] = useState<string[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [supplySearchTerm, setSupplySearchTerm] = useState('');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSuppliesDropdownOpen, setIsSuppliesDropdownOpen] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Buenos Aires / CABA');
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'Mercado Libre',
    'Tiendas Online',
  ]);

  // Saving / Editing Query state
  const [queryName, setQueryName] = useState('');
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [lastSimulationSummary, setLastSimulationSummary] = useState<string | null>(null);

  // Category filter for benchmarks below
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  // ---------------------------------------------------------------------------
  // HANDLERS FOR SELECTION
  // ---------------------------------------------------------------------------
  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = () => {
    setSelectedProductIds(catalogProducts.map((p) => p.id));
  };

  const handleClearProducts = () => {
    setSelectedProductIds([]);
  };

  const handleToggleSupply = (id: string) => {
    setSelectedSupplyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllSupplies = () => {
    setSelectedSupplyIds(ingredients.map((ing) => ing.id));
  };

  const handleClearSupplies = () => {
    setSelectedSupplyIds([]);
  };

  const handleToggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  // Filtered products for dropdown search
  const filteredProducts = catalogProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Filtered supplies for dropdown search
  const filteredSupplies = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(supplySearchTerm.toLowerCase()) ||
    ing.category.toLowerCase().includes(supplySearchTerm.toLowerCase())
  );

  // Selected items objects
  const selectedProducts = catalogProducts.filter((p) => selectedProductIds.includes(p.id));
  const selectedSupplies = ingredients.filter((ing) => selectedSupplyIds.includes(ing.id));

  // ---------------------------------------------------------------------------
  // RUN QUERY SIMULATION
  // ---------------------------------------------------------------------------
  const handleExecuteCurrentQuery = () => {
    if (
      selectedProductIds.length === 0 &&
      selectedSupplyIds.length === 0 &&
      !freeText.trim()
    ) {
      showToast('Por favor seleccioná al menos una pieza, materia prima o ingresá un término.', 'warning');
      return;
    }

    setIsRunningSimulation(true);
    setTimeout(() => {
      runMarketQueries();
      setIsRunningSimulation(false);

      const itemsCount =
        selectedProducts.length + selectedSupplies.length + (freeText.trim() ? 1 : 0);
      setLastSimulationSummary(
        `Relevamiento procesado con éxito para ${itemsCount} elemento(s) en ${selectedZone}.`
      );
    }, 800);
  };

  // ---------------------------------------------------------------------------
  // SAVE / UPDATE QUERY
  // ---------------------------------------------------------------------------
  const handleSaveQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = queryName.trim() || `Consulta ${new Date().toLocaleDateString('es-AR')}`;

    if (editingQueryId) {
      updateMarketQuery(editingQueryId, {
        name: finalName,
        selectedProducts: selectedProducts.map((p) => p.name),
        selectedSupplies: selectedSupplies.map((s) => s.name),
        freeText,
        zone: selectedZone,
        sources: selectedSources,
      });
      setEditingQueryId(null);
    } else {
      addMarketQuery({
        name: finalName,
        selectedProducts: selectedProducts.map((p) => p.name),
        selectedSupplies: selectedSupplies.map((s) => s.name),
        freeText,
        zone: selectedZone,
        sources: selectedSources,
        status: 'Activo',
      });
    }

    setQueryName('');
  };

  // Populate form for editing
  const handleEditQuery = (query: MarketQuery) => {
    setEditingQueryId(query.id);
    setQueryName(query.name);
    setFreeText(query.freeText || '');
    if (query.zone) setSelectedZone(query.zone);
    if (query.sources) setSelectedSources(query.sources);

    // Map names back to IDs if match exists
    if (query.selectedProducts) {
      const pIds = catalogProducts
        .filter((p) => query.selectedProducts?.includes(p.name))
        .map((p) => p.id);
      setSelectedProductIds(pIds);
    }
    if (query.selectedSupplies) {
      const sIds = ingredients
        .filter((ing) => query.selectedSupplies?.includes(ing.name))
        .map((ing) => ing.id);
      setSelectedSupplyIds(sIds);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load / run saved query immediately
  const handleRunSavedQuery = (query: MarketQuery) => {
    handleEditQuery(query);
    setTimeout(() => {
      handleExecuteCurrentQuery();
    }, 200);
  };

  // Reset form
  const handleResetForm = () => {
    setSelectedProductIds([]);
    setSelectedSupplyIds([]);
    setFreeText('');
    setQueryName('');
    setEditingQueryId(null);
  };

  // Benchmark filters
  const filteredBenchmarks = marketBenchmarks.filter((b) => {
    return categoryFilter === 'Todas' || b.category === categoryFilter;
  });

  const opportunitiesCount = marketBenchmarks.filter((b) => b.status === 'Oportunidad Aumento').length;
  const competitiveCount = marketBenchmarks.filter((b) => b.status === 'Competitivo').length;

  return (
    <div className="space-y-10 animate-in fade-in pb-12 font-typewriter">
      {/* Header Banner */}
      <SectionHero
        title="Observatorio de Mercado & Benchmarking"
        subtitle="Monitoreo de precios de referencia, materias primas botánicas y posicionamiento competitivo en perfumería de autor en Buenos Aires y Argentina."
        badgeText="MEJUNJE · OBSERVATORIO & PRECIOS"
        badgeIcon={<TrendingUp className="w-3.5 h-3.5 text-mejunje-verdeseco" />}
        bgImage="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1600&q=80"
        noticeText="posicionamiento de atelier · márgenes saludables"
      >
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-mejunje-border text-xs shrink-0 shadow-xs">
          <Info className="w-4 h-4 text-mejunje-verdeseco shrink-0" />
          <span className="text-mejunje-carbon text-[10px] tracking-wider uppercase font-bold">
            Relevamiento activo en taller
          </span>
        </div>
      </SectionHero>

      {/* --------------------------------------------------------------------- */}
      {/* 1. BLOQUE NUEVA CONSULTA DE MERCADO */}
      {/* --------------------------------------------------------------------- */}
      <div className="atelier-sheet p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-mejunje-border">
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-mejunje-carbon flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-mejunje-verdeseco" />
              {editingQueryId ? 'Editar Consulta de Observatorio' : 'Nueva Consulta de Observatorio'}
            </h2>
            <p className="text-xs text-mejunje-secundario mt-0.5">
              Seleccioná las piezas del atelier o materias primas mediante selectores desplegables, o ingresá una búsqueda libre.
            </p>
          </div>

          {editingQueryId && (
            <button
              onClick={handleResetForm}
              className="text-xs text-mejunje-verdeprofundo hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT & CENTER COLS: Selection Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3.1 SELECTOR DESPLEGABLE DE PIEZAS */}
            <div className="space-y-3 bg-mejunje-papel p-5 rounded-2xl border border-mejunje-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-mejunje-carbon flex items-center gap-2">
                  <Package className="w-4 h-4 text-mejunje-verdeseco" /> Piezas del Catálogo ({selectedProducts.length} seleccionadas)
                </label>

                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectAllProducts}
                    className="text-mejunje-verdeprofundo font-bold hover:underline"
                  >
                    Seleccionar todas
                  </button>
                  <span className="text-mejunje-arena">·</span>
                  <button
                    type="button"
                    onClick={handleClearProducts}
                    className="text-mejunje-secundario hover:underline"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {/* Dropdown Box */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductsDropdownOpen(!isProductsDropdownOpen);
                    setIsSuppliesDropdownOpen(false);
                  }}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-4 py-3 text-left flex items-center justify-between text-xs hover:border-mejunje-verdeseco transition-colors shadow-xs"
                >
                  <span className="text-mejunje-carbon font-medium truncate">
                    {selectedProducts.length === 0
                      ? 'Desplegar para seleccionar piezas a monitorear...'
                      : `${selectedProducts.length} pieza(s) seleccionada(s)`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-mejunje-secundario transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProductsDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-mejunje-border rounded-2xl shadow-xl p-3 space-y-2 animate-in fade-in zoom-in-95">
                    {/* Search inside dropdown */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-mejunje-secundario absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {filteredProducts.length === 0 ? (
                        <p className="text-xs text-mejunje-secundario p-2 text-center">No se encontraron piezas</p>
                      ) : (
                        filteredProducts.map((p) => {
                          const isSelected = selectedProductIds.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => handleToggleProduct(p.id)}
                              className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-mejunje-papel border-mejunje-verdeseco text-mejunje-carbon font-bold'
                                  : 'bg-white border-transparent hover:bg-mejunje-papel/50 text-mejunje-carbon'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="text-mejunje-verdeseco">
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4 text-mejunje-secundario" />
                                  )}
                                </div>
                                <span className="truncate">{p.name}</span>
                              </div>
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-mejunje-papel text-mejunje-secundario border border-mejunje-border shrink-0">
                                {p.category}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Pills */}
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProducts.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-mejunje-border text-mejunje-verdeprofundo font-bold text-xs shadow-2xs"
                    >
                      <span>{p.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleProduct(p.id)}
                        className="text-mejunje-secundario hover:text-mejunje-rojo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 3.2 SELECTOR DESPLEGABLE DE MATERIAS PRIMAS */}
            <div className="space-y-3 bg-mejunje-papel p-5 rounded-2xl border border-mejunje-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-mejunje-carbon flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-mejunje-verdeseco" /> Materias Primas & Insumos ({selectedSupplies.length} seleccionadas)
                </label>

                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectAllSupplies}
                    className="text-mejunje-verdeprofundo font-bold hover:underline"
                  >
                    Seleccionar todas
                  </button>
                  <span className="text-mejunje-arena">·</span>
                  <button
                    type="button"
                    onClick={handleClearSupplies}
                    className="text-mejunje-secundario hover:underline"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {/* Dropdown Box */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuppliesDropdownOpen(!isSuppliesDropdownOpen);
                    setIsProductsDropdownOpen(false);
                  }}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-4 py-3 text-left flex items-center justify-between text-xs hover:border-mejunje-verdeseco transition-colors shadow-xs"
                >
                  <span className="text-mejunje-carbon font-medium truncate">
                    {selectedSupplies.length === 0
                      ? 'Desplegar para seleccionar materias primas...'
                      : `${selectedSupplies.length} materia(s) prima(s) seleccionada(s)`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-mejunje-secundario transition-transform ${isSuppliesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSuppliesDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-mejunje-border rounded-2xl shadow-xl p-3 space-y-2 animate-in fade-in zoom-in-95">
                    {/* Search inside dropdown */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-mejunje-secundario absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar por insumo o categoría..."
                        value={supplySearchTerm}
                        onChange={(e) => setSupplySearchTerm(e.target.value)}
                        className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {filteredSupplies.length === 0 ? (
                        <p className="text-xs text-mejunje-secundario p-2 text-center">No se encontraron insumos</p>
                      ) : (
                        filteredSupplies.map((ing) => {
                          const isSelected = selectedSupplyIds.includes(ing.id);
                          return (
                            <div
                              key={ing.id}
                              onClick={() => handleToggleSupply(ing.id)}
                              className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-mejunje-papel border-mejunje-verdeseco text-mejunje-carbon font-bold'
                                  : 'bg-white border-transparent hover:bg-mejunje-papel/50 text-mejunje-carbon'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="text-mejunje-verdeseco">
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4 text-mejunje-secundario" />
                                  )}
                                </div>
                                <span className="truncate">{ing.name}</span>
                              </div>
                              <span className="text-[9px] text-mejunje-secundario shrink-0">
                                {formatCurrency(ing.purchasePriceARS)}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Pills */}
              {selectedSupplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSupplies.map((ing) => (
                    <span
                      key={ing.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-mejunje-border text-mejunje-carbon font-bold text-xs shadow-2xs"
                    >
                      <span>{ing.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSupply(ing.id)}
                        className="text-mejunje-secundario hover:text-mejunje-rojo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 3.3 TEXTO LIBRE */}
            <div className="space-y-2 bg-mejunje-papel p-5 rounded-2xl border border-mejunje-border">
              <label className="text-xs font-bold uppercase tracking-wider text-mejunje-carbon block">
                Búsqueda Abierta de Mercado
              </label>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={3}
                placeholder={`Ejemplos:
- velas de cera de soja aromáticas frasco ámbar
- difusores de varillas ratán buenos aires
- esencias aromáticas para perfumería por mayor
- packaging botánico y cajas kraft`}
                className="w-full bg-white border border-mejunje-border rounded-xl p-3 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco leading-relaxed"
              />
              <p className="text-[11px] text-mejunje-secundario">
                Podés ingresar consultas libres adicionales para monitorear tendencias y nuevos competidores.
              </p>
            </div>

            {/* 3.4 UBICACIÓN Y FUENTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ubicación */}
              <div className="bg-mejunje-papel p-4 rounded-2xl border border-mejunje-border space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-mejunje-carbon flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-mejunje-verdeseco" /> Zona de Estudio
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-3 py-2 text-xs text-mejunje-carbon focus:outline-none"
                >
                  <option value="Buenos Aires / CABA">Buenos Aires / CABA</option>
                  <option value="Zona Norte GBA">Zona Norte GBA</option>
                  <option value="Buenos Aires Interior">Buenos Aires Interior</option>
                  <option value="Argentina Nacional">Argentina Nacional</option>
                </select>
              </div>

              {/* Fuentes */}
              <div className="bg-mejunje-papel p-4 rounded-2xl border border-mejunje-border space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-mejunje-carbon flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" /> Canales de Relevamiento
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Mercado Libre', 'Tiendas Online', 'Ateliers de Autor', 'Ferias de Diseño'].map((source) => {
                    const isChecked = selectedSources.includes(source);
                    return (
                      <button
                        type="button"
                        key={source}
                        onClick={() => handleToggleSource(source)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-white border-emerald-700 text-mejunje-carbon font-bold shadow-xs'
                            : 'bg-white/70 border-mejunje-border text-mejunje-secundario'
                        }`}
                      >
                        <span className="truncate">{source}</span>
                        {isChecked && <CheckCircle className="w-3 h-3 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: RESUMEN DE CONSULTA & ACCIONES */}
          <div className="bg-mejunje-papel p-6 rounded-3xl border border-mejunje-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-mejunje-carbon border-b border-mejunje-border pb-2">
                Alcance del Relevamiento:
              </h3>

              <div className="space-y-3 text-xs">
                {/* Selected Products */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold block">
                    Piezas Seleccionadas ({selectedProducts.length})
                  </span>
                  {selectedProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-md bg-white border border-mejunje-border text-mejunje-verdeprofundo font-bold text-[11px]"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-mejunje-secundario italic text-[11px]">Ningún producto seleccionado</span>
                  )}
                </div>

                {/* Selected Supplies */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold block">
                    Materias Primas ({selectedSupplies.length})
                  </span>
                  {selectedSupplies.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSupplies.map((ing) => (
                        <span
                          key={ing.id}
                          className="px-2 py-0.5 rounded-md bg-white border border-mejunje-border text-mejunje-carbon font-bold text-[11px]"
                        >
                          {ing.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-mejunje-secundario italic text-[11px]">Ningún insumo</span>
                  )}
                </div>

                {/* Free Text */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold block">
                    Búsqueda Abierta
                  </span>
                  {freeText.trim() ? (
                    <p className="bg-white p-2 rounded-lg border border-mejunje-border text-mejunje-carbon text-[11px] italic mt-1">
                      "{freeText.trim()}"
                    </p>
                  ) : (
                    <span className="text-mejunje-secundario italic text-[11px]">Sin texto libre</span>
                  )}
                </div>

                {/* Location */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold block">
                    Zona
                  </span>
                  <span className="font-bold text-mejunje-carbon">{selectedZone}</span>
                </div>

                {/* Sources */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold block">
                    Canales
                  </span>
                  <span className="text-mejunje-carbon font-bold">
                    {selectedSources.length > 0 ? selectedSources.join(', ') : 'Todos'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-mejunje-border">
              <button
                type="button"
                onClick={handleExecuteCurrentQuery}
                disabled={isRunningSimulation}
                className="w-full py-3 btn-mejunje-primary text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-95 disabled:opacity-60"
              >
                <Play className="w-4 h-4 fill-white" />
                {isRunningSimulation ? 'Consultando...' : 'Relevar Precios de Mercado'}
              </button>

              {/* SAVE QUERY BLOCK */}
              <form onSubmit={handleSaveQuery} className="space-y-2 pt-2 border-t border-mejunje-border">
                <label className="text-[10px] uppercase text-mejunje-carbon font-bold block">
                  Guardar en Archivo de Observatorio
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="Ej: Benchmark velas Buenos Aires"
                    className="flex-1 bg-white border border-mejunje-border rounded-xl px-2.5 py-1.5 text-xs text-mejunje-carbon focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 btn-mejunje-secondary text-xs rounded-xl flex items-center gap-1 shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                </div>
              </form>

              {lastSimulationSummary && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lastSimulationSummary}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. SECCIÓN CONSULTAS GUARDADAS */}
      {/* --------------------------------------------------------------------- */}
      <div className="atelier-sheet p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-mejunje-border">
          <h2 className="font-bold text-lg text-mejunje-carbon flex items-center gap-2">
            <Save className="w-5 h-5 text-mejunje-verdeseco" /> Consultas Guardadas
          </h2>
          <span className="text-xs text-mejunje-secundario">
            {marketQueries.length} consultas en archivo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketQueries.map((query) => {
            const hasProducts = query.selectedProducts && query.selectedProducts.length > 0;
            const hasSupplies = query.selectedSupplies && query.selectedSupplies.length > 0;

            return (
              <div
                key={query.id}
                className="p-5 rounded-2xl bg-mejunje-papel border border-mejunje-border space-y-3 hover:border-mejunje-verdeseco transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-mejunje-carbon">
                      {query.name}
                    </h3>

                    <button
                      onClick={() => toggleMarketQueryStatus(query.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        query.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-mejunje-papel text-mejunje-secundario border border-mejunje-border'
                      }`}
                    >
                      {query.status}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-mejunje-secundario">
                    {hasProducts && (
                      <div>
                        <strong className="text-mejunje-carbon font-bold">Piezas:</strong>{' '}
                        {query.selectedProducts?.join(', ')}
                      </div>
                    )}

                    {hasSupplies && (
                      <div>
                        <strong className="text-mejunje-carbon font-bold">Materias Primas:</strong>{' '}
                        {query.selectedSupplies?.join(', ')}
                      </div>
                    )}

                    {query.freeText && (
                      <div>
                        <strong className="text-mejunje-carbon font-bold">Búsqueda libre:</strong> "{query.freeText}"
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 text-mejunje-secundario">
                      <span>Zona: <strong className="text-mejunje-carbon font-bold">{query.zone || 'N/A'}</strong></span>
                      <span>Canales: <strong className="text-mejunje-carbon font-bold">{query.sources?.join(', ') || query.source || 'Varios'}</strong></span>
                    </div>

                    <div className="text-[10px] text-mejunje-secundario pt-1">
                      Último relevamiento: {query.lastRun || 'Pendiente'}
                    </div>
                  </div>
                </div>

                {/* Actions: Ejecutar, Editar, Duplicar, Eliminar */}
                <div className="flex items-center justify-between pt-3 border-t border-mejunje-border text-xs gap-2">
                  <button
                    onClick={() => handleRunSavedQuery(query)}
                    className="px-3 py-1.5 btn-mejunje-primary text-[11px] rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-white" /> Ejecutar
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditQuery(query)}
                      className="p-1.5 btn-mejunje-secondary rounded-lg"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicateMarketQuery(query.id)}
                      className="p-1.5 btn-mejunje-secondary rounded-lg"
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteMarketQuery(query.id)}
                      className="p-1.5 btn-mejunje-secondary text-mejunje-rojo hover:bg-rose-50 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 5. METRIC CARDS & COMPARATIVA DIRECTA BENCHMARKS */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="atelier-sheet p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase text-mejunje-secundario font-bold">Competitividad General</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-800 mt-2 flex items-center gap-2">
            {competitiveCount} Alineados <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs text-mejunje-secundario mt-1">Precios situados en el rango medio-alto de perfumería artesanal</p>
        </div>

        <div className="atelier-sheet p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase text-mejunje-secundario font-bold">Oportunidad de Captura</span>
          <div className="text-xl sm:text-2xl font-bold text-mejunje-verdeprofundo mt-2 flex items-center gap-2">
            {opportunitiesCount} Oportunidad(es) <ArrowUpRight className="w-5 h-5 text-mejunje-ambar" />
          </div>
          <p className="text-xs text-mejunje-secundario mt-1">Brecha positiva contra el promedio de marcas similares</p>
        </div>

        <div className="atelier-sheet p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase text-mejunje-secundario font-bold">Margen Comercial Promedio</span>
          <div className="text-xl sm:text-2xl font-bold text-mejunje-verdeprofundo mt-2">
            ~64.5%
          </div>
          <p className="text-xs text-mejunje-secundario mt-1">Calculado sobre materias primas e insumos directos</p>
        </div>
      </div>

      {/* Filter and Benchmark List */}
      <div className="atelier-sheet p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mejunje-border">
          <h2 className="font-bold text-lg text-mejunje-carbon flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-mejunje-verdeseco" /> Comparativa Directa de Precios
          </h2>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-mejunje-secundario" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-mejunje-border rounded-xl px-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Velas Botánicas">Velas Botánicas</option>
              <option value="Difusores de Ambiente">Difusores de Ambiente</option>
              <option value="Perfumes Finos">Perfumes Finos</option>
              <option value="Cosmética Natural">Cosmética Natural</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBenchmarks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-mejunje-papel border border-mejunje-border flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-mejunje-verdeseco transition-all"
            >
              <div className="space-y-1.5 lg:w-1/3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-mejunje-carbon">{item.productName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Oportunidad Aumento'
                        ? 'bg-amber-50 text-mejunje-ambar border border-amber-200'
                        : item.status === 'Competitivo'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-mejunje-rojo border border-rose-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-mejunje-secundario">
                  Categoría: <strong className="text-mejunje-carbon font-bold">{item.category}</strong> · Actualizado: {item.lastUpdated}
                </p>
                <div className="text-[11px] text-mejunje-secundario">
                  Margen Estimado Mejunje: <strong className="text-mejunje-verdeprofundo font-bold">{item.kameloMarginPercent}%</strong>
                </div>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs lg:w-1/2">
                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-secundario text-[9px] uppercase font-bold block">Precio Mejunje</span>
                  <span className="text-sm font-bold text-mejunje-verdeprofundo">
                    {formatCurrency(item.kameloPriceARS)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-secundario text-[9px] uppercase font-bold block">Prom. Mercado</span>
                  <span className="text-sm font-bold text-mejunje-carbon">
                    {formatCurrency(item.competitorAverageARS)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-secundario text-[9px] uppercase font-bold block">Mín. Mercado</span>
                  <span className="text-sm font-bold text-mejunje-secundario">
                    {formatCurrency(item.competitorMinARS)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-secundario text-[9px] uppercase font-bold block">Máx. Mercado</span>
                  <span className="text-sm font-bold text-mejunje-secundario">
                    {formatCurrency(item.competitorMaxARS)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 lg:w-1/6 justify-end">
                {item.status === 'Oportunidad Aumento' ? (
                  <button
                    onClick={() => {
                      const suggestedPrice = item.competitorAverageARS - 1500;
                      updateBenchmarkPrice(item.id, suggestedPrice);
                    }}
                    className="w-full px-3.5 py-2.5 btn-mejunje-primary text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Ajustar a Mercado
                  </button>
                ) : (
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Alineado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
