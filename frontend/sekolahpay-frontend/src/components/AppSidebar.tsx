import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, FileText, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Manajemen Tagihan', icon: Receipt, path: '/tagihan' },
  { label: 'User Admin', icon: Users, path: '/user-admin' },
  { label: 'Laporan', icon: FileText, path: '/report' },
];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed top-0 left-0 h-screen z-30 lg:z-20 gemini-surface border-0 rounded-none">
      <div className="p-6 flex-col border-b border-sidebar-border">
        <h2 className="text-lg font-bold">
          SEKOLAH<span className="text-sidebar-primary">PAY</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-2">Sistem Pembayaran Sekolah</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                'gemini-nav-item',
                isActive && 'active'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <button
          onClick={logout}
          className="gemini-nav-item w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}