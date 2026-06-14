import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useFeeTypes,
  useCreateFeeType,
  useUpdateFeeType,
  useDeleteFeeType
} from '@/hooks/useApi';
import type { FeeType } from '@/types/server/api';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n);
}

export function useSetJenisTagihanPage() {
  const qc = useQueryClient();
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  
  // Form states
  const [newFeeType, setNewFeeType] = useState({
    code: '',
    name: '',
    default_amount: '',
    recurring_type: 'once' as 'once' | 'monthly' | 'yearly',
    description: '',
    is_active: true
  });

  const [editFeeType, setEditFeeType] = useState({
    name: '',
    default_amount: '',
    recurring_type: 'once' as 'once' | 'monthly' | 'yearly',
    description: '',
    is_active: true
  });

  // Data fetching
  const { data: feeTypesData, isLoading } = useFeeTypes({
    page: 1,
    perPage: 100
  });
  const feeTypes = feeTypesData?.data || [];

  // Mutations
  const createMutation = useCreateFeeType();
  const updateMutation = useUpdateFeeType();
  const deleteMutation = useDeleteFeeType();

  // Progress for loading state
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(timer);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  // Form reset helpers
  const resetCreateForm = () => {
    setNewFeeType({
      code: '',
      name: '',
      default_amount: '',
      recurring_type: 'once',
      description: '',
      is_active: true
    });
  };

  // Handlers
  const handleCreateFeeType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeType.code || !newFeeType.name || !newFeeType.default_amount) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    createMutation.mutate({
      code: newFeeType.code,
      name: newFeeType.name,
      default_amount: Number(newFeeType.default_amount),
      recurring_type: newFeeType.recurring_type,
      description: newFeeType.description || null,
      is_active: newFeeType.is_active
    }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['fee-types'] });
        setCreateDialogOpen(false);
        resetCreateForm();
        toast.success('Jenis tagihan baru berhasil dibuat');
      },
      onError: () => {
        toast.error('Gagal membuat jenis tagihan');
      }
    });
  };

  const handleEditClick = (fee: FeeType) => {
    setEditingId(fee.id);
    setEditFeeType({
      name: fee.name,
      default_amount: String(fee.default_amount),
      recurring_type: fee.recurring_type,
      description: fee.description || '',
      is_active: fee.is_active
    });
  };

  const handleUpdateFeeType = (id: number) => {
    if (!editFeeType.name || !editFeeType.default_amount) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    updateMutation.mutate({
      id,
      data: {
        name: editFeeType.name,
        default_amount: Number(editFeeType.default_amount),
        recurring_type: editFeeType.recurring_type,
        description: editFeeType.description || null,
        is_active: editFeeType.is_active
      }
    }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['fee-types'] });
        setEditingId(null);
        toast.success('Jenis tagihan berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui jenis tagihan');
      }
    });
  };

  const handleDeleteFeeType = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['fee-types'] });
        setDeleteDialogOpen(null);
        toast.success('Jenis tagihan berhasil dihapus');
      },
      onError: () => {
        toast.error('Gagal menghapus jenis tagihan');
      }
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return {
    // States
    createDialogOpen,
    setCreateDialogOpen,
    editingId,
    setEditingId,
    deleteDialogOpen,
    setDeleteDialogOpen,
    newFeeType,
    setNewFeeType,
    editFeeType,
    setEditFeeType,
    
    // Loading state
    isLoading,
    progress,
    
    // Data
    feeTypes,
    
    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
    
    // Helpers
    resetCreateForm,
    formatRupiah,
    
    // Handlers
    handleCreateFeeType,
    handleEditClick,
    handleUpdateFeeType,
    handleDeleteFeeType,
    cancelEdit
  };
}