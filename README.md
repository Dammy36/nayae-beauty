# Nayaé Beauty

A React (JavaScript, no TypeScript) e-commerce + booking website for Nayaé
Beauty, backed by Supabase (database, auth, file storage).

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project URL + anon key
npm run dev             # starts the local dev server
```

## Supabase setup (one-time)

1. Go to [supabase.com](https://supabase.com), sign up/log in, and click
   **New Project**. Pick any name/region/password (save the database
   password somewhere safe, but you won't need it day-to-day).
2. Once the project finishes setting up, go to **SQL Editor** in the left
   sidebar, click **New query**, paste in the entire contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**. This
   creates every table, security rule, and function the app needs. It's
   safe to run again later if the schema file is ever updated.
3. Go to **Settings -> API**. Copy the **Project URL** and the
   **anon / public** key (NOT the `service_role` key - that one must never
   be shared or put in frontend code) into your `.env` file:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. To create the one admin login: go to **Authentication -> Users -> Add
   user**, create an account with your email/password, then run this in
   the SQL Editor (replace the email) so that account is recognized as an
   admin:
   ```sql
   insert into admins (id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```

## Project structure

```
src/
  main.jsx                 # app entry point - mounts React, router, and cart state
  App.jsx                   # the full list of URLs/pages in the site
  lib/
    supabaseClient.js       # the one shared connection to Supabase
    whatsapp.js              # builds "click to chat" WhatsApp links
    orders.js                 # TEMPORARY local order storage (until Phase 8 finishes)
  context/
    CartContext.jsx          # shopping cart state, shared across the whole app
  data/
    sampleProducts.js        # TEMPORARY placeholder catalogue (until Supabase is wired up)
    sampleServices.js        # TEMPORARY placeholder services
  components/
    layout/                   # Header, Footer, and the Layout wrapper
    product/                   # ProductCard, ShadeSelector
    service/                   # ServiceCard, ServiceIcon
    home/                       # homepage sections (Hero, FeaturedProducts, ...)
  pages/                      # one file per page (Home, Shop, Cart, Checkout, ...)
    admin/                       # admin-only pages (login, dashboard, ...)
  styles/
    tokens.css                 # design tokens (colors, spacing, type scale)
    global.css                  # shared styles built from those tokens
public/
  logo.jpg                    # the Nayaé Beauty logo (also used as favicon)
supabase/
  schema.sql                  # the full database schema - see "Supabase setup" above
makeup-images/                 # original source photos (already copied into src/assets
                                 # under clearer names - this folder is just the archive)
```

## Why these tools

- **Vite** - bundles the React code into plain HTML/CSS/JS files. No
  server needed to run the finished site, which is what makes it possible
  to deploy to plain Hostinger hosting.
- **react-router-dom** - lets the app show different pages (Shop, Cart,
  Admin, ...) without a full page reload, based on the URL.
- **@supabase/supabase-js** - the library that talks to our Supabase
  project (database, login, file storage) from the browser.
- **@fontsource-variable/\*** - self-hosts the Playfair Display and Inter
  fonts, bundled into the build instead of loaded from Google's servers.

No other libraries are used yet. Anything added later will be explained
when it's introduced.

## Current status

Phases 1-7 are complete: project setup, design system, homepage, shop
catalogue (with shade/color variants), product detail pages, cart, and
checkout with the WhatsApp order handoff. Products, services, and orders
currently live in local placeholder files (clearly marked `TEMPORARY` in
each file) rather than Supabase - Phase 8 replaces those with real
database calls once a Supabase project is connected (see "Supabase setup"
above).
