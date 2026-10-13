'use client';
import React, { useRef, useState } from 'react';

export function useBusinessMutation(showToast: (message: string, type: 'error') => void) {
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const run = async (action: () => Promise<unknown>, onSuccess?: () => void) => {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    try { await action(); onSuccess?.(); }
    catch (e) { showToast(e instanceof Error ? e.message : 'Unable to save record.', 'error'); }
    finally { lock.current = false; setBusy(false); }
  };
  return { busy, run };
}

export default function BusinessDataSource({ demo, onChange, loading, error, retry, empty }: {
  demo: boolean; onChange: (demo: boolean) => void; loading: boolean; error: string | null;
  retry: () => Promise<void>; empty: boolean;
}) {
  return <div className="atelier-sheet p-4 space-y-3">
    <div className="flex gap-3">
      <button className={!demo ? 'btn-mejunje-primary px-3 py-2 rounded-xl' : 'btn-mejunje-secondary px-3 py-2 rounded-xl'} onClick={() => onChange(false)}>Datos Reales</button>
      <button className={demo ? 'btn-mejunje-primary px-3 py-2 rounded-xl' : 'btn-mejunje-secondary px-3 py-2 rounded-xl'} onClick={() => onChange(true)}>Ejemplos / Demostración</button>
    </div>
    {demo ? <p className="text-xs">Datos de referencia de solo lectura.</p> : loading ? <p role="status">Cargando datos reales…</p> : error ? <div role="alert">{error} <button onClick={() => void retry()} className="btn-mejunje-secondary px-3 py-1">Reintentar</button></div> : empty ? <p>No hay datos reales. Cree el primer registro.</p> : null}
  </div>;
}
