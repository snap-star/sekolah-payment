import { Download, Upload } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { CreateStudentDialog } from './CreateStudentDialog';
import type { CreateStudentInput } from '@/types/server/api';

interface HeaderActionsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  formData: CreateStudentInput;
  onFormChange: (data: CreateStudentInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  createStudentPending: boolean;
  resetForm: () => void;
}

export function HeaderActions({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  formData,
  onFormChange,
  onSubmit,
  createStudentPending,
  resetForm,
}: HeaderActionsProps) {
  return (
    <div className="relative flex flex-cols-3 items-center gap-5 justify-center">
      <div className="w-full">
        <h2 className="gemini-page-title">Manajemen Siswa</h2>
        <p className="text-muted-foreground">Kelola data siswa di sekolah.</p>
      </div>
      <div id="import-data-siswa">
        <Button><Upload className="mr-2 h-4 w-4" />Import Data Siswa</Button>
      </div>
      <div id="download-data-siswa">
        <Button><Download className="mr-2 h-4 w-4" />Download Data Siswa</Button>
      </div>
      <CreateStudentDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); }}
        formData={formData}
        onFormChange={onFormChange}
        onSubmit={onSubmit}
        isPending={createStudentPending}
      />
    </div>
  );
}