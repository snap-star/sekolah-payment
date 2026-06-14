import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CreateInvoiceInput, FeeType, SchoolYear, Student } from '@/types/server/api';
import { Plus, RefreshCcw, SaveIcon } from 'lucide-react';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newInvoice: Partial<CreateInvoiceInput>;
  setNewInvoice: (data: Partial<CreateInvoiceInput>) => void;
  onSubmit: (e: React.FormEvent) => void;
  students: Student[];
  feeTypes: FeeType[];
  schoolYears: SchoolYear[];
  handleFeeTypeChange: (feeTypeId: string) => void;
  isPending: boolean;
  resetForm: () => void;
  formatRupiah: (n: number) => string;
}

export function CreateInvoiceDialog({
  isOpen,
  onOpenChange,
  newInvoice,
  setNewInvoice,
  onSubmit,
  students,
  feeTypes,
  schoolYears,
  handleFeeTypeChange,
  isPending,
  resetForm,
  formatRupiah
}: CreateInvoiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" />Buat Tagihan Baru</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="gemini-page-title">Buat Tagihan Siswa</DialogTitle>
          <DialogDescription>
            Isi semua field dengan benar untuk membuat tagihan baru.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pilih Siswa</Label>
              <Select 
                value={newInvoice.student_id?.toString() || ''} 
                onValueChange={(value) => setNewInvoice({...newInvoice, student_id: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student: Student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name} ({student.nis})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Tagihan</Label>
              <Select 
                value={newInvoice.fee_type_id?.toString() || ''}
                onValueChange={handleFeeTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {feeTypes.map((fee: FeeType) => (
                    <SelectItem key={fee.id} value={String(fee.id)}>
                      {fee.name} ({formatRupiah(fee.default_amount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tahun Ajaran</Label>
              <Select 
                value={newInvoice.school_year_id?.toString() || ''}
                onValueChange={(value) => setNewInvoice({...newInvoice, school_year_id: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {schoolYears.map((sy: SchoolYear) => (
                    <SelectItem key={sy.id} value={String(sy.id)}>
                      {sy.name} {sy.is_active ? '(Aktif)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Jatuh Tempo</Label>
              <Input 
                type="date"
                value={newInvoice.due_date || ''}
                onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Nominal Tagihan Asli
              </Label>
              <Input
                type="number" 
                value={newInvoice.amount?.toString() || ''}
                onChange={(e) => setNewInvoice({...newInvoice, amount: Number(e.target.value)})}
                placeholder="1000000" 
              />
            </div>
            <div className="space-y-2">
              <Label>Nominal Setelah Diskon</Label>
              <Input 
                type="number" 
                value={newInvoice.discount_amount?.toString() || ''}
                onChange={(e) => setNewInvoice({...newInvoice, discount_amount: Number(e.target.value)})}
                placeholder="1000000" 
              />
              <p className="text-xs text-muted-foreground">
                Gunakan nilai ini jika siswa mendapatkan keringanan biaya sekolah
              </p>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <><RefreshCcw className="animate-spin mr-2 h-4 w-4" /> Menyimpan...</>
            ) : <><SaveIcon /> Simpan Tagihan</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}