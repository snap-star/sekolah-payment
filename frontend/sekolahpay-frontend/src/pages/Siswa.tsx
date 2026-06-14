import type { CreateStudentInput, Student, UpdateStudentInput } from '@/types/server/api';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DeleteStudentDialog } from '../components/Siswa/DeleteStudentDialog';
import { EditStudentDialog } from '../components/Siswa/EditStudentDialog';
import { HeaderActions } from '../components/Siswa/HeaderActions';
import { LoadingState } from '../components/Siswa/LoadingState';
import { StudentFilterBar } from '../components/Siswa/StudentFilterBar';
import { StudentTable } from '../components/Siswa/StudentTable';
import {
    useCreateStudent,
    useDeleteStudent,
    useStudents,
    useUpdateStudent,
} from '../hooks/useApi';

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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, genderFilter]);
  
  // Fetch students with pagination and filters
  const { data, isLoading } = useStudents({
    page: currentPage,
    perPage: 10,
    search: debouncedSearch,
    status: statusFilter === 'all'? undefined : statusFilter || undefined,
    gender: genderFilter === 'all' ? undefined : genderFilter || undefined,
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudent.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
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

  const [progress, setProgress] = useState(0);

  // Animate progress bar while loading
  useEffect(() => {
    if (isLoading) {
       
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Hold at 90% until complete
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(timer);
    } else {
      setProgress(100); // Complete when loading finishes
    }
  }, [isLoading]);

  if (isLoading || progress < 100) return <LoadingState progress={progress} />;

  return (
    <div className="space-y-6">
      <HeaderActions
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        formData={formData}
        onFormChange={(data) => setFormData(data)}
        onSubmit={handleCreateSubmit}
        createStudentPending={createStudent.isPending}
        resetForm={resetForm}
      />

      <StudentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        onResetFilters={resetFilters}
      />

      <StudentTable
        students={data?.data || []}
        meta={data?.meta}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <EditStudentDialog
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}
        formData={formData as UpdateStudentInput}
        onFormChange={(data) => setFormData(data as CreateStudentInput)}
        onSubmit={handleEditSubmit}
        isPending={updateStudent.isPending}
      />

      <DeleteStudentDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={(open) => { setIsDeleteDialogOpen(open); if (!open) resetForm(); }}
        selectedStudent={selectedStudent}
        onConfirm={handleDeleteSubmit}
        isPending={deleteStudent.isPending}
        onCancel={() => { setIsDeleteDialogOpen(false); resetForm(); }}
      />
    </div>
  );
}