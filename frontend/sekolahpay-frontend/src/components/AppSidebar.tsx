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
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed top-0 left-0 h-screen z-30 lg:z-20">
      <div className="p-4 flex-col border-b border-sidebar-border">
        <h2 className="text-sm">
          SEKOLAH<span className="text-sidebar-primary">PAY</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Sistem Pembayaran Sekolah</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}