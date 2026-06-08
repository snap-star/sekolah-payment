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

// Guardian Row component that can safely use hooks
interface GuardianRowProps {
  guardian: StudentGuardian;
  onEdit: (guardian: StudentGuardian) => void;
  onDelete: (guardian: StudentGuardian) => void;
  getRelationBadge: (relation: string | null) => React.JSX.Element;
}

const GuardianRow = ({ guardian, onEdit, onDelete, getRelationBadge }: GuardianRowProps) => {
  return (
    <TableRow key={guardian.id}>
      <TableCell className="font-mono text-xs">{guardian.id}</TableCell>
      <TableCell className="font-medium">{guardian.student?.name || '-'}</TableCell>
      <TableCell className="font-mono text-xs">{guardian.student?.nis || '-'}</TableCell>
      <TableCell className="font-medium">{guardian.name}</TableCell>
      <TableCell className="text-xs">{guardian.phone || '-'}</TableCell>
      <TableCell>{getRelationBadge(guardian.relation)}</TableCell>
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
    name: '',
    phone: '',
    relation: 'Ayah',
    occupation: '',
    address: '',
  });

  const resetForm = () => {
    setFormData({
      student_id: 0,
      name: '',
      phone: '',
      relation: 'Ayah',
      occupation: '',
      address: '',
    });
    setSelectedGuardian(null);
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
      name: guardian.name,
      phone: guardian.phone || '',
      relation: guardian.relation || 'Ayah',
      occupation: guardian.occupation || '',
      address: guardian.address || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (guardian: StudentGuardian) => {
    setSelectedGuardian(guardian);
    setIsDeleteDialogOpen(true);
  };

  // Create mutation
  const createGuardian = useCreateStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil ditambahkan');
      // Refresh the guardians list
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan wali/orang tua');
    },
  });

  // Update mutation
  const updateGuardian = useUpdateStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil diperbarui');
      // Refresh the guardians list
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal memperbarui wali/orang tua');
    },
  });

  // Delete mutation
  const deleteGuardian = useDeleteStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsDeleteDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil dihapus');
      // Refresh the guardians list
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus wali/orang tua');
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.student_id > 0) {
      createGuardian.mutate({
        studentId: formData.student_id,
        data: formData,
      });
    } else {
      toast.error('Pilih siswa terlebih dahulu');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGuardian) {
      updateGuardian.mutate({
        studentId: selectedGuardian.student?.id || 0,
        guardianId: selectedGuardian.id,
        data: formData as UpdateStudentGuardianInput,
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (selectedGuardian) {
      deleteGuardian.mutate({
        studentId: selectedGuardian.student?.id || 0,
        guardianId: selectedGuardian.id,
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedGuardian(null);
  };

  const getRelationBadge = (relation: string | null) => {
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
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Manajemen Orang Tua/Wali</CardTitle>
          <p className="text-sm text-muted-foreground">Kelola data orang tua dan wali siswa di sekolah.</p>
        </CardHeader>
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
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Wali/Orang Tua
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" aria-describedby="createGuardianForm">
                <DialogHeader>
                  <DialogTitle className="gemini-page-title">Tambah Wali/Orang Tua Baru</DialogTitle>
                </DialogHeader>
                <form id="createGuardianForm" className="space-y-4" onSubmit={handleCreateSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="student">Siswa <span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.student_id.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, student_id: parseInt(value) })}
                    >
                      <SelectTrigger id="student">
                        <SelectValue placeholder="Pilih Siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name} (NIS: {student.nis})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon <span className="text-destructive">*</span></Label>
                    <Input
                      id="phone"
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
                <TableHead>ID</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>NIS Siswa</TableHead>
                <TableHead>Nama Wali</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Hubungan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGuardians.map((guardian) => (
                <GuardianRow
                  key={guardian.id}
                  guardian={guardian}
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
          </DialogHeader>
          <form id="editGuardianForm" className="space-y-4" onSubmit={handleEditSubmit}>
            <div className="space-y-2">
              <Label htmlFor="edit-student">Siswa</Label>
              <Select 
                value={formData.student_id.toString()} 
                onValueChange={(value) => setFormData({ ...formData, student_id: parseInt(value) })}
              >
                <SelectTrigger id="edit-student">
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} (NIS: {student.nis})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus data wali/orang tua ini? Tindakan ini tidak dapat dibatalkan.
            </p>
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