# Alpha Dashboard

A premium product management admin dashboard built for a Front-End Internship assignment.

## 🚀 Live Demo
[Deployed on Vercel](#) <!-- Add link after deployment -->

## 🎯 Features

### Core Requirements
- **Dashboard Layout** — Responsive sidebar + topbar + content area (Desktop/Tablet/Mobile)
- **Product Listing** — Table + Grid view with search, multi-category filters, sort, pagination
- **Product Detail** — Image carousel, full specs, reviews, warranty info
- **Analytics Dashboard** — 4 stat cards with count-up animations + 4 Recharts charts
- **URL State Sync** — All filters, search, sort, pagination synced to URL
- **Authentication & RBAC** — Admin vs User roles with different access levels

### Performance Optimizations (All 5)
1. **Debounced Search** — 300ms debounce via custom `useDebounce` hook
2. **React.memo** — `ProductRow`, `ProductCard`, `StarRating`, `StatCard`
3. **useMemo** — Filtered/sorted product lists recomputed only when dependencies change
4. **useCallback** — All event handlers in `ProductsPage` memoized
5. **Lazy Loading** — All pages via `React.lazy()` + `Suspense`

### Bonus Features
- **Real-Time Polling** — Live product updates with LIVE badge and seconds-ago counter
- **Column Customization** — Show/hide columns + drag-to-reorder via HTML5 DnD

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alpha.io | admin123 |
| User | user@alpha.io | user123 |

**Admin Access:** Analytics dashboard, all products (including hidden), publish/hide products
**User Access:** Product listing (published only), product detail pages

## 🛠 Tech Stack
- **React 18** + **Vite**
- **React Router v6** (URL state sync)
- **Recharts** (analytics charts)
- **Lucide React** (icons)
- **Vanilla CSS** with CSS custom properties

## 📦 Setup

```bash
npm install
npm run dev
```

## 🌐 API
Uses [dummyjson.com/products](https://dummyjson.com/products) — 194 products across 24 categories
