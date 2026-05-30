# SekolahPay Frontend

A modern, premium school payment management system frontend built with React, TypeScript, and a Google Gemini-inspired UI design.

## ✨ Features

- **Premium Gemini-Inspired UI**: Flat/material design with smooth animations and a teal/blue color palette
- **Dashboard Analytics**: Real-time statistics and payment tracking
- **Payment Management**: Handle student payments, invoices, and transaction records
- **User Administration**: Manage admin users and student data
- **Reporting**: Generate payment reports and financial summaries
- **Dark/Light Mode**: Full theme support with smooth transitions
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS 4** for styling
- **shadcn/ui** for accessible UI components
- **React Router 7** for navigation
- **TanStack Query** for data fetching
- **Lucide React** for icons
- **Axios** for API communication
- **pnpm** as package manager

## 📦 Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
## VITE_API_URL=http://localhost:8000/api
```

3. Start the development server:

```bash
pnpm dev
```

## 🛠️ Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AppSidebar.tsx  # Sidebar navigation
│   ├── Layout.tsx      # Main layout wrapper
│   ├── StatCard.tsx    # Dashboard statistics card
│   └── ThemeToggle.tsx # Theme switcher
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Authentication page
│   ├── Tagihan.tsx     # Payment/invoice management
│   ├── Report.tsx      # Reports and analytics
│   └── UserAdmin.tsx   # User administration
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utility libraries
│   ├── api.ts          # API client setup
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
└── index.css           # Global styles with Gemini design system
```

## 🎨 Design System

The application features a Google Gemini-inspired design system with:

- Flat, material design aesthetics (no gradients)
- Smooth cubic-bezier animations for all transitions
- Staggered loading animations for dashboard elements
- Teal/blue color palette with soft blue undertones
- Oklch color format for consistent light/dark mode
- Centralized styling in `src/index.css` for easy maintenance

### Key CSS Classes

- `gemini-surface`: Main surface background
- `gemini-stat-card`: Dashboard statistic cards
- `gemini-card`: General card container
- `animate-gemini-fade-in`: Fade in animation
- `animate-gemini-slide-up`: Slide up animation
- `animate-gemini-spin`: Loading spinner animation

## 🔐 Type Safety

Full TypeScript support with strict type checking. No `any` types used - all data structures are properly typed.

## 📄 Core Data Types

### Tagihan (Invoice)

```typescript
interface Tagihan {
  id: number;
  siswa: Siswa;
  jenis: string;
  nominal_asli: number;
  nominal_disesuaikan: number;
  periode: string;
  status: 'lunas' | 'menunggak' | 'belum_lunas';
  // ... additional properties
}
```

### Dashboard Statistics

```typescript
interface DashboardStats {
  total_tunggakan: number;
  total_terbayar_bulan_ini: number;
  jumlah_siswa_menunggak: number;
  total_transaksi_hari_ini: number;
}
```

## 🔗 Backend Integration

This frontend is designed to work with a Laravel backend (included in the parent directory) for handling payment processing, user authentication, and data persistence.

## 📝 License

Private - All rights reserved.
