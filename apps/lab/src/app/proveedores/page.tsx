'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  Clock,
  Edit3,
  Trash2,
  Copy,
  ShoppingBag,
  X,
  Save,
  CheckCircle,
} from '@/components/Icons';
import { useKamelo } from '@/context/KameloContext';
import { Supplier } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const ALL_CATEGORIES = [
  'Todos',
  'Fragancias',
  'Ceras',
  'Alcoholes',
  'Envases',
  'Tapas',
  'Packaging',
  'Etiquetas',
  'Pabilos',
  'Aditivos',
  'Bases',
];

export default function ProveedoresPage() {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    requirements,
    ingredients,
    showToast,
  } = useKamelo();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [form, setForm] = useState<Omit<Supplier, 'id'>>({
    name: '',
    contactPerson: '',
    phoneWhatsApp: '+54911',
    email: '',
    web: '',
    location: 'Buenos Aires',
    categoriesSupplied: ['Fragancias'],
    minPurchaseARS: 100000,
    deliveryTimeDays: 3,
    notes: '',
  });

  const openCreateModal = () => {
    setEditingSupplier(null);
    setForm({
      name: '',
      contactPerson: '',
      phoneWhatsApp: '+54911',
      email: '',
      web: '',
      location: 'Buenos Aires',
      categoriesSupplied: ['Fragancias'],
      minPurchaseARS: 100000,
      deliveryTimeDays: 3,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phoneWhatsApp: supplier.phoneWhatsApp,
      email: supplier.email || '',
      web: supplier.web || '',
      location: supplier.location || 'Buenos Aires',
      categoriesSupplied: supplier.categoriesSupplied || [],
      minPurchaseARS: supplier.minPurchaseARS || 0,
      deliveryTimeDays: supplier.deliveryTimeDays || 3,
      notes: supplier.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Por favor ingrese el nombre del proveedor.', 'warning');
      return;
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, form);
    } else {
      addSupplier(form);
    }
    setIsModalOpen(false);
  };

  const toggleFormCategory = (cat: string) => {
    setForm((prev) => {
      const exists = prev.categoriesSupplied.includes(cat);
      if (exists) {
        return { ...prev, categoriesSupplied: prev.categoriesSupplied.filter((c) => c !== cat) };
      } else {
        return { ...prev, categoriesSupplied: [...prev.categoriesSupplied, cat] };
      }
    });
  };

  const handleDuplicate = (supplier: Supplier) => {
    addSupplier({
      ...supplier,
      name: `${supplier.name} (Copia)`,
    });
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.location && supplier.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.notes && supplier.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todos' ||
      supplier.categoriesSupplied.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalSuppliers = suppliers.length;
  const avgDeliveryDays = Math.round(
    suppliers.reduce((acc, s) => acc + (s.deliveryTimeDays || 0), 0) / (totalSuppliers || 1)
  );
  const avgMinPurchase = Math.round(
    suppliers.reduce((acc, s) => acc + (s.minPurchaseARS || 0), 0) / (totalSuppliers || 1)
  );

  const handleWhatsAppContact = (supplier: Supplier) => {
    const cleanPhone = supplier.phoneWhatsApp.replace(/[^0-9]/g, '');
    const greeting = encodeURIComponent(
      `Hola ${supplier.contactPerson || supplier.name}! Nos comunicamos desde MEJUNJE · Atelier de Aromas (Buenos Aires) para consultar disponibilidad de insumos.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${greeting}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-mejunje-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-mejunje-verdeprofundo uppercase tracking-widest font-typewriter">
              Cadena de Suministros
            </span>
            <span className="text-mejunje-arena">·</span>
            <span className="text-xs text-mejunje-secundario font-typewriter">Buenos Aires</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-mejunje-carbon font-typewriter">
            Proveedores & Destilerías
          </h1>
          <p className="text-sm text-mejunje-secundario font-typewriter mt-1">
            Archivo de contactos directos, mínimos de compra y plazos de entrega para materias primas de atelier.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            href="/compras"
            className="px-3.5 py-2 btn-mejunje-secondary text-xs rounded-xl flex items-center gap-2 font-typewriter"
          >
            <ShoppingBag className="w-4 h-4 text-mejunje-verdeseco" />
            <span>Ver Abastecimiento</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="btn-mejunje-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs font-typewriter font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Proveedores</span>
            <Building2 className="w-4 h-4 text-mejunje-verdeprofundo" />
          </div>
          <p className="text-2xl font-bold text-mejunje-carbon font-typewriter">{totalSuppliers}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Empresas y destilerías</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Insumos Registrados</span>
            <ShoppingBag className="w-4 h-4 text-mejunje-verdeseco" />
          </div>
          <p className="text-2xl font-bold text-mejunje-verdeprofundo font-typewriter">{ingredients.length}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Materias primas en catálogo</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Mínimo Promedio</span>
            <span className="text-xs font-bold text-mejunje-ambar font-typewriter">$</span>
          </div>
          <p className="text-2xl font-bold text-mejunje-ambar font-typewriter">{formatCurrency(avgMinPurchase)}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Mínimo de orden requerido</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Plazo Entrega</span>
            <Clock className="w-4 h-4 text-mejunje-secundario" />
          </div>
          <p className="text-2xl font-bold text-mejunje-carbon font-typewriter">{avgDeliveryDays} días</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Tiempo medio de despacho</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-mejunje-secundario absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, contacto, nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-mejunje-papel border border-mejunje-border rounded-xl pl-9 pr-4 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mejunje-secundario hover:text-mejunje-carbon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-typewriter tracking-wide transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-mejunje-verdeprofundo text-white font-bold shadow-xs'
                    : 'bg-mejunje-papel text-mejunje-secundario hover:text-mejunje-carbon hover:bg-mejunje-arena/30 border border-mejunje-border'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mejunje-border p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-mejunje-papel text-mejunje-secundario mx-auto flex items-center justify-center mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-mejunje-carbon font-typewriter mb-1">
            No se encontraron proveedores
          </h3>
          <p className="text-xs text-mejunje-secundario font-typewriter max-w-md mx-auto mb-4">
            No hay registros que coincidan con la búsqueda o categoría seleccionada.
          </p>
          <button
            onClick={openCreateModal}
            className="btn-mejunje-primary px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 font-typewriter font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Nuevo Proveedor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuppliers.map((supplier) => {
            // Count ingredients for this supplier
            const supplierIngCount = ingredients.filter(
              (i) => i.supplierId === supplier.id || i.supplierName.toLowerCase() === supplier.name.toLowerCase()
            ).length;

            return (
              <div
                key={supplier.id}
                className="bg-white rounded-2xl border border-mejunje-border p-5 shadow-xs hover:border-mejunje-verdeseco/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Categories & Deliveries */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1">
                      {supplier.categoriesSupplied.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border font-typewriter"
                        >
                          {cat}
                        </span>
                      ))}
                      {supplier.categoriesSupplied.length > 3 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-typewriter font-bold">
                          +{supplier.categoriesSupplied.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-mejunje-secundario font-typewriter flex items-center gap-1">
                      <Clock className="w-3 h-3 text-mejunje-verdeseco" />
                      {supplier.deliveryTimeDays}d entrega
                    </span>
                  </div>

                  {/* Name & Contact Person */}
                  <h3 className="font-bold text-base text-mejunje-carbon font-typewriter group-hover:text-mejunje-verdeprofundo transition-colors">
                    {supplier.name}
                  </h3>
                  <p className="text-xs text-mejunje-secundario font-typewriter mt-0.5">
                    Contacto: <strong className="text-mejunje-carbon">{supplier.contactPerson}</strong>
                  </p>

                  {/* Details Grid */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 bg-mejunje-papel/60 p-2.5 rounded-xl border border-mejunje-border text-[11px] font-typewriter">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-mejunje-secundario block">Mínimo Compra</span>
                      <span className="font-bold text-mejunje-carbon">{formatCurrency(supplier.minPurchaseARS)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-mejunje-secundario block">Insumos Atelier</span>
                      <span className="font-bold text-mejunje-verdeprofundo">{supplierIngCount} materias primas</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 space-y-1.5 text-xs text-mejunje-secundario font-typewriter">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-mejunje-secundario shrink-0" />
                      <span>{supplier.location || 'Buenos Aires'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-mejunje-verdeseco shrink-0" />
                      <span className="text-mejunje-carbon">{supplier.phoneWhatsApp}</span>
                    </div>

                    {supplier.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-mejunje-secundario shrink-0" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                    )}

                    {supplier.web && (
                      <div className="flex items-center gap-2 truncate">
                        <Globe className="w-3.5 h-3.5 text-mejunje-secundario shrink-0" />
                        <span className="truncate text-mejunje-verdeprofundo hover:underline">{supplier.web}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {supplier.notes && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-white border border-mejunje-border text-[11px] text-mejunje-carbon font-typewriter leading-relaxed">
                      <span className="font-bold text-mejunje-secundario block text-[9px] uppercase tracking-wider mb-0.5">
                        Especialidad / Nota:
                      </span>
                      {supplier.notes}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3.5 border-t border-mejunje-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleWhatsAppContact(supplier)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-typewriter text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(supplier)}
                      title="Editar proveedor"
                      className="p-1.5 text-mejunje-secundario hover:text-mejunje-verdeprofundo hover:bg-mejunje-papel rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(supplier)}
                      title="Duplicar proveedor"
                      className="p-1.5 text-mejunje-secundario hover:text-mejunje-carbon hover:bg-mejunje-papel rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSupplier(supplier.id)}
                      title="Eliminar proveedor"
                      className="p-1.5 text-mejunje-secundario hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Proveedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-mejunje-border shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-mejunje-secundario hover:text-mejunje-carbon p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-mejunje-border">
              <div className="w-10 h-10 rounded-xl bg-mejunje-papel border border-mejunje-border flex items-center justify-center text-mejunje-verdeprofundo">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-mejunje-carbon font-typewriter">
                  {editingSupplier ? 'Editar Ficha de Proveedor' : 'Nuevo Proveedor'}
                </h2>
                <p className="text-xs text-mejunje-secundario font-typewriter">
                  Registro de Cadena de Abastecimiento · Buenos Aires
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Razón Social / Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Destilería Aromática San Martín"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+54911..."
                    value={form.phoneWhatsApp}
                    onChange={(e) => setForm({ ...form, phoneWhatsApp: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="ventas@proveedor.com.ar"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Sitio Web / Catálogo Online
                  </label>
                  <input
                    type="text"
                    placeholder="www.proveedor.com.ar"
                    value={form.web}
                    onChange={(e) => setForm({ ...form, web: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Ubicación / Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Buenos Aires"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Mínimo de Compra ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="100000"
                    value={form.minPurchaseARS}
                    onChange={(e) => setForm({ ...form, minPurchaseARS: Number(e.target.value) })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Plazo de Entrega (Días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="3"
                    value={form.deliveryTimeDays}
                    onChange={(e) => setForm({ ...form, deliveryTimeDays: Number(e.target.value) })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>
              </div>

              {/* Categories Supplied Selector */}
              <div>
                <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1.5">
                  Rubros que Provee
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CATEGORIES.filter((c) => c !== 'Todos').map((cat) => {
                    const isSelected = form.categoriesSupplied.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleFormCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-typewriter transition-all ${
                          isSelected
                            ? 'bg-mejunje-verdeprofundo text-white font-bold'
                            : 'bg-mejunje-papel text-mejunje-secundario hover:text-mejunje-carbon border border-mejunje-border'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                  Notas / Observaciones de Calidad
                </label>
                <textarea
                  rows={3}
                  placeholder="Pureza de materias primas, acuerdos de pago, datos de cuenta bancaria..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-white border border-mejunje-border rounded-xl p-3 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-mejunje-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 btn-mejunje-secondary text-xs rounded-xl font-typewriter"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 btn-mejunje-primary text-xs rounded-xl shadow-xs flex items-center gap-1.5 font-typewriter font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingSupplier ? 'Guardar Cambios' : 'Registrar Proveedor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
