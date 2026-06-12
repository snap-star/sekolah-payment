import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { RefreshCcw, ChevronLeft, ChevronRight, Search, Plus, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  useInvoices, 
  useCreateInvoice, 
  useUpdateInvoice, 
  useDeleteInvoice,
  useStudents, 
  useFeeTypes,
  useSchoolYears
} from '@/hooks/useApi';
import type { Invoice, Student, FeeType, SchoolYear, CreateInvoiceInput } from '@/types/server/api';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function TagihanPage() {
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
  const createInvoiceMutation = useCreateInvoice({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setCreateDialogOpen(false);
      setNewInvoice({
        student_id: undefined,
        fee_type_id: undefined,
        school_year_id: undefined,
        amount: undefined,
        discount_amount: undefined,
        due_date: ''
      });
      toast.success('Tagihan baru berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat tagihan');
    }
  });

  const updateInvoiceMutation = useUpdateInvoice({
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

  const deleteInvoiceMutation = useDeleteInvoice({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setDeleteDialogOpen(null);
      toast.success('Tagihan berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus tagihan');
    }
  });

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
    
    createInvoiceMutation.mutate({
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

    updateInvoiceMutation.mutate({
      id: invoice.id,
      data: {
        due_date: editDueDate
      }
    });
  };

  const handleDeleteInvoice = (id: number) => {
    deleteInvoiceMutation.mutate(id);
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

  if (isLoading || progress < 100) return (
    <div className="p-4 select-none flex flex-col gap-4 items-center justify-center min-h-[60vh]">
      <RefreshCcw className="animate-spin mr-2 inline-block h-8 w-8 text-primary" />
      <Label htmlFor="progress" className="text-2xl font-semibold">Memuat data tagihan ...</Label>
      <div className="w-80 mt-2">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-center text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= paginationMeta.lastPage; i++) {
    pageNumbers.push(i);
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge variant="default">Lunas</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Menunggak</Badge>;
      default:
        return <Badge variant="secondary">Belum Lunas</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Manajemen Tagihan</h2>
          <p className="text-muted-foreground">Kelola tagihan siswa, nominal dinamis.</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Buat Tagihan Baru</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="gemini-page-title">Buat Tagihan Siswa</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateInvoice}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pilih Siswa</Label>
                  <Select 
                    value={newInvoice.student_id?.toString() || ''} 
                    onValueChange={(value) => setNewInvoice({...newInvoice, student_id: Number(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih siswa" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student: Student) => (
                        <SelectItem key={student.id} value={String(student.id)}>
                          {student.name} ({student.nis})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Jenis Tagihan</Label>
                  <Select 
                    value={newInvoice.fee_type_id?.toString() || ''}
                    onValueChange={handleFeeTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeTypes.map((fee: FeeType) => (
                        <SelectItem key={fee.id} value={String(fee.id)}>
                          {fee.name} ({formatRupiah(fee.default_amount)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Select 
                    value={newInvoice.school_year_id?.toString() || ''}
                    onValueChange={(value) => setNewInvoice({...newInvoice, school_year_id: Number(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun ajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolYears.map((sy: SchoolYear) => (
                        <SelectItem key={sy.id} value={String(sy.id)}>
                          {sy.name} {sy.is_active ? '(Aktif)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Jatuh Tempo</Label>
                  <Input 
                    type="date"
                    value={newInvoice.due_date || ''}
                    onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Nominal Tagihan Asli
                  </Label>
                  <Input
                    type="number" 
                    value={newInvoice.amount?.toString() || ''}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: Number(e.target.value)})}
                    placeholder="1000000" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nominal Setelah Diskon</Label>
                  <Input 
                    type="number" 
                    value={newInvoice.discount_amount?.toString() || ''}
                    onChange={(e) => setNewInvoice({...newInvoice, discount_amount: Number(e.target.value)})}
                    placeholder="1000000" 
                  />
                  <p className="text-xs text-muted-foreground">
                    Gunakan nilai ini jika siswa mendapatkan keringanan biaya sekolah
                  </p>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? (
                  <><RefreshCcw className="animate-spin mr-2 h-4 w-4" /> Menyimpan...</>
                ) : 'Simpan Tagihan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIS siswa..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Status:</Label>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="overdue">Menunggak</SelectItem>
                  <SelectItem value="unpaid">Belum Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Daftar Tagihan Aktif ({paginationMeta.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="text-sm text-bold">
                <TableRow>
                  <TableHead>Nomor Invoice</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tahun Ajaran</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Sisa Bayar</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice: Invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{invoice.invoice_number}</div>
                      <div className="text-xs text-muted-foreground">{new Date(invoice.created_at).toLocaleDateString('id-ID')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{invoice.student?.name || '-'}</div>
                      <div className="text-xs text-muted-foreground">{invoice.student?.nis || '-'}</div>
                    </TableCell>
                    <TableCell>{invoice.fee_type?.name || '-'}</TableCell>
                    <TableCell>{invoice.school_year?.name || '-'}</TableCell>
                    <TableCell className="text-muted-foreground line-through text-xs">{formatRupiah(invoice.amount)}</TableCell>
                    <TableCell className="font-medium">
                      {editingId === invoice.id ? (
                        <div className="flex gap-2">
                          <Input 
                            type="date" 
                            className="w-32 h-8" 
                            value={editDueDate} 
                            onChange={(e) => setEditDueDate(e.target.value)} 
                            autoFocus 
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateDueDate(invoice)}
                            disabled={updateInvoiceMutation.isPending}
                          >
                            Simpan
                          </Button>
                        </div>
                      ) : formatRupiah(invoice.remaining_amount)}
                    </TableCell>
                    <TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {invoice.status !== 'paid' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => { setEditingId(invoice.id); setEditDueDate(invoice.due_date || ''); }}
                          >
                            Ubah Jatuh Tempo
                          </Button>
                        )}
                        <Dialog open={deleteDialogOpen === invoice.id} onOpenChange={(open) => setDeleteDialogOpen(open ? invoice.id : null)}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              disabled={deleteInvoiceMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Hapus Tagihan</DialogTitle>
                            </DialogHeader>
                            <p>Apakah Anda yakin ingin menghapus tagihan {invoice.invoice_number}?</p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>Batal</Button>
                              <Button variant="destructive" onClick={() => handleDeleteInvoice(invoice.id)} disabled={deleteInvoiceMutation.isPending}>
                                {deleteInvoiceMutation.isPending ? <RefreshCcw className="animate-spin h-4 w-4" /> : 'Hapus'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Tidak ada data tagihan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paginationMeta.lastPage > 1 && (
            <div className="flex items-center justify-center gap-1 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-9"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.lastPage))}
                disabled={currentPage === paginationMeta.lastPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}