import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '../components/ui/pagination';
import { toast } from 'sonner';
import { Pencil, RefreshCcw, Trash, Search, Plus, Save, CircleX } from 'lucide-react';
import { 
  useParents,
  useStudents,
  useCreateStudentGuardian, 
  useUpdateStudentGuardian, 
  useDeleteStudentGuardian 
} from '../hooks/useApi';
import type { StudentGuardian, CreateStudentGuardianInput, UpdateStudentGuardianInput } from '@/types/server/api';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';

// Guardian Row component that can safely use hooks
interface GuardianRowProps {
  guardian: StudentGuardian;
  onEdit: (guardian: StudentGuardian) => void;
  onDelete: (guardian: StudentGuardian) => void;
  getRelationBadge: (guardian: StudentGuardian) => React.JSX.Element;
  index: number;
  currentPage: number;
  perPage: number;
}

const GuardianRow = ({ index, guardian, onEdit, onDelete, getRelationBadge, perPage, currentPage }: GuardianRowProps) => {
  const rowNumber = (currentPage - 1) * perPage + index + 1;
  return (
    <TableRow key={guardian.id}>
      <TableCell className="font-mono text-xs">{rowNumber}</TableCell>
      <TableCell className="font-medium">{guardian.student?.name || '-'}</TableCell>
      <TableCell className="font-mono text-xs">{guardian.student?.nis || '-'}</TableCell>
      <TableCell className="font-medium">{guardian.name}</TableCell>
      <TableCell className="text-xs">{guardian.phone || '-'}</TableCell>
      <TableCell>{getRelationBadge(guardian)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(guardian)}
          >
            <Pencil className="h-4 w-4" />
            <span className="ml-2 text-sm">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(guardian)}
          >
            <Trash className="h-4 w-4" />
            <span className="ml-2 text-sm">Hapus</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function OrangTuaPage() {
  const queryClient = useQueryClient();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // Student search state for combobox
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Fetch all students for the dropdowns in add/edit forms
  const { data: studentsData } = useStudents({
    page: 1,
    perPage: 1000, // Get all students to populate dropdowns
  });
  const students = studentsData?.data || [];
  
  // Filter students based on search query (name, nis, or nisn)
  const filteredStudents = students.filter(student => {
    if (!studentSearchQuery) return true;
    const searchLower = studentSearchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.nis.toLowerCase().includes(searchLower) ||
      (student.nisn && student.nisn.toLowerCase().includes(searchLower))
    );
  });
  
  // Fetch all guardians/parents using the new useParents hook
  const { data: guardiansData } = useParents({
    page: currentPage,
    perPage: 10,
  });
  const apiGuardians = guardiansData?.data || [];
  
  // Use the guardians directly from the API response
  const localGuardians = apiGuardians;
  const [guardiansLoading] = useState(false);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<StudentGuardian | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CreateStudentGuardianInput>({
    student_id: 0,
    student_name: '',
    guardian_name: '',
    phone: '',
    relation: '',
    occupation: '',
    address: '',
  });

  const resetForm = () => {
    setFormData({
      student_id: 0,
      student_name: '',
      guardian_name: '',
      phone: '',
      relation: '',
      occupation: '',
      address: '',
    });
    setSelectedGuardian(null);
    setStudentSearchQuery('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const openEditDialog = (guardian: StudentGuardian) => {
    setSelectedGuardian(guardian);
    setFormData({
      student_id: guardian.student?.id || 0,
      student_name: guardian.student?.name || '',
      guardian_name: guardian.name || '',
      phone: guardian.phone || '',
      relation: guardian.relation || '',
      occupation: guardian.occupation || '',
      address: guardian.address || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (guardian: StudentGuardian) => {
    setSelectedGuardian(guardian);
    setIsDeleteDialogOpen(true);
  };

  // Create mutation - Updated to use new simplified hook signature
  // Implements POST /api/student-guardians from documentation
  const createGuardian = useCreateStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil ditambahkan');
      // No need for window.location.reload() - React Query handles cache invalidation
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan wali/orang tua');
    },
  });

  // Update mutation - Updated to use new simplified hook signature
  // Implements PUT /api/student-guardians/{id} from documentation
  const updateGuardian = useUpdateStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil diperbarui');
      // No need for window.location.reload() - React Query handles cache invalidation
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal memperbarui wali/orang tua');
    },
  });

  // Delete mutation - Updated to use new simplified hook signature
  // Implements DELETE /api/student-guardians/{id} from documentation
  const deleteGuardian = useDeleteStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsDeleteDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil dihapus');
      // No need for window.location.reload() - React Query handles cache invalidation
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus wali/orang tua');
    },
  });

  const handleCreateSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (formData.student_id > 0 && formData.student_name) {
      // Directly pass formData to mutation - simplified API matches documentation
      createGuardian.mutate(formData);
    } else {
      toast.error('Pilih siswa terlebih dahulu');
    }
  };

  const handleEditSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (selectedGuardian) {
      // Pass only id and data - simplified API matches documentation
      updateGuardian.mutate({
        id: selectedGuardian.id,
        data: formData as UpdateStudentGuardianInput,
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (selectedGuardian) {
      // Pass only guardianId - simplified API matches documentation
      deleteGuardian.mutate(selectedGuardian.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedGuardian(null);
  };

  /**
   * Helper function to get the appropriate badge for guardian relationship
   * Supports both 'relation' and 'relationship' fields from API responses
   */
  const getRelationBadge = (guardian: StudentGuardian) => {
    // Get relation from either field (supports both API response formats)
    const relation = guardian.relation || null;
    
    if (!relation) return <Badge variant="outline">-</Badge>;
    
    switch (relation) {
      case 'Ayah':
        return <Badge variant="default">Ayah</Badge>;
      case 'Ibu':
        return <Badge variant="default">Ibu</Badge>;
      case 'Wali':
        return <Badge variant="secondary">Wali</Badge>;
      default:
        return <Badge variant="outline">{relation}</Badge>;
    }
  };

  // Filter and paginate guardians
  const filteredGuardians = localGuardians.filter(guardian => {
    return guardian.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
           (guardian.phone && guardian.phone.includes(debouncedSearch)) ||
           (guardian.student?.name && guardian.student.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  });

  const perPage = 10;
  const totalPages = Math.ceil(filteredGuardians.length / perPage);
  const paginatedGuardians = filteredGuardians.slice(
    (currentPage - 1) * perPage, 
    currentPage * perPage
  );


  if (guardiansLoading) return (
    <div className="p-4 select-none flex items-center justify-center h-64">
      <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
      <span className="select-none">Memuat data wali/orang tua...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col">
      <Label className="gemini-page-title">
      Manajemen Orang Tua/Wali
      </Label>
      <p className="text-sm text-muted-foreground">Kelola data orang tua dan wali siswa di sekolah.</p>
      <div className="absolute top-0 right-0">
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); }}>
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
                <form id="createGuardianForm" className="space-y-4" onSubmit={handleCreateSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="student">Siswa <span className="text-destructive">*</span></Label>
                    {/* TODO: INPUT COMBOBOX SEHARUSNYA BERUBAH JADI NAMA STUDENT, DAN FORM YANG TERSUBMIT ADALAH ID STUDENT */}
                    <Combobox
                      id="search-student"
                      value={formData.student_id.toString()}
                      required
                      items={students.map(student => student.name)}
                      onValueChange={(value) => {
                        if (value) {
                          setFormData({ ...formData, student_id: parseInt(value) });
                        }
                      }}
                    >
                      {/* TODO: INPUT COMBOBOX SEHARUSNYA BERUBAH JADI NAMA STUDENT, DAN FORM YANG TERSUBMIT ADALAH ID STUDENT */}
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
                      pattern="[a-zA-Z\s]+"
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
                      pattern="[0-9\s]+"
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
                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Masukkan alamat"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      <CircleX className="mr-2 h-4 w-4" />Batal
                    </Button>
                    <Button type="submit" disabled={createGuardian.isPending}>
                      {createGuardian.isPending ? <><Save className="mr-2 h-4 w-4 animate-pulse" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Simpan</>}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Daftar Orang Tua/Wali</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead>No.</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>NIS Siswa</TableHead>
                <TableHead>Nama Wali</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Hubungan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGuardians.map((guardian, index) => (
                <GuardianRow
                  key={guardian.id}
                  index={index}
                  guardian={guardian}
                  perPage={perPage}
                  currentPage={currentPage}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  getRelationBadge={getRelationBadge}
                />
              ))}
              {paginatedGuardians.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Belum ada data wali/orang tua
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-self-auto mt-4 pt-4 border-t gap-4">
              <div className="text-xs text-muted-foreground">
                Halaman {currentPage} dari {totalPages} • Total: {filteredGuardians.length} Wali/Orang Tua
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Sebelumnya"
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Selanjutnya"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" aria-describedby="editGuardianForm">
          <DialogHeader>
            <DialogTitle>Edit Wali/Orang Tua</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Merubah data orang tua atau wali dari siswa.
            </DialogDescription>
          </DialogHeader>
          <form id="editGuardianForm" className="space-y-4" onSubmit={handleEditSubmit}>
            <div className="space-y-2">
              <Label htmlFor="edit-student">Siswa</Label>
              <Combobox
                id="edit-student"
                readOnly
                disabled
                  value={formData.student_id.toString()}
                  onValueChange={(value) => {
                    if (value) {
                      setFormData({ ...formData, student_id: parseInt(value) });
                    }
                  }}
                >
                  <ComboboxInput
                    id="student-edit"
                    placeholder="Cari berdasarkan nama, NIS, atau NISN..."
                    showClear
                    className="w-full"
                    // onChange={(e) => setStudentSearchQuery(e.target.value)}
                    disabled
                  />
                <ComboboxContent className="w-full max-h-60 overflow-y-auto">
                  <ComboboxList>
                    {filteredStudents.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Tidak ada siswa yang ditemukan
                      </div>
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
              <Label htmlFor="edit-name">Nama Lengkap <span className="text-destructive">*</span></Label>
              <Input
                id="edit-name"
                value={formData.guardian_name}
                onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                required
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Nomor Telepon <span className="text-destructive">*</span></Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                maxLength={50}
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
                  placeholder="Masukkan pekerjaan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Alamat</Label>
                <Input
                  id="edit-address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Masukkan alamat"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <CircleX className="mr-2 h-4 w-4" />Batal
              </Button>
              <Button type="submit" disabled={updateGuardian.isPending}>
                {updateGuardian.isPending ? <><Save className="mr-2 h-4 w-4 animate-pulse" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { setIsDeleteDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" aria-describedby="deleteGuardianForm">
          <DialogHeader>
            <DialogTitle>Hapus Wali/Orang Tua</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus data wali/orang tua ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedGuardian && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedGuardian.name}</p>
                <p className="text-sm text-muted-foreground">{selectedGuardian.phone}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSubmit}
              disabled={deleteGuardian.isPending}
            >
              {deleteGuardian.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}