import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

import { RefreshCcw } from 'lucide-react';

// Lazy load all page components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TagihanPage = lazy(() => import('./pages/Tagihan'));
const SetTagihanPage = lazy(() => import('./pages/SetJenisTagihan'));
const UserAdminPage = lazy(() => import('./pages/UserAdmin'));
const ReportPage = lazy(() => import('./pages/Report'));
const SiswaPage = lazy(() => import('./pages/Siswa'));
const OrangTuaPage = lazy(() => import('./pages/OrangTua'));

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasToken = !!localStorage.getItem('sekolahpay_token');
  
  if (isLoading) return <div className="p-8 select-none">
    <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
    Memuat...
    </div>;
  
  // If no token and not authenticated, redirect to login only once
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }
  
  // If we have a token but still not authenticated, let the useAuth hook handle it
  if (!isAuthenticated && hasToken && isLoading === false) {
    localStorage.removeItem('sekolahpay_token');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" themes={['light', 'dark']}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="/tagihan" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <TagihanPage />
                </Suspense>
              } />
              <Route path="/set-tagihan" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <SetTagihanPage />
                </Suspense>
              } />
              <Route path="/siswa" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <SiswaPage />
                </Suspense>
              } />
              <Route path="/orang-tua" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <OrangTuaPage />
                </Suspense>
              }/>
              <Route path="/user-admin" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <UserAdminPage />
                </Suspense>
              } />
              <Route path="/report" element={
                <Suspense fallback={<div className="p-8 select-none">
                  <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
                  Memuat...
                </div>}>
                  <ReportPage />
                </Suspense>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;