'use client';
import React, { useState } from 'react';
import { ClientContact } from '@/types';
import { useKamelo } from '@/context/KameloContext';
import { useBusinessMutation } from './BusinessDataSource';
import { Users, X, Save } from './Icons';
export default function ClientEditor({ record, close }: { record?: ClientContact; close: () => void }) {
  const { addClient, updateClient, showToast } = useKamelo();
  const { busy, run } = useBusinessMutation(showToast);
  const editingClient = record;
  const [form, setForm] = useState<Omit<ClientContact, 'id'>>(record ?? { name:'',phone:'',type:'Boutique',email:'',address:'',notes:'',status:'Activo' });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    await run(() => record ? updateClient(record.id, form) : addClient(form), close);
  };
  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-mejunje-border shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => close()}
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

            <form onSubmit={handleSubmit} className="space-y-4"><fieldset disabled={busy} className="space-y-4">
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

              <label className="block text-xs">Estado<select className="w-full border rounded-xl p-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ClientContact['status'] })}>{['Activo','Inactivo','Potencial'].map(status => <option key={status}>{status}</option>)}</select></label>
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-mejunje-border">
                <button
                  type="button"
                  onClick={() => close()}
                  className="px-4 py-2 btn-mejunje-secondary text-xs rounded-xl font-typewriter"
                >
                  Cancelar
                </button>
                <button
                  disabled={busy} type="submit"
                  className="px-5 py-2 btn-mejunje-primary text-xs rounded-xl shadow-xs flex items-center gap-1.5 font-typewriter font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingClient ? 'Guardar Cambios' : 'Registrar Cliente'}</span>
                </button>
              </div>
            </fieldset></form>
          </div>
        </div>
  );
}
