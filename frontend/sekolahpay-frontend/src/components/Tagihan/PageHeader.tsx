import type { CreateInvoiceInput, FeeType, SchoolYear, Student } from '@/types/server/api';
import { CreateInvoiceDialog } from './CreateInvoiceDialog';

interface PageHeaderProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  newInvoice: Partial<CreateInvoiceInput>;
  setNewInvoice: (data: Partial<CreateInvoiceInput>) => void;
  handleCreateInvoice: (e: React.FormEvent) => void;
  students: Student[];
  feeTypes: FeeType[];
  schoolYears: SchoolYear[];
  handleFeeTypeChange: (feeTypeId: string) => void;
  isCreatePending: boolean;
  resetForm: () => void;
  formatRupiah: (n: number) => string;
}

export function PageHeader({
  createDialogOpen,
  setCreateDialogOpen,
  newInvoice,
  setNewInvoice,
  handleCreateInvoice,
  students,
  feeTypes,
  schoolYears,
  handleFeeTypeChange,
  isCreatePending,
  resetForm,
  formatRupiah
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="gemini-page-title">Manajemen Tagihan</h2>
        <p className="text-muted-foreground">Kelola tagihan siswa, nominal dinamis.</p>
      </div>
      <CreateInvoiceDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        newInvoice={newInvoice}
        setNewInvoice={setNewInvoice}
        onSubmit={handleCreateInvoice}
        students={students}
        feeTypes={feeTypes}
        schoolYears={schoolYears}
        handleFeeTypeChange={handleFeeTypeChange}
        isPending={isCreatePending}
        resetForm={resetForm}
        formatRupiah={formatRupiah}
      />
    </div>
  );
}