export type CategoryType = 'Vela' | 'Difusor' | 'Perfume textil' | 'Otro';

export type InsumoCategory =
  | 'Ceras'
  | 'Fragancias'
  | 'Aditivos'
  | 'Pabilos'
  | 'Envases'
  | 'Tapas'
  | 'Packaging'
  | 'Etiquetas'
  | 'Alcoholes'
  | 'Bases'
  | 'Otros';

export interface Ingredient {
  id: string;
  name: string;
  category: InsumoCategory;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'unid' | '%';
  purchasePriceARS: number;
  referenceQty: number; // e.g. 5 (kg) or 1000 (ml)
  unitCostARS: number; // calculated price per unit (per g or per ml or per unid)
  stock: number;
  minStock: number;
  supplierId: string;
  supplierName: string;
  lastUpdated: string;
  imageUrl?: string;
}

export interface FormulaIngredient {
  ingredientId: string;
  ingredientName: string;
  category: InsumoCategory | string;
  quantity: number; // quantity needed in base unit (e.g. g or ml or unid)
  unit: string;
  percentage: number; // % of total weight/volume
  unitCostARS: number;
  supplierId?: string;
  supplierName?: string;
  calculatedCostARS: number;
}

export interface Formula {
  id: string;
  name: string;
  category: CategoryType;
  associatedProductId?: string;
  associatedProductName?: string;
  yieldSize: string; // e.g., "200 g", "350 g", "250 ml", "20 kg"
  batchSizeGrams: number;
  status: 'Borrador' | 'En prueba' | 'Aprobada' | 'Archivada';
  version: string; // e.g. "v1", "v2"
  notes?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  ingredients: FormulaIngredient[];
  suggestedMarginPercent: number;
  processMaxMeltingTemp?: number;
  processFragranceTemp?: number;
  processPouringTemp?: number;
  processCuringDays?: number;
  processNotes?: string;
}

export interface BatchTest {
  id: string;
  code: string; // e.g., LAB-2026-001 or MJ-2026-001
  formulaId: string;
  formulaName: string;
  version: string;
  date: string;
  qtyProduced: string;
  status: 'Preparación' | 'Curado' | 'Evaluación' | 'Aprobada' | 'Rechazada';
  ambientTemp?: number;
  meltingTemp?: number;
  fragranceTemp?: number;
  pouringTemp?: number;
  fragrancePercent?: number;
  additivePercent?: number;
  ratingAppearance?: number; // 1-5
  ratingColdAroma?: number; // 1-5
  ratingHotAroma?: number; // 1-5
  ratingBurn?: number; // 1-5
  observations?: string;
  result?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phoneWhatsApp: string;
  email?: string;
  web?: string;
  location?: string;
  categoriesSupplied: string[];
  minPurchaseARS: number;
  deliveryTimeDays: number;
  notes?: string;
  imageUrl?: string;
}

export interface PurchaseItem {
  id: string;
  ingredientId?: string;
  ingredientName: string;
  category?: string;
  requiredQty: number;
  unit: string;
  unitPriceARS: number;
  subtotalARS: number;
  formulaReferences?: string[];
}

export interface SupplierRequirementGroup {
  supplierId: string;
  supplierName: string;
  minPurchaseARS: number;
  requirements: PurchaseItem[];
  totalARS: number;
  meetsMinimum: boolean;
}

export interface PurchaseOrder {
  id: string;
  code: string; // OC-001 or MJ-OC-001
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  subtotalARS: number;
  totalARS: number;
  status: 'Borrador' | 'Pendiente' | 'Solicitada' | 'Confirmada' | 'Recibida' | 'Cancelada';
  observations?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string; // "200 g", "350 g"
  unit: string;
  aroma: string; // "Ámbar Botánico", "Lavanda Silvestre"
  salePriceARS: number;
  estimatedCostARS: number;
  status: 'Activo' | 'Inactivo';
}

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: CategoryType | 'Perfumes Finos' | 'Velas Botánicas' | 'Difusores de Ambiente' | 'Cosmética Natural';
  description: string;
  shortDescription: string;
  collection: string;
  fragranceFamily: string;
  status: 'Borrador' | 'Activo' | 'Inactivo';
  formulaId?: string;
  formulaName?: string;
  imageUrl?: string;
  images?: string[];
  variants: ProductVariant[];
  badge?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
}

export interface MarketQuery {
  id: string;
  name: string;
  category?: string;
  keywords?: string;
  zone?: 'CABA' | 'Zona Norte' | 'Buenos Aires' | 'Argentina' | string;
  source?: 'Mercado Libre' | 'Ecommerce' | 'Marca concreta' | 'Otra' | string;
  sources?: string[];
  selectedProducts?: string[];
  selectedSupplies?: string[];
  freeText?: string;
  status: 'Activo' | 'Inactivo';
  lastRun?: string;
}

export interface MarketBenchmark {
  id: string;
  productName: string;
  category: string;
  kameloPriceARS: number; // kept for compatibility
  mejunjePriceARS?: number;
  competitorAverageARS: number;
  competitorMinARS: number;
  competitorMaxARS: number;
  kameloMarginPercent: number;
  lastUpdated: string;
  status: 'Competitivo' | 'Oportunidad Aumento' | 'Precio Alto';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'formula' | 'batch' | 'purchase' | 'market' | 'catalog' | 'supplier' | 'client';
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ClientContact {
  id: string;
  name: string;
  phone: string;
  type: 'Minorista' | 'Mayorista' | 'Boutique' | string;
  email?: string;
  address?: string;
  notes?: string;
  status?: 'Activo' | 'Inactivo' | 'Potencial';
  lastOrderDate?: string;
}
