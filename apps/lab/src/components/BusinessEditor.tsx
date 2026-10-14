'use client';
import React, { useState } from 'react';
import ImageField from './ImageField';
import { Formula, CatalogProduct } from '@/types';
import { useKamelo } from '@/context/KameloContext';
import { useBusinessMutation } from './BusinessDataSource';

const inputClass = 'w-full border border-mejunje-border rounded-xl px-3 py-2 bg-white text-sm';
function Field({ label, value, change, numeric = false }: { label: string; value: string | number; change: (value: string) => void; numeric?: boolean }) {
  return <label className="block text-xs space-y-1">{label}<input className={inputClass} type={numeric ? 'number' : 'text'} step={numeric ? '0.0001' : undefined} value={value} onChange={e => change(e.target.value)} /></label>;
}

export default function BusinessEditor({ record, kind, close }: { record: Formula | CatalogProduct; kind: 'formula' | 'product'; close: () => void }) {
  const { realIngredients, realFormulas, updateFormula, updateProduct, showToast } = useKamelo();
  const [formula, setFormula] = useState<Formula>(kind === 'formula' ? record as Formula : {} as Formula);
  const [product, setProduct] = useState<CatalogProduct>(kind === 'product' ? record as CatalogProduct : {} as CatalogProduct);
  const { busy: saving, run } = useBusinessMutation(showToast);
  const [uploading, setUploading] = useState(false);
  const busy = saving || uploading;
  const linkedFormula = realFormulas.find(f => f.id === product.formulaId);
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <form className="atelier-sheet bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4" onSubmit={e => { e.preventDefault(); if (busy) return; void run(() => kind === 'formula' ? updateFormula(formula.id, formula) : updateProduct(product.id, product), close); }}>
      <h2 className="text-xl font-bold">{kind === 'formula' ? 'Editar fórmula' : 'Editar producto'}</h2>
      <fieldset disabled={busy} className="space-y-4">
      {kind === 'formula' ? <>
        <Field label="Nombre" value={formula.name} change={name => setFormula({ ...formula, name })} />
        <Field label="Presentación" value={formula.yieldSize} change={yieldSize => setFormula({ ...formula, yieldSize })} />
        <Field label="Versión" value={formula.version} change={version => setFormula({ ...formula, version })} />
        <Field label="Unidades producidas por lote" numeric value={formula.yieldUnits ?? 1} change={v => setFormula({ ...formula, yieldUnits: Number(v) })} />
        <Field label="Tamaño del lote (g)" numeric value={formula.batchSizeGrams} change={v => setFormula({ ...formula, batchSizeGrams: Number(v) })} />
        <label className="block text-xs">Estado<select className={inputClass} value={formula.status} onChange={e => setFormula({ ...formula, status: e.target.value as Formula['status'] })}>{['Borrador','En prueba','Aprobada','Archivada'].map(s => <option key={s}>{s}</option>)}</select></label>
        <Field label="Notas" value={formula.notes ?? ''} change={notes => setFormula({ ...formula, notes })} />
        <p className="text-xs">Los costos se recalculan en el servidor al guardar.</p>
        {formula.ingredients.map((item, index) => <div key={index} className="grid grid-cols-3 gap-2 border-b pb-3">
          <label className="text-xs">Insumo real<select className={inputClass} required value={item.ingredientId} onChange={e => setFormula({ ...formula, ingredients: formula.ingredients.map((i,n) => n === index ? { ...i, ingredientId: e.target.value } : i) })}><option value="">Seleccionar insumo activo</option>{realIngredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
          <Field label="Cantidad" numeric value={item.quantity} change={v => setFormula({ ...formula, ingredients: formula.ingredients.map((i,n) => n === index ? { ...i, quantity: Number(v) } : i) })} />
          <Field label="Porcentaje" numeric value={item.percentage} change={v => setFormula({ ...formula, ingredients: formula.ingredients.map((i,n) => n === index ? { ...i, percentage: Number(v) } : i) })} />
          <button type="button" onClick={() => setFormula({ ...formula, ingredients: formula.ingredients.filter((_,n) => n !== index) })}>Quitar insumo</button>
        </div>)}
        <button type="button" onClick={() => setFormula({ ...formula, ingredients: [...formula.ingredients, { ingredientId:'', ingredientName:'',category:'',quantity:1,unit:'g',percentage:0,unitCostARS:0,calculatedCostARS:0 }] })}>Agregar insumo</button>
      </> : <>
        <Field label="Nombre" value={product.name} change={name => setProduct({ ...product, name })} />
        <ImageField value={product.imageUrl} onChange={imageUrl => setProduct({ ...product, imageUrl, images: Array.from(new Set([...(product.images ?? []).filter(url => url !== product.imageUrl), ...(imageUrl ? [imageUrl] : [])])) })} onBusyChange={setUploading} disabled={saving} />
        <Field label="SKU" value={product.sku} change={sku => setProduct({ ...product, sku })} />
        <Field label="Descripción" value={product.description} change={description => setProduct({ ...product, description })} />
        <Field label="Descripción breve" value={product.shortDescription} change={shortDescription => setProduct({ ...product, shortDescription })} />
        <Field label="Colección" value={product.collection} change={collection => setProduct({ ...product, collection })} />
        <label className="text-xs block">Estado<select className={inputClass} value={product.status} onChange={e => setProduct({ ...product, status: e.target.value as CatalogProduct['status'] })}>{['Borrador','Activo','Inactivo'].map(s => <option key={s}>{s}</option>)}</select></label>
        <label className="text-xs block">Fórmula real<select className={inputClass} value={product.formulaId ?? ''} onChange={e => setProduct({ ...product, formulaId: e.target.value || undefined })}><option value="">Sin fórmula</option>{realFormulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
        {linkedFormula && <p>Costo unitario de fórmula: ARS {linkedFormula.unitCostARS}</p>}
        {product.variants.map((v, index) => {
          const change = (patch: Partial<typeof v>) => setProduct({ ...product, variants: product.variants.map((old,n) => n === index ? { ...old,...patch } : old) });
          const cost = linkedFormula?.unitCostARS ?? v.estimatedCostARS;
          return <div key={index} className="border rounded-xl p-3 grid grid-cols-2 gap-3">
            <Field label="SKU variante" value={v.sku} change={sku => change({sku})} />
            <Field label="Presentación" value={v.size} change={size => change({size})} />
            <Field label="Aroma" value={v.aroma} change={aroma => change({aroma})} />
            {!linkedFormula && <Field label="Costo estimado ARS" numeric value={v.estimatedCostARS} change={s => change({ estimatedCostARS: Number(s) })} />}
            <Field label="Recargo objetivo %" numeric value={v.marginPercent ?? 65} change={s => change({ marginPercent: Number(s) })} />
            <Field label="Precio aprobado ARS" numeric value={v.salePriceARS} change={s => change({ salePriceARS: Number(s) })} />
            <p className="text-xs col-span-2">Costo: ARS {cost} · Precio sugerido: ARS {(cost * (1 + (v.marginPercent ?? 65)/100)).toFixed(2)} · Se confirma al guardar.</p>
            <button type="button" onClick={() => setProduct({ ...product, variants: product.variants.filter((_,n) => n !== index) })}>Quitar variante</button>
          </div>;
        })}
        <button type="button" onClick={() => setProduct({ ...product, variants: [...product.variants, { id:'',sku:'',size:'',unit:'unid',aroma:product.name,salePriceARS:0,estimatedCostARS:0,marginPercent:65,status:'Activo' }] })}>Agregar variante</button>
      </>}
      </fieldset>
      <div className="flex gap-3"><button disabled={busy} className="btn-mejunje-primary px-4 py-2 rounded-xl" type="submit">{busy ? 'Guardando…' : 'Guardar cambios'}</button><button disabled={busy} className="btn-mejunje-secondary px-4 py-2 rounded-xl" type="button" onClick={close}>Cancelar</button></div>
    </form>
  </div>;
}
