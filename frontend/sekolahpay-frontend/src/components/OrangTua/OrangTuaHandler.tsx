import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { StudentGuardian, CreateStudentGuardianInput, UpdateStudentGuardianInput } from "@/types/server/api";
import { useDeleteStudentGuardian, useUpdateStudentGuardian, useCreateStudentGuardian, useParents, useStudents } from "@/hooks/useApi";
import { toast } from 'sonner';

// Custom hook that contains all the OrangTua page logic - properly uses React hooks inside a function
export function useOrangTuaPage() {
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
  const { data: guardiansData, isLoading: guardiansLoading } = useParents({
    page: currentPage,
    perPage: 10,
  });
  const apiGuardians = guardiansData?.data || [];
  
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

  // dialog handlers
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

  // Create mutation
  const createGuardian = useCreateStudentGuardian({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Wali/orang tua berhasil ditambahkan');
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
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus wali/orang tua');
    },
  });

  // submit form handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.student_id > 0) {
      createGuardian.mutate(formData);
    } else {
      toast.error('Pilih siswa terlebih dahulu');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGuardian) {
      updateGuardian.mutate({
        id: selectedGuardian.id,
        data: formData as UpdateStudentGuardianInput,
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (selectedGuardian) {
      deleteGuardian.mutate(selectedGuardian.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedGuardian(null);
  };

  // Filter and paginate guardians
  const filteredGuardians = apiGuardians.filter(guardian => {
    return guardian.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
           (guardian.phone && guardian.phone.includes(debouncedSearch)) ||
           (guardian.student?.name && guardian.student.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  });

  const perPage = 10;
  const totalPages = Math.ceil((guardiansData?.meta?.total || filteredGuardians.length) / perPage);
  const paginatedGuardians = filteredGuardians.slice(
    (currentPage - 1) * perPage, 
    currentPage * perPage
  );

  return {
    // States
    currentPage,
    searchQuery,
    setSearchQuery,
    studentSearchQuery,
    setStudentSearchQuery,
    formData,
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedGuardian,
    guardiansLoading,
    
    // Computed values
    filteredStudents,
    filteredGuardians,
    paginatedGuardians,
    totalPages,
    perPage,
    
    // Handlers
    resetForm,
    resetFilters,
    handlePageChange,
    openEditDialog,
    openDeleteDialog,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteSubmit,
    
    // Mutations
    createGuardian,
    updateGuardian,
    deleteGuardian,
  };
}