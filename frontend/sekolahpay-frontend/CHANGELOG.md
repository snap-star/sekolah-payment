# Changelog - SekolahPay School Management System

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.3](https://github.com/snap-star/sekolah-payment/compare/v1.2.2...v1.2.3) (2026-06-14)

### 🔨 Code Refactoring

* splitting 1 job 1 component for report, setJenistagihan, UserAdmin, pages. ([7130c07](https://github.com/snap-star/sekolah-payment/commit/7130c075ce4bcbe16a95f4eb41d5a5c46b18d2af))

## [1.2.2](https://github.com/snap-star/sekolah-payment/compare/v1.2.1...v1.2.2) (2026-06-14)

### 🐛 Bug Fixes

* uncaught error dialog trigger ([f25a5be](https://github.com/snap-star/sekolah-payment/commit/f25a5be45ad3b0428b014b7cd4b885486f34e5c4))

## [1.2.1](https://github.com/snap-star/sekolah-payment/compare/v1.2.0...v1.2.1) (2026-06-14)

### 🧹 Maintenance

* refactor tagihan ([8f3259c](https://github.com/snap-star/sekolah-payment/commit/8f3259c83d3059fa9fff3997cf359b7ac70eaba0))

## [1.2.0](https://github.com/snap-star/sekolah-payment/compare/v1.1.0...v1.2.0) (2026-06-13)

### ✨ New Features

* add date-fns-tz dependency and implement date picker components ([2ce1078](https://github.com/snap-star/sekolah-payment/commit/2ce10783fb24d4f65dd490094223059f3cd4fff4))

## [1.1.0](https://github.com/snap-star/sekolah-payment/compare/v1.0.4...v1.1.0) (2026-06-12)

### ✨ New Features

* initial use API for tagihan ([3365cb5](https://github.com/snap-star/sekolah-payment/commit/3365cb58b34a71ead7667e4e0bb640f1d5ced897))
* Refactor Dashboard and Report pages to use real API hooks and improve data handling ([0ed82f7](https://github.com/snap-star/sekolah-payment/commit/0ed82f7780374b4f1c589e84aaddf87b603f668d))

### 📝 Documentation

* update api reports - implementation and TODOS ([5c1d7a8](https://github.com/snap-star/sekolah-payment/commit/5c1d7a85b27a0b1bcfb4ec3bb464420d4d50b76e))

### 🔄 CI/CD

* pnpm lint ([fb245c2](https://github.com/snap-star/sekolah-payment/commit/fb245c20199f8c20ae1415d4d76b56c9e7ed0948))

## [1.0.4](https://github.com/snap-star/sekolah-payment/compare/v1.0.3...v1.0.4) (2026-06-11)

### 🧹 Maintenance

* disable log console for api update create wali dan siswa ([3472829](https://github.com/snap-star/sekolah-payment/commit/3472829a2b092b40fc1d4b72afece9550ea303fa))

## [1.0.3](https://github.com/snap-star/sekolah-payment/compare/v1.0.2...v1.0.3) (2026-06-10)

### 🧹 Maintenance

* fix add orang tua wali, fix forms type and aria ([6307067](https://github.com/snap-star/sekolah-payment/commit/6307067f851f16425c85520711f973812f55de78))
* pnpm lint ([11d4c20](https://github.com/snap-star/sekolah-payment/commit/11d4c20eda57453bad2ecd8933528ab2accd620d))

## [1.0.2](https://github.com/snap-star/sekolah-payment/compare/v1.0.1...v1.0.2) (2026-06-10)

### 🧹 Maintenance

* **deps:** bump the minor-patch-dependencies group ([f656fa3](https://github.com/snap-star/sekolah-payment/commit/f656fa3fc728f79a480d8fbab33ceb11d4f7cccb))

## [1.0.1](https://github.com/snap-star/sekolah-payment/compare/v1.0.0...v1.0.1) (2026-06-09)

### 🎨 Styling

* add some loading animation to all pages ([df15507](https://github.com/snap-star/sekolah-payment/commit/df15507a5cd363e56d487d416299d3fca904d327))

### 🧹 Maintenance

* eslint config ([b1e9679](https://github.com/snap-star/sekolah-payment/commit/b1e9679dbdf624fba3bbc309b5e55e4e94c3d0b7))
* updating api Siswa and OrangTua ([48d8a9a](https://github.com/snap-star/sekolah-payment/commit/48d8a9a3c46ccb01056d5d3ba5f79c85f3e251c1))

## 1.0.0 (2026-06-08)

### ✨ New Features

* added new pages: setTagihan, Orang Tua Wali, (test)consume api on tagihan, (test)Siswa, (test) OrangTua ([78dfff4](https://github.com/snap-star/sekolah-payment/commit/78dfff488c67fe04a382d7ea8dab43cf99653f65))
* new page register (not live) ([de8f5cd](https://github.com/snap-star/sekolah-payment/commit/de8f5cdae34193191f68117f7bcc2ba4d4655fb8))
* proper github action ([d744545](https://github.com/snap-star/sekolah-payment/commit/d744545e3ddc211dcc4c62313782f66f7325413e))
* semver versioning control ([fa27bc1](https://github.com/snap-star/sekolah-payment/commit/fa27bc10d42b5459204d183b29a4e77d00654599))
* semver versioning control ([76968c6](https://github.com/snap-star/sekolah-payment/commit/76968c6fa4044b8d8d18e2720812d72ddf8c49dc))

### 🔨 Code Refactoring

* remove unused code, disable mock data ([2f42cc6](https://github.com/snap-star/sekolah-payment/commit/2f42cc6c14c57a7111bd80eb10651b70e8cc4ef3))
* remove unused console ([19e975d](https://github.com/snap-star/sekolah-payment/commit/19e975db08ff7623e1209876ba85eeac19135154))

### 🧪 Tests

* codeQL ([fdf7b03](https://github.com/snap-star/sekolah-payment/commit/fdf7b036c46bb45943749c80a22a2515da41c588))

### 🔄 CI/CD

* fix Potential file system race condition ([5255363](https://github.com/snap-star/sekolah-payment/commit/525536335408f8dddea0699fdeceef39db661529))
* fix semver version ([d074085](https://github.com/snap-star/sekolah-payment/commit/d074085add1ffa29fa1ea5938ff4b523e366ce13))
* semver release ([75b744c](https://github.com/snap-star/sekolah-payment/commit/75b744cf70b8d9a8d17d11fa05219400529ae722))

### 🧹 Maintenance

* add skills-lock.json ([bf3d6a6](https://github.com/snap-star/sekolah-payment/commit/bf3d6a66fa54e099d9ffb6243d0d2042a60404cb))
* Change repository owner in release workflow ([e435a10](https://github.com/snap-star/sekolah-payment/commit/e435a100d2975af324002f08ecc4ba7047dba9a2))
* comment some mock data ([d52076d](https://github.com/snap-star/sekolah-payment/commit/d52076d640615aa1039b63aef75b49d2bc188b3b))
* **deps:** bump actions/checkout from 4 to 6 ([ef9ebf5](https://github.com/snap-star/sekolah-payment/commit/ef9ebf500fc2b98423d23a2a607ac96bd04b4d74))
* **deps:** bump actions/dependency-review-action from 4 to 5 ([1a2cce1](https://github.com/snap-star/sekolah-payment/commit/1a2cce162d357f8ef8f5fc22ab116e1a8bfad34c))
* **deps:** bump actions/labeler from 5 to 6 ([391d7f5](https://github.com/snap-star/sekolah-payment/commit/391d7f59aaffc8eb6b9a2e57207032cc59d89e60))
* **deps:** bump actions/setup-node from 4 to 6 ([50f143f](https://github.com/snap-star/sekolah-payment/commit/50f143f27733ca9935bf56ed5fd5b89723274d66))
* **deps:** bump github/codeql-action from 3 to 4 ([d64ee03](https://github.com/snap-star/sekolah-payment/commit/d64ee03c75aab8c2f8f9327fa4a11401bbc181c6))
* **deps:** bump the major-dependencies group with 3 updates ([73ef841](https://github.com/snap-star/sekolah-payment/commit/73ef841e052dd00417858959b4f65718f84e4d0c))
* **deps:** bump the minor-patch-dependencies group across 1 directory with 10 updates ([0f3667c](https://github.com/snap-star/sekolah-payment/commit/0f3667cab4a390a50ac6daac22233050cb2d4d99))
* fix github action release ([095eed6](https://github.com/snap-star/sekolah-payment/commit/095eed6f81c053752b1154bd113dac2cf0926f00))
* fix github action releases ([a18ea06](https://github.com/snap-star/sekolah-payment/commit/a18ea06f35552067d100aeedb875970e84109bc3))
* github action (test) ([bb22d64](https://github.com/snap-star/sekolah-payment/commit/bb22d64db344ca039ddbc07b3ce9fb3fe33d16a5))
* tRPC matches to the other definition ([1e88d58](https://github.com/snap-star/sekolah-payment/commit/1e88d586c44a16d632960b99c7e503b4b24ef110))

## [1.1.0] - 2026-06-08 - Invoice & Fee Management Update

### Summary
Comprehensive billing system update with type-safe invoice management, fee type administration, and complete billing workflow implementation.

---

## [1.0.0] - 2026-06-03 - Initial Production Release

### Summary
First production-ready release with complete student management system, authentication, and basic school management infrastructure.

---

## 📦 Backend (Laravel) - `sekolahpay_server`

### 🔄 Updates in v1.1.0 (2026-06-08)

#### 📊 Invoices Database Enhancement
- **Added period column to invoices table** via migration `2026_06_05_111627_add_period_to_invoices_table.php`
- Enhanced invoice tracking with academic period support for multi-year billing
- Maintains backward compatibility with existing invoice data

#### 🏷️ FeeTypeController Full Implementation
- Complete CRUD API for fee types management already operational
- Full resource controller supporting all REST operations
- Already integrated with frontend type-safe hooks

---

## 📦 Backend (Laravel) - `sekolahpay_server` (Previously documented features)

### ✨ New Features

#### 🏗️ Core Database Schema
- **Complete initial database schema** with 13 core tables for school management
- **Users System** with role-based access control (admin, bendahara, guru, student, guardian)
- **School Years Management** for academic period tracking
- **Classrooms Management** with level, major, and name fields
- **Students Management** with comprehensive student data
- **Student Guardians** system to track parent/guardian information
- **Student Classroom Enrollment** for tracking student class assignments per school year
- **Fee Types** for different payment categories with recurring type support
- **Payment Methods** for handling various payment channels
- **Invoices System** for generating student bills
- **Payments Tracking** for recording payment transactions
- **Payment Gateway Transactions** for handling online payments
- **Activity Logs** for auditing all system activities

#### 🔐 Authentication & Authorization
- JWT-based authentication system (`tymon/jwt-auth`)
- Role middleware for route protection
- Login endpoint with email/password validation
- Token refresh mechanism
- Logout functionality
- User account status tracking (active/inactive)
- Last login timestamp tracking

#### 👥 Student Management API
- **Full CRUD API for Students** (RESTful Resource Controller)
  - `GET /api/students` - List all students with pagination (10 items per page)
  - `POST /api/students` - Create new student with validation
  - `GET /api/students/{student}` - Get single student details
  - `PUT/PATCH /api/students/{student}` - Update student information
  - `DELETE /api/students/{student}` - Delete student record
- **Validation Rules**:
  - NIS (Student ID) required, unique, max 50 chars
  - NISN (National Student ID) optional, unique, max 50 chars
  - Name required, max 255 chars
  - Gender restricted to 'L' (Laki-laki) or 'P' (Perempuan)
  - Birth date as optional date field
  - Status restricted to 'active', 'inactive', 'graduated'

#### 🛡️ Route Protection
- Student endpoints protected by auth middleware and role restrictions (admin, bendahara only)
- Admin test endpoint `/api/admin-test` for admin role verification
- Sanctum authentication configured
- CORS setup for frontend integration

#### 📊 API Response Format
- Standardized JSON responses with success status and message
- Paginated responses with metadata (current_page, last_page, per_page, total)
- Resource transformations using Laravel API Resources
- Proper HTTP status codes (200, 201, 401, 403)

#### 🌱 Database Seeders
- `UserSeeder` - Initial admin and user accounts
- `FeeTypeSeeder` - Default fee types setup
- `PaymentMethodSeeder` - Available payment methods
- `SchoolYearSeeder` - Default academic years

### 🔧 Technical Stack
- Laravel 11 Framework
- PHP 8.2+
- MySQL/PostgreSQL database support
- JWT Authentication
- RESTful API architecture
- Soft deletes for all major entities
- Foreign key constraints with cascade delete

---

## 🎨 Frontend (Vite SPA + React + TypeScript + Tailwindcss) - `sekolahpay-frontend`

### 🔄 Updates in v1.1.0 (2026-06-08)

#### 💰 Tagihan (Invoices) Page Overhaul - `src/pages/Tagihan.tsx`
- **Complete rewrite with type-safe implementation** - removed all `any` types for full TypeScript compliance
- **Removed mock data entirely** - now uses real backend APIs: `/students` and `/fee-types`
- **Implemented complete billing workflow**:
  - Create new invoices with auto-populated `nominal_asli` (original amount) from selected fee type
  - `nominal_asli` field is read-only to preserve original fee integrity
  - `nominal_disesuaikan` (adjusted amount) field for school cost relief support
  - Clear labels and explanations for relief functionality
- **Advanced table features**:
  - Search functionality: search by student name, NIS, or NISN
  - Filtering capabilities for efficient invoice management
  - Sortable columns for data organization
  - Numbered pagination with 25 items per page ([prev, 1,2,3,4, next])
- **QRIS payment simulation**: mock QR generator with 7-day expiry (simulates future payment gateway integration)
- **Independent implementation**: no dependencies on OrangTua.tsx or Siswa.tsx pages
- **Full React Query integration**: caching, invalidation, and state management

#### 🏷️ New Fee Type Management Page - `src/pages/SetJenisTagihan.tsx`
- **New control page for managing fee types (jenis tagihan)** - controls default amounts used in Tagihan.tsx
- **Full CRUD operations interface**:
  - Create new fee types with code, name, default amount, recurrence pattern
  - Inline editing of existing fee types
  - Delete with confirmation dialog
  - Activate/deactivate fee types without deletion
- **Real-time synchronization**: changes to fee types automatically reflect in Tagihan.tsx via React Query cache
- **Rupiah formatting**: proper Indonesian currency display for all amounts
- **Recurrence type support**: Sekali Bayar (one-time), Bulanan (monthly), Tahunan (yearly)
- **Shadcn/ui components**: modern dialogs, tables, cards, switches, and form controls

#### 🛡️ Type Safety Improvements
- **API Client restructure**: reorganized feeTypes methods in `src/lib/api.ts` for consistent namespace usage
- **Removed duplicate methods**: eliminated duplicate deleteFeeType from API client
- **Updated TypeScript interfaces**: modified FeeType interface to match backend schema, removed deprecated fields
- **Zero `any` types across all billing pages** - strict TypeScript compliance
- **Fixed import errors**: resolved all unused import warnings and missing namespace issues

#### 📝 API Updates Report
- Generated comprehensive `api-updates-report.md` documenting all backend API mismatches
- Documented missing Invoice controller on backend and client-side workarounds
- Recorded all type mismatches and frontend adaptations

---

## 🎨 Frontend (Vite SPA + React + TypeScript + Tailwindcss) - `sekolahpay-frontend` (Previously documented features)

### ✨ New Features

#### 🔷 Type-Safe API Integration
- **tRPC setup** for end-to-end type safety
- Zod validation schemas matching backend validation rules
- Complete TypeScript types for all backend entities

#### 🔐 Authentication Hooks
- `useLogin()` - Handle user authentication
- `useMe()` - Fetch authenticated user profile
- `useLogout()` - Handle user logout
- `useRefreshToken()` - Refresh JWT token
- `useAdminTest()` - Admin role verification
- `useFinanceTest()` - Finance role verification

#### 👥 Student Management Hooks (NEW - Added 2026-06-03)
- `useStudents()` - Fetch all students with pagination support
- `useStudent(id)` - Fetch single student by ID
- `useCreateStudent()` - Create new student record
- `useUpdateStudent()` - Update existing student information
- `useDeleteStudent()` - Delete student record
- All hooks use React Query for caching and state management

#### 📊 Finance & Reporting Hooks
- `useInvoices()` - Fetch all invoices and billing information
- `useReport()` - Generate payment reports with summary statistics

#### 🔧 API Client
- Axios-based API client with automatic token injection
- tRPC proxy client for type-safe API calls
- 401 unauthorized interceptor with automatic redirect to login
- LocalStorage token persistence
- Base URL configuration via environment variables

#### 📝 Type Definitions
- **Student Types**: Complete TypeScript interfaces matching backend StudentResource
- **Pagination Types**: TypeScript interfaces for paginated responses
- **Auth Types**: User, login, token response types
- **Invoice Types**: Billing and payment tracking types
- **Report Types**: Financial reporting types

### 🎨 Technical Stack
- Next.js 14+ with App Router
- TypeScript with strict type checking
- React Query (TanStack Query) for data fetching
- tRPC for end-to-end type safety
- Zod for runtime validation
- Shadcn/ui component library
- TailwindCSS for styling
- Axios for HTTP requests
- pnpm package manager

---

## 🔗 API Endpoints Summary

### Authentication
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/auth/login` | User login | Public |
| GET | `/auth/me` | Get current user | Authenticated |
| POST | `/auth/refresh` | Refresh token | Authenticated |
| POST | `/auth/logout` | Logout user | Authenticated |

### Students
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/students` | List all students | admin, bendahara |
| POST | `/students` | Create student | admin, bendahara |
| GET | `/students/{id}` | Get student details | admin, bendahara |
| PUT | `/students/{id}` | Update student | admin, bendahara |
| DELETE | `/students/{id}` | Delete student | admin, bendahara |

### Fee Types
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/fee-types` | List all fee types | admin, bendahara |
| POST | `/fee-types` | Create fee type | admin, bendahara |
| GET | `/fee-types/{id}` | Get fee type details | admin, bendahara |
| PUT | `/fee-types/{id}` | Update fee type | admin, bendahara |
| DELETE | `/fee-types/{id}` | Delete fee type | admin, bendahara |

### Admin
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/admin-test` | Admin endpoint test | admin |

---

## 🐛 Bug Fixes
- Fixed admin-test endpoint URL in frontend API client (was incorrectly pointing to `/auth/admin-test` instead of `/admin-test`)
- Added proper nullability for optional fields in student schema
- Fixed pagination metadata types to match backend response format

---

## 🔒 Security Features
- JWT token authentication
- Role-based access control
- CORS configuration
- HTTP-only cookie support
- Input validation on both frontend and backend
- SQL injection protection via Eloquent ORM
- XSS protection headers

---

## 📈 Database Schema Overview

### Core Relationships
- **Users** can be linked to Students or Guardians
- **Students** belong to Classrooms via StudentClassrooms (per school year)
- **Students** have many Guardians (StudentGuardians)
- **Invoices** belong to Students, FeeTypes, and SchoolYears
- **Payments** belong to Invoices and PaymentMethods
- **ActivityLogs** track all changes made by Users

---

---

## 📝 Commit History (Development Timeline)

### 2026-06-08 - Billing System Updates (v1.1.0)
- **billing-complete** SetJenisTagihan.tsx - Created complete fee type management page with full CRUD operations
- **tagihan-overhaul** Tagihan.tsx - Complete rewrite with type-safe implementation, removed all mocks, added filtering/pagination/QRIS
- **nominal-asli-implementation** Added nominal_asli field for original tuition amounts with cost relief support
- **api-client-fixes** src/lib/api.ts - Fixed feeTypes namespace, removed duplicate methods, improved type safety
- **2026_06_05_111627** Backend migration: added period column to invoices table for academic year tracking

### 2026-06-03 - Latest Updates
- **527eb45** Update psalm.yml - Updated PHP static analysis configuration
- **87bf271** Update workflow paths to include sekolahpay_server - Fixed GitHub Actions paths to properly include backend directory
- **6a4e516** Student CRUD - Implemented complete student CRUD operations on backend and frontend synchronization

### 2026-06-02 - CI/CD & Documentation
- **eff6855** Update dependency review workflow to include frontend paths
- **8e64ed6** Add GitHub Actions workflow for PR labeler
- **eea1452** Add labeler configuration for GitHub Actions
- **f2740e1** Init CodeQL for typescript workflow configuration - Added TypeScript security scanning
- **9cac0ba** Init Psalm workflow to include backend paths - Added PHP static analysis workflow
- **a6fb951** chore (docs): project root documentation - Added comprehensive project documentation

### 2026-06-01 - Frontend Polish & Configuration
- **95a995f** chore (config): eslint config react refresh warn - Updated ESLint configuration
- **89f7d33** Merge branch 'master' - Main branch synchronization
- **8b918c6** chore (style): apply some styling - UI/UX improvements
- **24fd9b7** chore (style): index.css font declare optimize layout mobile desktop users some colors change - Responsive design and typography updates
- **51774a4** chore (style): theme provider set default theme to light - Default theme configuration
- **18d5f75** chore (config): eslint change reactrefresh to warn - Further ESLint refinements
- **475c825** feat (deps): tailwind cli - Added TailwindCSS CLI
- **3ba6f2d** chore (fix): shadcn rsc true - Fixed Shadcn/ui React Server Components configuration
- **3260b17** chore (style): fix header title in darkmode card accent colors matching the color tone - Dark mode improvements
- **ce27be4** Merge branch 'master' - Another main branch merge
- **435a78a** add note - Project documentation updates
- **ae687ca** feat (style): layout footer - Added footer component

### 2026-05-31 - Core Infrastructure & Backend
- **57ac19c** feat (deps): initial commit tRPC + define APIs - Set up tRPC for type-safe APIs
- **97650e4** add route test middleware - Implemented route protection and role middleware
- **bf75eff** sukses test api - API testing successful
- **179afd3** JWT SUKSES - JWT authentication implemented successfully
- **57e900c** jwt terpasang - JWT properly integrated
- **913ca49** model done - All database models completed
- **841da58** edit migration final - Final database migration tweaks
- **1e419a7** Bagian 1 - Initial project setup (Part 1)
- **3818c7e** feat (style): fresh looks - Initial frontend styling

---
