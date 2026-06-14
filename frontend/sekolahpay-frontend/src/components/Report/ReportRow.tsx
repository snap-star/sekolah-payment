import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Invoice } from '@/types/server/api';

interface ReportRowProps {
  invoice: Invoice;
  index: number;
  startNumber: number;
  formatRupiah: (n: number) => string;
}

export function ReportRow({ invoice, index, startNumber, formatRupiah }: ReportRowProps) {
  return (
    <TableRow key={invoice.id}>
      <TableCell className="font-medium">{startNumber + index}</TableCell>
      <TableCell>
        <div className="font-medium">{invoice.student.name}</div>
        <div className="text-xs text-muted-foreground">{invoice.student.nis}</div>
      </TableCell>
      <TableCell>{invoice.fee_type.name}</TableCell>
      <TableCell>{invoice.school_year.name}</TableCell>
      <TableCell className="text-right">{formatRupiah(invoice.amount)}</TableCell>
      <TableCell className="text-right text-primary">{formatRupiah(invoice.paid_amount)}</TableCell>
      <TableCell className="text-right font-bold text-destructive">{formatRupiah(invoice.remaining_amount)}</TableCell>
      <TableCell>
        <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'unpaid' ? 'secondary' : 'destructive'}>
          {invoice.status === 'paid' ? 'Lunas' : invoice.status === 'unpaid' ? 'Belum Lunas' : 'Menunggak'}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">Aksi</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
            <DropdownMenuItem>Edit Tagihan</DropdownMenuItem>
            <DropdownMenuItem>Catat Pembayaran</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}