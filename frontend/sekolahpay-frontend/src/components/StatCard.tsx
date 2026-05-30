import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, className }: StatCardProps) {
  return (
    <Card className={cn('gemini-stat-card', className)}>
      <CardHeader className="pb-3 px-0 pt-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
        {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}