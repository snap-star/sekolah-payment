import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Invoice } from '@/types/server/api';
import { CircleX, MessageSquareWarningIcon, RefreshCcw, Trash2Icon } from 'lucide-react';

interface DeleteInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | undefined;
  onSubmit: () => void;
  isPending: boolean;
  resetForm: () => void;
}

export function DeleteInvoiceDialog({
  isOpen,
  onOpenChange,
  invoice,
  onSubmit,
  isPending,
  resetForm
}: DeleteInvoiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Tagihan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus tagihan {invoice && <Badge variant="destructive">{invoice.invoice_number}</Badge>}
          </DialogDescription>
        </DialogHeader>
        <span className="text-sm text-yellow-800 bg-yellow-500/50 p-2 rounded-md flex items-center gap-2">
          <MessageSquareWarningIcon className="h-6 w-6" />
          Peringatan: Tindakan ini akan menghapus tagihan murid, dan tidak dapat di kembalikan.
        </span>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
            <CircleX className="h-4 w-4" />
            Batal
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
            {isPending ? <RefreshCcw className="animate-spin h-4 w-4" /> : <>
              <Trash2Icon className="h-4 w-4" />
              Hapus
            </>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}