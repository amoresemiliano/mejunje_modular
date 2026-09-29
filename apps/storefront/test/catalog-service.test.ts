/**
 * Storefront Catalog Integration Unit Test Suite (01-ECO-WP-001)
 * Validates DB -> DTO mapper functions, UI presentation transformations,
 * edge cases (missing media, missing pyramid, missing price), and data access fallbacks.
 */

import { mapDbProductToDTO, mapCatalogDTOToStorefrontProduct, buildCatalogMediaUrl } from '../services/catalog-mapper.ts';
import { getPublishedProducts, getPublishedProductBySlug } from '../services/catalog.ts';

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
  description: 'Aroma cállido de sotobosque y madera noble.',
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

const minimalDbRow = {
  id: 'prod-002-uuid',
  slug: 'difusor-bosque-niebla',
  name: 'Difusor Bosque de Niebla',
  status: 'published',
  product_variants: [],
  product_category_mappings: [],
  olfactory_pyramids: null,
  catalog_media: [],
};

// === 1. MAPPER TEST: Complete DB Row to DTO ===
const dto = mapDbProductToDTO(completeDbRow, 'https://supabase.mejunje.com');
assert(
  'DB row maps to CatalogProductDetailDTO with correct fields',
  dto.id === 'prod-001-uuid' && dto.slug === 'vela-ambar-madera' && dto.isPublished === true,
  'id=prod-001-uuid, isPublished=true',
  `id=${dto.id}, isPublished=${dto.isPublished}`
);

// === 2. MAPPER TEST: Media Ordering (Primary & Display Order) ===
assert(
  'Media items are sorted with primary image first',
  dto.media.length === 2 && dto.media[0].isPrimary === true && dto.media[0].id === 'med-001-uuid',
  'first media isPrimary = true (med-001-uuid)',
  `first media id = ${dto.media[0]?.id}`
);

// === 3. MAPPER TEST: Media URL Construction ===
const mediaUrl = buildCatalogMediaUrl('products/test/image.jpg', 'https://example.supabase.co');
assert(
  'Public storage media URL built correctly',
  mediaUrl === 'https://example.supabase.co/storage/v1/object/public/catalog-media/products/test/image.jpg',
  'https://example.supabase.co/storage/v1/object/public/catalog-media/products/test/image.jpg',
  mediaUrl
);

// === 4. MAPPER TEST: Product without media & pyramid ===
const minimalDto = mapDbProductToDTO(minimalDbRow);
assert(
  'Product without media & pyramid maps to null/empty without throwing',
  minimalDto.media.length === 0 && minimalDto.olfactoryPyramid === null && minimalDto.variants.length === 0,
  'media=[], pyramid=null, variants=[]',
  `media=${minimalDto.media.length}, pyramid=${minimalDto.olfactoryPyramid}, variants=${minimalDto.variants.length}`
);

// === 5. MAPPER TEST: DTO to Storefront Product UI Object ===
const uiProduct = mapCatalogDTOToStorefrontProduct(dto);
assert(
  'Catalog DTO converts to Storefront Product UI object',
  uiProduct.id === dto.id && uiProduct.price === 18500 && uiProduct.pyramid.topNotes.length === 2,
  'price = 18500, topNotes = 2',
  `price = ${uiProduct.price}, topNotes = ${uiProduct.pyramid.topNotes.length}`
);

// === 6. DATA ACCESS SERVICE: Handles DB Error or Missing Client Gracefully ===
const mockErrorClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: null, error: { message: 'DB Connection Error' } }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    }),
  }),
};

async function testServiceFallbacks() {
  const products = await getPublishedProducts(mockErrorClient);
  assert(
    'getPublishedProducts returns empty array on DB error without throwing',
    Array.isArray(products) && products.length === 0,
    'returns []',
    `returns ${JSON.stringify(products)}`
  );

  const productBySlug = await getPublishedProductBySlug('non-existent-slug', mockErrorClient);
  assert(
    'getPublishedProductBySlug returns null for missing slug without throwing',
    productBySlug === null,
    'returns null',
    `returns ${productBySlug}`
  );

  const emptySlugResult = await getPublishedProductBySlug('', mockErrorClient);
  assert(
    'getPublishedProductBySlug returns null immediately for empty slug string',
    emptySlugResult === null,
    'returns null',
    `returns ${emptySlugResult}`
  );
}

await testServiceFallbacks();

// Print Results
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
