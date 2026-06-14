import type { UpdateStudentInput } from '@/types/server/api';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { StudentForm } from './StudentForm';

interface EditStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UpdateStudentInput;
  onFormChange: (data: UpdateStudentInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function EditStudentDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  isPending,
}: EditStudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Siswa</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Merubah data siswa
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          formData={formData}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          isPending={isPending}
          submitText="Perbarui"
          loadingText="Menyimpan..."
        />
      </DialogContent>
    </Dialog>
  );
}