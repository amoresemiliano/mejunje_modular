'use client';

import React, { useState } from 'react';
import { useKamelo } from '@/context/KameloContext';
import { Supplier, PurchaseOrder } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import ConfirmDialog from '@/components/ConfirmDialog';
import SectionHero from '@/components/SectionHero';
import {
  ShoppingBag,
  Building2,
  AlertTriangle,
  CheckCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Copy,
  Trash2,
  FileText,
  Clock,
  MapPin,
  ApothecaryBottleIcon,
  TagStringIcon,
  BotanicalBranchMini,
} from '@/components/Icons';

export default function ComprasPage() {
  const {
    suppliers,
    requirements,
    purchaseOrders,
    createPurchaseOrderFromRequirements,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
    duplicatePurchaseOrder,
    deleteSupplier,
    setActiveModal,
  } = useKamelo();

  // Sub-navigation tab: 'necesidades' | 'ordenes' | 'proveedores'
  const [activeTab, setActiveTab] = useState<'necesidades' | 'ordenes' | 'proveedores'>('necesidades');

  // Expanded supplier in requirements
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(requirements[0]?.supplierId || null);

  // Confirm dialogs
  const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  // Status badge style helper
  const getPOStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Solicitada':
      case 'Pendiente':
        return 'bg-amber-50 text-mejunje-ambar border-amber-300';
      case 'Confirmada':
        return 'bg-mejunje-papel text-mejunje-carbon border-mejunje-borderarena';
      case 'Recibida':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Cancelada':
        return 'bg-rose-50 text-mejunje-rojo border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in pb-12 font-typewriter">
      {/* Header Banner */}
      <SectionHero
        title="Abastecimiento & Directorio de Proveedores"
        subtitle="Consolidación de materias primas por proveedor para alcanzar mínimos de compra, emisor de órdenes de compra y contacto directo de taller."
        badgeText="MEJUNJE · ABASTECIMIENTO & MATERIAS PRIMAS"
        badgeIcon={<ShoppingBag className="w-3.5 h-3.5 text-mejunje-verdeseco" />}
        bgImage="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1600&q=80"
        noticeText="consolidación inteligente de pedidos · optimización de fletes"
      >
        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-mejunje-border shadow-xs">
          <button
            onClick={() => setActiveTab('necesidades')}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
              activeTab === 'necesidades'
                ? 'bg-mejunje-verdeseco text-white shadow-xs font-bold'
                : 'text-mejunje-secundario hover:text-mejunje-carbon'
            }`}
          >
            Necesidades ({requirements.length})
          </button>

          <button
            onClick={() => setActiveTab('ordenes')}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
              activeTab === 'ordenes'
                ? 'bg-mejunje-verdeseco text-white shadow-xs font-bold'
                : 'text-mejunje-secundario hover:text-mejunje-carbon'
            }`}
          >
            Órdenes ({purchaseOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('proveedores')}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all ${
              activeTab === 'proveedores'
                ? 'bg-mejunje-verdeseco text-white shadow-xs font-bold'
                : 'text-mejunje-secundario hover:text-mejunje-carbon'
            }`}
          >
            Proveedores ({suppliers.length})
          </button>
        </div>
      </SectionHero>

      {/* =================================================================== */}
      {/* SUBSECTION 1: NECESIDADES DE PRODUCCIÓN (REQUERIMIENTOS AGRUPADOS) */}
      {/* =================================================================== */}
      {activeTab === 'necesidades' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
            <span className="text-xs text-mejunje-secundario">
              Materias primas agrupadas dinámicamente por proveedor desde el Laboratorio de Fórmulas
            </span>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="px-4 py-2 btn-mejunje-primary text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Nueva Orden de Compra
            </button>
          </div>

          <div className="space-y-4">
            {requirements.map((group) => {
              const isExpanded = expandedSupplierId === group.supplierId;
              const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));

              return (
                <div
                  key={group.supplierId}
                  className="atelier-sheet overflow-hidden transition-all"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedSupplierId(isExpanded ? null : group.supplierId)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-mejunje-papel/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-mejunje-papel text-mejunje-verdeprofundo flex items-center justify-center font-bold shrink-0 border border-mejunje-border">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-sm sm:text-base text-mejunje-carbon">{group.supplierName}</h2>
                          {group.meetsMinimum ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Mínimo Alcanzado
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-mejunje-ambar text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-mejunje-ambar" /> Faltan {formatCurrency(group.minPurchaseARS - group.totalARS)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-mejunje-secundario mt-0.5">
                          Compra Mínima Requerida: <strong className="text-mejunje-carbon font-bold">{formatCurrency(group.minPurchaseARS)}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-mejunje-secundario font-bold">Total Acumulado:</span>
                        <div className="text-lg sm:text-xl font-bold text-mejunje-verdeprofundo">
                          {formatCurrency(group.totalARS)}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-mejunje-papel text-mejunje-carbon border border-mejunje-border">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="px-5 pb-3">
                    <div className="w-full bg-mejunje-arena/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-mejunje-verdeprofundo' : 'bg-mejunje-verdeseco'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Collapsible Itemized Table */}
                  {isExpanded && (
                    <div className="p-5 border-t border-mejunje-border space-y-4 bg-mejunje-papel/30">
                      <h3 className="text-[10px] uppercase tracking-wider text-mejunje-secundario font-bold">
                        Materias Primas Requeridas ({group.requirements.length} ítems)
                      </h3>

                      {group.requirements.length === 0 ? (
                        <p className="text-xs text-mejunje-secundario italic py-2">No hay insumos pendientes para este proveedor.</p>
                      ) : (
                        <div className="overflow-x-auto border border-mejunje-border rounded-2xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-mejunje-papel text-mejunje-carbon text-[10px] uppercase tracking-wider border-b border-mejunje-border">
                              <tr>
                                <th className="p-3 font-bold">Materia Prima</th>
                                <th className="p-3 font-bold">Fórmulas de Destino</th>
                                <th className="p-3 font-bold text-center">Cantidad</th>
                                <th className="p-3 font-bold text-right">Subtotal Estimado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-mejunje-border bg-white">
                              {group.requirements.map((req) => (
                                <tr key={req.id} className="hover:bg-mejunje-papel/40 transition-colors">
                                  <td className="p-3 font-bold text-mejunje-carbon">{req.ingredientName}</td>
                                  <td className="p-3 text-mejunje-secundario">
                                    {req.formulaReferences?.map((ref, idx) => (
                                      <span key={idx} className="inline-block bg-mejunje-papel px-2 py-0.5 rounded text-[10px] mr-1 border border-mejunje-border">
                                        {ref}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="p-3 text-center font-bold text-mejunje-verdeprofundo">
                                    {req.requiredQty} {req.unit}
                                  </td>
                                  <td className="p-3 text-right font-bold text-mejunje-carbon">
                                    ${req.subtotalARS.toLocaleString('es-AR')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                        <button
                          disabled={group.requirements.length === 0}
                          onClick={() => createPurchaseOrderFromRequirements(group.supplierName)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
                            group.requirements.length > 0
                              ? 'btn-mejunje-primary'
                              : 'bg-mejunje-papel text-mejunje-secundario cursor-not-allowed border border-mejunje-border'
                          }`}
                        >
                          <FileText className="w-4 h-4" /> Emitir Orden de Compra Agrupada
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUBSECTION 2: ÓRDENES DE COMPRA (PURCHASE ORDERS) */}
      {/* =================================================================== */}
      {activeTab === 'ordenes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
            <span className="text-xs text-mejunje-secundario">
              Historial y seguimiento de Órdenes de Compra emitidas a proveedores de materias primas
            </span>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="px-4 py-2 btn-mejunje-primary text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Crear Orden de Compra
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="atelier-sheet p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-mejunje-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-mejunje-carbon">{po.code}</span>
                    <span className="text-[10px] text-mejunje-secundario">{po.date}</span>
                  </div>

                  <select
                    value={po.status}
                    onChange={(e) => updatePurchaseOrderStatus(po.id, e.target.value as any)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border focus:outline-none ${getPOStatusBadge(
                      po.status
                    )}`}
                  >
                    <option value="Solicitada">Solicitada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Recibida">Recibida</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-bold text-sm sm:text-base text-mejunje-carbon">{po.supplierName}</h4>
                  {po.observations && <p className="text-mejunje-secundario text-[11px] mt-0.5">{po.observations}</p>}
                </div>

                {/* Items preview */}
                <div className="bg-mejunje-papel p-3.5 rounded-2xl border border-mejunje-border space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-mejunje-secundario font-bold">Ítems en Orden:</span>
                  {po.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-mejunje-carbon font-bold">{item.ingredientName} ({item.requiredQty} {item.unit})</span>
                      <span className="font-bold text-mejunje-verdeprofundo">{formatCurrency(item.subtotalARS)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-mejunje-border">
                  <div>
                    <span className="text-[9px] uppercase text-mejunje-secundario font-bold">Total Orden:</span>
                    <div className="text-base sm:text-lg text-mejunje-carbon font-bold">
                      {formatCurrency(po.totalARS)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicatePurchaseOrder(po.id)}
                      title="Duplicar Orden"
                      className="p-1.5 btn-mejunje-secondary rounded-lg transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPoToDelete(po)}
                      title="Eliminar Orden"
                      className="p-1.5 btn-mejunje-secondary text-mejunje-rojo hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUBSECTION 3: PROVEEDORES (DIRECTORY & WHATSAPP) */}
      {/* =================================================================== */}
      {activeTab === 'proveedores' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
            <span className="text-xs text-mejunje-secundario">
              Directorio comercial de proveedores, materias primas aprovisionadas y contacto de WhatsApp
            </span>

            <button
              onClick={() => setActiveModal('supplier')}
              className="px-4 py-2 btn-mejunje-primary text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Registrar Proveedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suppliers.map((s) => {
              const waClean = s.phoneWhatsApp.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${waClean}?text=${encodeURIComponent(
                `Hola ${s.contactPerson}! Te escribo de MEJUNJE (Atelier de Aromas, Buenos Aires) para consultar por materias primas.`
              )}`;

              return (
                <div key={s.id} className="atelier-sheet p-6 space-y-4 text-xs flex flex-col justify-between overflow-hidden">
                  <div>
                    {s.imageUrl && (
                      <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-full h-full object-cover filter saturate-85 brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-mejunje-papel text-mejunje-verdeprofundo flex items-center justify-center font-bold border border-mejunje-border">
                        <Building2 className="w-5 h-5" />
                      </div>

                      <button
                        onClick={() => setSupplierToDelete(s)}
                        className="text-mejunje-secundario hover:text-mejunje-rojo p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-mejunje-carbon mt-3">{s.name}</h3>
                    <p className="text-mejunje-secundario text-[11px]">Contacto: <strong className="text-mejunje-carbon font-bold">{s.contactPerson}</strong></p>

                    <div className="mt-3 space-y-1.5 text-[11px] text-mejunje-secundario">
                      {s.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-mejunje-verdeseco" /> {s.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-mejunje-verdeprofundo" /> Plazo de entrega: <strong className="text-mejunje-carbon font-bold">{s.deliveryTimeDays} días</strong>
                      </div>
                      <div>
                        Compra Mínima: <strong className="text-mejunje-carbon font-bold">{formatCurrency(s.minPurchaseARS)}</strong>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="mt-3 p-3 rounded-2xl bg-mejunje-papel border border-mejunje-border text-[10px] text-mejunje-secundario italic">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-mejunje-border">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors text-xs"
                    >
                      <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={!!poToDelete}
        title="Eliminar Orden de Compra"
        message={`¿Está seguro de eliminar la orden ${poToDelete?.code}?`}
        onConfirm={() => poToDelete && deletePurchaseOrder(poToDelete.id)}
        onCancel={() => setPoToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!supplierToDelete}
        title="Eliminar Proveedor"
        message={`¿Está seguro de eliminar el proveedor "${supplierToDelete?.name}"?`}
        onConfirm={() => supplierToDelete && deleteSupplier(supplierToDelete.id)}
        onCancel={() => setSupplierToDelete(null)}
      />
    </div>
  );
}
