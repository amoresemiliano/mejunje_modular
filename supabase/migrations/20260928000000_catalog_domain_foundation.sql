-- =========================================================================
-- MEJUNJE — 02-CAT Catalog Domain Foundation Migration
-- YYYYMMDDHHMMSS: 20260928000000_catalog_domain_foundation.sql
-- =========================================================================

-- =========================================================================
-- 1. TABLE: PRODUCTS (products)
-- Commercial product entity owned exclusively by 02-CAT.
-- =========================================================================
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    description text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.products is 'Primary commercial product portfolio authority owned by 02-CAT.';

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status on public.products(status);

create trigger set_updated_at_products
    before update on public.products
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 2. TABLE: PRODUCT VARIANTS (product_variants)
-- Commercial SKU variants of a product (e.g. sizes, formats).
-- Stock/inventory fields are strictly excluded (owned by 08-INV).
-- =========================================================================
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    sku text not null unique,
    name text not null,
    is_active boolean not null default true,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.product_variants is 'Commercial variant SKUs. Physical inventory tracking is isolated in 08-INV.';

create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_product_variants_sku on public.product_variants(sku);

create trigger set_updated_at_product_variants
    before update on public.product_variants
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 3. TABLE: PRICES (prices)
-- Authority of current active commercial prices.
-- Transactional order snapshots reside downstream in 11-PED.
-- Unique constraint (variant_id, currency) enforces single-price row authority.
-- =========================================================================
create table if not exists public.prices (
    id uuid primary key default gen_random_uuid(),
    variant_id uuid not null references public.product_variants(id) on delete cascade,
    amount numeric(12, 2) not null check (amount >= 0),
    currency text not null default 'ARS' check (currency ~ '^[A-Z]{3}$'),
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_variant_currency unique (variant_id, currency)
);

comment on table public.prices is 'Current active commercial price authority owned by 02-CAT.';

create index if not exists idx_prices_variant_id on public.prices(variant_id);

create trigger set_updated_at_prices
    before update on public.prices
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 4. TABLE: PRODUCT CATEGORIES (product_categories)
-- Commercial category taxonomy.
-- =========================================================================
create table if not exists public.product_categories (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    description text,
    parent_id uuid references public.product_categories(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.product_categories is 'Commercial product taxonomy owned by 02-CAT.';

create index if not exists idx_product_categories_slug on public.product_categories(slug);
create index if not exists idx_product_categories_parent_id on public.product_categories(parent_id);

create trigger set_updated_at_product_categories
    before update on public.product_categories
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 5. TABLE: PRODUCT CATEGORY MAPPINGS (product_category_mappings)
-- Many-to-many relationship between products and categories.
-- =========================================================================
create table if not exists public.product_category_mappings (
    product_id uuid not null references public.products(id) on delete cascade,
    category_id uuid not null references public.product_categories(id) on delete cascade,
    primary key (product_id, category_id)
);

comment on table public.product_category_mappings is 'Product to category taxonomy assignment mapping.';

create index if not exists idx_cat_mappings_category_id on public.product_category_mappings(category_id);

-- =========================================================================
-- 6. TABLE: OLFACTORY PYRAMIDS (olfactory_pyramids)
-- Commercial scent profile information (top, heart, base notes).
-- Internal formulas and R&D data are strictly isolated in 05-LAB.
-- =========================================================================
create table if not exists public.olfactory_pyramids (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null unique references public.products(id) on delete cascade,
    top_notes text[] not null default '{}',
    heart_notes text[] not null default '{}',
    base_notes text[] not null default '{}',
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.olfactory_pyramids is 'Commercial olfactory pyramid presentation owned by 02-CAT.';

create trigger set_updated_at_olfactory_pyramids
    before update on public.olfactory_pyramids
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 7. TABLE: CATALOG MEDIA (catalog_media)
-- Public catalog media asset metadata (bucket: catalog-media).
-- Enforces strict target ownership (belongs to product OR variant).
-- =========================================================================
create table if not exists public.catalog_media (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade,
    variant_id uuid references public.product_variants(id) on delete cascade,
    file_path text not null,
    alt_text text,
    display_order integer not null default 0,
    is_primary boolean not null default false,
    media_type text not null default 'image' check (media_type in ('image', 'video', 'document')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint check_catalog_media_target check (num_nonnulls(product_id, variant_id) = 1)
);

comment on table public.catalog_media is 'Metadata for public catalog assets stored in catalog-media bucket.';

create index if not exists idx_catalog_media_product_id on public.catalog_media(product_id);
create index if not exists idx_catalog_media_variant_id on public.catalog_media(variant_id);

create trigger set_updated_at_catalog_media
    before update on public.catalog_media
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 8. SUPABASE STORAGE BUCKET INITIALIZATION
-- Public storage bucket for commercial media assets.
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('catalog-media', 'catalog-media', true)
on conflict (id) do nothing;

-- =========================================================================
-- 9. ROW LEVEL SECURITY (RLS) & POLICIES (DENY-BY-DEFAULT)
-- =========================================================================

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.prices enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_category_mappings enable row level security;
alter table public.olfactory_pyramids enable row level security;
alter table public.catalog_media enable row level security;

-- --- RLS: products ---
create policy products_select_policy on public.products
    for select
    using (
        status = 'published' or public.is_staff()
    );

create policy products_insert_policy on public.products
    for insert
    with check (
        public.is_admin()
    );

create policy products_update_policy on public.products
    for update
    using (
        public.is_admin()
    )
    with check (
        public.is_admin()
    );

create policy products_delete_policy on public.products
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: product_variants ---
create policy product_variants_select_policy on public.product_variants
    for select
    using (
        public.is_staff() or (
            is_active = true and exists (
                select 1 from public.products p
                where p.id = product_id and p.status = 'published'
            )
        )
    );

create policy product_variants_insert_policy on public.product_variants
    for insert
    with check (
        public.is_admin()
    );

create policy product_variants_update_policy on public.product_variants
    for update
    using (
        public.is_admin()
    )
    with check (
        public.is_admin()
    );

create policy product_variants_delete_policy on public.product_variants
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: prices ---
create policy prices_select_policy on public.prices
    for select
    using (
        public.is_staff() or (
            is_active = true and exists (
                select 1 from public.product_variants v
                join public.products p on p.id = v.product_id
                where v.id = variant_id and v.is_active = true and p.status = 'published'
            )
        )
    );

create policy prices_insert_policy on public.prices
    for insert
    with check (
        public.is_admin()
    );

create policy prices_update_policy on public.prices
    for update
    using (
        public.is_admin()
    )
    with check (
        public.is_admin()
    );

create policy prices_delete_policy on public.prices
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: product_categories ---
create policy product_categories_select_policy on public.product_categories
    for select
    using (
        true
    );

create policy product_categories_insert_policy on public.product_categories
    for insert
    with check (
        public.is_admin()
    );

create policy product_categories_update_policy on public.product_categories
    for update
    using (
        public.is_admin()
    )
    with check (
        public.is_admin()
    );

create policy product_categories_delete_policy on public.product_categories
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: product_category_mappings ---
create policy product_category_mappings_select_policy on public.product_category_mappings
    for select
    using (
        public.is_staff() or exists (
            select 1 from public.products p
            where p.id = product_id and p.status = 'published'
        )
    );

create policy product_category_mappings_insert_policy on public.product_category_mappings
    for insert
    with check (
        public.is_admin()
    );

create policy product_category_mappings_delete_policy on public.product_category_mappings
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: olfactory_pyramids ---
create policy olfactory_pyramids_select_policy on public.olfactory_pyramids
    for select
    using (
        public.is_staff() or exists (
            select 1 from public.products p
            where p.id = product_id and p.status = 'published'
        )
    );

create policy olfactory_pyramids_insert_policy on public.olfactory_pyramids
    for insert
    with check (
        public.is_admin()
    );

create policy olfactory_pyramids_update_policy on public.olfactory_pyramids
    for update
    using (
        public.is_admin()
    )
    with check (
        public.is_admin()
    );

create policy olfactory_pyramids_delete_policy on public.olfactory_pyramids
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: catalog_media ---
-- Resolves target product/variant status. Never permits unverified public access.
create policy catalog_media_select_policy on public.catalog_media
    for select
    using (
        public.is_staff() or (
            (product_id is not null and exists (
                select 1 from public.products p
                where p.id = product_id and p.status = 'published'
            ))
            or
            (variant_id is not null and exists (
                select 1 from public.product_variants v
                join public.products p on p.id = v.product_id
                where v.id = variant_id and v.is_active = true and p.status = 'published'
            ))
        )
    );

create policy catalog_media_insert_policy on public.catalog_media
    for insert
    with check (
        public.is_admin()
    );

create policy catalog_media_update_policy on public.catalog_media
    for update
    using (
        public.is_admin()
    )
    with check (
        public.is_admin()
    );

create policy catalog_media_delete_policy on public.catalog_media
    for delete
    using (
        public.is_admin()
    );

-- Grant select to anon and authenticated
grant select on public.products to anon, authenticated;
grant select on public.product_variants to anon, authenticated;
grant select on public.prices to anon, authenticated;
grant select on public.product_categories to anon, authenticated;
grant select on public.product_category_mappings to anon, authenticated;
grant select on public.olfactory_pyramids to anon, authenticated;
grant select on public.catalog_media to anon, authenticated;

-- Explicitly revoke client write operations
revoke insert, update, delete on public.products from public, anon;
revoke insert, update, delete on public.product_variants from public, anon;
revoke insert, update, delete on public.prices from public, anon;
revoke insert, update, delete on public.product_categories from public, anon;
revoke insert, update, delete on public.product_category_mappings from public, anon;
revoke insert, update, delete on public.olfactory_pyramids from public, anon;
revoke insert, update, delete on public.catalog_media from public, anon;
