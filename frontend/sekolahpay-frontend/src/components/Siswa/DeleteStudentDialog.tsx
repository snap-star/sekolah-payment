import type { Student } from '@/types/server/api';
import { RefreshCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface DeleteStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudent: Student | null;
  onConfirm: () => void;
  isPending: boolean;
  onCancel: () => void;
}

export function DeleteStudentDialog({
  isOpen,
  onOpenChange,
  selectedStudent,
  onConfirm,
  isPending,
  onCancel,
}: DeleteStudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Siswa</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus siswa <strong>{selectedStudent?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <RefreshCcw className="animate-spin mr-2 h-4 w-4" />
                  Menghapus...
                </>
              ) : 'Hapus'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}