# SEKOLAHPAY — Sistem Pembayaran Sekolah

> **Status:** Development Scaffold  
> **Stack:** Laravel 11 + Inertia.js + React 19 + shadcn/ui (Rhea/Mist)  
> **Team:** 2-person tag team (Frontend JS/TS + Backend Laravel/PHP)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Project Structure](#project-structure)
6. [Key Features](#key-features)
7. [Backend Guide (For Laravel Dev)](#backend-guide)
8. [Frontend Guide (For React Dev)](#frontend-guide)
9. [QRIS Integration](#qris-integration)
10. [Database Schema](#database-schema)
11. [Deployment](#deployment)
12. [Team Workflow](#team-workflow)

---

## 🎯 Overview

SEKOLAHPAY is a full-stack web application for managing school tuition payments via **QRIS** (Quick Response Code Indonesian Standard). Built for Indonesian schools that need:

- **Dynamic invoice amounts** — nominal can change on demand with full audit trail
- **QRIS generation & regeneration** — auto-expire old QRIS when amounts change
- **Real-time dashboard** — summary cards, charts, and recent transactions
- **Comprehensive reporting** — per-student payment history with **kekurangan bayar** (shortfall) tracking
- **Role-based admin management** — Kepala Sekolah, Bendahara, Operator

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Laravel | 11.x |
| **Frontend Framework** | Inertia.js | 2.x |
| **UI Library** | React | 19.x |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **UI Components** | shadcn/ui | v4 (Rhea style, Mist base) |
| **Animation** | tw-animate-css | latest |
| **Icons** | Lucide React | latest |
| **Build Tool** | Vite | 6.x |
| **Queue** | Redis + Laravel Horizon | — |
| **QRIS Gateway** | Midtrans / Xendit / Flip | — |

---

## 📦 Prerequisites

Before installing, ensure your environment has:

- **PHP** ≥ 8.3 with extensions: `pdo`, `pdo_mysql`, `mbstring`, `openssl`, `redis`, `gd`
- **Composer** ≥ 2.7
- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **MySQL** ≥ 8.0 or **PostgreSQL** ≥ 15
- **Redis** ≥ 7.0 (for queues & caching)
- **Git**

---

## 🚀 Installation

### 1. Clone & Setup Laravel

```bash
# Clone the repository
git clone https://github.com/your-org/sekolahpay.git
cd sekolahpay

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sekolahpay
DB_USERNAME=root
DB_PASSWORD=your_password

# Configure Redis (for queues)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Run migrations
php artisan migrate

# (Optional) Seed mock data for development
php artisan db:seed --class=MockDataSeeder
```

### 2. Setup Frontend

```bash
# Install Node dependencies
npm install

# Initialize shadcn/ui (if starting fresh)
npx shadcn@latest init
# Select: Laravel template, Rhea style, Mist base color

# Add required shadcn components
npx shadcn@latest add button card input label badge dialog select table sonner accordion sheet dropdown-menu separator avatar

# Install additional packages
npm install lucide-react

# Compile assets
npm run dev
```

### 3. Start Development Servers

```bash
# Terminal 1 — Laravel backend
php artisan serve

# Terminal 2 — Vite HMR (if not using artisan serve integration)
npm run dev

# Terminal 3 — Queue worker (for QRIS generation & notifications)
php artisan queue:work --queue=default,qris,notifications

# Terminal 4 — Horizon dashboard (optional)
php artisan horizon
```

Access the app at: `http://localhost:8000`

---

## 🗂 Project Structure

```
sekolahpay/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php          # Login/logout handling
│   │   │   ├── DashboardController.php       # Summary stats & charts data
│   │   │   ├── TagihanController.php         # CRUD invoices + QRIS generation
│   │   │   ├── UserAdminController.php       # Role-based admin management
│   │   │   └── ReportController.php          # Payment reports with kekurangan
│   │   └── Middleware/
│   ├── Models/
│   │   ├── Siswa.php
│   │   ├── Tagihan.php
│   │   ├── InvoiceRevision.php               # Audit trail for dynamic amounts
│   │   ├── Payment.php
│   │   ├── QrisTransaction.php               # QRIS lifecycle tracking
│   │   └── User.php
│   └── Jobs/
│       ├── GenerateQrisJob.php
│       └── SendPaymentNotificationJob.php
├── database/
│   ├── migrations/
│   └── seeders/
│       └── MockDataSeeder.php
├── resources/
│   ├── css/
│   │   └── app.css                           # Tailwind v4 + Mist theme
│   └── js/
│       ├── Components/
│       │   ├── ui/                           # shadcn/ui components
│       │   ├── AppSidebar.tsx                # Navigation sidebar
│       │   ├── Layout.tsx                    # Root layout wrapper
│       │   ├── StatCard.tsx                  # Dashboard stat component
│       │   └── DataTable.tsx                 # Reusable table wrapper
│       ├── Pages/
│       │   ├── Auth/
│       │   │   └── Login.tsx
│       │   ├── Dashboard/
│       │   │   └── Index.tsx                 # Charts + summary cards
│       │   ├── Tagihan/
│       │   │   └── Index.tsx                 # Invoice CRUD + QRIS modal
│       │   ├── UserAdmin/
│       │   │   └── Index.tsx                 # Admin management table
│       │   └── Report/
│       │       └── Index.tsx                 # Reports with kekurangan
│       ├── types/
│       │   └── index.ts                      # Shared TypeScript interfaces
│       ├── lib/
│       │   └── utils.ts                      # cn() helper
│       └── app.tsx                           # Inertia app entry
├── routes/
│   └── web.php                               # All routes (Inertia + API webhooks)
├── storage/
│   └── app/public/qris/                     # Generated QRIS images
├── vite.config.ts
└── tailwind.config.ts                         # Not needed for Tailwind v4
```

---

## ✨ Key Features

### 1. Login Page
- Clean, centered card layout with Mist theme
- Laravel Breeze-compatible auth scaffolding
- Redirects to Dashboard upon success

### 2. Dashboard — Ringkasan Transaksi
- **4 Stat Cards**: Total tunggakan, terbayar bulan ini, siswa menunggak, transaksi hari ini
- **Rekap Bulanan**: Bar-style comparison of terbayar vs tunggakan per month
- **Breakdown Jenis Tagihan**: Progress bars showing payment completion % per category
- **Recent Transactions**: Table of last 10 QRIS payments with status badges

### 3. Manajemen Tagihan
- **Create Invoice**: Form with siswa data, jenis tagihan dropdown, periode, nominal
- **Dynamic Nominal**: Edit active amount anytime → triggers QRIS regeneration
- **QRIS Display**: Modal showing QRIS string + expiry countdown
- **Status Tracking**: `lunas` | `menunggak` | `belum_lunas`
- **Audit Trail**: Every nominal change logged in `invoice_revisions`

### 4. Manajemen User Admin
- Role-based: `kepala_sekolah`, `bendahara`, `operator`
- Active/inactive toggle
- Last login tracking
- Add new admin via dialog modal

### 5. Laporan (Report Table)
- **Kekurangan Bayar** column: dynamically calculated as `nominal_tagihan - total_dibayar`
- Expandable **Riwayat Pembayaran** accordion per row
- Summary cards at top: Total tagihan, terbayar, kekurangan, % pembayaran
- Filterable by kelas, periode, jenis tagihan, status

---

## 🧑‍💻 Backend Guide (For Laravel Dev)

### Mock Data → Real Implementation

Each controller currently returns hardcoded arrays. Replace them with:

#### DashboardController
```php
// Replace mock stats with:
$stats = [
    'total_tunggakan' => Invoice::where('status', '!=', 'lunas')
        ->selectRaw('SUM(nominal_adjusted - COALESCE(total_paid, 0)) as total')
        ->first()->total ?? 0,
    'total_terbayar_bulan_ini' => Payment::whereMonth('created_at', now()->month)
        ->sum('amount'),
    // ...
];
```

#### TagihanController — Critical Logic

**Dynamic Nominal & QRIS Regeneration Flow:**

```php
public function update(Request $request, Invoice $tagihan)
{
    $validated = $request->validate([
        'nominal_disesuaikan' => 'required|numeric|min:0',
        'alasan_perubahan' => 'required|string|max:255',
    ]);

    DB::transaction(function () use ($tagihan, $validated) {
        // 1. Log revision
        InvoiceRevision::create([
            'invoice_id' => $tagihan->id,
            'old_amount' => $tagihan->nominal_adjusted,
            'new_amount' => $validated['nominal_disesuaikan'],
            'reason' => $validated['alasan_perubahan'],
            'changed_by' => auth()->id(),
        ]);

        // 2. Update invoice
        $tagihan->update([
            'nominal_adjusted' => $validated['nominal_disesuaikan'],
            'status' => 'menunggak', // Reset if paid amount < new nominal
        ]);

        // 3. Expire old QRIS
        $tagihan->qrisTransactions()
            ->whereNull('expired_at')
            ->update(['expired_at' => now()]);

        // 4. Dispatch QRIS regeneration
        GenerateQrisJob::dispatch($tagihan);
    });

    return back()->with('flash', [
        'type' => 'success',
        'message' => 'Nominal diperbarui & QRIS diregenerasi'
    ]);
}
```

#### ReportController — Kekurangan Bayar

```php
public function index()
{
    $reports = Invoice::with(['siswa', 'payments'])
        ->select('*')
        ->selectRaw('(nominal_adjusted - COALESCE((SELECT SUM(amount) FROM payments WHERE payments.invoice_id = invoices.id), 0)) as kekurangan_bayar')
        ->get();

    return Inertia::render('Report/Index', [
        'reports' => InvoiceResource::collection($reports),
        'summary' => [
            'total_tagihan_keseluruhan' => Invoice::sum('nominal_adjusted'),
            'total_terbayar' => Payment::sum('amount'),
            'total_kekurangan' => Invoice::sum(DB::raw('nominal_adjusted - COALESCE(total_paid, 0)')),
            'persentase_pembayaran' => round((Payment::sum('amount') / Invoice::sum('nominal_adjusted')) * 100, 1),
        ],
    ]);
}
```

### Webhook Security (CRITICAL)

```php
Route::post('/webhook/midtrans', [WebhookController::class, 'midtrans'])
    ->withoutMiddleware([VerifyCsrfToken::class]);

public function midtrans(Request $request)
{
    // 1. Verify signature
    $signature = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . config('midtrans.server_key'));
    if ($signature !== $request->signature_key) {
        abort(403);
    }

    // 2. Idempotency check
    $exists = Payment::where('gateway_ref', $request->transaction_id)->exists();
    if ($exists) return response('OK', 200);

    // 3. Process payment
    DB::transaction(function () use ($request) {
        $invoice = Invoice::where('gateway_order_id', $request->order_id)->first();

        Payment::create([
            'invoice_id' => $invoice->id,
            'amount' => $request->gross_amount,
            'gateway_ref' => $request->transaction_id,
            'metode' => 'QRIS',
            'status' => $request->transaction_status,
        ]);

        // 4. Update invoice status if fully paid
        $totalPaid = $invoice->payments()->sum('amount');
        if ($totalPaid >= $invoice->nominal_adjusted) {
            $invoice->update(['status' => 'lunas', 'dibayar_pada' => now()]);
        } else {
            $invoice->update(['status' => 'belum_lunas']);
        }

        // 5. Notify
        SendPaymentNotificationJob::dispatch($invoice);
    });

    return response('OK', 200); // Must return 200 fast
}
```

---

## 🎨 Frontend Guide (For React Dev)

### Inertia Data Flow

```typescript
// Backend sends props via Inertia
return Inertia::render('Dashboard/Index', ['stats' => $stats]);

// Frontend receives via usePage()
const { stats } = usePage().props as { stats: StatsType };
```

### shadcn/ui Customization

All components live in `resources/js/Components/ui/`. You own the code — modify freely.

**Mist Theme Colors:**
- Primary: `#64748b` (slate-500)
- Background: `#f8f9fa`
- Destructive: `#ef4444` (for kekurangan/tunggak)
- Muted: `#f1f5f9`

### Formatting Rupiah

```typescript
function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n);
}
// Output: Rp 1.500.000
```

### Form Handling with Inertia

```typescript
const { data, setData, post, processing } = useForm({
  siswa_nama: '',
  nominal: '',
});

// Submit
post(route('tagihan.store'), {
  onSuccess: () => toast.success('Tagihan berhasil dibuat'),
});
```

---

## 💳 QRIS Integration

### Supported Gateways

| Gateway | Laravel Package | QRIS Method | Notes |
|---------|----------------|-------------|-------|
| **Midtrans** | `midtrans/midtrans-php` | Snap API / Core API | Most popular, good docs |
| **Xendit** | `xendit/xendit-php` | `QRCode::create()` | Fast onboarding |
| **Duitku** | Community packages | Direct QRIS endpoint | Indonesian focus |
| **Flip** | HTTP Client only | REST API | No official PHP SDK |

### Recommended: Midtrans Implementation

```php
// config/midtrans.php
return [
    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized' => true,
    'is_3ds' => true,
];

// .env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

```php
// In GenerateQrisJob.php
$midtrans = new Midtrans\Config();
$midtrans->serverKey = config('midtrans.server_key');
$midtrans->isProduction = config('midtrans.is_production');

$params = [
    'transaction_details' => [
        'order_id' => 'INV-' . $invoice->id . '-' . time(),
        'gross_amount' => $invoice->nominal_adjusted,
    ],
    'customer_details' => [
        'first_name' => $invoice->siswa->nama,
    ],
    'payment_type' => 'gopay', // or 'qris' depending on method
];

$response = Midtrans\CoreApi::charge($params);
// Store $response['qr_string'] in qris_transactions table
```

### QRIS Lifecycle Rules

1. **Create**: Generate QRIS with unique `order_id` + `gross_amount`
2. **Display**: Show QRIS string/image to user with expiry timer (usually 24h)
3. **Regenerate**: When nominal changes → mark old QRIS `expired` → create new
4. **Webhook**: Gateway POSTs to `/webhook/midtrans` on payment success
5. **Idempotency**: Ignore duplicate `transaction_id` to prevent double counting

---

## 🗄 Database Schema

### Core Tables

```sql
-- students (siswa)
CREATE TABLE students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nis VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    no_hp VARCHAR(20),
    alamat TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- tuition_types (jenis_tagihan)
CREATE TABLE tuition_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nominal_default DECIMAL(15,2) NOT NULL,
    periode ENUM('bulanan','semester','tahunan') NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- invoices (tagihan) — THE CORE TABLE
CREATE TABLE invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    tuition_type_id BIGINT UNSIGNED NOT NULL,
    periode VARCHAR(50) NOT NULL,
    nominal_original DECIMAL(15,2) NOT NULL,      -- nominal awal
    nominal_adjusted DECIMAL(15,2) NOT NULL,      -- nominal aktif (bisa berubah)
    status ENUM('lunas','belum_lunas','menunggak','dibatalkan') DEFAULT 'menunggak',
    qris_reference_id VARCHAR(100),               -- ref to latest active QRIS
    dibayar_pada TIMESTAMP NULL,
    notes TEXT,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (tuition_type_id) REFERENCES tuition_types(id)
);

-- invoice_revisions — AUDIT TRAIL (critical for dynamic amounts)
CREATE TABLE invoice_revisions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    old_amount DECIMAL(15,2) NOT NULL,
    new_amount DECIMAL(15,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    changed_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- qris_transactions — QRIS LIFECYCLE
CREATE TABLE qris_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    qris_string TEXT NOT NULL,
    gateway_order_id VARCHAR(100) NOT NULL,
    gateway_ref VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    paid_at TIMESTAMP NULL,
    status ENUM('active','expired','paid','cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- payments — ACTUAL PAYMENT RECORDS
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    gateway_ref VARCHAR(100) NOT NULL,
    metode VARCHAR(50) DEFAULT 'QRIS',
    status VARCHAR(50) DEFAULT 'success',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- users (admin/teachers)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('kepala_sekolah','bendahara','operator') DEFAULT 'operator',
    no_hp VARCHAR(20),
    active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes for Performance

```sql
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_gateway_ref ON payments(gateway_ref);
CREATE INDEX idx_qris_invoice ON qris_transactions(invoice_id);
CREATE INDEX idx_revisions_invoice ON invoice_revisions(invoice_id);
```

---

## 🚀 Deployment

### Server Requirements (Indonesia VPS/Cloud)

| Spec | Minimum | Recommended |
|------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB SSD | 80 GB SSD |
| PHP | 8.3 FPM | 8.3 FPM + OPcache |
| Web Server | Nginx | Nginx |
| Queue | Supervisor | Supervisor + Horizon |

### Environment Checklist

```bash
# Production .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://pay.sekolahmu.sch.id

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1

# Queue (Redis required for Horizon)
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1

# QRIS Gateway (use production keys!)
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxx
MIDTRANS_IS_PRODUCTION=true

# SSL (required for QRIS webhooks!)
# Let's Encrypt or Cloudflare Origin Cert
```

### Deployment Steps

```bash
# 1. Pull code
git pull origin main

# 2. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci && npm run build

# 3. Run migrations
php artisan migrate --force

# 4. Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 5. Restart queue workers
php artisan horizon:terminate

# 6. Restart PHP-FPM
sudo systemctl restart php8.3-fpm
```

### Queue Worker (Supervisor)

```ini
; /etc/supervisor/conf.d/sekolahpay-worker.conf
[program:sekolahpay-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/sekolahpay/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/sekolahpay/storage/logs/worker.log
```

---

## 🤝 Team Workflow

### Git Branching Strategy

```
main        → Production ready
├── develop → Integration branch
│   ├── feature/dashboard-charts
│   ├── feature/qris-webhook
│   └── feature/report-export
```

### Responsibility Split

| Task | Frontend (You) | Backend (Friend) |
|------|---------------|------------------|
| UI/UX Design | ✅ shadcn/ui components | ❌ |
| React Components | ✅ Pages & forms | ❌ |
| API Contract | ❌ Review Inertia props | ✅ Define controllers |
| Database Schema | ❌ Review for UI needs | ✅ Design & migrate |
| QRIS Integration | ❌ Display QRIS modal | ✅ Gateway API calls |
| Validation | ✅ Client-side (Zod) | ✅ Server-side (FormRequest) |
| Webhooks | ❌ Show payment status | ✅ Receive & process |
| PDF Reports | ✅ Preview component | ✅ Generate (DomPDF) |
| Export Excel | ✅ Button & loading | ✅ `maatwebsite/excel` |

### Communication Protocol

1. **Frontend needs data?** → Check controller mock data → Ask backend to replace with real query
2. **Backend changes schema?** → Update TypeScript interfaces in `resources/js/types/index.ts`
3. **New feature?** → Create feature branch → Frontend builds UI with mock → Backend wires real data
4. **Bug found?** → Check if Inertia props match expected types → Tag relevant dev

---

## 📚 Additional Resources

- [Laravel 11 Docs](https://laravel.com/docs/11.x)
- [Inertia.js Docs](https://inertiajs.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [Midtrans Docs](https://docs.midtrans.com/)
- [Xendit QRIS](https://developers.xendit.co/api-reference/#qris)
- [QRIS Specification](https://www.bi.go.id/id/payment-system/standar-bi/qr-code.aspx)

---

## 📝 License

Private — For internal school use only.

---

> **Built with ❤️ by a 2-person tag team.**  
> *"Frontend handles the pixels, Backend handles the pesos."*
