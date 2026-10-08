'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Formula,
  Ingredient,
  Supplier,
  SupplierRequirementGroup,
  PurchaseOrder,
  PurchaseItem,
  BatchTest,
  CatalogProduct,
  ProductVariant,
  MarketQuery,
  MarketBenchmark,
  ActivityLog,
  ToastNotification,
  ClientContact
} from '@/types';
import {
  mockFormulas,
  mockIngredients,
  mockSuppliers,
  mockSupplierGroups,
  mockPurchaseOrders,
  mockBatchTests,
  mockCatalogProducts,
  mockMarketQueries,
  mockMarketBenchmarks,
  mockActivityLogs,
  mockClients
} from '@/data/mockData';
import {
  getSuppliersApi,
  createSupplierApi,
  updateSupplierApi,
  deleteSupplierApi,
  CreateSupplierInput,
  UpdateSupplierInput,
  getIngredientsApi,
  createIngredientApi,
  updateIngredientApi,
  deleteIngredientApi,
  CreateIngredientInput,
  UpdateIngredientInput,
  getPurchaseOrdersApi,
  createPurchaseOrderApi,
  updatePurchaseOrderApi,
  deletePurchaseOrderApi,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
} from '@/services/api';

interface KameloContextType {
  // State
  formulas: Formula[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  demoSuppliers: Supplier[];
  demoIngredients: Ingredient[];
  realSuppliers: Supplier[];
  realIngredients: Ingredient[];
  realPurchaseOrders: PurchaseOrder[];
  demoPurchaseOrders: PurchaseOrder[];
  isSuppliersLoading: boolean;
  isIngredientsLoading: boolean;
  isPurchaseOrdersLoading: boolean;
  suppliersError: string | null;
  ingredientsError: string | null;
  purchaseOrdersError: string | null;
  requirements: SupplierRequirementGroup[];
  purchaseOrders: PurchaseOrder[];
  batchTests: BatchTest[];
  catalogProducts: CatalogProduct[];
  marketQueries: MarketQuery[];
  marketBenchmarks: MarketBenchmark[];
  activityLogs: ActivityLog[];
  toasts: ToastNotification[];
  clients: ClientContact[];
  activeModal: string | null;

  // Actions
  setActiveModal: (modal: string | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  addActivityLog: (title: string, description: string, type: ActivityLog['type']) => void;

  // API Reload Actions
  fetchRealSuppliers: () => Promise<void>;
  fetchRealIngredients: () => Promise<void>;
  fetchRealPurchaseOrders: () => Promise<void>;

  // Formulas CRUD
  addFormula: (formula: Omit<Formula, 'id'>) => Formula;
  updateFormula: (id: string, formula: Partial<Formula>) => void;
  deleteFormula: (id: string) => void;
  duplicateFormula: (id: string) => void;

  // Clients CRUD
  addClient: (client: Omit<ClientContact, 'id'>) => ClientContact;
  updateClient: (id: string, client: Partial<ClientContact>) => void;
  deleteClient: (id: string) => void;
  duplicateClient: (id: string) => void;

  // Insumos CRUD (API-backed)
  addIngredient: (ingredient: CreateIngredientInput) => Promise<Ingredient>;
  updateIngredient: (id: string, ingredient: UpdateIngredientInput) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;

  // Suppliers CRUD (API-backed)
  addSupplier: (supplier: CreateSupplierInput) => Promise<Supplier>;
  updateSupplier: (id: string, supplier: UpdateSupplierInput) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Purchase Requirements & Orders
  sendBatchToRequirements: (
    items: { ingredientName: string; requiredQty: number; unit: string; estimatedCostARS: number; supplierName?: string }[],
    formulaName: string
  ) => void;
  createPurchaseOrderFromRequirements: (supplierName: string) => void;
  addPurchaseOrder: (poInput: CreatePurchaseOrderInput) => Promise<PurchaseOrder>;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  duplicatePurchaseOrder: (id: string) => void;

  // Batches / Lab Tests
  addBatchTest: (batch: Omit<BatchTest, 'id' | 'code'>) => BatchTest;
  updateBatchTest: (id: string, batch: Partial<BatchTest>) => void;
  deleteBatchTest: (id: string) => void;
  approveBatchFormula: (batchId: string, formulaId: string) => void;

  // Catalog & Products
  addProduct: (product: Omit<CatalogProduct, 'id'>) => CatalogProduct;
  updateProduct: (id: string, product: Partial<CatalogProduct>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  addVariantToProduct: (productId: string, variant: Omit<ProductVariant, 'id'>) => void;
  updateVariant: (productId: string, variantId: string, variant: Partial<ProductVariant>) => void;
  deleteVariant: (productId: string, variantId: string) => void;

  // Market Queries & Benchmarks
  addMarketQuery: (query: Omit<MarketQuery, 'id'>) => MarketQuery;
  updateMarketQuery: (id: string, query: Partial<MarketQuery>) => void;
  deleteMarketQuery: (id: string) => void;
  duplicateMarketQuery: (id: string) => void;
  toggleMarketQueryStatus: (id: string) => void;
  runMarketQueries: () => void;
  adjustBenchmarkPrice: (benchmarkId: string, newPriceARS: number) => void;
  updateBenchmarkPrice: (benchmarkId: string, newPriceARS: number) => void;
}

const KameloContext = createContext<KameloContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kamelo_v2_app_state';

export const KameloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formulas, setFormulas] = useState<Formula[]>(mockFormulas);
  const [demoIngredients] = useState<Ingredient[]>(mockIngredients);
  const [demoSuppliers] = useState<Supplier[]>(mockSuppliers);

  // REAL API State for Suppliers, Ingredients & Purchase Orders
  const [realSuppliers, setRealSuppliers] = useState<Supplier[]>([]);
  const [realIngredients, setRealIngredients] = useState<Ingredient[]>([]);
  const [demoPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [realPurchaseOrders, setRealPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isSuppliersLoading, setIsSuppliersLoading] = useState<boolean>(true);
  const [isIngredientsLoading, setIsIngredientsLoading] = useState<boolean>(true);
  const [isPurchaseOrdersLoading, setIsPurchaseOrdersLoading] = useState<boolean>(true);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);
  const [ingredientsError, setIngredientsError] = useState<string | null>(null);
  const [purchaseOrdersError, setPurchaseOrdersError] = useState<string | null>(null);

  const [requirements, setRequirements] = useState<SupplierRequirementGroup[]>(mockSupplierGroups);
  const [batchTests, setBatchTests] = useState<BatchTest[]>(mockBatchTests);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(mockCatalogProducts);
  const [marketQueries, setMarketQueries] = useState<MarketQuery[]>(mockMarketQueries);
  const [marketBenchmarks, setMarketBenchmarks] = useState<MarketBenchmark[]>(mockMarketBenchmarks);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [clients, setClients] = useState<ClientContact[]>(mockClients);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Fetch Suppliers from PHP REST API
  const fetchRealSuppliers = async () => {
    setIsSuppliersLoading(true);
    setSuppliersError(null);
    try {
      const data = await getSuppliersApi();
      setRealSuppliers(data);
    } catch (e: any) {
      console.error('Failed to load real suppliers from API:', e);
      setSuppliersError(e.message || 'Error al cargar proveedores de la API.');
    } finally {
      setIsSuppliersLoading(false);
    }
  };

  // Fetch Ingredients from PHP REST API
  const fetchRealIngredients = async () => {
    setIsIngredientsLoading(true);
    setIngredientsError(null);
    try {
      const data = await getIngredientsApi();
      setRealIngredients(data);
    } catch (e: any) {
      console.error('Failed to load real ingredients from API:', e);
      setIngredientsError(e.message || 'Error al cargar insumos de la API.');
    } finally {
      setIsIngredientsLoading(false);
    }
  };

  // Fetch Purchase Orders from PHP REST API
  const fetchRealPurchaseOrders = async () => {
    setIsPurchaseOrdersLoading(true);
    setPurchaseOrdersError(null);
    try {
      const data = await getPurchaseOrdersApi();
      setRealPurchaseOrders(data);
    } catch (e: any) {
      console.error('Failed to load real purchase orders from API:', e);
      setPurchaseOrdersError(e.message || 'Error al cargar órdenes de compra de la API.');
    } finally {
      setIsPurchaseOrdersLoading(false);
    }
  };

  // Initial API Load
  useEffect(() => {
    fetchRealSuppliers();
    fetchRealIngredients();
    fetchRealPurchaseOrders();
  }, []);

  // Hydrate from localStorage on initial load (EXCLUDES suppliers, ingredients & purchase orders as real source of truth)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formulas) setFormulas(parsed.formulas);
        // Note: localStorage suppliers, ingredients & purchase orders are ignored for real operational state
        if (parsed.requirements) setRequirements(parsed.requirements);
        if (parsed.batchTests) setBatchTests(parsed.batchTests);
        if (parsed.catalogProducts) setCatalogProducts(parsed.catalogProducts);
        if (parsed.marketQueries) setMarketQueries(parsed.marketQueries);
        if (parsed.marketBenchmarks) setMarketBenchmarks(parsed.marketBenchmarks);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        if (parsed.clients) setClients(parsed.clients);
      }
    } catch (e) {
      console.error('Failed to load local storage state', e);
    }
  }, []);

  // Save to localStorage on changes (EXCLUDES suppliers, ingredients and purchase orders)
  useEffect(() => {
    try {
      const stateToSave = {
        formulas,
        requirements,
        batchTests,
        catalogProducts,
        marketQueries,
        marketBenchmarks,
        activityLogs,
        clients,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to local storage', e);
    }
  }, [
    formulas,
    requirements,
    batchTests,
    catalogProducts,
    marketQueries,
    marketBenchmarks,
    activityLogs,
    clients,
  ]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity Log Helper
  const addActivityLog = (title: string, description: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Ahora',
      title,
      description,
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // ---------------------------------------------------------------------------
  // FORMULAS CRUD
  // ---------------------------------------------------------------------------
  const addFormula = (formulaData: Omit<Formula, 'id'>): Formula => {
    const newId = `form-${Date.now()}`;
    const newFormula: Formula = { ...formulaData, id: newId };
    setFormulas((prev) => [newFormula, ...prev]);
    addActivityLog('Fórmula Creada', `Nueva fórmula "${newFormula.name}" (${newFormula.category}) registrada.`, 'formula');
    showToast(`Fórmula "${newFormula.name}" creada exitosamente.`);
    return newFormula;
  };

  const updateFormula = (id: string, partial: Partial<Formula>) => {
    setFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...partial } : f))
    );
    addActivityLog('Fórmula Actualizada', `Se guardaron los cambios en la fórmula.`, 'formula');
    showToast('Fórmula actualizada correctamente.');
  };

  const deleteFormula = (id: string) => {
    const target = formulas.find((f) => f.id === id);
    setFormulas((prev) => prev.filter((f) => f.id !== id));
    if (target) {
      addActivityLog('Fórmula Eliminada', `Fórmula "${target.name}" fue eliminada.`, 'formula');
      showToast(`Fórmula "${target.name}" eliminada.`, 'info');
    }
  };

  const duplicateFormula = (id: string) => {
    const target = formulas.find((f) => f.id === id);
    if (!target) return;
    const duplicated: Formula = {
      ...target,
      id: `form-${Date.now()}`,
      name: `${target.name} (Copia)`,
      version: `${target.version}.1`,
      status: 'Borrador',
    };
    setFormulas((prev) => [duplicated, ...prev]);
    addActivityLog('Fórmula Duplicada', `Copia generada: "${duplicated.name}".`, 'formula');
    showToast(`Fórmula duplicada como "${duplicated.name}".`);
  };

  // ---------------------------------------------------------------------------
  // CLIENTS CRUD
  // ---------------------------------------------------------------------------
  const addClient = (clientData: Omit<ClientContact, 'id'>): ClientContact => {
    const newId = `cli-${Date.now()}`;
    const newClient: ClientContact = { ...clientData, id: newId, status: clientData.status || 'Activo' };
    setClients((prev) => [newClient, ...prev]);
    addActivityLog('Cliente Registrado', `Nuevo cliente "${newClient.name}" (${newClient.type}) añadido al registro.`, 'client');
    showToast(`Cliente "${newClient.name}" registrado.`);
    return newClient;
  };

  const updateClient = (id: string, partial: Partial<ClientContact>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c))
    );
    addActivityLog('Cliente Actualizado', `Datos de contacto actualizados.`, 'client');
    showToast('Cliente actualizado correctamente.');
  };

  const deleteClient = (id: string) => {
    const target = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      addActivityLog('Cliente Eliminado', `Cliente "${target.name}" removido.`, 'client');
      showToast(`Cliente "${target.name}" eliminado.`, 'info');
    }
  };

  const duplicateClient = (id: string) => {
    const target = clients.find((c) => c.id === id);
    if (!target) return;
    const duplicated: ClientContact = {
      ...target,
      id: `cli-${Date.now()}`,
      name: `${target.name} (Copia)`,
    };
    setClients((prev) => [duplicated, ...prev]);
    showToast(`Cliente duplicado como "${duplicated.name}".`);
  };

  // ---------------------------------------------------------------------------
  // INSUMOS / INGREDIENTES CRUD
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // INSUMOS / INGREDIENTES CRUD (API-backed)
  // ---------------------------------------------------------------------------
  const addIngredient = async (ingInput: CreateIngredientInput): Promise<Ingredient> => {
    try {
      const created = await createIngredientApi(ingInput);
      setRealIngredients((prev) => [created, ...prev.filter((i) => i.id !== created.id)]);
      addActivityLog(
        'Insumo Registrado (API)',
        `Nueva materia prima "${created.name}" registrada en MySQL.`,
        'supplier'
      );
      showToast(`Materia prima "${created.name}" registrada exitosamente en MySQL.`);
      return created;
    } catch (e: any) {
      console.error('Failed to create ingredient via API:', e);
      showToast(e.message || 'Error al registrar materia prima en la API.', 'error');
      throw e;
    }
  };

  const updateIngredient = async (id: string, partial: UpdateIngredientInput): Promise<void> => {
    try {
      const updated = await updateIngredientApi(id, partial);
      setRealIngredients((prev) => prev.map((i) => (i.id === id ? updated : i)));
      addActivityLog('Insumo Modificado (API)', `Materia prima "${updated.name}" actualizada en MySQL.`, 'supplier');
      showToast('Materia prima actualizada correctamente en MySQL.');
    } catch (e: any) {
      console.error('Failed to update ingredient via API:', e);
      showToast(e.message || 'Error al actualizar materia prima en la API.', 'error');
      throw e;
    }
  };

  const deleteIngredient = async (id: string): Promise<void> => {
    const target = realIngredients.find((i) => i.id === id);
    try {
      await deleteIngredientApi(id);
      setRealIngredients((prev) => prev.filter((i) => i.id !== id));
      if (target) {
        addActivityLog('Insumo Eliminado (API)', `Materia prima "${target.name}" desactivada en MySQL.`, 'supplier');
        showToast(`Materia prima "${target.name}" eliminada (soft delete).`, 'info');
      }
    } catch (e: any) {
      console.error('Failed to delete ingredient via API:', e);
      showToast(e.message || 'Error al eliminar materia prima en la API.', 'error');
      throw e;
    }
  };

  // ---------------------------------------------------------------------------
  // SUPPLIERS CRUD (API-backed)
  // ---------------------------------------------------------------------------
  const addSupplier = async (supplierInput: CreateSupplierInput): Promise<Supplier> => {
    try {
      const created = await createSupplierApi(supplierInput);
      setRealSuppliers((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
      
      // Also sync requirement group
      setRequirements((prev) => [
        ...prev,
        {
          supplierId: created.id,
          supplierName: created.name,
          minPurchaseARS: created.minPurchaseARS || 0,
          requirements: [],
          totalARS: 0,
          meetsMinimum: false,
        },
      ]);

      addActivityLog('Proveedor Registrado (API)', `Nuevo proveedor "${created.name}" registrado en MySQL.`, 'supplier');
      showToast(`Proveedor "${created.name}" registrado exitosamente en MySQL.`);
      return created;
    } catch (e: any) {
      console.error('Failed to create supplier via API:', e);
      showToast(e.message || 'Error al registrar proveedor en la API.', 'error');
      throw e;
    }
  };

  const updateSupplier = async (id: string, partial: UpdateSupplierInput): Promise<void> => {
    try {
      const updated = await updateSupplierApi(id, partial);
      setRealSuppliers((prev) => prev.map((s) => (s.id === id ? updated : s)));
      
      if (updated.name || updated.minPurchaseARS !== undefined) {
        setRequirements((prev) =>
          prev.map((r) => {
            if (r.supplierId === id) {
              const minP = updated.minPurchaseARS !== undefined ? updated.minPurchaseARS : r.minPurchaseARS;
              return {
                ...r,
                supplierName: updated.name || r.supplierName,
                minPurchaseARS: minP,
                meetsMinimum: r.totalARS >= minP,
              };
            }
            return r;
          })
        );
      }

      showToast('Proveedor actualizado correctamente en MySQL.');
    } catch (e: any) {
      console.error('Failed to update supplier via API:', e);
      showToast(e.message || 'Error al actualizar proveedor en la API.', 'error');
      throw e;
    }
  };

  const deleteSupplier = async (id: string): Promise<void> => {
    const target = realSuppliers.find((s) => s.id === id);
    try {
      await deleteSupplierApi(id);
      setRealSuppliers((prev) => prev.filter((s) => s.id !== id));
      setRequirements((prev) => prev.filter((r) => r.supplierId !== id));
      if (target) {
        addActivityLog('Proveedor Eliminado (API)', `Proveedor "${target.name}" desactivado en MySQL.`, 'supplier');
        showToast(`Proveedor "${target.name}" eliminado (soft delete).`, 'info');
      }
    } catch (e: any) {
      console.error('Failed to delete supplier via API:', e);
      showToast(e.message || 'Error al eliminar proveedor en la API.', 'error');
      throw e;
    }
  };

  // ---------------------------------------------------------------------------
  // PURCHASES & REQUIREMENTS
  // ---------------------------------------------------------------------------
  const sendBatchToRequirements = (
    items: { ingredientName: string; requiredQty: number; unit: string; estimatedCostARS: number; supplierName?: string }[],
    formulaName: string
  ) => {
    setRequirements((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        const suppName = item.supplierName || 'Proveedor General';
        let groupIndex = updated.findIndex((g) => g.supplierName.toLowerCase() === suppName.toLowerCase());

        if (groupIndex === -1) {
          const matchedSup = realSuppliers.find((s) => s.name.toLowerCase() === suppName.toLowerCase()) || demoSuppliers.find((s) => s.name.toLowerCase() === suppName.toLowerCase());
          const supId = matchedSup ? matchedSup.id : `sup-${Date.now()}`;
          const minP = matchedSup ? matchedSup.minPurchaseARS : 100000;
          updated.push({
            supplierId: supId,
            supplierName: suppName,
            minPurchaseARS: minP,
            requirements: [],
            totalARS: 0,
            meetsMinimum: false,
          });
          groupIndex = updated.length - 1;
        }

        const reqList = [...updated[groupIndex].requirements];
        reqList.push({
          id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          ingredientName: item.ingredientName,
          requiredQty: item.requiredQty,
          unit: item.unit,
          unitPriceARS: item.estimatedCostARS / (item.requiredQty || 1),
          subtotalARS: item.estimatedCostARS,
          formulaReferences: [formulaName],
        });

        const newTotal = reqList.reduce((acc, r) => acc + r.subtotalARS, 0);
        updated[groupIndex] = {
          ...updated[groupIndex],
          requirements: reqList,
          totalARS: newTotal,
          meetsMinimum: newTotal >= updated[groupIndex].minPurchaseARS,
        };
      });
      return updated;
    });

    addActivityLog('Requerimientos de Producción Enviados', `Batch de "${formulaName}" derivado a Compras.`, 'purchase');
    showToast(`Requerimientos de batch "${formulaName}" enviados a Compras.`);
  };

  const createPurchaseOrderFromRequirements = (supplierName: string) => {
    showToast(
      'Las necesidades derivan de fórmulas demo. Para emitir una orden de compra real use la pestaña Órdenes > Nueva Orden de Compra.',
      'warning'
    );
  };

  const addPurchaseOrder = async (poInput: CreatePurchaseOrderInput): Promise<PurchaseOrder> => {
    try {
      const created = await createPurchaseOrderApi(poInput);
      setRealPurchaseOrders((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
      addActivityLog(
        'Orden de Compra Registrada (API)',
        `OC ${created.code} registrada para ${created.supplierName} en MySQL.`,
        'purchase'
      );
      showToast(`Orden de compra ${created.code} registrada exitosamente.`);
      return created;
    } catch (e: any) {
      console.error('Failed to create PO via API:', e);
      showToast(e.message || 'Error al registrar orden de compra en la API.', 'error');
      throw e;
    }
  };

  const updatePurchaseOrderStatus = async (id: string, status: PurchaseOrder['status']): Promise<void> => {
    try {
      const updated = await updatePurchaseOrderApi(id, { status });
      setRealPurchaseOrders((prev) => prev.map((p) => (p.id === id ? updated : p)));

      if (status === 'Recibida') {
        await fetchRealIngredients();
        showToast(`Orden ${updated.code} recibida. ¡Cantidades sumadas al stock real de insumos!`, 'success');
      } else {
        showToast(`Estado de la orden ${updated.code} actualizado a ${status}.`);
      }
      addActivityLog('Estado OC Cambiado (API)', `Orden ${updated.code} marcada como ${status}.`, 'purchase');
    } catch (e: any) {
      console.error('Failed to update PO status via API:', e);
      showToast(e.message || 'Error al actualizar estado de la orden en la API.', 'error');
      throw e;
    }
  };

  const deletePurchaseOrder = async (id: string): Promise<void> => {
    const target = realPurchaseOrders.find((p) => p.id === id);
    try {
      await deletePurchaseOrderApi(id);
      setRealPurchaseOrders((prev) => prev.filter((p) => p.id !== id));
      if (target) {
        addActivityLog('Orden de Compra Eliminada (API)', `Orden ${target.code} deshabilitada en MySQL.`, 'purchase');
        showToast(`Orden ${target.code} eliminada (soft delete).`, 'info');
      }
    } catch (e: any) {
      console.error('Failed to delete PO via API:', e);
      showToast(e.message || 'Error al eliminar orden de compra en la API.', 'error');
      throw e;
    }
  };

  const duplicatePurchaseOrder = (id: string) => {
    const target = realPurchaseOrders.find((p) => p.id === id) || demoPurchaseOrders.find((p) => p.id === id);
    if (!target) return;
    showToast('Para emitir una nueva orden de compra, use la opción Nueva Orden Real.', 'info');
  };

  // ---------------------------------------------------------------------------
  // BATCH TESTS / LAB TESTS
  // ---------------------------------------------------------------------------
  const addBatchTest = (batchData: Omit<BatchTest, 'id' | 'code'>): BatchTest => {
    const newId = `bt-${Date.now()}`;
    const code = `LAB-2026-00${batchTests.length + 1}`;
    const newBatch: BatchTest = { ...batchData, id: newId, code };
    setBatchTests((prev) => [newBatch, ...prev]);
    addActivityLog('Prueba de Laboratorio Registrada', `Batch ${code} registrado para "${newBatch.formulaName}".`, 'batch');
    showToast(`Prueba de laboratorio ${code} registrada.`);
    return newBatch;
  };

  const updateBatchTest = (id: string, partial: Partial<BatchTest>) => {
    setBatchTests((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...partial } : b))
    );
    showToast('Prueba de laboratorio actualizada.');
  };

  const deleteBatchTest = (id: string) => {
    const target = batchTests.find((b) => b.id === id);
    setBatchTests((prev) => prev.filter((b) => b.id !== id));
    if (target) {
      addActivityLog('Prueba Eliminada', `Batch ${target.code} eliminado.`, 'batch');
      showToast(`Prueba ${target.code} eliminada.`, 'info');
    }
  };

  const approveBatchFormula = (batchId: string, formulaId: string) => {
    setBatchTests((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'Aprobada' } : b))
    );
    setFormulas((prev) =>
      prev.map((f) => (f.id === formulaId ? { ...f, status: 'Aprobada' } : f))
    );
    addActivityLog('Fórmula Aprobada en Laboratorio', `Fórmula de batch marcada como Aprobada.`, 'batch');
    showToast(`Fórmula aprobada oficialmente desde laboratorio.`);
  };

  // ---------------------------------------------------------------------------
  // PRODUCTS & CATALOG
  // ---------------------------------------------------------------------------
  const addProduct = (productData: Omit<CatalogProduct, 'id'>): CatalogProduct => {
    const newId = `prod-${Date.now()}`;
    const newProduct: CatalogProduct = { ...productData, id: newId };
    setCatalogProducts((prev) => [newProduct, ...prev]);

    // Create a market benchmark automatically for this product
    if (newProduct.variants && newProduct.variants.length > 0) {
      const v = newProduct.variants[0];
      setMarketBenchmarks((prev) => [
        ...prev,
        {
          id: `bench-${Date.now()}`,
          productName: `${newProduct.name} ${v.size}`,
          category: newProduct.category,
          kameloPriceARS: v.salePriceARS,
          competitorAverageARS: Math.round(v.salePriceARS * 1.08),
          competitorMinARS: Math.round(v.salePriceARS * 0.88),
          competitorMaxARS: Math.round(v.salePriceARS * 1.25),
          kameloMarginPercent: Math.round(((v.salePriceARS - v.estimatedCostARS) / v.salePriceARS) * 100),
          lastUpdated: new Date().toLocaleDateString('es-AR'),
          status: 'Competitivo',
        },
      ]);
    }

    addActivityLog('Producto Creado', `Nuevo producto "${newProduct.name}" agregado al catálogo.`, 'catalog');
    showToast(`Producto "${newProduct.name}" creado en catálogo.`);
    return newProduct;
  };

  const updateProduct = (id: string, partial: Partial<CatalogProduct>) => {
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
    addActivityLog('Producto Actualizado', `Ficha de producto modificada.`, 'catalog');
    showToast('Producto actualizado.');
  };

  const deleteProduct = (id: string) => {
    const target = catalogProducts.find((p) => p.id === id);
    setCatalogProducts((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      addActivityLog('Producto Eliminado', `Producto "${target.name}" removido de catálogo.`, 'catalog');
      showToast(`Producto "${target.name}" eliminado.`, 'info');
    }
  };

  const duplicateProduct = (id: string) => {
    const target = catalogProducts.find((p) => p.id === id);
    if (!target) return;
    const duplicated: CatalogProduct = {
      ...target,
      id: `prod-${Date.now()}`,
      sku: `${target.sku}-COPY`,
      name: `${target.name} (Copia)`,
      status: 'Borrador',
    };
    setCatalogProducts((prev) => [duplicated, ...prev]);
    addActivityLog('Producto Duplicado', `Copia realizada: "${duplicated.name}".`, 'catalog');
    showToast(`Producto duplicado como "${duplicated.name}".`);
  };

  const addVariantToProduct = (productId: string, variantData: Omit<ProductVariant, 'id'>) => {
    const newVariantId = `var-${Date.now()}`;
    const newVariant: ProductVariant = { ...variantData, id: newVariantId };
    setCatalogProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, variants: [...p.variants, newVariant] };
        }
        return p;
      })
    );
    showToast(`Variante ${newVariant.size} agregada.`);
  };

  const updateVariant = (productId: string, variantId: string, partial: Partial<ProductVariant>) => {
    setCatalogProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) => (v.id === variantId ? { ...v, ...partial } : v)),
          };
        }
        return p;
      })
    );
    showToast('Variante actualizada.');
  };

  const deleteVariant = (productId: string, variantId: string) => {
    setCatalogProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.filter((v) => v.id !== variantId),
          };
        }
        return p;
      })
    );
    showToast('Variante eliminada.', 'info');
  };

  // ---------------------------------------------------------------------------
  // MARKET QUERIES & BENCHMARKS
  // ---------------------------------------------------------------------------
  const addMarketQuery = (queryData: Omit<MarketQuery, 'id'>): MarketQuery => {
    const newId = `mq-${Date.now()}`;
    const newQuery: MarketQuery = { ...queryData, id: newId };
    setMarketQueries((prev) => [newQuery, ...prev]);
    addActivityLog('Consulta Configurada', `Nueva consulta de mercado "${newQuery.name}" creada.`, 'market');
    showToast(`Consulta de mercado "${newQuery.name}" creada.`);
    return newQuery;
  };

  const updateMarketQuery = (id: string, partial: Partial<MarketQuery>) => {
    setMarketQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...partial } : q))
    );
    showToast('Consulta de mercado actualizada.');
  };

  const deleteMarketQuery = (id: string) => {
    const target = marketQueries.find((q) => q.id === id);
    setMarketQueries((prev) => prev.filter((q) => q.id !== id));
    if (target) {
      addActivityLog('Consulta Eliminada', `Consulta "${target.name}" removida.`, 'market');
      showToast(`Consulta "${target.name}" eliminada.`, 'info');
    }
  };

  const duplicateMarketQuery = (id: string) => {
    const target = marketQueries.find((q) => q.id === id);
    if (!target) return;
    const duplicated: MarketQuery = {
      ...target,
      id: `mq-${Date.now()}`,
      name: `${target.name} (Copia)`,
      lastRun: undefined,
    };
    setMarketQueries((prev) => [duplicated, ...prev]);
    addActivityLog('Consulta Duplicada', `Consulta "${target.name}" duplicada.`, 'market');
    showToast(`Consulta duplicada como "${duplicated.name}".`);
  };

  const toggleMarketQueryStatus = (id: string) => {
    setMarketQueries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: q.status === 'Activo' ? 'Inactivo' : 'Activo' } : q
      )
    );
  };

  const runMarketQueries = () => {
    const activeCount = marketQueries.filter((q) => q.status === 'Activo').length;
    const nowStr = new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    setMarketQueries((prev) =>
      prev.map((q) => (q.status === 'Activo' ? { ...q, lastRun: nowStr } : q))
    );

    // Simulate minor price fluctuation in benchmarks
    setMarketBenchmarks((prev) =>
      prev.map((b) => {
        const delta = Math.floor(Math.random() * 800) - 400;
        const newAvg = Math.max(5000, b.competitorAverageARS + delta);
        return {
          ...b,
          competitorAverageARS: newAvg,
          lastUpdated: new Date().toLocaleDateString('es-AR'),
        };
      })
    );

    addActivityLog('Consulta de Mercado Ejecutada', `Simulación ejecutada sobre ${activeCount} consultas activas.`, 'market');
    showToast(`Consulta de mercado completada — datos simulados (${activeCount} consultas ejecutadas).`);
  };

  const adjustBenchmarkPrice = (benchmarkId: string, newPriceARS: number) => {
    setMarketBenchmarks((prev) =>
      prev.map((b) => {
        if (b.id === benchmarkId) {
          return {
            ...b,
            kameloPriceARS: newPriceARS,
            status: newPriceARS < b.competitorAverageARS ? 'Competitivo' : 'Precio Alto',
          };
        }
        return b;
      })
    );
    addActivityLog('Precio Reajustado', `Precio reajustado a ${newPriceARS.toLocaleString('es-AR')} según mercado.`, 'market');
    showToast(`Precio Kamelo ajustado a ${newPriceARS.toLocaleString('es-AR')}.`);
  };

  return (
    <KameloContext.Provider
      value={{
        formulas,
        ingredients: realIngredients,
        suppliers: realSuppliers,
        demoSuppliers,
        demoIngredients,
        realSuppliers,
        realIngredients,
        realPurchaseOrders,
        demoPurchaseOrders,
        isSuppliersLoading,
        isIngredientsLoading,
        isPurchaseOrdersLoading,
        suppliersError,
        ingredientsError,
        purchaseOrdersError,
        fetchRealSuppliers,
        fetchRealIngredients,
        fetchRealPurchaseOrders,
        requirements,
        purchaseOrders: realPurchaseOrders,
        batchTests,
        catalogProducts,
        marketQueries,
        marketBenchmarks,
        activityLogs,
        toasts,
        clients,
        activeModal,

        setActiveModal,
        showToast,
        removeToast,
        addActivityLog,

        addFormula,
        updateFormula,
        deleteFormula,
        duplicateFormula,

        addClient,
        updateClient,
        deleteClient,
        duplicateClient,

        addIngredient,
        updateIngredient,
        deleteIngredient,

        addSupplier,
        updateSupplier,
        deleteSupplier,

        sendBatchToRequirements,
        createPurchaseOrderFromRequirements,
        addPurchaseOrder,
        updatePurchaseOrderStatus,
        deletePurchaseOrder,
        duplicatePurchaseOrder,

        addBatchTest,
        updateBatchTest,
        deleteBatchTest,
        approveBatchFormula,

        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addVariantToProduct,
        updateVariant,
        deleteVariant,

        addMarketQuery,
        updateMarketQuery,
        deleteMarketQuery,
        duplicateMarketQuery,
        toggleMarketQueryStatus,
        runMarketQueries,
        adjustBenchmarkPrice,
        updateBenchmarkPrice: adjustBenchmarkPrice,
      }}
    >
      {children}
    </KameloContext.Provider>
  );
};

export const useKamelo = () => {
  const context = useContext(KameloContext);
  if (!context) {
    throw new Error('useKamelo must be used within a KameloProvider');
  }
  return context;
};
