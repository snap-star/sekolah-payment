import type { CreateStudentInput } from '@/types/server/api';
import { Plus } from 'lucide-react';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { StudentForm } from './StudentForm';

interface CreateStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateStudentInput;
  onFormChange: (data: CreateStudentInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function CreateStudentDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  isPending,
}: CreateStudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" />Tambah Siswa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" aria-describedby="createStudentForm">
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tambahkan data siswa baru ke sekolah.
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          formData={formData}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          isPending={isPending}
          submitText="Simpan"
          loadingText="Menyimpan..."
        />
      </DialogContent>
    </Dialog>
  );
}