'use client';

import React, { useState } from 'react';
import { useKamelo } from '@/context/KameloContext';
import { Formula, Ingredient, BatchTest, InsumoCategory } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import ConfirmDialog from '@/components/ConfirmDialog';
import SectionHero from '@/components/SectionHero';
import {
  FlaskConical,
  Sparkles,
  Calculator,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Copy,
  AlertTriangle,
  Send,
  BookOpen,
  CandleIcon,
  DropperIcon,
  ApothecaryBottleIcon,
  TagStringIcon,
  CheckCircle,
  ChevronRight,
  ArrowRight,
} from '@/components/Icons';

export default function LaboratorioPage() {
  const {
    formulas,
    ingredients,
    batchTests,
    suppliers,
    duplicateFormula,
    deleteFormula,
    addIngredient,
    deleteIngredient,
    addBatchTest,
    deleteBatchTest,
    approveBatchFormula,
    sendBatchToRequirements,
    setActiveModal,
    showToast,
  } = useKamelo();

  // Primary Sub-navigation Tabs: 'formulas' | 'insumos' | 'batches'
  const [activeTab, setActiveTab] = useState<'formulas' | 'insumos' | 'batches'>('formulas');

  // Mobile / responsive view mode for formulas: 'list' | 'detail' | 'both'
  const [mobileFormulaView, setMobileFormulaView] = useState<'list' | 'detail'>('detail');

  // ---------------------------------------------------------------------------
  // TAB 1: FORMULAS STATE & CALCULATOR
  // ---------------------------------------------------------------------------
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaCategoryFilter, setFormulaCategoryFilter] = useState<string>('Todas');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(formulas[0]?.id || '');
  const [batchProductionUnits, setBatchProductionUnits] = useState<number>(10); // 10 units default

  // Confirm dialog state for formulas
  const [formulaToDelete, setFormulaToDelete] = useState<Formula | null>(null);

  // Active formula details
  const activeFormula = formulas.find((f) => f.id === selectedFormulaId) || formulas[0];

  // Batch multiplier based on batch size or units
  const currentBatchGrams = (activeFormula?.batchSizeGrams || 2000) * (batchProductionUnits / 10);
  const baseBatchGrams = activeFormula?.batchSizeGrams || 2000;
  const multiplier = baseBatchGrams > 0 ? currentBatchGrams / baseBatchGrams : 1;

  const totalBatchCostARS =
    activeFormula?.ingredients.reduce((acc, item) => {
      const qty = item.quantity * multiplier;
      return acc + qty * item.unitCostARS;
    }, 0) || 0;

  const unitCostARS = batchProductionUnits > 0 ? totalBatchCostARS / batchProductionUnits : 0;

  // Formulation helper warnings / guidance
  const essenceIngredient = activeFormula?.ingredients.find((i) => i.category === 'Fragancias');
  const essencePercent = essenceIngredient ? essenceIngredient.percentage : 0;

  const additiveIngredient = activeFormula?.ingredients.find((i) => i.category === 'Aditivos');
  const additivePercent = additiveIngredient ? additiveIngredient.percentage : 0;

  let formulationWarning = '';
  if (activeFormula?.category === 'Vela') {
    if (essencePercent > 10) {
      formulationWarning =
        'La concentración aromática supera el 10% máximo recomendado. Puede generar túnel o combustión inestable.';
    } else if (essencePercent < 5 && essencePercent > 0) {
      formulationWarning =
        'La concentración es menor al 5% de referencia para velas aromáticas de alta difusión.';
    }
  }

  // Filtered Formulas
  const filteredFormulas = formulas.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(formulaSearch.toLowerCase());
    const matchesCat = formulaCategoryFilter === 'Todas' || f.category === formulaCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handler: Send Batch to Purchases
  const handleSendBatchToPurchases = () => {
    if (!activeFormula) return;

    const itemsToSend = activeFormula.ingredients.map((ing) => ({
      ingredientName: ing.ingredientName,
      requiredQty: Math.round(ing.quantity * multiplier),
      unit: ing.unit,
      estimatedCostARS: Math.round(ing.quantity * multiplier * ing.unitCostARS),
      supplierName: ing.supplierName,
    }));

    sendBatchToRequirements(itemsToSend, `${activeFormula.name} (${batchProductionUnits} unidades)`);
  };

  // ---------------------------------------------------------------------------
  // TAB 2: INSUMOS STATE
  // ---------------------------------------------------------------------------
  const [insumoSearch, setInsumoSearch] = useState('');
  const [insumoCategoryFilter, setInsumoCategoryFilter] = useState<string>('Todas');
  const [insumoToDelete, setInsumoToDelete] = useState<Ingredient | null>(null);
  const [editingInsumo, setEditingInsumo] = useState<Ingredient | null>(null);

  const [newInsumoForm, setNewInsumoForm] = useState({
    name: '',
    category: 'Fragancias' as InsumoCategory,
    unit: 'ml' as 'g' | 'kg' | 'ml' | 'l' | 'unid',
    purchasePriceARS: 120000,
    referenceQty: 1000,
    stock: 500,
    minStock: 200,
    supplierId: suppliers[0]?.id || '',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  });

  const filteredInsumos = ingredients.filter((ing) => {
    const matchesSearch =
      ing.name.toLowerCase().includes(insumoSearch.toLowerCase()) ||
      ing.supplierName.toLowerCase().includes(insumoSearch.toLowerCase());
    const matchesCat = insumoCategoryFilter === 'Todas' || ing.category === insumoCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSaveNewInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsumoForm.name.trim()) {
      showToast('Por favor ingrese el nombre de la materia prima.', 'warning');
      return;
    }

    const sup = suppliers.find((s) => s.id === newInsumoForm.supplierId) || suppliers[0];
    const unitCost =
      newInsumoForm.referenceQty > 0 ? newInsumoForm.purchasePriceARS / newInsumoForm.referenceQty : 0;

    addIngredient({
      name: newInsumoForm.name,
      category: newInsumoForm.category,
      unit: newInsumoForm.unit,
      purchasePriceARS: Number(newInsumoForm.purchasePriceARS),
      referenceQty: Number(newInsumoForm.referenceQty),
      unitCostARS: unitCost,
      stock: Number(newInsumoForm.stock),
      minStock: Number(newInsumoForm.minStock),
      supplierId: sup ? sup.id : 'sup-1',
      supplierName: sup ? sup.name : 'Proveedor General',
      imageUrl: newInsumoForm.imageUrl,
    });

    setEditingInsumo(null);
  };

  // ---------------------------------------------------------------------------
  // TAB 3: BATCHES / PRUEBAS STATE
  // ---------------------------------------------------------------------------
  const [batchToDelete, setBatchToDelete] = useState<BatchTest | null>(null);
  const [newBatchForm, setNewBatchForm] = useState({
    formulaId: formulas[0]?.id || '',
    qtyProduced: '10 unidades',
    ambientTemp: 21,
    meltingTemp: 64,
    fragranceTemp: 42,
    pouringTemp: 37,
    fragrancePercent: 7,
    ratingAppearance: 5,
    ratingColdAroma: 4,
    ratingHotAroma: 4,
    ratingBurn: 5,
    observations: 'Prueba sensorial en vaso de cristal esmerilado con pabilo de algodón puro encerado.',
  });

  const handleSaveNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const f = formulas.find((form) => form.id === newBatchForm.formulaId) || formulas[0];

    addBatchTest({
      formulaId: f.id,
      formulaName: f.name,
      version: f.version,
      date: new Date().toLocaleDateString('es-AR'),
      qtyProduced: newBatchForm.qtyProduced,
      status: 'Curado',
      ambientTemp: Number(newBatchForm.ambientTemp),
      meltingTemp: Number(newBatchForm.meltingTemp),
      fragranceTemp: Number(newBatchForm.fragranceTemp),
      pouringTemp: Number(newBatchForm.pouringTemp),
      fragrancePercent: Number(newBatchForm.fragrancePercent),
      ratingAppearance: Number(newBatchForm.ratingAppearance),
      ratingColdAroma: Number(newBatchForm.ratingColdAroma),
      ratingHotAroma: Number(newBatchForm.ratingHotAroma),
      ratingBurn: Number(newBatchForm.ratingBurn),
      observations: newBatchForm.observations,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12 font-typewriter max-w-full overflow-hidden">
      {/* Page Header */}
      <SectionHero
        title="Laboratorio Olfativo & Insumos Botánicos"
        subtitle="Archivo de formulación botánica de autor, calibración de notas olfativas, calculadora de lotes y control sensorial de curado y quemado en taller."
        badgeText="MEJUNJE · LABORATORIO & MATERIAS PRIMAS"
        badgeIcon={<FlaskConical className="w-3.5 h-3.5 text-mejunje-verdeseco" />}
        bgImage="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=80"
        noticeText="pesaje artesanal · proporciones exactas"
      >
        {/* Tab Selector Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-mejunje-border shadow-xs">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
              activeTab === 'formulas'
                ? 'bg-mejunje-verdeseco text-white shadow-xs font-bold'
                : 'text-mejunje-secundario hover:text-mejunje-carbon'
            }`}
          >
            Fórmulas ({formulas.length})
          </button>

          <button
            onClick={() => setActiveTab('insumos')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
              activeTab === 'insumos'
                ? 'bg-mejunje-verdeseco text-white shadow-xs font-bold'
                : 'text-mejunje-secundario hover:text-mejunje-carbon'
            }`}
          >
            Insumos ({ingredients.length})
          </button>

          <button
            onClick={() => setActiveTab('batches')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
              activeTab === 'batches'
                ? 'bg-mejunje-verdeseco text-white shadow-xs font-bold'
                : 'text-mejunje-secundario hover:text-mejunje-carbon'
            }`}
          >
            Batches ({batchTests.length})
          </button>
        </div>
      </SectionHero>

      {/* =================================================================== */}
      {/* TAB 1: FORMULAS & PRODUCTION CALCULATOR (DEFINITIVELY FIXED LAYOUT) */}
      {/* =================================================================== */}
      {activeTab === 'formulas' && (
        <div className="space-y-6 max-w-full">
          {/* Top Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-4 h-4 text-mejunje-secundario absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar fórmula de autor..."
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-mejunje-secundario" />
                <select
                  value={formulaCategoryFilter}
                  onChange={(e) => setFormulaCategoryFilter(e.target.value)}
                  className="bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none"
                >
                  <option value="Todas">Todas las categorías</option>
                  <option value="Vela">Velas Botánicas</option>
                  <option value="Difusor">Difusores</option>
                  <option value="Perfume textil">Perfumes Finos / Textil</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('formula')}
              className="px-4 py-2 btn-mejunje-primary text-xs rounded-xl flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto font-bold"
            >
              <Plus className="w-4 h-4" /> Crear Nueva Fórmula
            </button>
          </div>

          {/* Master / Detail Mobile Navigation Switcher (for small screens < xl) */}
          <div className="xl:hidden flex items-center justify-between bg-mejunje-papel p-2 rounded-xl border border-mejunje-border text-xs">
            <span className="text-mejunje-secundario text-[11px] font-bold">
              Vista activa:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileFormulaView('list')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  mobileFormulaView === 'list'
                    ? 'bg-white text-mejunje-verdeprofundo border border-mejunje-border shadow-xs'
                    : 'text-mejunje-secundario hover:text-mejunje-carbon'
                }`}
              >
                Lista ({filteredFormulas.length})
              </button>
              <button
                onClick={() => setMobileFormulaView('detail')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  mobileFormulaView === 'detail'
                    ? 'bg-white text-mejunje-verdeprofundo border border-mejunje-border shadow-xs'
                    : 'text-mejunje-secundario hover:text-mejunje-carbon'
                }`}
              >
                Fórmula Seleccionada
              </button>
            </div>
          </div>

          {/* Master-Detail Layout Container (Fixed Grid + Zero Overflow) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-w-0 max-w-full">
            {/* Left Column: Formulas List (Always visible on xl, conditional on mobile) */}
            <div
              className={`xl:col-span-4 min-w-0 max-w-full space-y-3 ${
                mobileFormulaView === 'detail' ? 'hidden xl:block' : 'block'
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario block font-bold">
                  Archivo de Fórmulas ({filteredFormulas.length})
                </span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredFormulas.map((f) => {
                  const isSelected = f.id === selectedFormulaId;
                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedFormulaId(f.id);
                        setMobileFormulaView('detail');
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-mejunje-papel text-mejunje-carbon border-mejunje-verdeseco shadow-xs ring-1 ring-mejunje-verdeseco/30'
                          : 'bg-white text-mejunje-carbon border-mejunje-border hover:border-mejunje-borderarena hover:bg-mejunje-papel/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold truncate ${
                            isSelected
                              ? 'bg-mejunje-verdeseco text-white'
                              : 'bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border'
                          }`}
                        >
                          {f.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                            isSelected
                              ? 'bg-white text-mejunje-verdeprofundo border border-mejunje-border'
                              : 'bg-mejunje-papel text-mejunje-secundario'
                          }`}
                        >
                          {f.version} · {f.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base mt-2.5 text-mejunje-carbon">
                        {f.name}
                      </h3>

                      <div className="mt-3 pt-3 border-t border-mejunje-border flex items-center justify-between text-xs">
                        <span className="text-[11px] text-mejunje-secundario">
                          Batch ref: {f.yieldSize}
                        </span>

                        <div className="flex items-center gap-1.5 text-mejunje-secundario">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateFormula(f.id);
                            }}
                            title="Duplicar fórmula"
                            className="p-1 hover:text-mejunje-verdeprofundo transition-colors rounded-lg hover:bg-mejunje-papel"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormulaToDelete(f);
                            }}
                            title="Eliminar fórmula"
                            className="p-1 hover:text-mejunje-rojo transition-colors rounded-lg hover:bg-mejunje-papel"
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

            {/* Right Column: Active Formula Workstation (Always visible on xl, conditional on mobile) */}
            {activeFormula && (
              <div
                className={`xl:col-span-8 min-w-0 max-w-full space-y-6 ${
                  mobileFormulaView === 'list' ? 'hidden xl:block' : 'block'
                }`}
              >
                <div className="atelier-sheet p-5 sm:p-7 space-y-6 min-w-0 max-w-full overflow-hidden">
                  {/* Active Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mejunje-border min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-mejunje-verdeprofundo font-bold">
                          {activeFormula.category}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          {activeFormula.status}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-mejunje-carbon truncate">
                        {activeFormula.name}
                      </h2>
                      {activeFormula.associatedProductName && (
                        <p className="text-xs text-mejunje-secundario mt-0.5 truncate">
                          Ficha comercial:{' '}
                          <strong className="text-mejunje-carbon font-bold">
                            {activeFormula.associatedProductName}
                          </strong>
                        </p>
                      )}
                    </div>

                    {/* Batch Production Unit Input */}
                    <div className="bg-mejunje-papel p-3 rounded-2xl border border-mejunje-border flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <Calculator className="w-5 h-5 text-mejunje-verdeseco shrink-0" />
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold">
                          Unidades a Producir
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={batchProductionUnits}
                          onChange={(e) =>
                            setBatchProductionUnits(Math.max(1, Number(e.target.value)))
                          }
                          className="w-20 bg-white border border-mejunje-border rounded-lg px-2 py-1 text-sm font-bold text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formulation Guidance */}
                  {activeFormula.category === 'Vela' && (
                    <div className="p-4 rounded-2xl bg-mejunje-papel border border-mejunje-border space-y-2 text-xs min-w-0 max-w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-mejunje-carbon flex items-center gap-1.5 uppercase tracking-wider">
                          <CandleIcon className="w-4 h-4 text-mejunje-verdeseco shrink-0" /> Dosificación de Taller: Vela de Soja
                        </span>
                        <span className="text-[10px] text-mejunje-secundario">
                          Ref: Esencia 5-8% | Mejorador 2-3%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-mejunje-secundario">
                        <span>
                          Esencia aromática actual:{' '}
                          <strong className="text-mejunje-carbon font-bold">
                            {essencePercent}%
                          </strong>
                        </span>
                        <span>
                          Aditivo de quemado actual:{' '}
                          <strong className="text-mejunje-carbon font-bold">
                            {additivePercent}%
                          </strong>
                        </span>
                      </div>
                      {formulationWarning && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-mejunje-ambar text-[11px] font-bold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-mejunje-ambar" />{' '}
                          <span>{formulationWarning}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Olfactory Pyramid Display */}
                  {(activeFormula.topNotes?.length ||
                    activeFormula.heartNotes?.length ||
                    activeFormula.baseNotes?.length) && (
                    <div className="min-w-0 max-w-full">
                      <h3 className="text-[11px] uppercase tracking-wider text-mejunje-secundario font-bold mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-mejunje-verdeseco shrink-0" /> Pirámide Olfativa (Notas de Autor)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0 max-w-full">
                        {/* Salida: Amber */}
                        <div className="p-3.5 rounded-2xl bg-[#FCF8EE] border border-mejunje-ambar/40 min-w-0">
                          <span className="text-[9px] uppercase tracking-widest text-mejunje-ambar font-bold block">
                            Salida (Primer Impacto)
                          </span>
                          <div className="mt-1 text-xs text-mejunje-carbon font-bold break-words">
                            {activeFormula.topNotes?.join(', ') || 'Bergamota, Mandarina'}
                          </div>
                        </div>

                        {/* Corazón: Terracotta */}
                        <div className="p-3.5 rounded-2xl bg-[#FAF2ED] border border-mejunje-terracota/40 min-w-0">
                          <span className="text-[9px] uppercase tracking-widest text-mejunje-terracota font-bold block">
                            Corazón (Cuerpo / Flor)
                          </span>
                          <div className="mt-1 text-xs text-mejunje-carbon font-bold break-words">
                            {activeFormula.heartNotes?.join(', ') || 'Rosa Damascena, Jazmín'}
                          </div>
                        </div>

                        {/* Fondo: Deep Green */}
                        <div className="p-3.5 rounded-2xl bg-[#F4F6F2] border border-mejunje-verdeprofundo/40 min-w-0">
                          <span className="text-[9px] uppercase tracking-widest text-mejunje-verdeprofundo font-bold block">
                            Fondo (Fijación / Madera)
                          </span>
                          <div className="mt-1 text-xs text-mejunje-carbon font-bold break-words">
                            {activeFormula.baseNotes?.join(', ') || 'Ámbar, Cedro, Vainilla'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingredients Table Container (Strict overflow protection) */}
                  <div className="min-w-0 max-w-full space-y-3">
                    <h3 className="text-[11px] uppercase tracking-wider text-mejunje-secundario font-bold">
                      Composición & Desglose para {batchProductionUnits} unidades (
                      {Math.round(currentBatchGrams)}g/ml totales)
                    </h3>
                    <div className="w-full max-w-full overflow-x-auto border border-mejunje-border rounded-2xl">
                      <table className="w-full text-left text-xs min-w-[460px]">
                        <thead className="bg-mejunje-papel text-mejunje-carbon text-[10px] uppercase tracking-wider border-b border-mejunje-border">
                          <tr>
                            <th className="p-3 font-bold">Materia Prima</th>
                            <th className="p-3 font-bold">Proveedor</th>
                            <th className="p-3 font-bold text-center">Proporción</th>
                            <th className="p-3 font-bold text-center">Cantidad Recalculada</th>
                            <th className="p-3 font-bold text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-mejunje-border bg-white">
                          {activeFormula.ingredients.map((item, idx) => {
                            const calculatedQty = Math.round(item.quantity * multiplier);
                            const subtotal = Math.round(calculatedQty * item.unitCostARS);
                            return (
                              <tr key={idx} className="hover:bg-mejunje-papel/40 transition-colors">
                                <td className="p-3 font-bold text-mejunje-carbon">
                                  {item.ingredientName}
                                </td>
                                <td className="p-3 text-mejunje-secundario text-[11px]">
                                  {item.supplierName || 'General'}
                                </td>
                                <td className="p-3 text-center text-mejunje-secundario">
                                  {item.percentage > 0 ? `${item.percentage}%` : 'Unid.'}
                                </td>
                                <td className="p-3 text-center font-bold text-mejunje-verdeprofundo">
                                  {calculatedQty} {item.unit}
                                </td>
                                <td className="p-3 text-right font-bold text-mejunje-carbon">
                                  {formatCurrency(subtotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary & Send to Purchases Bar */}
                  <div className="bg-mejunje-papel border border-mejunje-border text-mejunje-carbon p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs min-w-0 max-w-full">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold block">
                        Costo Total del Batch ({batchProductionUnits} unidades):
                      </span>
                      <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">
                        {formatCurrency(totalBatchCostARS)}
                      </div>
                      <p className="text-[11px] text-mejunje-secundario mt-0.5">
                        Costo unitario de producción:{' '}
                        <strong className="text-mejunje-carbon font-bold">
                          {formatCurrency(unitCostARS)}
                        </strong>
                      </p>
                    </div>

                    <button
                      onClick={handleSendBatchToPurchases}
                      className="px-5 py-2.5 btn-mejunje-primary text-xs rounded-xl flex items-center gap-2 shadow-xs shrink-0 self-stretch sm:self-auto justify-center active:scale-95 font-bold"
                    >
                      <Send className="w-4 h-4" /> Consolidar en Compras
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: INSUMOS CATALOG */}
      {/* =================================================================== */}
      {activeTab === 'insumos' && (
        <div className="space-y-6 max-w-full">
          {/* Top Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-4 h-4 text-mejunje-secundario absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar materia prima o proveedor..."
                  value={insumoSearch}
                  onChange={(e) => setInsumoSearch(e.target.value)}
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco"
                />
              </div>

              <select
                value={insumoCategoryFilter}
                onChange={(e) => setInsumoCategoryFilter(e.target.value)}
                className="bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-1.5 text-xs text-mejunje-carbon focus:outline-none"
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Ceras">Ceras</option>
                <option value="Fragancias">Fragancias</option>
                <option value="Aditivos">Aditivos</option>
                <option value="Pabilos">Pabilos</option>
                <option value="Envases">Envases</option>
                <option value="Tapas">Tapas</option>
                <option value="Packaging">Packaging</option>
                <option value="Etiquetas">Etiquetas</option>
                <option value="Alcoholes">Alcoholes</option>
                <option value="Bases">Bases</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <button
              onClick={() =>
                setEditingInsumo({
                  id: '',
                  name: '',
                  category: 'Fragancias',
                  unit: 'ml',
                  purchasePriceARS: 120000,
                  referenceQty: 1000,
                  unitCostARS: 120,
                  stock: 500,
                  minStock: 200,
                  supplierId: suppliers[0]?.id || '',
                  supplierName: suppliers[0]?.name || '',
                  lastUpdated: new Date().toLocaleDateString('es-AR'),
                  imageUrl:
                    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
                })
              }
              className="px-4 py-2 btn-mejunje-primary text-xs rounded-xl flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto font-bold"
            >
              <Plus className="w-4 h-4" /> Registrar Materia Prima
            </button>
          </div>

          {/* Insumos Table with Strict Overflow Containment */}
          <div className="atelier-sheet p-5 sm:p-6 max-w-full overflow-hidden">
            <div className="w-full max-w-full overflow-x-auto border border-mejunje-border rounded-2xl">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead className="bg-mejunje-papel text-mejunje-carbon text-[10px] uppercase tracking-wider border-b border-mejunje-border">
                  <tr>
                    <th className="p-3.5 font-bold">Materia Prima</th>
                    <th className="p-3.5 font-bold">Categoría</th>
                    <th className="p-3.5 font-bold">Proveedor</th>
                    <th className="p-3.5 font-bold text-right">Precio Compra</th>
                    <th className="p-3.5 font-bold text-right">Costo Unitario Calculado</th>
                    <th className="p-3.5 font-bold text-center">Stock Actual</th>
                    <th className="p-3.5 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mejunje-border bg-white">
                  {filteredInsumos.map((ing) => (
                    <tr key={ing.id} className="hover:bg-mejunje-papel/40 transition-colors">
                      <td className="p-3.5 font-bold text-mejunje-carbon flex items-center gap-3">
                        {ing.imageUrl && (
                          <img
                            src={ing.imageUrl}
                            alt={ing.name}
                            className="w-10 h-10 rounded-lg object-cover border border-mejunje-border shrink-0 shadow-xs"
                          />
                        )}
                        <span className="truncate">{ing.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
                          {ing.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-mejunje-secundario">{ing.supplierName}</td>
                      <td className="p-3.5 text-right font-medium text-mejunje-carbon">
                        {formatCurrency(ing.purchasePriceARS)} x {ing.referenceQty} {ing.unit}
                      </td>
                      <td className="p-3.5 text-right font-bold text-mejunje-verdeprofundo">
                        {formatCurrency(ing.unitCostARS)} /{' '}
                        {ing.unit === 'kg' ? 'g' : ing.unit === 'l' ? 'ml' : ing.unit}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ing.stock <= ing.minStock
                              ? 'bg-amber-50 text-mejunje-ambar border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {ing.stock} {ing.unit}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setInsumoToDelete(ing)}
                          className="p-1 text-mejunje-secundario hover:text-mejunje-rojo transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: BATCHES & LAB TESTS */}
      {/* =================================================================== */}
      {activeTab === 'batches' && (
        <div className="space-y-6 max-w-full">
          <div className="atelier-sheet p-5 sm:p-6 space-y-6 min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mejunje-border">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-mejunje-carbon">
                  Registrar Nuevo Batch de Prueba
                </h3>
                <p className="text-xs text-mejunje-secundario">
                  Control de temperaturas de vertido y evaluación sensorial de quemado
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSaveNewBatch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs min-w-0 max-w-full"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold mb-1">
                  Fórmula en Prueba
                </label>
                <select
                  value={newBatchForm.formulaId}
                  onChange={(e) =>
                    setNewBatchForm({ ...newBatchForm, formulaId: e.target.value })
                  }
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon focus:outline-none"
                >
                  {formulas.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.version})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold mb-1">
                  Cantidad Producida
                </label>
                <input
                  type="text"
                  value={newBatchForm.qtyProduced}
                  onChange={(e) =>
                    setNewBatchForm({ ...newBatchForm, qtyProduced: e.target.value })
                  }
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold mb-1">
                  Temp. Vertido (°C)
                </label>
                <input
                  type="number"
                  value={newBatchForm.pouringTemp}
                  onChange={(e) =>
                    setNewBatchForm({ ...newBatchForm, pouringTemp: Number(e.target.value) })
                  }
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold mb-1">
                  Evaluación Apariencia (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newBatchForm.ratingAppearance}
                  onChange={(e) =>
                    setNewBatchForm({
                      ...newBatchForm,
                      ratingAppearance: Number(e.target.value),
                    })
                  }
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold mb-1">
                  Evaluación Quemado Parejo (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newBatchForm.ratingBurn}
                  onChange={(e) =>
                    setNewBatchForm({ ...newBatchForm, ratingBurn: Number(e.target.value) })
                  }
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 btn-mejunje-primary font-bold rounded-xl shadow-xs"
                >
                  Registrar Batch en Bitácora
                </button>
              </div>
            </form>
          </div>

          {/* Batches History Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0 max-w-full">
            {batchTests.map((bt) => (
              <div
                key={bt.id}
                className="atelier-sheet p-5 space-y-3 text-xs min-w-0 max-w-full overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-mejunje-border pb-2">
                  <span className="font-bold text-mejunje-verdeprofundo">{bt.code}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    {bt.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm sm:text-base text-mejunje-carbon">
                    {bt.formulaName}
                  </h4>
                  <p className="text-mejunje-secundario text-[11px]">
                    Versión: {bt.version} · Fecha: {bt.date}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-mejunje-papel p-3 rounded-2xl border border-mejunje-border text-[11px]">
                  <div>
                    Temp. Vertido:{' '}
                    <strong className="text-mejunje-carbon font-bold">
                      {bt.pouringTemp || 37}°C
                    </strong>
                  </div>
                  <div>
                    Temp. Esencia:{' '}
                    <strong className="text-mejunje-carbon font-bold">
                      {bt.fragranceTemp || 42}°C
                    </strong>
                  </div>
                  <div>
                    Apariencia:{' '}
                    <strong className="text-mejunje-carbon font-bold">
                      {bt.ratingAppearance || 5}/5
                    </strong>
                  </div>
                  <div>
                    Quemado:{' '}
                    <strong className="text-mejunje-carbon font-bold">
                      {bt.ratingBurn || 5}/5
                    </strong>
                  </div>
                </div>

                {bt.observations && (
                  <p className="text-mejunje-secundario italic text-[11px]">{bt.observations}</p>
                )}

                <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    onClick={() => approveBatchFormula(bt.id, bt.formulaId)}
                    className="px-3 py-1.5 btn-mejunje-primary text-[11px] rounded-xl flex items-center gap-1 shadow-xs font-bold"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Aprobar Fórmula
                  </button>

                  <button
                    onClick={() => setBatchToDelete(bt)}
                    className="p-1 text-mejunje-secundario hover:text-mejunje-rojo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={!!formulaToDelete}
        title="Eliminar Fórmula"
        message={`¿Está seguro de eliminar la fórmula "${formulaToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={() => formulaToDelete && deleteFormula(formulaToDelete.id)}
        onCancel={() => setFormulaToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!insumoToDelete}
        title="Eliminar Materia Prima"
        message={`¿Está seguro de eliminar la materia prima "${insumoToDelete?.name}"?`}
        onConfirm={() => insumoToDelete && deleteIngredient(insumoToDelete.id)}
        onCancel={() => setInsumoToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!batchToDelete}
        title="Eliminar Batch"
        message={`¿Está seguro de eliminar la prueba "${batchToDelete?.code}"?`}
        onConfirm={() => batchToDelete && deleteBatchTest(batchToDelete.id)}
        onCancel={() => setBatchToDelete(null)}
      />

      {/* Edit Insumo Modal */}
      {editingInsumo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white text-mejunje-carbon p-6 rounded-3xl max-w-md w-full space-y-4 shadow-xl border border-mejunje-border font-typewriter">
            <h3 className="font-bold text-base text-mejunje-carbon">Registrar Materia Prima</h3>
            <form onSubmit={handleSaveNewInsumo} className="space-y-3 text-xs">
              <div>
                <label className="block text-mejunje-secundario mb-1 text-[10px] uppercase font-bold">
                  Nombre Insumo
                </label>
                <input
                  type="text"
                  required
                  value={newInsumoForm.name}
                  onChange={(e) =>
                    setNewInsumoForm({ ...newInsumoForm, name: e.target.value })
                  }
                  className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-mejunje-secundario mb-1 text-[10px] uppercase font-bold">
                    Categoría
                  </label>
                  <select
                    value={newInsumoForm.category}
                    onChange={(e) =>
                      setNewInsumoForm({
                        ...newInsumoForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon focus:outline-none"
                  >
                    <option value="Ceras">Ceras</option>
                    <option value="Fragancias">Fragancias</option>
                    <option value="Aditivos">Aditivos</option>
                    <option value="Pabilos">Pabilos</option>
                    <option value="Envases">Envases</option>
                    <option value="Tapas">Tapas</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Etiquetas">Etiquetas</option>
                    <option value="Alcoholes">Alcoholes</option>
                    <option value="Bases">Bases</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mejunje-secundario mb-1 text-[10px] uppercase font-bold">
                    Unidad Medida
                  </label>
                  <select
                    value={newInsumoForm.unit}
                    onChange={(e) =>
                      setNewInsumoForm({
                        ...newInsumoForm,
                        unit: e.target.value as any,
                      })
                    }
                    className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon focus:outline-none"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                    <option value="unid">Unidad (unid)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-mejunje-secundario mb-1 text-[10px] uppercase font-bold">
                    Precio Compra ($)
                  </label>
                  <input
                    type="number"
                    value={newInsumoForm.purchasePriceARS}
                    onChange={(e) =>
                      setNewInsumoForm({
                        ...newInsumoForm,
                        purchasePriceARS: Number(e.target.value),
                      })
                    }
                    className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-mejunje-secundario mb-1 text-[10px] uppercase font-bold">
                    Cantidad Referencia
                  </label>
                  <input
                    type="number"
                    value={newInsumoForm.referenceQty}
                    onChange={(e) =>
                      setNewInsumoForm({
                        ...newInsumoForm,
                        referenceQty: Number(e.target.value),
                      })
                    }
                    className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-carbon focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingInsumo(null)}
                  className="px-4 py-2 btn-mejunje-secondary rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-mejunje-primary font-bold rounded-xl shadow-xs"
                >
                  Guardar Materia Prima
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
