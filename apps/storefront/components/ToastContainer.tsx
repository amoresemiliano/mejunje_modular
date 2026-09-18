"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Sparkles } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-mejunje-charcoal text-mejunje-paper px-5 py-3 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 font-typewriter text-xs tracking-wide">
        <Sparkles className="w-4 h-4 text-mejunje-amber shrink-0" />
        <span>{toast}</span>
      </div>
    </div>
  );
};
