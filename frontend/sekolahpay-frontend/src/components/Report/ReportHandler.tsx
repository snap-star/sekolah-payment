import { useState, useEffect, useMemo } from 'react';
import { useReport } from '@/hooks/useApi';
import type { Invoice } from '@/types/server/api';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n);
}

type SortField = 'student.name' | 'amount' | 'paid_amount' | 'remaining_amount' | 'status';
type SortDirection = 'asc' | 'desc';

export function useReportPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('student.name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const itemsPerPage = 10;

  // API parameters
  const apiParams = useMemo(() => ({
    page: currentPage,
    perPage: itemsPerPage,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined
  }), [currentPage, searchQuery, statusFilter]);

  // Data fetching
  const { data, isLoading } = useReport(apiParams);

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

  // Summary calculations
  const summary = useMemo(() => {
    if (!data?.data) return {
      total_tagihan_keseluruhan: 0,
      total_terbayar: 0,
      total_kekurangan: 0,
      persentase_pembayaran: 0,
    };
    
    const invoices = data.data;
    const total_tagihan_keseluruhan = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const total_terbayar = invoices.reduce((sum, invoice) => sum + invoice.paid_amount, 0);
    const total_kekurangan = invoices.reduce((sum, invoice) => sum + invoice.remaining_amount, 0);
    const persentase_pembayaran = total_tagihan_keseluruhan > 0 
      ? Math.round((total_terbayar / total_tagihan_keseluruhan) * 100 * 10) / 10 
      : 0;
    
    return { total_tagihan_keseluruhan, total_terbayar, total_kekurangan, persentase_pembayaran };
  }, [data]);

  // Pagination metadata
  const serverPagination = data?.meta;
  const totalPages = serverPagination?.last_page || 1;
  const totalItems = serverPagination?.total || 0;
  const startNumber = ((currentPage - 1) * itemsPerPage + 1);

  // Processed data with sorting
  const processedData = useMemo(() => {
    if (!data?.data) return [];
    
    const filtered = [...data.data] as Invoice[];
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'student.name':
          comparison = a.student.name.localeCompare(b.student.name);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'paid_amount':
          comparison = a.paid_amount - b.paid_amount;
          break;
        case 'remaining_amount':
          comparison = a.remaining_amount - b.remaining_amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [data, sortField, sortDirection]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    // States
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    
    // Loading state
    isLoading,
    progress,
    
    // Data
    summary,
    processedData,
    totalPages,
    totalItems,
    startNumber,
    
    // Helpers
    formatRupiah,
    
    // Handlers
    handleSort
  };
}