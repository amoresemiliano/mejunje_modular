"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Product, BundleItem, formatPrice } from "@/data/catalog";

export interface CartItem {
  id: string; // unique item id in cart (slug or slug+gift)
  itemType: "product" | "bundle";
  slug: string;
  name: string;
  categoryLabel: string;
  price: number;
  sizeVolume?: string;
  imageBg: string;
  accentColor: string;
  quantity: number;
  isGiftWrapped: boolean;
  giftNote?: string;
  visualType?: "candle" | "diffuser" | "spray" | "textile" | "blend";
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: {
    itemType?: "product" | "bundle";
    slug: string;
    name: string;
    categoryLabel: string;
    price: number;
    sizeVolume?: string;
    imageBg?: string;
    accentColor?: string;
    quantity?: number;
    isGiftWrapped?: boolean;
    giftNote?: string;
    visualType?: "candle" | "diffuser" | "spray" | "textile" | "blend";
  }) => void;
  addProductToCart: (product: Product, quantity?: number, isGiftWrapped?: boolean, giftNote?: string) => void;
  addBundleToCart: (bundle: BundleItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleGiftWrap: (id: string) => void;
  setGiftNote: (id: string, note: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  shippingCost: number;
  isFreeShipping: boolean;
  amountForFreeShipping: number;
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 40000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mejunje_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mejunje_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (item: {
    itemType?: "product" | "bundle";
    slug: string;
    name: string;
    categoryLabel: string;
    price: number;
    sizeVolume?: string;
    imageBg?: string;
    accentColor?: string;
    quantity?: number;
    isGiftWrapped?: boolean;
    giftNote?: string;
    visualType?: "candle" | "diffuser" | "spray" | "textile" | "blend";
  }) => {
    const qty = item.quantity || 1;
    const isGift = item.isGiftWrapped || false;
    const note = item.giftNote || "";
    const id = `${item.slug}${isGift ? "-gift" : ""}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + qty, giftNote: note || i.giftNote } : i
        );
      } else {
        return [
          ...prev,
          {
            id,
            itemType: item.itemType || "product",
            slug: item.slug,
            name: item.name,
            categoryLabel: item.categoryLabel,
            price: item.price,
            sizeVolume: item.sizeVolume || "250g",
            imageBg: item.imageBg || "#FAF8F5",
            accentColor: item.accentColor || "#C87D38",
            quantity: qty,
            isGiftWrapped: isGift,
            giftNote: note,
            visualType: item.visualType || "candle",
          },
        ];
      }
    });

    showToast(`“${item.name}” agregado a tu mejunje`);
    setIsCartOpen(true);
  };

  const addProductToCart = (
    product: Product,
    quantity = 1,
    isGiftWrapped = false,
    giftNote = ""
  ) => {
    addToCart({
      itemType: "product",
      slug: product.slug,
      name: product.name,
      categoryLabel: product.categoryLabel,
      price: product.price,
      sizeVolume: product.sizeVolume,
      imageBg: product.imageBg,
      accentColor: product.accentColor,
      quantity,
      isGiftWrapped,
      giftNote,
      visualType: product.visualType,
    });
  };

  const addBundleToCart = (bundle: BundleItem) => {
    addToCart({
      itemType: "bundle",
      slug: bundle.slug,
      name: bundle.title,
      categoryLabel: "Set & Bundle Especial",
      price: bundle.bundlePrice,
      sizeVolume: `${bundle.productsIncluded.length} piezas de atelier`,
      imageBg: "#F4EFE6",
      accentColor: bundle.accentColor,
      quantity: 1,
      isGiftWrapped: true,
      visualType: "blend",
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleGiftWrap = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isGiftWrapped: !item.isGiftWrapped } : item
      )
    );
  };

  const setGiftNote = (id: string, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, giftNote: note } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }, [subtotal, appliedCoupon]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = subtotal === 0 || isFreeShipping ? 0 : 4200;
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "MEJUNJE10" || clean === "ATELIER10") {
      setAppliedCoupon({ code: clean, discountPercent: 10 });
      showToast("Cupón de 10% OFF aplicado con éxito");
      return true;
    } else if (clean === "BIENVENIDA" || clean === "PRIMERAROMA") {
      setAppliedCoupon({ code: clean, discountPercent: 15 });
      showToast("Cupón de bienvenida de 15% OFF aplicado");
      return true;
    }
    showToast("El cupón ingresado no es válido");
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addProductToCart,
        addBundleToCart,
        removeFromCart,
        updateQuantity,
        toggleGiftWrap,
        setGiftNote,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        totalItems,
        subtotal,
        discountAmount,
        total,
        shippingCost,
        isFreeShipping,
        amountForFreeShipping,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
