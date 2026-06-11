# SHOE MAFIA — Enterprise E-Commerce Platform

Production-grade footwear e-commerce with offline POS, inventory management, barcode system, and BUSY PDF import. **All business data is stored exclusively in Neon PostgreSQL.**

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend:** Next.js Route Handlers, Server Actions
- **Database:** Neon PostgreSQL (sole source of truth)
- **ORM:** Prisma
- **Auth:** JWT + HTTP-only cookies
- **Payments:** Razorpay
- **Deployment:** Vercel

## Prerequisites

- Node.js 20+
- Neon PostgreSQL database ([neon.tech](https://neon.tech))

## Setup

### 1. Install dependencies

```bash
cd Projects/shoe-mafia
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection string |
| `JWT_SECRET` | Random 32+ character secret |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `RAZORPAY_KEY_ID` | Razorpay key (server) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (server) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `http://localhost:3000`) |

### 3. Initialize database

```bash
npx prisma db push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

Click **Admin** on the homepage footer area. Credentials are loaded from `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables only — never hardcoded in source.

Admin panel: `/admin`

## Features

| Module | Route | Description |
|--------|-------|-------------|
| Storefront | `/` | Dynamic homepage from Neon |
| Shop | `/shop` | Product catalog |
| Contact | `/contact` | Store info, map, WhatsApp |
| Admin Dashboard | `/admin` | Analytics overview |
| Products | `/admin/products` | CRUD, bulk operations |
| POS | `/admin/pos` | Barcode scanner, billing |
| BUSY Import | `/admin/import` | PDF stock sync |
| Barcodes | `/admin/barcodes` | Barcode management |
| Orders | `/admin/orders` | Order management |
| Invoices | `/admin/invoices` | Invoice records |
| Analytics | `/admin/analytics` | Revenue charts |
| Settings | `/admin/settings` | Store config + danger zone |

## Database Schema

30+ normalized tables including: `products`, `inventory`, `orders`, `invoices`, `barcodes`, `busy_import_logs`, `payments`, `customers`, `reviews`, `analytics`, `audit_logs`, and more.

All tables include `id`, `created_at`, `updated_at` with proper indexes and foreign keys.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

```bash
npm run build
```

## Architecture Principles

- **Neon PostgreSQL is the only permanent storage** — no localStorage, IndexedDB, or in-memory persistence for business data
- All CRUD operations read/write Neon
- Inventory updates use database transactions
- Admin actions are audit-logged
- JWT secrets and admin credentials never exposed to frontend

## License

Proprietary — SHOE MAFIA © 2026
