import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Invoice } from '@/types/server/api';
import { Trash2 } from 'lucide-react';

interface InvoiceRowProps {
  invoice: Invoice;
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

export function InvoiceRow({
  invoice,
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
}: InvoiceRowProps) {
  const status = getStatusBadge(invoice.status);
  
  return (
    <TableRow key={invoice.id}>
      <TableCell>
        <div className="font-medium">{invoice.invoice_number}</div>
        <div className="text-xs text-muted-foreground">{new Date(invoice.created_at).toLocaleDateString('id-ID')}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{invoice.student?.name || '-'}</div>
        <div className="text-xs text-muted-foreground">{invoice.student?.nis || '-'}</div>
      </TableCell>
      <TableCell>{invoice.fee_type?.name || '-'}</TableCell>
      <TableCell>{invoice.school_year?.name || '-'}</TableCell>
      <TableCell className="text-muted-foreground line-through text-xs">{formatRupiah(invoice.amount)}</TableCell>
      <TableCell className="font-medium">
        {editingId === invoice.id ? (
          <div className="flex gap-2">
            <Input 
              type="date" 
              className="w-32 h-8" 
              value={editDueDate} 
              onChange={(e) => setEditDueDate(e.target.value)} 
              autoFocus 
            />
            <Button 
              size="sm" 
              onClick={() => handleUpdateDueDate(invoice)}
              disabled={isUpdatePending}
            >
              Simpan
            </Button>
          </div>
        ) : formatRupiah(invoice.remaining_amount)}
      </TableCell>
      <TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('id-ID') : '-'}</TableCell>
      <TableCell>
        <Badge variant={status.variant}>{status.label}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {invoice.status !== 'paid' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEdit(invoice)}
            >
              Ubah Jatuh Tempo
            </Button>
          )}
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="destructive"
              disabled={isDeletePending}
              onClick={() => onDelete(invoice)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </div>
      </TableCell>
    </TableRow>
  );
}