-- Patch4Ever Supabase PostgreSQL Schema
-- Run this script once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

create extension if not exists pgcrypto;

-- 1. Order ID sequence (starts after seeded orders P4E-1042..P4E-1048)
create sequence if not exists public.p4e_order_number_seq start with 1049 increment by 1;

-- 2. Custom Patch Orders & Free Quotes
create table if not exists public.orders (
  id text primary key default ('P4E-' || nextval('public.p4e_order_number_seq')::text),
  source text not null default 'Order Page',
  status text not null default 'proof-pending'
    check (status in ('proof-pending', 'proof-sent', 'approved', 'in-production', 'shipped', 'completed', 'cancelled')),
  patch_type text not null,
  shape text not null default 'Custom',
  width text not null default '3.00',
  height text not null default '3.00',
  size numeric(6, 2) not null default 3.00 check (size > 0 and size <= 24),
  coverage text not null default 'Standard',
  border text not null default 'Merrowed Border',
  backing text not null default 'No Backing (Sew-On)',
  upgrades jsonb not null default '[]'::jsonb,
  qty integer not null check (qty > 0 and qty <= 1000000),
  rush boolean not null default false,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(12, 2) not null check (total_price >= 0),
  customer_name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  address text not null default '',
  in_hands_date text not null default '',
  artwork_name text not null default 'No file uploaded',
  notes text not null default '',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_patch_type on public.orders (patch_type);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_email on public.orders (email);

-- 3. Order Builder Catalog Configuration (Patch Types, Borders, Backings, Upgrades)
create table if not exists public.catalog_config (
  id text primary key default 'default',
  config jsonb not null,
  updated_at timestamptz not null default now()
);

-- 4. Footer Newsletter Subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

-- 5. Automatic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();

drop trigger if exists trg_catalog_config_updated_at on public.catalog_config;
create trigger trg_catalog_config_updated_at
  before update on public.catalog_config
  for each row
  execute function public.set_updated_at();

-- 6. Row Level Security (RLS)
-- Customer orders & newsletter emails are strictly server-only (service_role via Vercel API).
-- Public clients cannot read or dump PII directly with an anon key.
alter table public.orders enable row level security;
alter table public.catalog_config enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can read catalog config" on public.catalog_config;
create policy "Public can read catalog config"
  on public.catalog_config
  for select
  to anon, authenticated
  using (true);
