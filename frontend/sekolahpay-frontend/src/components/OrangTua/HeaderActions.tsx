import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateGuardianDialog } from './CreateGuardianDialog';
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

interface HeaderActionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleCreateSubmit: (e: React.FormEvent) => void;
  setStudentSearchQuery: (query: string) => void;
  filteredStudents: Student[];
  isCreatePending: boolean;
  resetForm: () => void;
}

export function HeaderActions({
  searchQuery,
  setSearchQuery,
  resetFilters,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  formData,
  setFormData,
  handleCreateSubmit,
  setStudentSearchQuery,
  filteredStudents,
  isCreatePending,
  resetForm,
}: HeaderActionsProps) {
  return (
    <div className="space-y-6">
      <div className="relative flex flex-col">
        <Label className="gemini-page-title">
          Manajemen Orang Tua/Wali
        </Label>
        <p className="text-sm text-muted-foreground">Kelola data orang tua dan wali siswa di sekolah.</p>
        <div className="absolute top-0 right-0">
          <CreateGuardianDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateSubmit}
            setStudentSearchQuery={setStudentSearchQuery}
            filteredStudents={filteredStudents}
            isPending={isCreatePending}
            resetForm={resetForm}
          />
        </div>
      </div>

      <Card className="border-border">
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-50">
              <Label htmlFor="search" className="mb-2 block">Cari</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari nama atau nomor telepon..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}