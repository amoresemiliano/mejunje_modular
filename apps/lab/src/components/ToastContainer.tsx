'use client';

import React from 'react';
import { useKamelo } from '@/context/KameloContext';
import { CheckCircle2, AlertCircle, Info, X } from '@/components/Icons';

export default function ToastContainer() {
  const { toasts, removeToast } = useKamelo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none font-typewriter">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-xs font-bold transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 bg-white text-mejunje-carbon ${
              isSuccess
                ? 'border-emerald-500/40'
                : isWarning
                ? 'border-amber-500/40'
                : isError
                ? 'border-rose-500/40'
                : 'border-mejunje-border'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-5 h-5 text-mejunje-ambar shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-mejunje-rojo shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-mejunje-verdeprofundo shrink-0 mt-0.5" />}

            <div className="flex-1 leading-relaxed">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-mejunje-secundario hover:text-mejunje-carbon p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
