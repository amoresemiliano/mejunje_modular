import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "MEJUNJE · Botica & Atelier Olfativo Buenos Aires",
  description: "Velas botánicas de cera de soja, difusores de ratán, home sprays y blends de autor con espíritu de atelier y estética editorial.",
  keywords: ["velas aromáticas", "difusores", "home spray", "perfume textil", "buenos aires", "mejunje", "botánica", "atelier"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-mejunje-bg text-mejunje-charcoal selection:bg-mejunje-amber selection:text-white">
        <CartProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
