import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  setCurrentPage,
  resetFilters
}: SearchFilterBarProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-4 gap-3">
        <Label className="mb-3">
          Cari Tagihan
        </Label>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIS siswa..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">Status:</Label>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="overdue">Menunggak</SelectItem>
                <SelectItem value="unpaid">Belum Lunas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}