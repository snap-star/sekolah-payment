import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { CircleX, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/types/server/api';

interface FormData {
  student_id: number;
  student_name: string;
  guardian_name: string;
  phone: string;
  relation: string;
  occupation?: string | null;
  address?: string | null;
}

interface CreateGuardianDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  setStudentSearchQuery: (query: string) => void;
  filteredStudents: Student[];
  isPending: boolean;
  resetForm: () => void;
}

export function CreateGuardianDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  setStudentSearchQuery,
  filteredStudents,
  isPending,
  resetForm,
}: CreateGuardianDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Wali/Orang Tua
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="gemini-page-title">Tambah Wali/Orang Tua Baru</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Isi informasi wali atau orang tua untuk siswa ini.
          </DialogDescription>
        </DialogHeader>
        <form id="createGuardianForm" className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="student">Siswa <span className="text-destructive">*</span></Label>
            <Combobox
              id="search-student"
              value={formData.student_id.toString()}
              required
              onValueChange={(value) => {
                if (value) {
                  const student = filteredStudents.find(s => s.id.toString() === value);
                  setFormData({ ...formData, student_id: parseInt(value), student_name: student?.name || '' });
                }
              }}
            >
              <ComboboxInput
                id="search-student"
                placeholder="Cari berdasarkan nama, NIS, atau NISN..."
                showClear
                className="w-full"
                onChange={(e) => setStudentSearchQuery(e.target.value)}
              />
              <ComboboxContent className="w-full max-h-60 overflow-y-auto cursor-pointer">
                <ComboboxList>
                  {filteredStudents.length === 0 ? (
                    <ComboboxEmpty>
                      Tidak ada data siswa yang ditemukan
                    </ComboboxEmpty>
                  ) : (
                    filteredStudents.map(student => (
                      <ComboboxItem key={student.id} value={student.id.toString()}>
                          <span>{student.name}</span>
                          <span className="text-xs text-muted-foreground">
                            NIS: {student.nis}{student.nisn ? ` | NISN: ${student.nisn}` : ''}
                          </span>
                      </ComboboxItem>
                    ))
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap Orang Tua <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              type="text"
              pattern="[a-zA-Z\\s]+"
              placeholder="Masukkan nama lengkap Orang Tua"
              value={formData.guardian_name || ''}
              onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
              required
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon <span className="text-destructive">*</span></Label>
            <Input
              id="phone"
              type="tel"
              pattern="[0-9\\s]+"
              placeholder="Masukkan nomor telepon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              maxLength={50}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relation">Hubungan <span className="text-destructive">*</span></Label>
              <Select
                value={formData.relation}
                onValueChange={(value) => setFormData({ ...formData, relation: value })}
              >
                <SelectTrigger id="relation">
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
              <Label htmlFor="occupation">Pekerjaan</Label>
              <Input
                id="occupation"
                value={formData.occupation || ''}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Masukkan pekerjaan"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Masukkan alamat"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <CircleX className="mr-2 h-4 w-4" />Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Save className="mr-2 h-4 w-4 animate-pulse" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Simpan</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}