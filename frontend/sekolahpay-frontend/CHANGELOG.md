# Changelog - SekolahPay School Management System

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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