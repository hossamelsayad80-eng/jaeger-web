# Jaeger Web

Marketing + catalog site for Jaeger Longevity. Display-only — purchases happen inside the iOS app via In-App Purchase.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v3 · Supabase (via `get_public_products()` RPC) · deployed on Vercel.

---

## 1. Local setup

```bash
# 1. install
npm install

# 2. copy env template
cp .env.example .env.local

# 3. fill in real values in .env.local
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - NEXT_PUBLIC_APP_STORE_URL  (TestFlight link initially)

# 4. run
npm run dev
```

Open http://localhost:3000.

---

## 2. Supabase

The site reads exclusively through the existing RPC:

```sql
get_public_products()
```

That function is `SECURITY DEFINER` and bypasses RLS for anonymous reads, so the anon key is safe to expose.

If your row shape differs from `lib/types.ts`, edit that file — the rest of the app will type-check against it.

---

## 3. Deploy to Vercel

1. Push this repo to GitHub.
2. On Vercel → **Add New → Project** → import the repo.
3. In **Environment Variables**, paste the same three values from `.env.local`.
4. Deploy. You get a `*.vercel.app` URL immediately.

### Custom domain

1. In Vercel → Project → **Settings → Domains** → add `jaegerlongevity.com` and `www.jaegerlongevity.com`.
2. Vercel will show you the DNS records to set.
3. In Cloudflare (recommended) or wherever your DNS lives:
   - Add the `A` / `CNAME` records Vercel gave you for the website.
   - **Leave all `MX` and mail-related `TXT` records pointing to Turbify** so email keeps working.
4. SSL provisions automatically within a few minutes.

---

## 4. After cutover

- Verify email still works (send yourself a test).
- Shopify admin → **Settings → Plan → Deactivate store** to stop billing.
- Optional: export Shopify customers first (Customers → Export CSV).

---

## 5. Updating content

You don't redeploy when you add/edit products — pages revalidate every 5 minutes (`export const revalidate = 300`). To force an immediate refresh, redeploy from Vercel (1 click).

---

## 6. Where to edit

| Want to change… | Edit… |
| --- | --- |
| Colors, fonts, spacing | `tailwind.config.ts`, `app/globals.css` |
| Homepage copy | `app/page.tsx` |
| Catalog layout | `app/products/page.tsx` |
| Product detail layout | `app/products/[slug]/page.tsx` |
| Header / footer | `components/Header.tsx`, `components/Footer.tsx` |
| App Store link | `NEXT_PUBLIC_APP_STORE_URL` env var (no redeploy needed if changed in Vercel — trigger a redeploy after) |
| Privacy policy text | `app/privacy/page.tsx` |
# jaeger-web
