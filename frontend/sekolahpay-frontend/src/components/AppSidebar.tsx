import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, FileText, LogOut, ScrollText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Siswa', icon: Users, path: '/siswa' },
  { label: 'Orang Tua', icon: Users, path: '/orang-tua' },
  { label: 'Manajemen Tagihan', icon: Receipt, path: '/tagihan' },
  { label: 'Set Tagihan', icon: ScrollText, path: '/set-tagihan' },
  { label: 'User Admin', icon: Users, path: '/user-admin' },
  { label: 'Laporan', icon: FileText, path: '/report' },
];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <aside className="w-64 font-noto font-semibold bg-sidebar border-r border-sidebar-border flex flex-col fixed top-0 left-0 h-screen z-30 lg:z-20 gemini-surface border-0 rounded-none">
      <div className="p-6 flex-col border-b border-sidebar-border">
        <h2 className="gemini-page-title">
          SEKOLAH<span className="text-primary">PAY</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-2">Sistem Pembayaran Sekolah</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-auto">
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
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full rounded-lg justify-start hover:bg-destructive/30 border-0"
        >
          <LogOut className="w-5 h-5" />
          {logout.isPending ? 'Keluar...' : 'Keluar'}
        </Button>
      </div>
    </aside>
  );
}