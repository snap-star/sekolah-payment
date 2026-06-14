import { CircleX, Save, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  student_id: number;
  student_name: string;
  guardian_name: string;
  phone: string;
  relation: string;
  occupation?: string | null;
  address?: string | null;
}

interface EditGuardianDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  resetForm: () => void;
}

export function EditGuardianDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isPending,
  resetForm,
}: EditGuardianDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Wali/Orang Tua</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Ubah data wali atau orang tua.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-student">Siswa</Label>
            <Input
              id="edit-student"
              value={formData.student_name || ''}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama Lengkap Orang Tua <span className="text-destructive">*</span></Label>
            <Input
              id="edit-name"
              value={formData.guardian_name || ''}
              onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Nomor Telepon <span className="text-destructive">*</span></Label>
            <Input
              id="edit-phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-relation">Hubungan <span className="text-destructive">*</span></Label>
              <Select
                value={formData.relation}
                onValueChange={(value) => setFormData({ ...formData, relation: value })}
              >
                <SelectTrigger id="edit-relation">
                  <SelectValue placeholder="Pilih Hubungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ayah">Ayah</SelectItem>
                  <SelectItem value="Ibu">Ibu</SelectItem>
                  <SelectItem value="Wali">Wali</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-occupation">Pekerjaan</Label>
              <Input
                id="edit-occupation"
                value={formData.occupation || ''}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-address">Alamat</Label>
            <Input
              id="edit-address"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
              <CircleX className="mr-2 h-4 w-4" />Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Save className="mr-2 h-4 w-4 animate-pulse" />Menyimpan...</> : <><Edit2 className="mr-2 h-4 w-4" />Perbarui</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}