'use client';

import React from 'react';
import { AlertTriangle, X } from '@/components/Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in font-typewriter">
      <div className="bg-white text-mejunje-carbon border border-mejunje-border rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-mejunje-secundario hover:text-mejunje-carbon p-1 rounded-full hover:bg-mejunje-papel transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-mejunje-rojo" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl text-mejunje-carbon mb-1">{title}</h3>
            <p className="text-xs text-mejunje-secundario leading-relaxed mb-6">{message}</p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 btn-mejunje-secondary text-xs rounded-xl"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-mejunje-rojo hover:bg-rose-800 transition-colors shadow-xs"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
