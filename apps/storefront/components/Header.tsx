"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Compass, 
  Sparkles, 
  Gift, 
  BookOpen, 
  Flame 
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, openCart, openSearch } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "TIENDA", href: "/tienda" },
    { label: "AROMAS", href: "/aromas" },
    { label: "COLECCIONES", href: "/colecciones" },
    { label: "REGALOS", href: "/regalos" },
    { label: "QUIZ", href: "/descubri-tu-aroma", highlight: true },
    { label: "ATELIER", href: "/atelier" },
  ];

  return (
    <>
      {/* Top micro-announcement bar */}
      <div className="bg-mejunje-charcoal text-mejunje-paper py-1.5 px-4 text-center border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-typewriter text-[11px] tracking-widest uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-mejunje-amber animate-pulse" />
          <span>ENVÍO SIN CARGO EN COMPRAS SUPERIORES A $40.000 EN CABA & GBA</span>
          <span className="hidden md:inline text-mejunje-subtle">·</span>
          <span className="hidden md:inline text-mejunje-subtle">ATELIER BUENOS AIRES</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-mejunje-border"
            : "bg-mejunje-bg border-b border-mejunje-borderLight"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-mejunje-charcoal hover:text-mejunje-amber transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Monospace Typewriter Heritage */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex flex-col items-center sm:items-start">
              <span className="font-typewriter text-2xl sm:text-3xl font-bold tracking-[0.25em] text-mejunje-charcoal group-hover:text-mejunje-amber transition-colors">
                MEJUNJE
              </span>
              <span className="font-typewriter text-[9px] tracking-[0.35em] text-mejunje-muted uppercase -mt-0.5">
                BOTICA · BUENOS AIRES
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-typewriter text-xs font-bold tracking-widest transition-colors py-1 ${
                    isActive
                      ? "text-mejunje-amber"
                      : link.highlight
                      ? "text-mejunje-terracotta hover:text-mejunje-amber"
                      : "text-mejunje-charcoal hover:text-mejunje-amber"
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-mejunje-terracotta" />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-mejunje-amber rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Find Scent Quiz, Cart Drawer) */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="p-2.5 rounded-xl text-mejunje-charcoal hover:bg-mejunje-paper hover:text-mejunje-amber transition-all flex items-center gap-1.5"
              aria-label="Buscar aromas"
            >
              <Search className="w-5 h-5" />
              <span className="hidden xl:inline font-typewriter text-[11px] text-mejunje-muted tracking-wider">
                BUSCAR
              </span>
            </button>

            {/* Quiz direct CTA */}
            <Link
              href="/descubri-tu-aroma"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-mejunje-border bg-mejunje-paper text-mejunje-charcoal hover:border-mejunje-amber hover:text-mejunje-amber transition-all font-typewriter text-xs font-semibold tracking-wider"
            >
              <Compass className="w-4 h-4 text-mejunje-terracotta" />
              <span>DESCUBRÍ TU AROMA</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-mejunje-charcoal text-mejunje-paper hover:bg-mejunje-amber transition-all duration-300 flex items-center gap-2 shadow-sm"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="font-typewriter text-xs font-bold px-1.5 py-0.5 rounded-full bg-mejunje-amber text-white min-w-[20px] text-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-mejunje-border px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <Link
                href="/descubri-tu-aroma"
                className="flex items-center gap-2 p-3 rounded-xl bg-mejunje-paper border border-mejunje-border font-typewriter text-xs font-bold text-mejunje-charcoal"
              >
                <Compass className="w-4 h-4 text-mejunje-terracotta" />
                <span>QUIZ OLFATIVO</span>
              </Link>
              <Link
                href="/regalos"
                className="flex items-center gap-2 p-3 rounded-xl bg-mejunje-paper border border-mejunje-border font-typewriter text-xs font-bold text-mejunje-charcoal"
              >
                <Gift className="w-4 h-4 text-mejunje-amber" />
                <span>REGALOS</span>
              </Link>
            </div>

            <div className="flex flex-col space-y-3 divide-y divide-mejunje-borderLight">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pt-3 font-typewriter text-sm font-bold tracking-widest flex items-center justify-between ${
                    pathname === link.href ? "text-mejunje-amber" : "text-mejunje-charcoal"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-mejunje-muted font-normal">→</span>
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-mejunje-border">
              <p className="font-editorial italic text-xs text-mejunje-muted text-center">
                “historias de vida envueltas en perfume.”
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
