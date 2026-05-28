import { AppSidebar } from './AppSidebar';
import { Toaster } from './ui/sonner';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background">
            <AppSidebar />
            <main className="flex-1 p-6 overflow-auto">
                {children}
                <Toaster position="top-right" />
            </main>
        </div>
    );
}
