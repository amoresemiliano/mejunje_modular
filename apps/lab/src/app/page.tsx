'use client';

import React from 'react';
import Link from 'next/link';
import { useKamelo } from '@/context/KameloContext';
import { formatCurrency } from '@/utils/formatters';
import { LotusIcon } from '@/components/LotusLogo';
import SectionHero from '@/components/SectionHero';
import {
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Plus,
  CandleIcon,
  DropperIcon,
  ApothecaryBottleIcon,
  TagStringIcon,
  BotanicalBranchMini,
  MessageCircle,
  Sparkles,
  Phone,
} from '@/components/Icons';

export default function DashboardPage() {
  const {
    formulas,
    ingredients,
    requirements,
    purchaseOrders,
    batchTests,
    marketBenchmarks,
    catalogProducts,
    clients,
    suppliers,
    activityLogs,
    setActiveModal,
    runMarketQueries,
  } = useKamelo();

  // Metrics Calculations (Derived strictly from real global state)
  const lowStockCount = ingredients.filter((ing) => ing.stock <= ing.minStock).length;
  const inTestFormulas = batchTests.filter(
    (bt) => bt.status === 'Curado' || bt.status === 'Evaluación' || bt.status === 'Preparación'
  );
  const totalRequirementARS = requirements.reduce((acc, g) => acc + g.totalARS, 0);
  const metMinimumsCount = requirements.filter((g) => g.meetsMinimum).length;
  const pendingOrdersCount = purchaseOrders.filter(
    (p) => p.status === 'Solicitada' || p.status === 'Pendiente'
  ).length;
  const opportunitiesCount = marketBenchmarks.filter(
    (b) => b.status === 'Oportunidad Aumento'
  ).length;

  const totalCatalogVariants = catalogProducts.reduce(
    (acc, p) => acc + (p.variants?.length || 1),
    0
  );

  return (
    <div className="space-y-10 animate-in fade-in pb-12 font-typewriter max-w-full overflow-hidden">
      {/* Header Banner: Editorial Dashboard Hero */}
      <SectionHero
        title="Dashboard General del Atelier"
        subtitle="Visión ejecutiva de producción olfativa, balance de insumos botánicos, consolidación de compras a proveedores y posición de mercado."
        badgeText="MEJUNJE · BUENOS AIRES"
        badgeIcon={<LotusIcon className="w-3.5 h-3.5 text-mejunje-verdeseco" />}
        bgImage="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80"
        noticeText="mezcla · intención · aroma"
      >
        {/* Quick Action Ledger Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-mejunje-border shrink-0 shadow-xs font-typewriter">
          <button
            onClick={() => setActiveModal('formula')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-mejunje-primary text-xs shadow-xs active:scale-95 font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Fórmula
          </button>

          <button
            onClick={() => setActiveModal('product')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-mejunje-secondary text-xs active:scale-95 font-bold"
          >
            <TagStringIcon className="w-3.5 h-3.5 text-mejunje-terracota" /> Ficha Comercial
          </button>

          <button
            onClick={() => setActiveModal('purchaseOrder')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-mejunje-secondary text-xs active:scale-95 font-bold"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-mejunje-verdeprofundo" /> Orden de Compra
          </button>

          <button
            onClick={() => runMarketQueries()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mejunje-papel hover:bg-mejunje-arena/40 text-mejunje-carbon text-xs border border-mejunje-border transition-all font-bold"
          >
            <TrendingUp className="w-3.5 h-3.5 text-mejunje-ambar" /> Relevar Precios
          </button>
        </div>
      </SectionHero>

      {/* Primary KPI Metrics Grid (Asymmetrical & Editorial) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-typewriter">
        {/* Metric 1: Laboratorio & Stock */}
        <Link
          href="/laboratorio"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-mejunje-borderarena"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold">
              Laboratorio & Stock
            </span>
            <div
              className={`p-2 rounded-xl ${
                lowStockCount > 0
                  ? 'bg-amber-50 text-mejunje-ambar border border-amber-200'
                  : 'bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">
              {formulas.length} Fórmulas
            </div>
            <p className="text-[11px] text-mejunje-secundario mt-1">
              {inTestFormulas.length} batches en curso ·{' '}
              {lowStockCount > 0 ? (
                <span className="text-mejunje-ambar font-bold">{lowStockCount} bajo mínimo</span>
              ) : (
                <span className="text-emerald-700 font-bold">Stock óptimo</span>
              )}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-verdeprofundo font-bold">
            <span>Ir al Laboratorio</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Metric 2: Abastecimiento & Compras */}
        <Link
          href="/compras"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-mejunje-borderarena"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold">
              Abastecimiento
            </span>
            <div className="p-2 rounded-xl bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">
              {formatCurrency(totalRequirementARS)}
            </div>
            <p className="text-[11px] text-mejunje-verdeprofundo mt-1 font-bold">
              {metMinimumsCount} de {requirements.length} proveedores en mínimo
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-verdeprofundo font-bold">
            <span>{pendingOrdersCount} órdenes activas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Metric 3: Catálogo & Clientes */}
        <Link
          href="/catalogo"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-mejunje-borderarena"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold">
              Catálogo & Comercial
            </span>
            <div className="p-2 rounded-xl bg-mejunje-papel text-mejunje-terracota border border-mejunje-border">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">
              {catalogProducts.length} Fichas de Autor
            </div>
            <p className="text-[11px] text-mejunje-secundario mt-1">
              {totalCatalogVariants} variantes · {clients.length} clientes registrados
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-terracota font-bold">
            <span>Explorar catálogo</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Metric 4: Observatorio de Precios */}
        <Link
          href="/mercado"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-mejunje-borderarena"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold">
              Observatorio
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-mejunje-ambar border border-amber-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">
              {marketBenchmarks.length} Benchmarks
            </div>
            <p className="text-[11px] text-mejunje-ambar mt-1 font-bold">
              {opportunitiesCount} oportunidad(es) de captura
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-ambar font-bold">
            <span>Monitorear mercado</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Main Grid: 60/40 Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-w-0 max-w-full">
        {/* Left Column (60% ~ 7 cols): Suppliers Progress + Active Batches + Benchmarking */}
        <div className="lg:col-span-7 space-y-6 min-w-0 max-w-full">
          {/* Supplier Minimums Progress Card */}
          <div className="atelier-sheet p-6 sm:p-7 min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-typewriter text-sm sm:text-base font-bold text-mejunje-carbon flex items-center gap-2 uppercase tracking-wider">
                  <DropperIcon className="w-4 h-4 text-mejunje-verdeseco shrink-0" /> Consolidación de Compras por Proveedor
                </h3>
                <p className="text-xs text-mejunje-secundario mt-0.5 font-typewriter">
                  Control de acumulación para desbloquear precios mayoristas en Buenos Aires
                </p>
              </div>
              <Link
                href="/compras"
                className="text-xs text-mejunje-verdeprofundo font-bold hover:underline flex items-center gap-1 shrink-0 font-typewriter"
              >
                Ver Abastecimiento <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4 font-typewriter">
              {requirements.map((group) => {
                const percent = Math.min(
                  100,
                  Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100)
                );
                return (
                  <div
                    key={group.supplierId}
                    className="p-4 rounded-2xl bg-mejunje-papel border border-mejunje-border space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-mejunje-carbon truncate">
                          {group.supplierName}
                        </span>
                        {group.meetsMinimum ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200 shrink-0">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Mínimo Cumplido
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-mejunje-ambar text-[10px] font-bold flex items-center gap-1 border border-amber-200 shrink-0">
                            <AlertTriangle className="w-3 h-3 text-mejunje-ambar" /> Faltan{' '}
                            {formatCurrency(group.minPurchaseARS - group.totalARS)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-mejunje-secundario shrink-0">
                        Acumulado:{' '}
                        <strong className="text-mejunje-carbon">
                          {formatCurrency(group.totalARS)}
                        </strong>{' '}
                        / Mín: {formatCurrency(group.minPurchaseARS)}
                      </div>
                    </div>

                    {/* Progress Bar in Botanical / Earth Colors */}
                    <div className="w-full bg-mejunje-arena/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-mejunje-verdeprofundo' : 'bg-mejunje-verdeseco'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Sensorial Batches Card */}
          <div className="atelier-sheet p-6 sm:p-7 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-mejunje-border">
              <div>
                <h3 className="font-typewriter text-sm sm:text-base font-bold text-mejunje-carbon flex items-center gap-2 uppercase tracking-wider">
                  <CandleIcon className="w-4 h-4 text-mejunje-verdeseco" /> Pruebas de Laboratorio en Curso
                </h3>
                <p className="text-xs text-mejunje-secundario mt-0.5">
                  Control de curado, temperaturas de colada y comportamiento de pabilo
                </p>
              </div>
              <Link
                href="/laboratorio"
                className="text-xs text-mejunje-verdeprofundo font-bold hover:underline flex items-center gap-1"
              >
                Mesa de pesaje <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {batchTests.slice(0, 4).map((bt) => (
                <div
                  key={bt.id}
                  className="p-4 rounded-2xl bg-mejunje-papel border border-mejunje-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-mejunje-verdeprofundo font-mono text-[11px]">
                      {bt.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200">
                      {bt.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-mejunje-carbon truncate">
                    {bt.formulaName}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-mejunje-secundario pt-1 border-t border-mejunje-border">
                    <span>Temp: {bt.pouringTemp || 37}°C</span>
                    <span>Quemado: {bt.ratingBurn || 5}/5 ★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Module Access Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-typewriter">
            <Link
              href="/clientes"
              className="atelier-sheet p-5 flex items-center justify-between group hover:border-mejunje-borderarena transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-mejunje-papel text-mejunje-verdeprofundo flex items-center justify-center border border-mejunje-border shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-mejunje-carbon truncate">
                    Clientes & Cuentas
                  </h4>
                  <p className="text-[10px] text-mejunje-secundario truncate">
                    Boutiques y pedidos mayoristas
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-mejunje-verdeseco group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              href="/proveedores"
              className="atelier-sheet p-5 flex items-center justify-between group hover:border-mejunje-borderarena transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-mejunje-papel text-mejunje-secundario flex items-center justify-center border border-mejunje-border shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-mejunje-carbon truncate">
                    Proveedores & Red
                  </h4>
                  <p className="text-[10px] text-mejunje-secundario truncate">
                    Destilerías botánicas y vidrierías
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-mejunje-secundario group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>
        </div>

        {/* Right Column (40% ~ 5 cols): Live Activity Ledger + VIP Clients + Atelier Stamp */}
        <div className="lg:col-span-5 space-y-6 min-w-0 max-w-full">
          {/* Activity Ledger (Bitácora del Atelier) */}
          <div className="atelier-sheet p-6 sm:p-7 flex flex-col justify-between font-typewriter min-w-0 max-w-full">
            <div>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-mejunje-border">
                <h3 className="text-xs sm:text-sm font-bold text-mejunje-carbon flex items-center gap-2 uppercase tracking-wider">
                  <LotusIcon className="w-3.5 h-3.5 text-mejunje-verdeseco" /> Bitácora del Atelier
                </h3>
                <span className="text-[9px] bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border font-bold px-2 py-0.5 rounded-full">
                  Archivo Vivo
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {activityLogs.slice(0, 7).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-mejunje-papel/60 border border-mejunje-border space-y-1 text-xs transition-colors hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-mejunje-carbon text-xs truncate">
                        {log.title}
                      </span>
                      <span className="text-[9px] text-mejunje-secundario shrink-0 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-mejunje-secundario text-[11px] leading-relaxed">
                      {log.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-mejunje-border flex items-center justify-between">
              <span className="text-[9px] text-mejunje-secundario uppercase tracking-wider">
                MEJUNJE · Buenos Aires
              </span>
              <BotanicalBranchMini className="w-10 h-5 text-mejunje-salvia" />
            </div>
          </div>

          {/* Key Clients Glance with WhatsApp shortcuts */}
          <div className="atelier-sheet p-6 min-w-0 max-w-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-mejunje-border">
              <h3 className="text-xs font-bold text-mejunje-carbon flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-mejunje-verdeseco" /> Cuentas & Boutiques
              </h3>
              <Link
                href="/clientes"
                className="text-[11px] text-mejunje-verdeprofundo font-bold hover:underline"
              >
                Ver todos ({clients.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {clients.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-mejunje-papel/70 border border-mejunje-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-mejunje-carbon truncate">{c.name}</div>
                    <div className="text-[10px] text-mejunje-secundario truncate">
                      {c.type} {c.address ? `· ${c.address}` : '· Buenos Aires'}
                    </div>
                  </div>

                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hola ${c.name}, te escribo desde MEJUNJE Atelier de Aromas en Buenos Aires.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0"
                      title="Contactar por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
