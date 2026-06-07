import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { toast } from 'sonner';
import { Pencil, RefreshCcw, Trash, Search, Plus, Save } from 'lucide-react';
import { 
  useStudents, 
  useCreateStudent, 
  useUpdateStudent, 
  useDeleteStudent,
  useStudentGuardians
} from '../hooks/useApi';
import type { Student, CreateStudentInput, UpdateStudentInput } from '@/types/server/api';

// Student Row component that can safely use hooks
interface StudentRowProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  getGenderLabel: (gender: string) => string;
  getStatusBadge: (status: string) => React.JSX.Element;
}

const StudentRow = ({ student, onEdit, onDelete, getGenderLabel, getStatusBadge }: StudentRowProps) => {
  // Get guardians for this specific student - hooks work here because it's a component
  const { data: guardiansData } = useStudentGuardians(student.id, { page: 1, perPage: 100 });
  // Get the first guardian
  const primaryGuardian = guardiansData?.data?.[0];

  return (
    <TableRow key={student.id}>
      <TableCell className="font-mono text-xs">{student.nis}</TableCell>
      <TableCell className="font-mono text-xs">{student.nisn || '-'}</TableCell>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell className="text-xs">{getGenderLabel(student.gender)}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {student.birth_date ? new Date(student.birth_date).toLocaleDateString('id-ID') : '-'}
      </TableCell>
      <TableCell>{getStatusBadge(student.status)}</TableCell>
      <TableCell className="text-xs">
        {primaryGuardian ? (
          <div className="flex flex-col items-center gap-1">
            <div>{primaryGuardian.name}</div>
            {/* Relation badge uncomment jika diperlukan tampilkan status relasi siswa dan wali */}
            {/* <Badge className="ml-2 text-muted-foreground" variant="secondary">
              {primaryGuardian.relation || '-'}
            </Badge> */}
            <Badge className="ml-2 text-muted-foreground" variant="secondary">
            <div className="text-muted-foreground">{primaryGuardian.phone || '-'}</div>
            </Badge>
          </div>
        ) : '-'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(student)}
          >
            <Pencil className="h-4 w-4" />
            <span className="ml-2 text-sm">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(student)}
          >
            <Trash className="h-4 w-4" />
            <span className="ml-2 text-sm">Hapus</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function SiswaPage() {
  const queryClient = useQueryClient();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Fetch students with pagination and filters
  const { data, isLoading } = useStudents({
    page: currentPage,
    perPage: 10,
    search: debouncedSearch,
    status: statusFilter || undefined,
    gender: genderFilter || undefined,
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CreateStudentInput>({
    nis: '',
    nisn: '',
    name: '',
    gender: 'L',
    birth_date: '',
    status: 'active',
  });

  const resetForm = () => {
    setFormData({
      nis: '',
      nisn: '',
      name: '',
      gender: 'L',
      birth_date: '',
      status: 'active',
    });
    setSelectedStudent(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setGenderFilter('');
    setCurrentPage(1);
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      nis: student.nis,
      nisn: student.nisn || '',
      name: student.name,
      gender: student.gender,
      birth_date: student.birth_date || '',
      status: student.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  // Create mutation
  const createStudent = useCreateStudent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Siswa berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan siswa');
    },
  });

  // Update mutation
  const updateStudent = useUpdateStudent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Siswa berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal memperbarui siswa');
    },
  });

  // Delete mutation
  const deleteStudent = useDeleteStudent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsDeleteDialogOpen(false);
      resetForm();
      toast.success('Siswa berhasil dihapus');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus siswa');
    },
  });

  const handleCreateSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createStudent.mutate(formData);
  };

  const handleEditSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      updateStudent.mutate({
        id: selectedStudent.id,
        data: formData as UpdateStudentInput,
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (selectedStudent) {
      deleteStudent.mutate(selectedStudent.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Nonaktif</Badge>;
      case 'graduated':
        return <Badge variant="outline">Lulus</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'L' ? 'Laki-laki' : 'Perempuan';
  };

  if (isLoading) return (
    <div className="p-4 select-none">
      <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
      <span className="select-none">Memuat...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Manajemen Siswa</h2>
          <p className="text-muted-foreground">Kelola data siswa di sekolah.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Tambah Siswa</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" aria-describedby="createStudentForm">
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
            </DialogHeader>
            <form id="createStudentForm" className="space-y-4" onSubmit={handleCreateSubmit}>
              <div className="space-y-2">
                <Label htmlFor="nis">NIS <span className="text-destructive">*</span></Label>
                <Input
                  id="nis"
                  placeholder="Masukkan NIS"
                  value={formData.nis}
                  autoComplete="off"
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nisn">NISN</Label>
                <Input
                  id="nisn"
                  placeholder="Masukkan NISN"
                  value={formData.nisn || ''}
                  autoComplete="off"
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="Masukkan Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoComplete="off"
                  maxLength={255}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin <span className="text-destructive">*</span></Label>
                  <Select
                    defaultValue="L"
                    value={formData.gender}
                    onValueChange={(value: 'L' | 'P') => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue aria-placeholder="Pilih Jenis Kelamin" placeholder="Pilih jenis kelamin" />
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
                    value={formData.birth_date || ''}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'graduated') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue aria-placeholder="Pilih Status" placeholder="Pilih status" />
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
                disabled={createStudent.isPending}
              >
                {createStudent.isPending ? (
                  <>
                    <RefreshCcw className="animate-spin mr-2 h-4 w-4" />
                    <Save className="mr-2 h-4 w-4 animate-pulse" />
                    Menyimpan...
                  </>
                ) : <><Save className="mr-2 h-4 w-4" />Simpan</>}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Siswa</DialogTitle>
            </DialogHeader>
            <form id="editStudentForm" className="space-y-4" onSubmit={handleEditSubmit}>
              <div className="space-y-2">
                <Label htmlFor="edit-nis">NIS <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-nis"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nisn">NISN</Label>
                <Input
                  id="edit-nisn"
                  value={formData.nisn || ''}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={255}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Jenis Kelamin <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: 'L' | 'P') => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-birth_date">Tanggal Lahir</Label>
                  <Input
                    id="edit-birth_date"
                    type="date"
                    value={formData.birth_date || ''}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'graduated') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue aria-placeholder="Pilih Status" placeholder="Pilih status" />
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
                disabled={updateStudent.isPending}
              >
                {updateStudent.isPending ? (
                  <>
                    <RefreshCcw className="animate-spin mr-2 h-4 w-4" />
                    Menyimpan...
                  </>
                ) : 'Perbarui'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { setIsDeleteDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Hapus Siswa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menghapus siswa <strong>{selectedStudent?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setIsDeleteDialogOpen(false); resetForm(); }}
                  disabled={deleteStudent.isPending}
                >
                  Batal
                </Button>
                <Button
                  id="deleteStudentButton"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteSubmit}
                  disabled={deleteStudent.isPending}
                >
                  {deleteStudent.isPending ? (
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
      </div>

      {/* Filter Bar */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-50">
              <Label htmlFor="search" className="mb-2 block">Cari Siswa</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari berdasarkan NIS, NISN, atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-40">
              <Label htmlFor="filter-status" className="mb-2 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                  <SelectItem value="graduated">Lulus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label htmlFor="filter-gender" className="mb-2 block">Jenis Kelamin</Label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger id="filter-gender">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead>NIS</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>JK</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orang Tua/Wali</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((student) => (
                <StudentRow 
                  key={student.id}
                  student={student}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  getGenderLabel={getGenderLabel}
                  getStatusBadge={getStatusBadge}
                />
              ))}
              
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Belum ada data siswa
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {data?.meta && (
            <div className="flex flex-col sm:flex-row items-center justify-self-auto mt-4 pt-4 border-t gap-4">
              <div className="text-xs text-muted-foreground">
                Halaman {data.meta.current_page} dari {data.meta.last_page} • Total: {data.meta.total} Siswa
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={(e) => {
                        e.preventDefault();
                        if (data.meta.current_page > 1) {
                          handlePageChange(data.meta.current_page - 1);
                        }
                      }}
                      className={data.meta.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Sebelumnya"
                    />
                  </PaginationItem>
                  {Array.from({ length: data.meta.last_page }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current page
                      if (page === 1 || page === data.meta.last_page) return true;
                      if (page >= data.meta.current_page - 1 && page <= data.meta.current_page + 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap between pages
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                                isActive={page === data.meta.current_page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        );
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === data.meta.current_page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (data.meta.current_page < data.meta.last_page) {
                          handlePageChange(data.meta.current_page + 1);
                        }
                      }}
                      className={data.meta.current_page === data.meta.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Berikutnya"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}