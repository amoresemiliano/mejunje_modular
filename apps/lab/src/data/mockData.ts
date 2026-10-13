import {
  Formula,
  Ingredient,
  MarketBenchmark,
  CatalogProduct,
  SupplierRequirementGroup,
  Supplier,
  BatchTest,
  PurchaseOrder,
  MarketQuery,
  ActivityLog,
  ClientContact
} from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Fragancias Eissen AR',
    contactPerson: 'Carlos Eissen',
    phoneWhatsApp: '+5491145558900',
    email: 'contacto@eissenfragancias.com.ar',
    web: 'www.eissenfragancias.com.ar',
    location: 'Villa Crespo, CABA',
    categoriesSupplied: ['Fragancias', 'Aditivos'],
    minPurchaseARS: 150000,
    deliveryTimeDays: 3,
    notes: 'Proveedor principal de fragancias finas importadas concentradas y aceites aromáticos.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sup-4',
    name: 'Ceras & Botánica AR',
    contactPerson: 'Esteban Lucero',
    phoneWhatsApp: '+5491167772233',
    email: 'pedidos@cerasbotanica.com',
    web: 'www.cerasbotanica.com',
    location: 'Lomas de Zamora, Buenos Aires',
    categoriesSupplied: ['Ceras', 'Aditivos', 'Pabilos'],
    minPurchaseARS: 120000,
    deliveryTimeDays: 3,
    notes: 'Cooperativa de cera de soja vegetal pura de bajo punto de fusión y pabilos de algodón trenzado.',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
  },
];

export const mockIngredients: Ingredient[] = [
  {
    id: 'ing-1',
    name: 'Cera de Soja APF Bajo Punto Fusión',
    category: 'Ceras',
    unit: 'kg',
    purchasePriceARS: 42500,
    referenceQty: 5,
    unitCostARS: 8.5, // 8.5 por gramo
    stock: 25,
    minStock: 50,
    supplierId: 'sup-4',
    supplierName: 'Ceras & Botánica AR',
    lastUpdated: '08/08/2026',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ing-7',
    name: 'Esencia Ámbar Botánico & Madera',
    category: 'Fragancias',
    unit: 'ml',
    purchasePriceARS: 145000,
    referenceQty: 1000,
    unitCostARS: 145,
    stock: 800,
    minStock: 600,
    supplierId: 'sup-1',
    supplierName: 'Fragancias Eissen AR',
    lastUpdated: '10/08/2026',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  },
];

export const mockFormulas: Formula[] = [
  {
    "id": "form-1",
    "name": "Vela Botánica Ámbar & Madera 200g",
    "category": "Vela",
    "associatedProductId": "prod-1",
    "associatedProductName": "Vela Botánica Ámbar & Madera",
    "yieldSize": "200 g",
    "batchSizeGrams": 2000,
    "status": "Aprobada",
    "version": "v2",
    "notes": "Fórmula insignia Mejunje. Quemado parejo y excelente difusión aromática en frío y caliente. Ejemplo DEMO: composición simplificada a cera de soja y esencia ámbar; no representa una receta comercial.",
    "topNotes": [
      "Bergamota",
      "Cáscara de Naranja"
    ],
    "heartNotes": [
      "Flor de Azahar",
      "Especies Cálidas"
    ],
    "baseNotes": [
      "Ámbar Botánico",
      "Madera de Cedro",
      "Vainilla"
    ],
    "suggestedMarginPercent": 65,
    "processMaxMeltingTemp": 65,
    "processFragranceTemp": 42,
    "processPouringTemp": 37,
    "processCuringDays": 14,
    "processNotes": "Fundir cera de soja sin superar 65°C. Incorporar esencia suavemente a 42°C y verter a 37°C.",
    "ingredients": [
      {
        "ingredientId": "ing-1",
        "ingredientName": "Cera de Soja APF Bajo Punto Fusión",
        "category": "Ceras",
        "quantity": 1860,
        "unit": "g",
        "percentage": 93,
        "unitCostARS": 8.5,
        "supplierId": "sup-4",
        "supplierName": "Ceras & Botánica AR",
        "calculatedCostARS": 15810
      },
      {
        "ingredientId": "ing-7",
        "ingredientName": "Esencia Ámbar Botánico & Madera",
        "category": "Fragancias",
        "quantity": 140,
        "unit": "ml",
        "percentage": 7,
        "unitCostARS": 145,
        "supplierId": "sup-1",
        "supplierName": "Fragancias Eissen AR",
        "calculatedCostARS": 20300
      }
    ],
    "yieldUnits": 10,
    "totalCostARS": 36110,
    "unitCostARS": 3611
  },
  {
    "id": "form-2",
    "name": "Vela Soja Lavanda & Manzanilla 250g",
    "category": "Vela",
    "associatedProductId": "prod-2",
    "associatedProductName": "Vela Soja Lavanda & Manzanilla",
    "yieldSize": "250 g",
    "batchSizeGrams": 2500,
    "status": "Aprobada",
    "version": "v1.5",
    "notes": "Aroma botánico relajante con flores secas de lavanda de Provenza. Ejemplo DEMO: composición simplificada a cera de soja y esencia ámbar; no representa una receta comercial.",
    "topNotes": [
      "Lavanda de Provenza",
      "Eucalipto"
    ],
    "heartNotes": [
      "Manzanilla Romana",
      "Flor de Azahar"
    ],
    "baseNotes": [
      "Cedro de Virginia",
      "Sándalo"
    ],
    "suggestedMarginPercent": 62,
    "processMaxMeltingTemp": 65,
    "processFragranceTemp": 40,
    "processPouringTemp": 36,
    "processCuringDays": 10,
    "processNotes": "Cuidar temperatura para evitar túneles de quemado.",
    "ingredients": [
      {
        "ingredientId": "ing-1",
        "ingredientName": "Cera de Soja APF Bajo Punto Fusión",
        "category": "Ceras",
        "quantity": 2300,
        "unit": "g",
        "percentage": 92,
        "unitCostARS": 8.5,
        "supplierId": "sup-4",
        "supplierName": "Ceras & Botánica AR",
        "calculatedCostARS": 19550
      },
      {
        "ingredientId": "ing-7",
        "ingredientName": "Esencia Ámbar Botánico & Madera",
        "category": "Fragancias",
        "quantity": 200,
        "unit": "ml",
        "percentage": 8,
        "unitCostARS": 145,
        "supplierId": "sup-1",
        "supplierName": "Fragancias Eissen AR",
        "calculatedCostARS": 29000
      }
    ],
    "yieldUnits": 10,
    "totalCostARS": 48550,
    "unitCostARS": 4855
  },
];

export const mockBatchTests: BatchTest[] = [
  {
    id: 'bt-1',
    code: 'MJ-LAB-2026-001',
    formulaId: 'form-1',
    formulaName: 'Vela Botánica Ámbar & Madera 200g',
    version: 'v2',
    date: '08/08/2026',
    qtyProduced: '10 unidades (2 kg)',
    status: 'Aprobada',
    ambientTemp: 21,
    meltingTemp: 64,
    fragranceTemp: 42,
    pouringTemp: 37,
    fragrancePercent: 7,
    additivePercent: 0,
    ratingAppearance: 5,
    ratingColdAroma: 5,
    ratingHotAroma: 4,
    ratingBurn: 5,
    observations: 'Superficie lisa perfecta sin grietas ni rechupe. Excelente adherencia al vaso de vidrio.',
    result: 'Fórmula lista para producción en el taller de Buenos Aires.',
  },
  {
    id: 'bt-2',
    code: 'MJ-LAB-2026-002',
    formulaId: 'form-2',
    formulaName: 'Vela Soja Lavanda & Manzanilla 250g',
    version: 'v1.5',
    date: '05/08/2026',
    qtyProduced: '12 unidades (3 kg)',
    status: 'Curado',
    ambientTemp: 19,
    meltingTemp: 63,
    fragranceTemp: 40,
    pouringTemp: 36,
    fragrancePercent: 8,
    additivePercent: 0,
    ratingAppearance: 4,
    ratingColdAroma: 5,
    ratingHotAroma: 4,
    ratingBurn: 4,
    observations: 'Prueba de reposo de 10 días en cámara de curado.',
  },
];

export const mockSupplierGroups: SupplierRequirementGroup[] = [
  {
    "supplierId": "sup-1",
    "supplierName": "Fragancias Eissen AR",
    "minPurchaseARS": 150000,
    "meetsMinimum": true,
    "totalARS": 174000,
    "requirements": [
      {
        "id": "req-1",
        "ingredientId": "ing-7",
        "ingredientName": "Esencia Ámbar Botánico & Madera",
        "category": "Fragancias",
        "requiredQty": 1200,
        "unit": "ml",
        "unitPriceARS": 145,
        "subtotalARS": 174000,
        "formulaReferences": [
          "Vela Botánica Ámbar & Madera 200g",
          "Vela Soja Lavanda & Manzanilla 250g"
        ]
      }
    ]
  },
  {
    "supplierId": "sup-4",
    "supplierName": "Ceras & Botánica AR",
    "minPurchaseARS": 120000,
    "meetsMinimum": true,
    "totalARS": 170000,
    "requirements": [
      {
        "id": "req-2",
        "ingredientId": "ing-1",
        "ingredientName": "Cera de Soja APF Bajo Punto Fusión",
        "category": "Ceras",
        "requiredQty": 20,
        "unit": "kg",
        "unitPriceARS": 8500,
        "subtotalARS": 170000,
        "formulaReferences": [
          "Vela Botánica Ámbar & Madera 200g",
          "Vela Soja Lavanda & Manzanilla 250g"
        ]
      }
    ]
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    "id": "po-1",
    "code": "MJ-OC-2026-001",
    "supplierId": "sup-1",
    "supplierName": "Fragancias Eissen AR",
    "date": "09/08/2026",
    "items": [
      {
        "id": "poi-1",
        "ingredientId": "ing-7",
        "ingredientName": "Esencia Ámbar Botánico & Madera",
        "category": "Fragancias",
        "requiredQty": 1000,
        "unit": "ml",
        "unitPriceARS": 145,
        "subtotalARS": 145000
      }
    ],
    "subtotalARS": 145000,
    "totalARS": 145000,
    "status": "Solicitada",
    "observations": "Entrega acordada en el atelier de Buenos Aires."
  },
  {
    "id": "po-2",
    "code": "MJ-OC-2026-002",
    "supplierId": "sup-4",
    "supplierName": "Ceras & Botánica AR",
    "date": "06/08/2026",
    "items": [
      {
        "id": "poi-3",
        "ingredientId": "ing-1",
        "ingredientName": "Cera de Soja APF Bajo Punto Fusión",
        "category": "Ceras",
        "requiredQty": 50,
        "unit": "kg",
        "unitPriceARS": 8500,
        "subtotalARS": 425000
      }
    ],
    "subtotalARS": 425000,
    "totalARS": 425000,
    "status": "Recibida",
    "observations": "Materia prima recibida en perfectas condiciones y cargada al stock."
  },
];

export const mockMarketQueries: MarketQuery[] = [
  {
    id: 'mq-1',
    name: 'Vela de Soja 200g - Benchmark Buenos Aires',
    category: 'Vela',
    keywords: 'vela soja 200g aromatica artesanal buenos aires',
    zone: 'Buenos Aires',
    source: 'Mercado Libre',
    status: 'Activo',
    lastRun: '10/08/2026 10:15',
  },
  {
    id: 'mq-2',
    name: 'Vela Botánica 350g Vaso Cristal',
    category: 'Vela',
    keywords: 'vela aromatica premium vaso cristal ambar 350g',
    zone: 'Buenos Aires',
    source: 'Ecommerce',
    status: 'Activo',
    lastRun: '10/08/2026 09:30',
  },
];

export const mockMarketBenchmarks: MarketBenchmark[] = [
  {
    "id": "bench-2",
    "productName": "Vela Botánica Ámbar & Madera",
    "category": "Vela",
    "kameloPriceARS": 18500,
    "mejunjePriceARS": 18500,
    "competitorAverageARS": 19200,
    "competitorMinARS": 16500,
    "competitorMaxARS": 24000,
    "kameloMarginPercent": 65,
    "lastUpdated": "10/08/2026",
    "status": "Competitivo"
  },
  {
    "id": "bench-3",
    "productName": "Vela Soja Lavanda & Manzanilla",
    "category": "Vela",
    "kameloPriceARS": 22900,
    "mejunjePriceARS": 22900,
    "competitorAverageARS": 23500,
    "competitorMinARS": 19000,
    "competitorMaxARS": 28000,
    "kameloMarginPercent": 62,
    "lastUpdated": "08/08/2026",
    "status": "Competitivo"
  },
];

export const mockCatalogProducts: CatalogProduct[] = [
  {
    id: 'prod-1',
    sku: 'MJ-VEL-AMB-200',
    name: 'Vela Botánica Ámbar & Madera',
    category: 'Velas Botánicas',
    shortDescription: 'Cera de soja 100% pura con notas de ámbar cálido, cedro y vainilla.',
    description: 'Vela botánica elaborada artesanalmente en nuestro atelier de Buenos Aires con cera de soja de bajo punto de fusión, pabilo de algodón puro y aceites botánicos.',
    collection: 'Colección Botánica Tierra',
    fragranceFamily: 'Amaderada Cálida',
    status: 'Activo',
    formulaId: 'form-1',
    formulaName: 'Vela Botánica Ámbar & Madera 200g',
    badge: 'Atelier Clásico',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
    ],
    topNotes: 'Bergamota, Cáscara de Naranja',
    heartNotes: 'Flor de Azahar, Especias Cálidas',
    baseNotes: 'Ámbar Botánico, Cedro, Vainilla',
    variants: [
      { id: 'var-101', sku: 'MJ-VEL-AMB-200', size: '200 g', unit: 'g', aroma: 'Ámbar & Madera', salePriceARS: 18500, estimatedCostARS: 5800, status: 'Activo' },
      { id: 'var-102', sku: 'MJ-VEL-AMB-350', size: '350 g', unit: 'g', aroma: 'Ámbar & Madera', salePriceARS: 29900, estimatedCostARS: 9200, status: 'Activo' },
      { id: 'var-103', sku: 'MJ-VEL-AMB-500', size: '500 g (3 pabilos)', unit: 'g', aroma: 'Ámbar & Madera', salePriceARS: 39900, estimatedCostARS: 12500, status: 'Activo' },
    ],
  },
  {
    id: 'prod-2',
    sku: 'MJ-VEL-LAV-250',
    name: 'Vela Soja Lavanda & Manzanilla',
    category: 'Velas Botánicas',
    shortDescription: 'Armonía de lavanda silvestre de Provenza, manzanilla y cedro.',
    description: 'Vela aromática pensada para momentos de calma y lectura. Vaso de cristal esmerilado con tapa de madera maciza encerada a mano.',
    collection: 'Colección Calma',
    fragranceFamily: 'Aromática Herbal',
    status: 'Activo',
    formulaId: 'form-2',
    formulaName: 'Vela Soja Lavanda & Manzanilla 250g',
    badge: 'Edición Botánica',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
    ],
    topNotes: 'Lavanda Silvestre, Eucalipto',
    heartNotes: 'Manzanilla Romana, Azahar',
    baseNotes: 'Cedro de Virginia, Sándalo',
    variants: [
      { id: 'var-201', sku: 'MJ-VEL-LAV-250', size: '250 g', unit: 'g', aroma: 'Lavanda Silvestre', salePriceARS: 22900, estimatedCostARS: 7400, status: 'Activo' },
      { id: 'var-202', sku: 'MJ-VEL-LAV-400', size: '400 g', unit: 'g', aroma: 'Lavanda Silvestre', salePriceARS: 34500, estimatedCostARS: 11200, status: 'Activo' },
    ],
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    "id": "act-1",
    "timestamp": "Hace 10 min",
    "title": "Fórmula Actualizada",
    "description": "Ejemplo DEMO: Vela Botánica Ámbar & Madera v2 simplificada a cera de soja y esencia ámbar.",
    "type": "formula"
  },
  {
    id: 'act-2',
    timestamp: 'Hace 35 min',
    title: 'Prueba de Laboratorio Registrada',
    description: 'Batch MJ-LAB-2026-001 validado y marcado como Aprobado.',
    type: 'batch',
  },
];

export const mockClients: ClientContact[] = [
  { id: 'cli-1', name: 'Sofía Martínez (Boutique de Diseño)', phone: '+5491140001122', type: 'Boutique', email: 'sofia@boutiquediseno.com.ar', address: 'Buenos Aires', notes: 'Prefiere presentaciones de velas de 350g en vidrio esmerilado.' },
  {
    "id": "cli-2",
    "name": "Martín Benítez (Estudio Decoración)",
    "phone": "+5491152223344",
    "type": "Mayorista",
    "email": "martin@benitezdeco.com.ar",
    "address": "Buenos Aires",
    "notes": "Pedidos periódicos de Vela Soja Lavanda & Manzanilla de 250g."
  },
];
