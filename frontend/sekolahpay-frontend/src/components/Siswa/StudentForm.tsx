import type { CreateStudentInput, UpdateStudentInput } from '@/types/server/api';
import { RefreshCcw, Save } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface StudentFormProps<T extends CreateStudentInput | UpdateStudentInput> {
  formData: T;
  onFormChange: (data: T) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  submitText: string;
  loadingText: string;
}

export function StudentForm<T extends CreateStudentInput | UpdateStudentInput>({
  formData,
  onFormChange,
  onSubmit,
  isPending,
  submitText,
  loadingText,
}: StudentFormProps<T>) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="nis">NIS <span className="text-destructive">*</span></Label>
        <Input
          id="nis"
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          pattern="[0-9]+"
          placeholder="Masukkan NIS"
          value={formData.nis}
          autoComplete="off"
          onChange={(e) => onFormChange({ ...formData, nis: e.target.value })}
          required
          maxLength={50}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nisn">NISN</Label>
        <Input
          id="nisn"
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          pattern="[0-9]+"
          placeholder="Masukkan NISN"
          value={formData.nisn || ''}
          autoComplete="off"
          onChange={(e) => onFormChange({ ...formData, nisn: e.target.value })}
          maxLength={50}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
        <Input
          id="name"
          type="text"
          pattern="[a-zA-Z\s]+"
          placeholder="Masukkan Nama Lengkap"
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          required
          autoComplete="off"
          maxLength={255}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Jenis Kelamin <span className="text-destructive">*</span></Label>
          <Select
            required
            value={formData.gender}
            onValueChange={(value: 'L' | 'P') => onFormChange({ ...formData, gender: value })}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth_date">Tanggal Lahir</Label>
          <Input
            id="birth_date"
            placeholder="Pilih Tanggal Lahir"
            autoComplete="off"
            type="date"
            required
            value={formData.birth_date || ''}
            onChange={(e) => onFormChange({ ...formData, birth_date: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
        <Select
          defaultValue="active"
          required
          value={formData.status}
          onValueChange={(value: 'active' | 'inactive' | 'graduated') => 
            onFormChange({ ...formData, status: value })
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
            <SelectItem value="graduated">Lulus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isPending}
      >
        {isPending ? (
          <>
            <RefreshCcw className="animate-spin mr-2 h-4 w-4" />
            {loadingText}
          </>
        ) : <><Save className="mr-2 h-4 w-4" />{submitText}</>}
      </Button>
    </form>
  );
}