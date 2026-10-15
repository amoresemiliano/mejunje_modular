'use client';
import React, { useState } from 'react';
import { Ingredient, InsumoCategory } from '@/types';
import { CreateIngredientInput } from '@/services/api/ingredients';
import { useKamelo } from '@/context/KameloContext';
import { useBusinessMutation } from './BusinessDataSource';
import ImageField from './ImageField';
import { ingredientCostPreview, isStockUnit, stockUnits } from '@/utils/ingredientUnits';

const categories: InsumoCategory[] = ['Ceras','Fragancias','Aditivos','Pabilos','Envases','Tapas','Packaging','Etiquetas','Alcoholes','Bases','Otros'];
export default function IngredientEditor({ record, close }: { record?: Ingredient; close: () => void }) {
  const { realSuppliers, addIngredient, updateIngredient, showToast } = useKamelo();
  const { busy, run } = useBusinessMutation(showToast);
  const [uploading, setUploading] = useState(false);
  const [explicitUnit, setExplicitUnit] = useState(!!record);
  const oldPurchaseUnit = record?.purchaseUnit ?? record?.unit ?? 'kg';
  const initialPurchaseUnit = isStockUnit(oldPurchaseUnit) ? oldPurchaseUnit : 'kg';
  const [form, setForm] = useState<CreateIngredientInput>({ name:record?.name ?? '', category:record?.category ?? 'Fragancias', unit: record && isStockUnit(record.unit) ? record.unit : 'g', purchaseUnit: initialPurchaseUnit, purchasePriceARS:record?.purchasePriceARS ?? 0, referenceQty:record?.referenceQty ?? 1, stock:record?.stock ?? 0, minStock:record?.minStock ?? 0, supplierId:record?.supplierId ?? '', imageUrl:record?.imageUrl ?? '' });
  const preview = ingredientCostPreview(form.purchasePriceARS, form.referenceQty, form.purchaseUnit, form.unit);
  const disabled = busy || uploading;
  const numeric = (key: 'purchasePriceARS' | 'referenceQty' | 'stock' | 'minStock', label: string) => <label className="block text-xs space-y-1">{label}<input required className="w-full border rounded-xl p-2" type="number" step="0.0001" min={key === 'referenceQty' ? '0.0001' : '0'} value={form[key] ?? 0} onChange={e => setForm({ ...form, [key]: Number(e.target.value) })} /></label>;
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <form className="bg-white rounded-2xl p-5 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4" onSubmit={e => {
      e.preventDefault(); if (disabled || preview === null) return;
      if (!realSuppliers.some(s => s.id === form.supplierId)) { showToast('Seleccione un proveedor real activo.', 'warning'); return; }
      void run(() => record ? updateIngredient(record.id, form) : addIngredient(form), close);
    }}>
      <h2 className="text-lg font-bold">{record ? 'Editar insumo' : 'Nuevo insumo'}</h2>
      {!realSuppliers.length && <p role="alert" className="text-xs">Primero registre un proveedor real para asociar el insumo.</p>}
      {record?.unit === '%' && <p className="text-xs">Este insumo usa una unidad antigua. Seleccione unidades de stock compatibles antes de guardar.</p>}
      <fieldset disabled={disabled} className="space-y-3">
        <label className="block text-xs">Nombre<input required className="w-full border rounded-xl p-2" value={form.name} onChange={e => setForm({ ...form,name:e.target.value })} /></label>
        <label className="block text-xs">Categoría<select className="w-full border rounded-xl p-2" value={form.category} onChange={e => setForm({ ...form,category:e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="block text-xs">Proveedor<select required className="w-full border rounded-xl p-2" value={form.supplierId ?? ''} onChange={e => setForm({ ...form,supplierId:e.target.value })}><option value="">Seleccionar proveedor real</option>{realSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        {numeric('purchasePriceARS','Precio de compra (ARS)')}
        {numeric('referenceQty','Cantidad comprada por ese precio')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-xs">Unidad de compra<select className="w-full border rounded-xl p-2" value={form.purchaseUnit} onChange={e => { const unit = e.target.value; if (isStockUnit(unit)) setForm({ ...form, purchaseUnit:unit, ...(!explicitUnit ? { unit:unit === 'kg' ? 'g' : unit === 'l' ? 'ml' : unit } : {}) }); }}>{stockUnits.map(u => <option key={u}>{u}</option>)}</select></label>
          <label className="block text-xs">Unidad de consumo / fórmula<select className="w-full border rounded-xl p-2" value={form.unit} onChange={e => { if (isStockUnit(e.target.value)) { setExplicitUnit(true); setForm({ ...form,unit:e.target.value }); } }}>{stockUnits.map(u => <option key={u}>{u}</option>)}</select></label>
        </div>
        <p className="text-xs">Indica cuánto producto recibís por el precio de compra. El sistema convierte automáticamente a la unidad usada en fórmulas.</p>
        <p aria-live="polite" className="text-sm font-bold">Costo unitario calculado: {preview === null ? 'Revise la cantidad y las unidades compatibles.' : `$ ${preview.toFixed(4)} / ${form.unit}`}<span className="block text-xs font-normal">El servidor confirma el costo al guardar.</span></p>
        <div className="grid grid-cols-2 gap-3">{numeric('stock',`Stock actual (${form.unit})`)}{numeric('minStock',`Stock mínimo (${form.unit})`)}</div>
      </fieldset>
      <ImageField value={form.imageUrl ?? ''} onChange={imageUrl => setForm({ ...form,imageUrl })} onBusyChange={setUploading} disabled={busy} />
      <div className="flex gap-3"><button type="submit" disabled={disabled || preview === null || !realSuppliers.length} className="btn-mejunje-primary px-4 py-2 rounded-xl">{busy ? 'Guardando…' : 'Guardar insumo'}</button><button type="button" disabled={disabled} onClick={close} className="btn-mejunje-secondary px-4 py-2 rounded-xl">Cancelar</button></div>
    </form>
  </div>;
}
