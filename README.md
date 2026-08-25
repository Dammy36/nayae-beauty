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

The site is feature-complete and connected to a live Supabase project:
shop with cart/checkout, service booking, a full admin dashboard (product,
order, and booking management), and the About/Services/Contact pages, all
backed by real database calls with the WhatsApp order/booking handoff.
It's ready to deploy - see "Deploying to Hostinger" below.

## Deploying to Hostinger

1. **Build the site**: run `npm run build`. This creates a `dist/` folder
   containing plain HTML/CSS/JS files - that's the entire website, ready
   to upload anywhere that serves static files (no Node.js needed on the
   server).
2. **Upload**: in Hostinger's hPanel, open **File Manager** (or use FTP),
   go to `public_html` (or a subfolder if the site lives at a path), and
   upload *everything inside* `dist/` - not the `dist` folder itself, its
   contents (`index.html`, `assets/`, `products/`, `logo.jpg`, and the
   hidden `.htaccess` file). File Manager may hide `.htaccess` by default;
   enable "Show Hidden Files" to confirm it uploaded, since the site's
   page links (like `/shop` or `/about`) won't work without it.
3. **Re-deploying after a change**: repeat steps 1-2. Overwrite the old
   files with the new `dist/` contents.

A few things worth knowing:
- The `.htaccess` file (in `public/`, copied into every build) is what
  makes direct links like `nayaebeauty.com/shop` work. Without it,
  Hostinger's server would show a 404 for any page except the homepage,
  since this is a client-side-routed React app.
- The Supabase URL and key are baked into the build at build time from
  `.env` - if those ever change, update `.env` and run `npm run build`
  again before re-uploading.
- Product photos are served from this app itself (the `public/products/`
  folder, copied into `dist/products/`) rather than Supabase Storage, so
  they need to be part of every upload too.
