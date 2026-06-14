import { CircleX, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteGuardianDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
  resetForm: () => void;
}

export function DeleteGuardianDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  resetForm,
}: DeleteGuardianDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Wali/Orang Tua</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus data wali/orang tua ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
            <CircleX className="mr-2 h-4 w-4" />Batal
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
            {isPending ? <><RefreshCcw className="mr-2 h-4 w-4 animate-spin" />Menghapus...</> : <><Trash2 className="mr-2 h-4 w-4" />Hapus</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}