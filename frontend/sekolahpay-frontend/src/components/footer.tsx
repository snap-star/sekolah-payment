import { version } from '../../package.json';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm py-4 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">SekolahPay</span>
            <span className="h-4 w-px bg-border" />
            <span>v{version}</span>
          </div>
          <p className="text-center sm:text-right">
            © {currentYear} SekolahPay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}