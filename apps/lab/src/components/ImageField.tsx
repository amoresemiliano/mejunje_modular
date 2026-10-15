'use client';
import React, { useId, useRef, useState } from 'react';
import { uploadImageApi } from '@/services/api/media';

export default function ImageField({ value, onChange, onBusyChange, disabled = false }: {
  value?: string; onChange: (url: string) => void; onBusyChange: (busy: boolean) => void; disabled?: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [broken, setBroken] = useState(false);
  const change = (url: string) => { setBroken(false); setError(''); onChange(url); };
  const upload = async (file?: File) => {
    if (!file || busy) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024 || file.size === 0) {
      setError('Seleccione una imagen JPEG, PNG o WebP de hasta 8 MB.'); return;
    }
    setBusy(true); onBusyChange(true); setError('');
    try { change((await uploadImageApi(file)).url); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo subir la imagen.'); }
    finally { setBusy(false); onBusyChange(false); if (input.current) input.current.value = ''; }
  };
  return <div className="space-y-2 border border-mejunje-border rounded-xl p-3">
    <span className="block text-xs font-bold">Imagen (opcional)</span>
    <input ref={input} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled || busy} onChange={e => void upload(e.target.files?.[0])} />
    <button type="button" disabled={disabled || busy} className="btn-mejunje-secondary rounded-xl px-3 py-2 text-xs" onClick={() => input.current?.click()}>{busy ? 'Subiendo imagen…' : value ? 'Subir imagen / Reemplazar' : 'Subir imagen'}</button>
    <label htmlFor={id} className="block text-xs">Pegar URL</label>
    <input id={id} type="text" inputMode="url" placeholder="https://… o /dev/api/uploads/images/…" className="w-full border rounded-xl p-2 text-sm" value={value ?? ''} disabled={disabled || busy} onChange={e => change(e.target.value)} />
    {value && !broken && <img src={value} alt="Vista previa de la imagen" className="h-28 max-w-full rounded-xl object-contain" onError={() => setBroken(true)} />}
    {broken && <p className="text-xs">No se pudo mostrar la vista previa. Revise la URL.</p>}
    {value && <button type="button" disabled={disabled || busy} onClick={() => change('')} className="text-xs underline">Quitar imagen</button>}
    <p className="text-xs">JPEG, PNG o WebP · máximo 8 MB.</p>
    <div role="status" aria-live="polite" className="text-xs">{busy ? 'Cargando imagen…' : ''}</div>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>;
}
