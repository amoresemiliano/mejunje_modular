'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Mail,
  MapPin,
  Edit3,
  Trash2,
  Copy,
  Building2,
  X,
  Save,
  FileText,
  UserCheck,
} from '@/components/Icons';
import { useKamelo } from '@/context/KameloContext';
import { ClientContact } from '@/types';

export default function ClientesPage() {
  const { clients, addClient, updateClient, deleteClient, duplicateClient, showToast } = useKamelo();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientContact | null>(null);

  // Form state
  const [form, setForm] = useState<Omit<ClientContact, 'id'>>({
    name: '',
    phone: '',
    type: 'Boutique',
    email: '',
    address: 'Buenos Aires',
    notes: '',
    status: 'Activo',
  });

  const openCreateModal = () => {
    setEditingClient(null);
    setForm({
      name: '',
      phone: '+54911',
      type: 'Boutique',
      email: '',
      address: 'Buenos Aires',
      notes: '',
      status: 'Activo',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (client: ClientContact) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      phone: client.phone,
      type: client.type,
      email: client.email || '',
      address: client.address || 'Buenos Aires',
      notes: client.notes || '',
      status: client.status || 'Activo',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('Por favor complete el nombre y teléfono del cliente.', 'warning');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, form);
    } else {
      addClient(form);
    }
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.notes && client.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'Todos' || client.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Client counts
  const totalCount = clients.length;
  const boutiqueCount = clients.filter((c) => c.type === 'Boutique').length;
  const mayoristaCount = clients.filter((c) => c.type === 'Mayorista').length;
  const minoristaCount = clients.filter((c) => c.type === 'Minorista').length;

  const handleWhatsAppContact = (client: ClientContact) => {
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    const greeting = encodeURIComponent(
      `Hola ${client.name}! Te escribimos desde MEJUNJE · Atelier de Aromas (Buenos Aires). ¿En qué podemos ayudarte hoy?`
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
              Directorio Comercial
            </span>
            <span className="text-mejunje-arena">·</span>
            <span className="text-xs text-mejunje-secundario font-typewriter">Buenos Aires</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-mejunje-carbon font-typewriter">
            Clientes & Cuentas
          </h1>
          <p className="text-sm text-mejunje-secundario font-typewriter mt-1">
            Gestión de boutiques aliadas, revendedores mayoristas y clientes particulares de MEJUNJE.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-mejunje-primary px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start md:self-auto shadow-xs font-typewriter font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Total Clientes</span>
            <Users className="w-4 h-4 text-mejunje-verdeseco" />
          </div>
          <p className="text-2xl font-bold text-mejunje-carbon font-typewriter">{totalCount}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Cuentas activas en base</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Boutiques</span>
            <Building2 className="w-4 h-4 text-mejunje-verdeprofundo" />
          </div>
          <p className="text-2xl font-bold text-mejunje-verdeprofundo font-typewriter">{boutiqueCount}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Puntos de venta de diseño</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Mayoristas</span>
            <UserCheck className="w-4 h-4 text-mejunje-ambar" />
          </div>
          <p className="text-2xl font-bold text-mejunje-ambar font-typewriter">{mayoristaCount}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Distribuidores y hoteles</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs">
          <div className="flex items-center justify-between text-mejunje-secundario mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-typewriter">Minoristas</span>
            <Users className="w-4 h-4 text-mejunje-secundario" />
          </div>
          <p className="text-2xl font-bold text-mejunje-carbon font-typewriter">{minoristaCount}</p>
          <p className="text-[10px] text-mejunje-secundario font-typewriter mt-0.5">Clientes particulares</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-mejunje-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-mejunje-secundario absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono, nota..."
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

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['Todos', 'Boutique', 'Mayorista', 'Minorista'].map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-typewriter tracking-wide transition-all ${
                  isSelected
                    ? 'bg-mejunje-verdeprofundo text-white font-bold shadow-xs'
                    : 'bg-mejunje-papel text-mejunje-secundario hover:text-mejunje-carbon hover:bg-mejunje-arena/30 border border-mejunje-border'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clients Grid / List */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mejunje-border p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-mejunje-papel text-mejunje-secundario mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-mejunje-carbon font-typewriter mb-1">
            No se encontraron clientes
          </h3>
          <p className="text-xs text-mejunje-secundario font-typewriter max-w-md mx-auto mb-4">
            No hay registros que coincidan con la búsqueda o filtro seleccionado.
          </p>
          <button
            onClick={openCreateModal}
            className="btn-mejunje-primary px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 font-typewriter font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Nuevo Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const typeBadgeColors =
              client.type === 'Boutique'
                ? 'bg-emerald-50 text-mejunje-verdeprofundo border-emerald-200'
                : client.type === 'Mayorista'
                ? 'bg-amber-50 text-mejunje-ambar border-amber-200'
                : 'bg-stone-100 text-stone-700 border-stone-200';

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-mejunje-border p-5 shadow-xs hover:border-mejunje-verdeseco/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Type & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${typeBadgeColors} font-typewriter`}
                    >
                      {client.type}
                    </span>
                    <span className="text-[10px] text-mejunje-secundario font-typewriter flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {client.status || 'Activo'}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-base text-mejunje-carbon font-typewriter group-hover:text-mejunje-verdeprofundo transition-colors">
                    {client.name}
                  </h3>

                  {/* Contact Info */}
                  <div className="mt-3 space-y-1.5 text-xs text-mejunje-secundario font-typewriter">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-mejunje-verdeseco shrink-0" />
                      <span className="text-mejunje-carbon">{client.phone}</span>
                    </div>

                    {client.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-mejunje-secundario shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-mejunje-secundario shrink-0" />
                      <span>{client.address || 'Buenos Aires'}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-mejunje-papel/70 border border-mejunje-border text-[11px] text-mejunje-carbon font-typewriter leading-relaxed">
                      <span className="font-bold text-mejunje-secundario block text-[9px] uppercase tracking-wider mb-0.5">
                        Nota de Cuenta:
                      </span>
                      {client.notes}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3.5 border-t border-mejunje-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleWhatsAppContact(client)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-typewriter text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(client)}
                      title="Editar cliente"
                      className="p-1.5 text-mejunje-secundario hover:text-mejunje-verdeprofundo hover:bg-mejunje-papel rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateClient(client.id)}
                      title="Duplicar cliente"
                      className="p-1.5 text-mejunje-secundario hover:text-mejunje-carbon hover:bg-mejunje-papel rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      title="Eliminar cliente"
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

      {/* Modal Crear / Editar Cliente */}
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
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-mejunje-carbon font-typewriter">
                  {editingClient ? 'Editar Ficha de Cliente' : 'Nuevo Cliente'}
                </h2>
                <p className="text-xs text-mejunje-secundario font-typewriter">
                  Directorio Comercial MEJUNJE · Buenos Aires
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                  Nombre o Razón Comercial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Boutique La Esmeralda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Tipo de Cuenta *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  >
                    <option value="Boutique">Boutique de Diseño</option>
                    <option value="Mayorista">Mayorista / Distribuidor</option>
                    <option value="Minorista">Particular / Minorista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+54911..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="contacto@cliente.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3.5 py-2 text-xs text-mejunje-carbon focus:outline-none focus:border-mejunje-verdeseco font-typewriter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-mejunje-carbon font-typewriter mb-1">
                  Notas / Preferencias de Pedido
                </label>
                <textarea
                  rows={3}
                  placeholder="Fragancias preferidas, volumen usual de compra, condiciones pactadas..."
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
                  <span>{editingClient ? 'Guardar Cambios' : 'Registrar Cliente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
