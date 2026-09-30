/**
 * Storefront Catalog Integration Unit Test Suite (01-ECO-WP-001)
 * Validates LIVE (02-CAT) vs DEMO (synthetic fixtures) data mode behavior,
 * DB -> DTO mapper functions, non-invented commercial facts (price, stock),
 * error states, empty catalog handling, and companion product resolution.
 */

import { mapDbProductToDTO, mapCatalogDTOToStorefrontProduct, buildCatalogMediaUrl } from '../services/catalog-mapper.ts';
import {
  getStorefrontProductsResult,
  getStorefrontProductBySlugResult,
  getPublishedProducts,
  getPublishedProductBySlug,
  getDataMode,
} from '../services/catalog.ts';

interface TestResult {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, expected: string, actual: string) {
  results.push({
    name,
    expected,
    actual,
    passed: condition,
  });
}

// === FIXTURES ===
const completeDbRow = {
  id: 'prod-001-uuid',
  slug: 'vela-ambar-madera',
  name: 'Vela Ámbar & Madera',
  description: 'Aroma cálido de sotobosque y madera noble.',
  status: 'published',
  metadata: {
    aromaticFamily: 'Amaderado',
    shortStory: 'Un living de madera después de la lluvia.',
    intensity: 4,
  },
  product_variants: [
    {
      id: 'var-001-uuid',
      sku: 'VEL-AMB-250',
      name: '250g · 50hs',
      is_active: true,
      prices: [
        {
          id: 'prc-001-uuid',
          amount: 18500,
          currency: 'ARS',
          is_active: true,
        },
      ],
    },
  ],
  product_category_mappings: [
    {
      product_categories: {
        id: 'cat-velas-uuid',
        slug: 'velas',
        name: 'Velas Botánicas',
      },
    },
  ],
  olfactory_pyramids: {
    top_notes: ['Ámbar silvestre', 'Pino insigne'],
    heart_notes: ['Cedro del Atlas', 'Humo de leña'],
    base_notes: ['Vainilla negra', 'Musgo de roble'],
    description: 'Perfil olfativo profundo y envolvente.',
  },
  catalog_media: [
    {
      id: 'med-002-uuid',
      file_path: 'products/prod-001/gallery-2.jpg',
      display_order: 2,
      is_primary: false,
    },
    {
      id: 'med-001-uuid',
      file_path: 'products/prod-001/hero.jpg',
      display_order: 1,
      is_primary: true,
    },
  ],
};

const minimalDbRowNoPrice = {
  id: 'prod-002-uuid',
  slug: 'difusor-bosque-niebla',
  name: 'Difusor Bosque de Niebla',
  status: 'published',
  product_variants: [
    {
      id: 'var-002-uuid',
      sku: 'DIF-BOS-200',
      name: '200ml',
      is_active: true,
      prices: [], // No active price!
    },
  ],
  product_category_mappings: [],
  olfactory_pyramids: null,
  catalog_media: [],
};

// === MOCK CLIENTS ===
const mockEmptyClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows returned' } }),
        }),
      }),
    }),
  }),
};

const mockErrorClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: null, error: { message: 'DB Connection Error' } }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Fatal DB failure' } }),
        }),
      }),
    }),
  }),
};

const mockSuccessClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [completeDbRow, minimalDbRowNoPrice], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: completeDbRow, error: null }),
        }),
      }),
    }),
  }),
};

async function runAllTests() {
  // 1. MAPPER TEST: DB Row to DTO
  const dto = mapDbProductToDTO(completeDbRow, 'https://supabase.mejunje.com');
  assert(
    '1. DB row maps to CatalogProductDetailDTO with correct fields',
    dto.id === 'prod-001-uuid' && dto.slug === 'vela-ambar-madera' && dto.isPublished === true,
    'id=prod-001-uuid, isPublished=true',
    `id=${dto.id}, isPublished=${dto.isPublished}`
  );

  // 2. MAPPER TEST: Primary Media First Ordering
  assert(
    '2. Media items are sorted with primary image first',
    dto.media.length === 2 && dto.media[0].isPrimary === true && dto.media[0].id === 'med-001-uuid',
    'first media isPrimary = true (med-001-uuid)',
    `first media id = ${dto.media[0]?.id}`
  );

  // 3. MAPPER TEST: Public Storage URL Construction
  const mediaUrl = buildCatalogMediaUrl('products/test/image.jpg', 'https://example.supabase.co');
  assert(
    '3. Public storage media URL built correctly',
    mediaUrl === 'https://example.supabase.co/storage/v1/object/public/catalog-media/products/test/image.jpg',
    'https://example.supabase.co/storage/v1/object/public/catalog-media/products/test/image.jpg',
    mediaUrl
  );

  // 4. LIVE MODE + EMPTY CAT -> Returns [], NOT synthetic fixtures
  const liveEmptyResult = await getStorefrontProductsResult({ mode: 'live', customClient: mockEmptyClient });
  assert(
    '4. LIVE mode + empty CAT returns empty array [] (NO silent fallback to DEMO fixtures)',
    liveEmptyResult.products.length === 0 && liveEmptyResult.isError === false && liveEmptyResult.mode === 'live',
    'products=[], isError=false, mode=live',
    `products=${liveEmptyResult.products.length}, isError=${liveEmptyResult.isError}, mode=${liveEmptyResult.mode}`
  );

  // 5. LIVE MODE + DB ERROR -> Returns isError: true, NOT synthetic fixtures
  const liveErrorResult = await getStorefrontProductsResult({ mode: 'live', customClient: mockErrorClient });
  assert(
    '5. LIVE mode + DB error returns isError=true and [] (NO silent fallback to DEMO fixtures)',
    liveErrorResult.products.length === 0 && liveErrorResult.isError === true && liveErrorResult.mode === 'live',
    'products=[], isError=true, mode=live',
    `products=${liveErrorResult.products.length}, isError=${liveErrorResult.isError}, mode=${liveErrorResult.mode}`
  );

  // 6. LIVE MODE + MISSING SLUG -> Returns isNotFound: true, product: null
  const liveMissingSlug = await getStorefrontProductBySlugResult('non-existent-slug', { mode: 'live', customClient: mockEmptyClient });
  assert(
    '6. LIVE mode + non-existent slug returns product=null and isNotFound=true',
    liveMissingSlug.product === null && liveMissingSlug.isNotFound === true && liveMissingSlug.isError === false,
    'product=null, isNotFound=true, isError=false',
    `product=${liveMissingSlug.product}, isNotFound=${liveMissingSlug.isNotFound}, isError=${liveMissingSlug.isError}`
  );

  // 7. DEMO MODE -> Returns synthetic PRODUCTS fixtures
  const demoResult = await getStorefrontProductsResult({ mode: 'demo' });
  assert(
    '7. DEMO mode returns synthetic demonstration fixtures',
    demoResult.products.length > 0 && demoResult.mode === 'demo' && demoResult.isError === false,
    'products > 0, mode=demo',
    `products=${demoResult.products.length}, mode=${demoResult.mode}`
  );

  // 8. LIVE PRODUCT WITHOUT PRICE -> hasPrice: false, price: undefined (NO fake $0)
  const minimalDtoNoPrice = mapDbProductToDTO(minimalDbRowNoPrice);
  const liveProductNoPrice = mapCatalogDTOToStorefrontProduct(minimalDtoNoPrice, { mode: 'live' });
  assert(
    '8. LIVE product without price returns price=undefined and hasPrice=false (does NOT invent $0 price)',
    liveProductNoPrice.price === undefined && liveProductNoPrice.hasPrice === false,
    'price=undefined, hasPrice=false',
    `price=${liveProductNoPrice.price}, hasPrice=${liveProductNoPrice.hasPrice}`
  );

  // 9. LIVE PRODUCT DOES NOT INVENT STOCK -> stock: undefined (08-INV authority)
  const liveProductWithData = mapCatalogDTOToStorefrontProduct(dto, { mode: 'live' });
  assert(
    '9. LIVE product stock is undefined (does NOT invent stock: 10)',
    liveProductWithData.stock === undefined,
    'stock=undefined',
    `stock=${liveProductWithData.stock}`
  );

  // 10. DEMO PRODUCT PROVIDES SAMPLE STOCK -> stock: 10
  const demoProductWithData = mapCatalogDTOToStorefrontProduct(dto, { mode: 'demo' });
  assert(
    '10. DEMO product provides sample stock fixture (stock: 10)',
    demoProductWithData.stock === 10,
    'stock=10',
    `stock=${demoProductWithData.stock}`
  );
}

runAllTests().then(() => {
  console.log('\n======================================================');
  console.log('  @mejunje/storefront CATALOG INTEGRATION UNIT TESTS');
  console.log('======================================================');
  let allPassed = true;
  results.forEach((r, idx) => {
    const status = r.passed ? 'PASS' : 'FAIL';
    if (!r.passed) allPassed = false;
    console.log(`[${status}] #${idx + 1}: ${r.name}`);
    console.log(`       Expected: ${r.expected}`);
    console.log(`       Actual:   ${r.actual}\n`);
  });

  console.log(`TOTAL: ${results.length} | PASSED: ${results.filter((r) => r.passed).length} | FAILED: ${results.filter((r) => !r.passed).length}`);

  if (!allPassed) {
    process.exit(1);
  }
});
