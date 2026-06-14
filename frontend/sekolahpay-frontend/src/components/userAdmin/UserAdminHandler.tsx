import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/useApi';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { CreateUserInput, UserRole } from '@/types/server/api';
import type { NewUserForm } from './types';

// Role options that match the UserRole schema with Indonesian labels
export const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'bendahara', label: 'Bendahara' },
  { value: 'guru', label: 'Guru' },
  { value: 'student', label: 'Siswa' },
  { value: 'guardian', label: 'Orang Tua/Wali' },
];

export function useUserAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // API parameters
  const apiParams = useMemo(() => ({
    page: currentPage,
    perPage: itemsPerPage,
    search: searchQuery || undefined
  }), [currentPage, searchQuery]);

  // Use the real useUsers hook
  const { data, isLoading } = useUsers(apiParams);
  const createUserMutation = useCreateUser({
    onSuccess: () => {
      toast.success('User berhasil ditambahkan!');
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error('Gagal menambahkan user. Silakan coba lagi.');
    }
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success('User berhasil dihapus!');
    },
    onError: () => {
      toast.error('Gagal menghapus user. Silakan coba lagi.');
    }
  });

  const [progress, setProgress] = useState(0);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: '',
    email: '',
    no_hp: '',
    role: '',
    password: ''
  });

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

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const resetForm = () => {
    setNewUserForm({
      name: '',
      email: '',
      no_hp: '',
      role: '',
      password: ''
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.no_hp || !newUserForm.role || !newUserForm.password) {
      toast.error('Semua field harus diisi!');
      return;
    }
    
    createUserMutation.mutate(newUserForm as CreateUserInput);
    resetForm();
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const displayRoles = data?.roles || roleOptions;
  const users = data?.data || [];
  const totalItems = data?.meta?.total || users.length;

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isLoading,
    progress,
    newUserForm,
    setNewUserForm,
    createUserMutation,
    deleteUserMutation,
    handleCreateUser,
    handleDeleteUser,
    resetForm,
    displayRoles,
    users,
    totalItems,
    roleOptions
  };
}