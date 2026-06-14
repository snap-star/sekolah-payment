import { CircleX, MessageSquareWarningIcon, RefreshCcw, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { DeleteFeeTypeDialogProps } from './types';

export function DeleteFeeTypeDialog({
  isOpen,
  onOpenChange,
  fee,
  onSubmit,
  isPending,
  resetForm
}: DeleteFeeTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Jenis Tagihan</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus jenis tagihan {fee && <Badge variant="destructive" className="px-2 py-1">"{fee.name}"</Badge>}
          </DialogDescription>
        </DialogHeader>
        <span className="text-yellow-800 bg-yellow-500/50 px-2 py-1 rounded-md flex mr-2 items-center justify-center gap-2">
          <MessageSquareWarningIcon className="h-6 w-6" /> Peringatan: Tindakan ini akan menghapus jenis tagihan yang sudah dibuat.
        </span>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
            <CircleX className="h-4 w-4 mr-2" />
            Batal
          </Button>
          <Button 
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? <RefreshCcw className="animate-spin h-4 w-4 mr-2" /> : null}
            <Trash2Icon className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}