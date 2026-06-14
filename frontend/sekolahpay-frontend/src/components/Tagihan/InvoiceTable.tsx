import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Invoice } from '@/types/server/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InvoiceRow } from './InvoiceRow';

interface InvoiceTableProps {
  invoices: Invoice[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  paginationMeta: { total: number; lastPage: number };
  pageNumbers: number[];
  editingId: number | null;
  editDueDate: string;
  setEditDueDate: (date: string) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  handleUpdateDueDate: (invoice: Invoice) => void;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  getStatusBadge: (status: string) => { variant: 'default' | 'destructive' | 'secondary'; label: string };
  formatRupiah: (n: number) => string;
}

export function InvoiceTable({
  invoices,
  currentPage,
  setCurrentPage,
  paginationMeta,
  pageNumbers,
  editingId,
  editDueDate,
  setEditDueDate,
  onEdit,
  onDelete,
  handleUpdateDueDate,
  isUpdatePending,
  isDeletePending,
  getStatusBadge,
  formatRupiah
}: InvoiceTableProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Daftar Tagihan Aktif ({paginationMeta.total} total)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="text-sm text-bold">
              <TableRow>
                <TableHead>Nomor Invoice</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Sisa Bayar</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice: Invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  editingId={editingId}
                  editDueDate={editDueDate}
                  setEditDueDate={setEditDueDate}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  handleUpdateDueDate={handleUpdateDueDate}
                  isUpdatePending={isUpdatePending}
                  isDeletePending={isDeletePending}
                  getStatusBadge={getStatusBadge}
                  formatRupiah={formatRupiah}
                />
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Tidak ada data tagihan yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paginationMeta.lastPage > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-9"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, paginationMeta.lastPage))}
              disabled={currentPage === paginationMeta.lastPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}