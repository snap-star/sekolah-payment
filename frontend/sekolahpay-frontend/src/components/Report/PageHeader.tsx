import { Download, Printer, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RangePicker } from '../ui/range-picker';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface PageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function PageHeader({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: PageHeaderProps) {
  return (
    <CardHeader className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CardTitle className="">Detail Laporan per Siswa</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="default">
            <Printer className="mr-2 inline-block h-5 w-5 text-primary-foreground dark:text-primary-foreground" />
            Cetak
          </Button>
          <Button variant="default">
            <Download className="mr-2 inline-block h-5 w-5 text-primary-foreground dark:text-primary-foreground" />
            Download Laporan
          </Button>
          <div className="flex items-center gap-2">
            <RangePicker />
          </div>
        </div>
      </div>
      
      {/* Filter and Search Section */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari siswa, NIS, atau tagihan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="unpaid">Belum Lunas</SelectItem>
              <SelectItem value="overdue">Menunggak</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>
  );
}