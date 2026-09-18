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

interface KameloContextType {
  // State
  formulas: Formula[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
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

  // Insumos CRUD
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'lastUpdated'>) => Ingredient;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;

  // Suppliers CRUD
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Purchase Requirements & Orders
  sendBatchToRequirements: (
    items: { ingredientName: string; requiredQty: number; unit: string; estimatedCostARS: number; supplierName?: string }[],
    formulaName: string
  ) => void;
  createPurchaseOrderFromRequirements: (supplierName: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'code'>) => PurchaseOrder;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => void;
  deletePurchaseOrder: (id: string) => void;
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
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [requirements, setRequirements] = useState<SupplierRequirementGroup[]>(mockSupplierGroups);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [batchTests, setBatchTests] = useState<BatchTest[]>(mockBatchTests);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(mockCatalogProducts);
  const [marketQueries, setMarketQueries] = useState<MarketQuery[]>(mockMarketQueries);
  const [marketBenchmarks, setMarketBenchmarks] = useState<MarketBenchmark[]>(mockMarketBenchmarks);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [clients, setClients] = useState<ClientContact[]>(mockClients);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Hydrate from localStorage on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formulas) setFormulas(parsed.formulas);
        if (parsed.ingredients) setIngredients(parsed.ingredients);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.requirements) setRequirements(parsed.requirements);
        if (parsed.purchaseOrders) setPurchaseOrders(parsed.purchaseOrders);
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

  // Save to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        formulas,
        ingredients,
        suppliers,
        requirements,
        purchaseOrders,
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
    ingredients,
    suppliers,
    requirements,
    purchaseOrders,
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
  const addIngredient = (ingData: Omit<Ingredient, 'id' | 'lastUpdated'>): Ingredient => {
    const newId = `ing-${Date.now()}`;
    const today = new Date().toLocaleDateString('es-AR');
    const newIng: Ingredient = { ...ingData, id: newId, lastUpdated: today };
    setIngredients((prev) => [newIng, ...prev]);
    addActivityLog('Insumo Registrado', `Nuevo insumo "${newIng.name}" cargado a ${newIng.purchasePriceARS.toLocaleString('es-AR')}.`, 'supplier');
    showToast(`Insumo "${newIng.name}" agregado a laboratorio.`);
    return newIng;
  };

  const updateIngredient = (id: string, partial: Partial<Ingredient>) => {
    const today = new Date().toLocaleDateString('es-AR');
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...partial, lastUpdated: today } : i))
    );
    addActivityLog('Insumo Modificado', `Costo o stock actualizado para insumo.`, 'supplier');
    showToast('Insumo actualizado correctamente.');
  };

  const deleteIngredient = (id: string) => {
    const target = ingredients.find((i) => i.id === id);
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    if (target) {
      addActivityLog('Insumo Eliminado', `Insumo "${target.name}" removido.`, 'supplier');
      showToast(`Insumo "${target.name}" eliminado.`, 'info');
    }
  };

  // ---------------------------------------------------------------------------
  // SUPPLIERS CRUD
  // ---------------------------------------------------------------------------
  const addSupplier = (supplierData: Omit<Supplier, 'id'>): Supplier => {
    const newId = `sup-${Date.now()}`;
    const newSupplier: Supplier = { ...supplierData, id: newId };
    setSuppliers((prev) => [newSupplier, ...prev]);
    
    // Also create empty requirement group for this supplier
    setRequirements((prev) => [
      ...prev,
      {
        supplierId: newId,
        supplierName: newSupplier.name,
        minPurchaseARS: newSupplier.minPurchaseARS,
        requirements: [],
        totalARS: 0,
        meetsMinimum: false,
      },
    ]);

    addActivityLog('Proveedor Agregado', `Nuevo proveedor "${newSupplier.name}" habilitado.`, 'supplier');
    showToast(`Proveedor "${newSupplier.name}" registrado.`);
    return newSupplier;
  };

  const updateSupplier = (id: string, partial: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...partial } : s))
    );
    // Sync supplier name in requirement groups
    if (partial.name || partial.minPurchaseARS !== undefined) {
      setRequirements((prev) =>
        prev.map((r) => {
          if (r.supplierId === id) {
            const minP = partial.minPurchaseARS !== undefined ? partial.minPurchaseARS : r.minPurchaseARS;
            return {
              ...r,
              supplierName: partial.name || r.supplierName,
              minPurchaseARS: minP,
              meetsMinimum: r.totalARS >= minP,
            };
          }
          return r;
        })
      );
    }
    showToast('Proveedor actualizado.');
  };

  const deleteSupplier = (id: string) => {
    const target = suppliers.find((s) => s.id === id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    setRequirements((prev) => prev.filter((r) => r.supplierId !== id));
    if (target) {
      addActivityLog('Proveedor Eliminado', `Proveedor "${target.name}" removido.`, 'supplier');
      showToast(`Proveedor "${target.name}" eliminado.`, 'info');
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
          const matchedSup = suppliers.find((s) => s.name.toLowerCase() === suppName.toLowerCase());
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
    const group = requirements.find((r) => r.supplierName.toLowerCase() === supplierName.toLowerCase());
    if (!group || group.requirements.length === 0) {
      showToast('No hay insumos requeridos para este proveedor.', 'warning');
      return;
    }

    const poCode = `OC-2026-00${purchaseOrders.length + 1}`;
    const today = new Date().toLocaleDateString('es-AR');

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      code: poCode,
      supplierId: group.supplierId,
      supplierName: group.supplierName,
      date: today,
      items: [...group.requirements],
      subtotalARS: group.totalARS,
      totalARS: group.totalARS,
      status: 'Solicitada',
      observations: `Orden generada automáticamente desde requerimientos consolidados de laboratorio.`,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Clear group requirements
    setRequirements((prev) =>
      prev.map((r) =>
        r.supplierName.toLowerCase() === supplierName.toLowerCase()
          ? { ...r, requirements: [], totalARS: 0, meetsMinimum: false }
          : r
      )
    );

    addActivityLog('Orden de Compra Creada', `OC ${poCode} generada para ${supplierName} por ${group.totalARS.toLocaleString('es-AR')}.`, 'purchase');
    showToast(`Orden ${poCode} generada para ${supplierName}.`);
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'code'>): PurchaseOrder => {
    const newId = `po-${Date.now()}`;
    const code = `OC-2026-00${purchaseOrders.length + 1}`;
    const newPO: PurchaseOrder = { ...poData, id: newId, code };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    addActivityLog('Orden de Compra Manual', `OC ${code} agregada para ${newPO.supplierName}.`, 'purchase');
    showToast(`Orden de compra ${code} registrada.`);
    return newPO;
  };

  const updatePurchaseOrderStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    addActivityLog('Estado OC Cambiado', `Orden marcada como ${status}.`, 'purchase');
    showToast(`Estado de la orden actualizado a ${status}.`);
  };

  const deletePurchaseOrder = (id: string) => {
    const target = purchaseOrders.find((p) => p.id === id);
    setPurchaseOrders((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      addActivityLog('Orden de Compra Eliminada', `Orden ${target.code} cancelada y eliminada.`, 'purchase');
      showToast(`Orden ${target.code} eliminada.`, 'info');
    }
  };

  const duplicatePurchaseOrder = (id: string) => {
    const target = purchaseOrders.find((p) => p.id === id);
    if (!target) return;
    const poCode = `OC-2026-00${purchaseOrders.length + 1}`;
    const today = new Date().toLocaleDateString('es-AR');
    const duplicated: PurchaseOrder = {
      ...target,
      id: `po-${Date.now()}`,
      code: poCode,
      date: today,
      status: 'Borrador',
    };
    setPurchaseOrders((prev) => [duplicated, ...prev]);
    addActivityLog('Orden Duplicada', `Copia de OC generada: ${poCode}.`, 'purchase');
    showToast(`Orden duplicada como ${poCode}.`);
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
        ingredients,
        suppliers,
        requirements,
        purchaseOrders,
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
