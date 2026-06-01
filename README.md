# SekolahPay - School Payment Management System

A full-stack school payment management system with a Laravel backend API and a modern React frontend featuring Google Gemini-inspired UI design.

## 📋 Project Overview

SekolahPay is a comprehensive platform for managing school payments, student invoices, and financial reporting. Built with modern technologies, it provides a seamless experience for school administrators to track payments, manage students, and generate financial reports.

## 🏗️ Project Structure

```txt
next plus laravel/
├── backend/
│   └── sekolahpay_server/          # Laravel Backend API
├── frontend/
│   └── sekolahpay-frontend/        # React TypeScript Frontend
└── README.md
```

## 🚀 Tech Stack

### Backend (Laravel)

- **Laravel 12** - PHP web framework
- **PHP 8.2+** - Modern PHP runtime
- **MySQL/PostgreSQL** - Database support
- **JWT Authentication** - Secure API authentication
- **Sanctum** - Laravel's API authentication system
- **Composer** - PHP package manager

### Frontend (React)

- **React 19** with TypeScript
- **Vite** - Fast development and build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Accessible, unstyled UI components
- **React Router 7** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **tRPC** - End-to-end type-safe APIs
- **Zod** - Schema validation
- **Axios** - HTTP client
- **pnpm** - Fast, disk-efficient package manager

## ✨ Key Features

### Backend Features

- RESTful API architecture
- Role-based access control (kepala_sekolah, bendahara, operator)
- JWT token authentication
- Student and classroom management
- Invoice and payment tracking
- Comprehensive database schema with migrations
- Seeders for initial data setup
- Activity logging system

### Frontend Features

- **Premium Gemini-Inspired UI**: Modern flat/material design
- **Dashboard Analytics**: Real-time statistics and payment tracking
- **Payment Management**: Handle invoices, generate QRIS payments
- **User Administration**: Manage admin users with role permissions
- **Financial Reporting**: Generate comprehensive payment reports
- **Dark/Light Mode**: Full theme support with smooth transitions
- **Responsive Design**: Works across all device sizes
- **Type-Safe APIs**: tRPC + Zod for end-to-end type safety
- **Professional Dashboard**: Clean, intuitive admin interface

## 🛠️ Installation & Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- pnpm
- MySQL/PostgreSQL

### 1. Backend Setup

```bash
cd backend/sekolahpay_server

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# Edit these lines:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=sekolahpay
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seeders
php artisan migrate --seed

# Start development server
php artisan serve
# Server runs at http://localhost:8000
```

### 2. Frontend Setup

```bash
cd frontend/sekolahpay-frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Configure API URL
# Edit .env:
# VITE_API_URL=http://localhost:8000/api

# Start development server
pnpm dev
# Server runs at http://localhost:5173
```

## 📦 Available Scripts

### Backend Scripts

```bash
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Create database tables and seed initial data
php artisan migrate --seed
```

### Frontend Scripts

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

## 🔐 API Routes

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Protected Routes (require authentication)

- `/api/invoices` - Manage payment invoices
- `/api/reports` - Generate financial reports
- `/api/users` - Admin user management
- `/api/students` - Student management
- `/api/payments` - Payment processing

## 👥 User Roles

The system supports three user roles:

- **kepala_sekolah** (Principal) - Full system access
- **bendahara** (Treasurer) - Financial management access
- **operator** (Operator) - Basic data entry access

## 📊 Database Schema

Core database tables:

- `users` - Admin users
- `students` - Student records
- `classrooms` - School classes
- `invoices` - Payment invoices
- `payments` - Payment transactions
- `fee_types` - Types of fees
- `school_years` - Academic years
- `activity_logs` - System activity tracking

## 🎨 Frontend Design

The frontend features a modern Google Gemini-inspired design system with:

- Flat, material design aesthetics
- Smooth animations and transitions
- Teal/blue color palette
- Full dark/light mode support
- Responsive grid layout
- Accessible components following WCAG guidelines
- Type-safe API layer with comprehensive error handling

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend/sekolahpay-frontend
pnpm build

# Deploy Laravel backend to your server
# Configure web server (Nginx/Apache) to point to backend/public
# Serve frontend build files from your web server
```

## 📝 License

Currently no license append
