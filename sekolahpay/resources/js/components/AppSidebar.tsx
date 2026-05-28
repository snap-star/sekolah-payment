import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { LayoutDashboard, Receipt, Users, FileText, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: 'dashboard' },
    { label: 'Manajemen Tagihan', icon: Receipt, route: 'tagihan.index' },
    { label: 'User Admin', icon: Users, route: 'user-admin.index' },
    { label: 'Laporan', icon: FileText, route: 'report.index' },
    { label: 'Log Out', icon: LogOut, route: 'logout' },
];

export function AppSidebar() {
    const { url } = usePage();

    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border">
                <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">SEKOLAH<span className="text-sidebar-primary">PAY</span></h1>
                <p className="text-xs text-muted-foreground mt-1">Selamat datang di Sistem Pembayaran SekolahPay</p>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-auto">
                {menuItems.map((item) => {
                    const isActive = route().current(item.route);
                    return (
                        <Link
                        key={item.route}
                        href={route(item.route)}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors',
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

            <div className="p-3 border-t border-sidebar-border">
                <Link
                href={route('logout')}
                method='POST'
                as="button"
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Keluar
                </Link>
            </div>
        </aside>
    );
}
