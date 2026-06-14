import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import type { Invoice } from '@/types/server/api';
import { ReportRow } from './ReportRow';
import type { SortField } from './types';

interface ReportTableProps {
  invoices: Invoice[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  startNumber: number;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  formatRupiah: (n: number) => string;
}

export function ReportTable({
  invoices,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  startNumber,
  sortField,
  sortDirection,
  onSort,
  formatRupiah
}: ReportTableProps) {
  // Helper to show active sort indicator
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return <span className="text-xs ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <CardContent className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('student.name')} className="flex items-center gap-1 -ml-3">
                Siswa
                <ArrowUpDown className="h-3 w-3" />
                {getSortIndicator('student.name')}
              </Button>
            </TableHead>
            <TableHead>Jenis Tagihan</TableHead>
            <TableHead>Tahun Ajaran</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onSort('amount')} className="flex items-center gap-1 ml-auto">
                Nominal
                <ArrowUpDown className="h-3 w-3" />
                {getSortIndicator('amount')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onSort('paid_amount')} className="flex items-center gap-1 ml-auto">
                Dibayar
                <ArrowUpDown className="h-3 w-3" />
                {getSortIndicator('paid_amount')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onSort('remaining_amount')} className="flex items-center gap-1 ml-auto">
                Kekurangan
                <ArrowUpDown className="h-3 w-3" />
                {getSortIndicator('remaining_amount')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('status')} className="flex items-center gap-1 -ml-3">
                Status
                <ArrowUpDown className="h-3 w-3" />
                {getSortIndicator('status')}
              </Button>
            </TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice: Invoice, index: number) => (
            <ReportRow
              key={invoice.id}
              invoice={invoice}
              index={index}
              startNumber={startNumber}
              formatRupiah={formatRupiah}
            />
          ))}
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                Tidak ada data yang cocok dengan filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <CardFooter>
        <div className="text-sm text-muted-foreground">
            Total: {totalItems} data
          </div>
      </CardFooter>
    </CardContent>
  );
}