-- ============================================================================
-- Nayae Beauty - Database Schema
-- ============================================================================
-- Run this once in the Supabase SQL Editor:
--   Dashboard -> SQL Editor -> New query -> paste this whole file -> Run
--
-- Safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE / DROP
-- POLICY IF EXISTS, so running it again later (after an update) won't
-- duplicate anything or error out.
-- ============================================================================

create extension if not exists pgcrypto;

-- Supabase normally grants baseline table permissions to the anon /
-- authenticated roles automatically, but that didn't take effect on this
-- project, which caused "permission denied" errors even though every
-- table below has RLS policies. This just allows the attempt in the
-- first place - the RLS policies on each table (further down) are what
-- actually decide which ROWS each role can see or change. Also applies
-- automatically to any table added later.
grant usage on schema public to anon, authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;

-- ----------------------------------------------------------------------------
-- ADMINS
-- One row per authorized admin login (there's exactly one for now - the
-- business owner). Checked by nearly every policy below to decide whether
-- the current logged-in user is allowed to manage data.
-- ----------------------------------------------------------------------------
create table if not exists admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- A small helper so every policy below can just write "is_admin()" instead
-- of repeating this subquery everywhere.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins where id = auth.uid()
  );
$$;

alter table admins enable row level security;

drop policy if exists "Admins can view the admin list" on admins;
create policy "Admins can view the admin list"
  on admins for select
  using (is_admin());

-- ----------------------------------------------------------------------------
-- SETTINGS
-- One single row of site-wide configuration (the WhatsApp number, etc.) so
-- it's never hardcoded in the frontend and the owner can update it later
-- from the admin dashboard.
-- ----------------------------------------------------------------------------
create table if not exists settings (
  id boolean primary key default true, -- always exactly one row (id = true)
  whatsapp_number text not null default '14372676919',
  updated_at timestamptz not null default now(),
  constraint settings_single_row check (id)
);

insert into settings (id) values (true)
  on conflict (id) do nothing;

alter table settings enable row level security;

drop policy if exists "Anyone can read settings" on settings;
create policy "Anyone can read settings"
  on settings for select
  using (true);

drop policy if exists "Admins can update settings" on settings;
create policy "Admins can update settings"
  on settings for update
  using (is_admin());

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

drop policy if exists "Anyone can read categories" on categories;
create policy "Anyone can read categories"
  on categories for select
  using (true);

drop policy if exists "Admins can manage categories" on categories;
create policy "Admins can manage categories"
  on categories for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2), -- null = "Price coming soon" in the UI
  stock integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products (category_id);

alter table products enable row level security;

drop policy if exists "Anyone can read active products" on products;
create policy "Anyone can read active products"
  on products for select
  using (status = 'active' or is_admin());

drop policy if exists "Admins can manage products" on products;
create policy "Admins can manage products"
  on products for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCT IMAGES
-- A product can have more than one photo; display_order controls which
-- one shows first.
-- ----------------------------------------------------------------------------
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on product_images (product_id);

alter table product_images enable row level security;

-- Only shows photos for products that are actually visible in the shop
-- (or to an admin, who can see everything) - otherwise an inactive
-- product's photos would still be fetchable directly even though the
-- product itself is hidden.
drop policy if exists "Anyone can read product images" on product_images;
create policy "Anyone can read product images"
  on product_images for select
  using (
    is_admin()
    or exists (
      select 1 from products
      where products.id = product_images.product_id and products.status = 'active'
    )
  );

drop policy if exists "Admins can manage product images" on product_images;
create policy "Admins can manage product images"
  on product_images for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCT SHADES
-- Optional color/shade variants (e.g. the L.A. Girl Concealer's 24
-- shades). A product with no rows here is simply a single-variant product.
-- ----------------------------------------------------------------------------
create table if not exists product_shades (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  name text not null,
  available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, name)
);

create index if not exists product_shades_product_id_idx on product_shades (product_id);

alter table product_shades enable row level security;

drop policy if exists "Anyone can read product shades" on product_shades;
create policy "Anyone can read product shades"
  on product_shades for select
  using (
    is_admin()
    or exists (
      select 1 from products
      where products.id = product_shades.product_id and products.status = 'active'
    )
  );

drop policy if exists "Admins can manage product shades" on product_shades;
create policy "Admins can manage product shades"
  on product_shades for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- SERVICES
-- ----------------------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2),
  duration_minutes integer,
  cover_image_url text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table services enable row level security;

drop policy if exists "Anyone can read active services" on services;
create policy "Anyone can read active services"
  on services for select
  using (status = 'active' or is_admin());

drop policy if exists "Admins can manage services" on services;
create policy "Admins can manage services"
  on services for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- SERVICE PORTFOLIO
-- Work photos shown on a service's detail page, managed by the owner
-- from the admin dashboard.
-- ----------------------------------------------------------------------------
create table if not exists service_portfolio (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services (id) on delete cascade,
  image_url text not null,
  caption text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists service_portfolio_service_id_idx on service_portfolio (service_id);

alter table service_portfolio enable row level security;

drop policy if exists "Anyone can read service portfolio" on service_portfolio;
create policy "Anyone can read service portfolio"
  on service_portfolio for select
  using (
    is_admin()
    or exists (
      select 1 from services
      where services.id = service_portfolio.service_id and services.status = 'active'
    )
  );

drop policy if exists "Admins can manage service portfolio" on service_portfolio;
create policy "Admins can manage service portfolio"
  on service_portfolio for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- ORDERS + ORDER ITEMS
-- Customers never get direct table access (there are no customer
-- accounts) - every order is created through the create_order() function
-- below, and only an admin can read or update orders afterward.
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id bigint generated always as identity (start with 1000) primary key,
  customer_name text not null,
  phone text not null,
  whatsapp_number text not null,
  email text,
  fulfillment_method text not null check (fulfillment_method in ('pickup', 'delivery')),
  delivery_address text,
  subtotal numeric(10, 2),
  total numeric(10, 2),
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Cancelled')),
  order_status text not null default 'Pending Payment'
    check (order_status in ('Pending Payment', 'Paid', 'Processing', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id bigint not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null, -- snapshot: stays correct even if the product is later renamed/deleted
  shade text,
  unit_price numeric(10, 2),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2)
);

create index if not exists order_items_order_id_idx on order_items (order_id);

alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "Admins can read orders" on orders;
create policy "Admins can read orders"
  on orders for select
  using (is_admin());

drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders"
  on orders for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "Admins can read order items" on order_items;
create policy "Admins can read order items"
  on order_items for select
  using (is_admin());

-- Nothing here grants INSERT to anon/customers on purpose. Orders are only
-- ever created through create_order() below, which runs with elevated
-- privileges and does its own validation - so a customer can never insert
-- a fake "Paid" order or read someone else's order.

-- ----------------------------------------------------------------------------
-- create_order()
-- The only way a customer's checkout can create an order. Runs as
-- SECURITY DEFINER (elevated privileges) so it can insert into orders /
-- order_items despite the customer having no direct table access - but it
-- only ever does exactly what's written here, nothing more.
-- ----------------------------------------------------------------------------
create or replace function create_order(
  p_customer_name text,
  p_phone text,
  p_whatsapp_number text,
  p_email text,
  p_fulfillment_method text,
  p_delivery_address text,
  p_items jsonb -- [{ "product_id": "...", "quantity": 1, "shade": "..." }, ...]
)
returns table (order_id bigint, order_total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id bigint;
  v_item jsonb;
  v_product products%rowtype;
  v_unit_price numeric(10, 2);
  v_line_total numeric(10, 2);
  v_subtotal numeric(10, 2) := 0;
  v_has_unpriced_item boolean := false;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'An order must have at least one item.';
  end if;

  insert into orders (
    customer_name, phone, whatsapp_number, email,
    fulfillment_method, delivery_address
  )
  values (
    p_customer_name, p_phone, p_whatsapp_number, p_email,
    p_fulfillment_method, p_delivery_address
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products where id = (v_item->>'product_id')::uuid;

    if not found then
      raise exception 'Product % no longer exists.', v_item->>'product_id';
    end if;

    if (v_item->>'quantity')::integer > v_product.stock then
      raise exception 'Not enough stock for "%".', v_product.name;
    end if;

    v_unit_price := v_product.price;
    if v_unit_price is null then
      v_has_unpriced_item := true;
      v_line_total := null;
    else
      v_line_total := v_unit_price * (v_item->>'quantity')::integer;
      v_subtotal := v_subtotal + v_line_total;
    end if;

    insert into order_items (order_id, product_id, product_name, shade, unit_price, quantity, line_total)
    values (
      v_order_id, v_product.id, v_product.name, v_item->>'shade',
      v_unit_price, (v_item->>'quantity')::integer, v_line_total
    );
  end loop;

  update orders
  set subtotal = case when v_has_unpriced_item then null else v_subtotal end,
      total = case when v_has_unpriced_item then null else v_subtotal end
  where id = v_order_id;

  return query select v_order_id, (case when v_has_unpriced_item then null else v_subtotal end);
end;
$$;

grant execute on function create_order to anon, authenticated;

-- ----------------------------------------------------------------------------
-- mark_order_paid()
-- Admin-only. Atomically re-checks stock and deducts it, so two admins
-- confirming payment on overlapping orders can never oversell the same
-- item. Fails loudly (with a clear message) if stock ran out since the
-- order was placed, instead of silently going negative.
-- ----------------------------------------------------------------------------
create or replace function mark_order_paid(p_order_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
begin
  if not is_admin() then
    raise exception 'Only an admin can mark an order as paid.';
  end if;

  for v_item in
    select product_id, product_name, quantity
    from order_items
    where order_id = p_order_id and product_id is not null
  loop
    if (select stock from products where id = v_item.product_id) < v_item.quantity then
      raise exception 'Not enough stock left for "%" to confirm this order.', v_item.product_name;
    end if;

    update products
    set stock = stock - v_item.quantity
    where id = v_item.product_id;
  end loop;

  update orders
  set payment_status = 'Paid', order_status = 'Paid'
  where id = p_order_id;
end;
$$;

grant execute on function mark_order_paid to authenticated;

-- ----------------------------------------------------------------------------
-- cancel_order()
-- Admin-only. If the order had already been marked Paid (meaning stock
-- was deducted), that stock is added back before the order is
-- cancelled - so cancelling a paid order doesn't leave inventory
-- permanently short. Cancelling a still-unpaid order just cancels it,
-- since no stock was ever deducted for it.
-- ----------------------------------------------------------------------------
create or replace function cancel_order(p_order_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_status text;
  v_item record;
begin
  if not is_admin() then
    raise exception 'Only an admin can cancel an order.';
  end if;

  select payment_status into v_payment_status from orders where id = p_order_id;

  if v_payment_status = 'Paid' then
    for v_item in
      select product_id, quantity
      from order_items
      where order_id = p_order_id and product_id is not null
    loop
      update products
      set stock = stock + v_item.quantity
      where id = v_item.product_id;
    end loop;
  end if;

  update orders
  set payment_status = 'Cancelled', order_status = 'Cancelled'
  where id = p_order_id;
end;
$$;

grant execute on function cancel_order to authenticated;

-- ----------------------------------------------------------------------------
-- BOOKINGS
-- Same pattern as orders: no direct customer table access, only through
-- create_booking().
-- ----------------------------------------------------------------------------
create table if not exists bookings (
  id bigint generated always as identity (start with 1000) primary key,
  service_id uuid references services (id) on delete set null,
  customer_name text not null,
  phone text not null,
  whatsapp_number text not null,
  booking_date date not null,
  booking_time time not null,
  notes text,
  status text not null default 'Pending'
    check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_date_time_idx on bookings (booking_date, booking_time);

-- Belt-and-suspenders alongside the check inside create_booking(): even if
-- two requests for the same slot somehow arrive at the exact same instant,
-- the database itself refuses to store both as a real hard guarantee.
create unique index if not exists bookings_no_double_booking
  on bookings (booking_date, booking_time)
  where status <> 'Cancelled';

alter table bookings enable row level security;

drop policy if exists "Admins can read bookings" on bookings;
create policy "Admins can read bookings"
  on bookings for select
  using (is_admin());

drop policy if exists "Admins can update bookings" on bookings;
create policy "Admins can update bookings"
  on bookings for update
  using (is_admin())
  with check (is_admin());

create or replace function create_booking(
  p_service_id uuid,
  p_customer_name text,
  p_phone text,
  p_whatsapp_number text,
  p_booking_date date,
  p_booking_time time,
  p_notes text
)
returns table (booking_id bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_id bigint;
begin
  if exists (
    select 1 from bookings
    where booking_date = p_booking_date
      and booking_time = p_booking_time
      and status not in ('Cancelled')
  ) then
    raise exception 'That time is no longer available. Please choose another.';
  end if;

  begin
    insert into bookings (service_id, customer_name, phone, whatsapp_number, booking_date, booking_time, notes)
    values (p_service_id, p_customer_name, p_phone, p_whatsapp_number, p_booking_date, p_booking_time, p_notes)
    returning id into v_booking_id;
  exception when unique_violation then
    -- Someone else booked this exact slot in the instant between our
    -- check above and this insert - the unique index caught it.
    raise exception 'That time is no longer available. Please choose another.';
  end;

  return query select v_booking_id;
end;
$$;

grant execute on function create_booking to anon, authenticated;

-- ----------------------------------------------------------------------------
-- STORAGE BUCKETS
-- Where product photos and service portfolio photos actually get
-- uploaded to (Phase 11+ admin image upload). Public read (so the photos
-- show up on the website), admin-only write.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin());

drop policy if exists "Anyone can view portfolio images" on storage.objects;
create policy "Anyone can view portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "Admins can upload portfolio images" on storage.objects;
create policy "Admins can upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and is_admin());

drop policy if exists "Admins can update portfolio images" on storage.objects;
create policy "Admins can update portfolio images"
  on storage.objects for update
  using (bucket_id = 'portfolio-images' and is_admin());

drop policy if exists "Admins can delete portfolio images" on storage.objects;
create policy "Admins can delete portfolio images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and is_admin());

-- ----------------------------------------------------------------------------
-- Apply the same baseline grants to the tables just created above (the
-- ALTER DEFAULT PRIVILEGES near the top only affects tables created AFTER
-- it runs, not these ones, since they're defined in this same script).
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
