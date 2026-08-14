-- Osaka Kart catalog: plans, addons, translations
-- Run in Supabase SQL editor, or via supabase db reset (requires Docker).

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  duration_minutes int not null,
  distance_km numeric,
  base_price_jpy int not null,
  max_participants int default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.plan_translations (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.plans(id) on delete cascade,
  locale text not null,
  name text not null,
  description text,
  highlights text[],
  route_summary text,
  includes text[],
  requirements text[],
  unique (plan_id, locale)
);

create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  price_jpy int not null,
  max_qty int default 1,
  is_active boolean default true
);

create table if not exists public.addon_translations (
  id uuid primary key default gen_random_uuid(),
  addon_id uuid references public.addons(id) on delete cascade,
  locale text not null,
  name text not null,
  description text,
  unique (addon_id, locale)
);

alter table public.plans enable row level security;
alter table public.plan_translations enable row level security;
alter table public.addons enable row level security;
alter table public.addon_translations enable row level security;

drop policy if exists "public read plans" on public.plans;
create policy "public read plans"
  on public.plans for select
  using (is_active = true);

drop policy if exists "public read plan_translations" on public.plan_translations;
create policy "public read plan_translations"
  on public.plan_translations for select
  using (
    exists (
      select 1 from public.plans p
      where p.id = plan_id and p.is_active = true
    )
  );

drop policy if exists "public read addons" on public.addons;
create policy "public read addons"
  on public.addons for select
  using (is_active = true);

drop policy if exists "public read addon_translations" on public.addon_translations;
create policy "public read addon_translations"
  on public.addon_translations for select
  using (
    exists (
      select 1 from public.addons a
      where a.id = addon_id and a.is_active = true
    )
  );
