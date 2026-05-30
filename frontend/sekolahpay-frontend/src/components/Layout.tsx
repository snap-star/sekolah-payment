import { AppSidebar } from './AppSidebar';
import { Toaster } from '../components/ui/sonner';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-background w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-40 backdrop-blur-sm supports-backdrop-blur:bg-background/90">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 max-w-[85vw]">
              <AppSidebar />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-base font-bold truncate">
            SEKOLAH<span className="text-primary">PAY</span>
          </h1>
          
          <ThemeToggle />
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:px-8">
          <div className="hidden lg:flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div>
            <Outlet />
          </div>
          <Toaster 
            position="top-right" 
            className="mobile:!bottom-6 mobile:!top-auto mobile:!right-4 mobile:!left-4 mobile:!w-auto"
          />
        </main>
      </div>
    </div>
  );
}