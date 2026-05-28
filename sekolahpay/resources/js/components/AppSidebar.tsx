import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { LayoutDashboard, Receipt, Users, FileText, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', href: '/dashboard' },
    { label: 'Manajemen Tagihan', icon: Receipt, path: '/tagihan', href: '/tagihan' },
    { label: 'User Admin', icon: Users, path: '/user-admin', href: '/user-admin' },
    { label: 'Laporan', icon: FileText, path: '/report', href: '/report' },
];

export function AppSidebar() {
    const { url } = usePage();

    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">SEKOLAH<span className="text-sidebar-primary">PAY</span></h1>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Selamat datang di Sistem Pembayaran SekolahPay</p>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-auto">
                {menuItems.map((item) => {
                    const isActive = url.startsWith(item.path);
                    return (
                        <Link
                        key={item.label}
                        href={item.href}
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

            <div className="flex p-3 border-t border-sidebar-border justify-between items-center">
                <Link
                href="/logout"
                method='POST'
                as="button"
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Keluar
                </Link>
                <ThemeToggle />
            </div>
        </aside>
    );
}
