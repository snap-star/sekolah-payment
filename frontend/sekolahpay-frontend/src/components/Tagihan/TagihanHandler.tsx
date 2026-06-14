import {
    useCreateInvoice,
    useDeleteInvoice,
    useFeeTypes,
    useInvoices,
    useSchoolYears,
    useStudents,
    useUpdateInvoice
} from '@/hooks/useApi';
import type { CreateInvoiceInput, FeeType, Invoice } from '@/types/server/api';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export function useTagihanPage() {
  const qc = useQueryClient();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Create invoice dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Partial<CreateInvoiceInput>>({
    student_id: undefined,
    fee_type_id: undefined,
    school_year_id: undefined,
    amount: undefined,
    discount_amount: undefined,
    due_date: ''
  });
  
  // Edit nominal state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);

  // Fetch data from backend APIs
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices({
    page: currentPage,
    perPage: itemsPerPage,
    search: searchQuery,
    status: statusFilter === 'all' ? undefined : statusFilter
  });
  
  const { data: studentsData, isLoading: studentsLoading } = useStudents({ 
    page: 1, 
    perPage: 500 // Get all students for selection
  });
  
  const { data: feeTypesData, isLoading: feeTypesLoading } = useFeeTypes({
    page: 1,
    perPage: 100
  });

  const { data: schoolYearsData, isLoading: schoolYearsLoading } = useSchoolYears({
    page: 1,
    perPage: 100
  });
  
  // Mutation hooks
  const createInvoice = useCreateInvoice({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setCreateDialogOpen(false);
      resetCreateForm();
      toast.success('Tagihan baru berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat tagihan');
    }
  });

  const updateInvoice = useUpdateInvoice({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setEditingId(null);
      setEditDueDate('');
      toast.success('Tanggal jatuh tempo berhasil diperbarui');
    },
    onError: () => {
      toast.error('Gagal memperbarui tagihan');
    }
  });

  const deleteInvoice = useDeleteInvoice({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setDeleteDialogOpen(null);
      toast.success('Tagihan berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus tagihan');
    }
  });

  // Reset create form
  const resetCreateForm = () => {
    setNewInvoice({
      student_id: undefined,
      fee_type_id: undefined,
      school_year_id: undefined,
      amount: undefined,
      discount_amount: undefined,
      due_date: ''
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter and paginate invoices - backend handles pagination, but we keep client-side filters for local state
  const paginationMeta = useMemo(() => {
    if (!invoicesData?.meta) return { total: 0, lastPage: 1, currentPage: 1, perPage: itemsPerPage };
    return {
      total: invoicesData.meta.total,
      lastPage: invoicesData.meta.last_page,
      currentPage: invoicesData.meta.current_page,
      perPage: invoicesData.meta.per_page
    };
  }, [invoicesData?.meta]);

  const invoices = useMemo(() => invoicesData?.data || [], [invoicesData?.data]);
  const students = useMemo(() => studentsData?.data || [], [studentsData?.data]);
  const feeTypes = useMemo(() => feeTypesData?.data || [], [feeTypesData?.data]);
  const schoolYears = useMemo(() => schoolYearsData?.data || [], [schoolYearsData?.data]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.student_id || !newInvoice.fee_type_id || !newInvoice.school_year_id || !newInvoice.amount) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }
    
    createInvoice.mutate({
      student_id: newInvoice.student_id,
      fee_type_id: newInvoice.fee_type_id,
      school_year_id: newInvoice.school_year_id,
      amount: newInvoice.amount,
      discount_amount: newInvoice.discount_amount || undefined,
      due_date: newInvoice.due_date || undefined
    } as CreateInvoiceInput);
  };

  const handleUpdateDueDate = (invoice: Invoice) => {
    if (!editDueDate) {
      toast.error('Mohon masukkan tanggal jatuh tempo');
      return;
    }

    updateInvoice.mutate({
      id: invoice.id,
      data: {
        due_date: editDueDate
      }
    });
  };

  const handleDeleteInvoice = (id: number) => {
    deleteInvoice.mutate(id);
  };

  const handleFeeTypeChange = (feeTypeId: string) => {
    const selectedFee = feeTypes.find((fee: FeeType) => fee.id === Number(feeTypeId));
    if (selectedFee) {
      setNewInvoice({
        ...newInvoice,
        fee_type_id: Number(feeTypeId),
        amount: selectedFee.default_amount,
        discount_amount: selectedFee.default_amount
      });
    }
  };

  const openEditDialog = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setEditDueDate(invoice.due_date || '');
  };

  const openDeleteDialog = (invoice: Invoice) => {
    setDeleteDialogOpen(invoice.id);
  };

  const [progress, setProgress] = useState(0);
  const isLoading = studentsLoading || feeTypesLoading || schoolYearsLoading || invoicesLoading;

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

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= paginationMeta.lastPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [paginationMeta.lastPage]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return { variant: 'default', label: 'Lunas' } as const;
      case 'overdue':
        return { variant: 'destructive', label: 'Menunggak' } as const;
      default:
        return { variant: 'secondary', label: 'Belum Lunas' } as const;
    }
  };

  return {
    // States
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createDialogOpen,
    setCreateDialogOpen,
    newInvoice,
    setNewInvoice,
    editingId,
    setEditingId,
    editDueDate,
    setEditDueDate,
    deleteDialogOpen,
    setDeleteDialogOpen,
    
    // Loading states
    isLoading,
    progress,
    
    // Data
    invoices,
    students,
    feeTypes,
    schoolYears,
    paginationMeta,
    pageNumbers,
    
    // Mutations
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Handlers
    resetCreateForm,
    resetFilters,
    handleCreateInvoice,
    handleUpdateDueDate,
    handleDeleteInvoice,
    handleFeeTypeChange,
    openEditDialog,
    openDeleteDialog,
    getStatusBadge,
    formatRupiah
  };
}