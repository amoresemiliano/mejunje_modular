'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
  Users,
  Building2,
  Menu,
  X,
  Plus,
  ArrowRight,
  CandleIcon,
  DropperIcon,
  BotanicalBranchMini,
} from '@/components/Icons';
import { LotusLogoHeader, LotusIcon } from '@/components/LotusLogo';
import { useKamelo } from '@/context/KameloContext';

interface NavGroup {
  title: string;
  items: {
    href: string;
    label: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[];
}

export default function Navigation() {
  const pathname = usePathname();
  const { requirements, purchaseOrders, setActiveModal } = useKamelo();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  // Active alerts count
  const pendingOrdersCount = purchaseOrders.filter(
    (p) => p.status === 'Solicitada' || p.status === 'Pendiente'
  ).length;
  const pendingRequirementsCount = requirements.filter(
    (r) => r.requirements.length > 0
  ).length;

  const navGroups: NavGroup[] = [
    {
      title: 'PANEL PRINCIPAL',
      items: [
        {
          href: '/',
          label: 'Dashboard',
          description: 'Visión general del atelier',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'OPERACIÓN DE TALLER',
      items: [
        {
          href: '/laboratorio',
          label: 'Laboratorio',
          description: 'Fórmulas, insumos y batches',
          icon: FlaskConical,
        },
        {
          href: '/compras',
          label: 'Abastecimiento',
          description: 'Compras y mínimos de taller',
          icon: ShoppingBag,
          badge: pendingOrdersCount + pendingRequirementsCount,
        },
      ],
    },
    {
      title: 'GESTIÓN COMERCIAL',
      items: [
        {
          href: '/catalogo',
          label: 'Catálogo Editorial',
          description: 'Fichas botánicas y WhatsApp',
          icon: BookOpen,
        },
        {
          href: '/mercado',
          label: 'Observatorio',
          description: 'Monitoreo de precios y marcas',
          icon: TrendingUp,
        },
        {
          href: '/clientes',
          label: 'Clientes',
          description: 'Boutiques, mayoristas y retail',
          icon: Users,
        },
      ],
    },
    {
      title: 'RED DE CONTACTOS',
      items: [
        {
          href: '/proveedores',
          label: 'Proveedores',
          description: 'Destilerías, envases e insumos',
          icon: Building2,
        },
      ],
    },
  ];

  return (
    <>
      {/* =================================================================== */}
      {/* DESKTOP SIDEBAR (PERSISTENT ON lg+) */}
      {/* =================================================================== */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-mejunje-border h-screen sticky top-0 shrink-0 z-30 font-typewriter select-none">
        {/* Sidebar Header / Brand */}
        <div className="p-6 border-b border-mejunje-border flex items-center justify-between">
          <Link href="/" className="group focus:outline-none block w-full">
            <LotusLogoHeader />
          </Link>
        </div>

        {/* Quick Action Button in Sidebar */}
        <div className="px-5 pt-4 pb-2 relative">
          <button
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl btn-mejunje-primary text-xs shadow-xs transition-all active:scale-98 font-bold"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nueva Entrada
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
              +
            </span>
          </button>

          {/* Quick Menu Popover */}
          {quickMenuOpen && (
            <div className="absolute left-5 right-5 top-16 bg-white border border-mejunje-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1 text-xs text-mejunje-carbon">
              <button
                onClick={() => {
                  setActiveModal('formula');
                  setQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-mejunje-papel text-left transition-colors"
              >
                <FlaskConical className="w-3.5 h-3.5 text-mejunje-verdeprofundo" />
                <span>Nueva Fórmula</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('product');
                  setQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-mejunje-papel text-left transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-mejunje-terracota" />
                <span>Nuevo Producto</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('purchaseOrder');
                  setQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-mejunje-papel text-left transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-mejunje-ambar" />
                <span>Orden de Compra</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('supplier');
                  setQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-mejunje-papel text-left transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-mejunje-secundario" />
                <span>Nuevo Proveedor</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links grouped editorially */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-6 custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-widest text-mejunje-secundario/80 uppercase">
                {group.title}
              </span>
              <div className="space-y-1 mt-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-mejunje-papel text-mejunje-verdeprofundo font-bold border border-mejunje-borderarena shadow-xs'
                          : 'text-mejunje-carbon hover:bg-mejunje-papel/60 hover:text-mejunje-verdeprofundo'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-white text-mejunje-verdeprofundo border border-mejunje-border'
                              : 'text-mejunje-secundario group-hover:text-mejunje-verdeprofundo'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <div className="truncate">
                          <div className="truncate">{item.label}</div>
                        </div>
                      </div>

                      {item.badge && item.badge > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-mejunje-ambar text-white text-[10px] font-bold shadow-xs">
                          {item.badge}
                        </span>
                      ) : (
                        isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-mejunje-verdeprofundo" />
                        )
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-mejunje-border bg-mejunje-papel/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mejunje-verdeseco animate-pulse" />
              <span className="text-[10px] font-bold text-mejunje-verdeprofundo tracking-wider uppercase">
                Taller Activo
              </span>
            </div>
            <span className="text-[10px] text-mejunje-secundario tracking-wider">
              Buenos Aires
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-mejunje-border/60">
            <p className="text-[9px] text-mejunje-secundario tracking-widest uppercase">
              mezcla · intención · aroma
            </p>
            <LotusIcon className="w-3 h-3 text-mejunje-verdeseco" />
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MOBILE / TABLET TOP HEADER BAR (VISIBLE ON < lg) */}
      {/* =================================================================== */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md text-mejunje-carbon shadow-atelier border-b border-mejunje-border font-typewriter">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Abrir menú de navegación"
              className="p-2 rounded-xl bg-mejunje-papel border border-mejunje-border text-mejunje-carbon hover:bg-mejunje-arena/30 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="focus:outline-none">
              <LotusLogoHeader />
            </Link>
          </div>

          {/* Quick Action Button for Mobile */}
          <button
            onClick={() => setActiveModal('formula')}
            aria-label="Nueva Fórmula"
            className="p-2 rounded-xl btn-mejunje-primary text-xs shadow-xs flex items-center gap-1 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Fórmula</span>
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* MOBILE / TABLET DRAWER OVERLAY */}
      {/* =================================================================== */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex font-typewriter animate-in fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-out Drawer Menu */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-r border-mejunje-border animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-mejunje-border flex items-center justify-between">
              <LotusLogoHeader />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-full bg-mejunje-papel border border-mejunje-border text-mejunje-secundario hover:text-mejunje-carbon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <span className="px-3 text-[9px] font-bold tracking-widest text-mejunje-secundario/80 uppercase">
                    {group.title}
                  </span>
                  <div className="space-y-1 mt-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-mejunje-papel text-mejunje-verdeprofundo font-bold border border-mejunje-borderarena'
                              : 'text-mejunje-carbon hover:bg-mejunje-papel/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 ${
                                isActive
                                  ? 'text-mejunje-verdeprofundo'
                                  : 'text-mejunje-secundario'
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && item.badge > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-mejunje-ambar text-white text-[10px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-mejunje-border bg-mejunje-papel/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-mejunje-verdeprofundo uppercase tracking-wider">
                  MEJUNJE · Buenos Aires
                </span>
                <span className="text-[10px] text-mejunje-secundario">
                  Atelier
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
