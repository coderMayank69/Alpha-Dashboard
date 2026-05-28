<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="Alpha Logo" />
</p>

<h1 align="center">Alpha Dashboard</h1>

<p align="center">
  <strong>A premium product management dashboard with AI-powered chat assistant, dual themes, real-time updates, and role-based access control.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-purple?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Groq_AI-LLaMA_3.3-orange?style=flat-square" alt="Groq AI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Dual Theme** | Plausible-inspired light mode + Linear-inspired dark mode with system auto-detection |
| 🤖 **AI Chat Assistant** | Groq-powered (LLaMA 3.3 70B) chatbot that answers dashboard questions via `Ctrl+K` |
| 📱 **Mobile-First Design** | Bottom tab navigation on mobile, collapsed sidebar on tablet, full sidebar on desktop |
| 🔐 **Role-Based Access** | Admin/User roles with route-level protection and feature gating |
| 📊 **Analytics Dashboard** | Category distribution, rating analysis, price ranges, and inventory value charts |
| 🔍 **Advanced Product Search** | Debounced real-time search with URL state sync for shareable filtered views |
| 🔄 **Live Polling** | Auto-refresh product data every 30 seconds with visual LIVE indicator |
| 📋 **Column Customizer** | Drag, reorder, and toggle table columns to preference |
| 📄 **Lazy Loading** | Route-based code splitting for optimal performance |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
├─────────────────────────────────────────────────────┤
│  React 19 + Vite 6                                  │
│  ┌───────────────────────────────────────────────┐  │
│  │                   App.jsx                     │  │
│  │  ┌─────────┐ ┌─────────────┐ ┌────────────┐  │  │
│  │  │ Theme   │ │    Auth     │ │  Product   │  │  │
│  │  │ Context │ │   Context   │ │  Status    │  │  │
│  │  │         │ │ (RBAC)      │ │  Context   │  │  │
│  │  └────┬────┘ └──────┬──────┘ └─────┬──────┘  │  │
│  │       │             │              │          │  │
│  │  ┌────▼─────────────▼──────────────▼──────┐   │  │
│  │  │           DashboardLayout              │   │  │
│  │  │  ┌─────────┐ ┌────────┐ ┌──────────┐  │   │  │
│  │  │  │ Sidebar │ │ TopBar │ │ BottomNav│  │   │  │
│  │  │  │(Desktop)│ │        │ │ (Mobile) │  │   │  │
│  │  │  └─────────┘ └────────┘ └──────────┘  │   │  │
│  │  │  ┌─────────────────────────────────┐   │   │  │
│  │  │  │         Page Routes             │   │   │  │
│  │  │  │  /dashboard  /products          │   │   │  │
│  │  │  │  /analytics  /settings          │   │   │  │
│  │  │  │  /products/:id                  │   │   │  │
│  │  │  └─────────────────────────────────┘   │   │  │
│  │  └────────────────────────────────────────┘   │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │           AI ChatBot (FAB)              │  │  │
│  │  │  Floating panel on all pages            │  │  │
│  │  │  Ctrl+K shortcut toggle                 │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                   External APIs                      │
│  ┌────────────────┐  ┌──────────────────────────┐   │
│  │  DummyJSON API │  │  Groq Cloud API          │   │
│  │  Products data │  │  LLaMA 3.3-70B-Versatile │   │
│  │  (REST)        │  │  (Chat Completions)       │   │
│  └────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── App.jsx                          # Root: routing, providers, chatbot
├── main.jsx                         # Vite entry point
├── index.css                        # Global design system (dual-theme tokens)
│
├── contexts/
│   ├── ThemeContext.jsx              # Light/Dark/System theme management
│   ├── AuthContext.jsx               # Authentication + RBAC (Admin/User)
│   └── ProductStatusContext.jsx      # Product visibility toggle state
│
├── hooks/
│   ├── useDebounce.js                # Debounce input values
│   ├── usePolling.js                 # Auto-refresh with configurable interval
│   └── useURLState.js                # URL ↔ state synchronization
│
├── components/
│   ├── Layout/
│   │   ├── Logo.jsx                  # SVG Alpha logomark component
│   │   ├── DashboardLayout.jsx       # Main layout shell
│   │   ├── Sidebar.jsx               # Desktop/tablet sidebar navigation
│   │   ├── TopBar.jsx                # Header with theme toggle + user menu
│   │   └── BottomNav.jsx             # Mobile bottom tab navigation
│   │
│   ├── Products/
│   │   ├── ProductTable.jsx          # Table view with sortable columns
│   │   ├── ProductGrid.jsx           # Grid/card view
│   │   ├── FilterPanel.jsx           # Category, rating, stock filters
│   │   ├── SearchBar.jsx             # Debounced search input
│   │   ├── SortControls.jsx          # Sort field + direction
│   │   ├── Pagination.jsx            # Page controls + per-page selector
│   │   ├── ColumnCustomizer.jsx      # Toggle & reorder columns
│   │   └── ImageCarousel.jsx         # Product image slideshow
│   │
│   ├── Analytics/
│   │   └── StatCard.jsx              # Animated metric card
│   │
│   ├── AI/
│   │   └── AIChatBot.jsx             # Groq-powered floating chatbot
│   │
│   └── ProtectedRoute.jsx            # Auth + role guard HOC
│
├── pages/
│   ├── LoginPage.jsx                 # Authentication with demo credentials
│   ├── DashboardPage.jsx             # Home overview + quick actions
│   ├── ProductsPage.jsx              # Full product management
│   ├── ProductDetailPage.jsx         # Single product deep dive
│   ├── AnalyticsPage.jsx             # Admin-only charts & stats
│   └── SettingsPage.jsx              # Profile, theme, access controls
│
└── utils/
    └── helpers.js                    # Shared utility functions
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/Alpha-Dashboard.git
cd Alpha-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🔑 **Admin** | `admin@alpha.io` | `admin123` |
| 👤 **User** | `user@alpha.io` | `user123` |

> **Admin** has full access: all products (including hidden), analytics dashboard, visibility toggles.  
> **User** sees published products only; no analytics page.

---

## 🤖 AI Chat Assistant

The dashboard includes a built-in AI chatbot powered by **Groq** (LLaMA 3.3 70B).

1. Click the ✨ floating button (bottom-right) or press `Ctrl+K`
2. Click ⚙️ to enter your **free** Groq API key from [console.groq.com](https://console.groq.com)
3. Ask anything about the dashboard:
   - *"How do I filter products by category?"*
   - *"What can admin users do?"*
   - *"How does the live polling work?"*
   - *"Explain the theme system"*

The API key is stored in your browser's `localStorage` — it never leaves your machine.

---

## 🎨 Design System

### Light Mode (Plausible-inspired)
- Clean white backgrounds with subtle gray hierarchy
- Bold indigo accent (`hsl(239, 84%, 67%)`)
- Crisp shadows, no glassmorphism
- Editorial, breathable feel

### Dark Mode (Linear-inspired)
- Deep navy backgrounds (`hsl(228, 25%, 7%)`)
- Electric violet accent (`hsl(252, 100%, 68%)`)
- Glassmorphism with `backdrop-filter: blur()`
- Subtle glows on interactive elements

### Responsive Breakpoints
| Breakpoint | Layout | Navigation |
|-----------|--------|------------|
| `< 768px` | Single column | Bottom tab bar |
| `768–1024px` | 2-column grids | Collapsed sidebar (icons) |
| `> 1024px` | Multi-column | Full sidebar (260px) |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI framework with lazy loading |
| [Vite 6](https://vite.dev) | Build tool + dev server |
| [React Router](https://reactrouter.com) | Client-side routing |
| [Recharts](https://recharts.org) | Chart components for analytics |
| [Lucide React](https://lucide.dev) | Icon library |
| [Groq Cloud](https://groq.com) | AI inference (LLaMA 3.3 70B) |
| [DummyJSON](https://dummyjson.com) | Mock product data API |
| CSS Custom Properties | Dual-theme design token system |

---

## 📝 License

MIT © Alpha Dashboard
