import { AppSidebar } from './AppSidebar';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
        <Toaster position="top-right" />
      </main>
    </div>
  );
}