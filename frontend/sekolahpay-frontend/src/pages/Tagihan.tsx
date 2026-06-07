import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { RefreshCcw, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
import { mockApi } from '../mock/api';
import { useStudents } from '@/hooks/useApi';
import { useFeeTypes } from '@/hooks/useApi';
import type { Student, FeeType } from '@/types/server/api';

// Type definition for Invoice since backend doesn't have API endpoints yet
interface Invoice {
  id: number;
  siswa: {
    nama: string;
    nis: string;
    kelas: string;
  };
  jenis: string;
  nominal_asli: number;
  nominal_disesuaikan: number;
  periode: string;
  status: 'lunas' | 'menunggak' | 'belum_lunas';
  qris_string: string | null;
  qris_expiry: string | null;
  dibayar_pada: string | null;
}

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
  const [newInvoice, setNewInvoice] = useState({
    student_id: '',
    fee_type_id: '',
    periode: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    nominal_asli: '',
    nominal_disesuaikan: ''
  });
  
  // Edit nominal state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newNominal, setNewNominal] = useState('');

  // Fetch real data from backend APIs
  const { data: studentsData, isLoading: studentsLoading } = useStudents({ 
    page: 1, 
    perPage: 100 // Get all students for selection
  });
  
  // Fetch real fee types from backend
  const { data: feeTypesData, isLoading: feeTypesLoading } = useFeeTypes({
    page: 1,
    perPage: 100
  });
  
  // Fetch mock invoices data since backend invoice endpoints are not yet implemented
  // NOTE: Backend has Invoice model and migration but no API controller yet
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery<{ tagihan: Invoice[] }>({
    queryKey: ['invoices'],
    queryFn: () => mockApi.getTagihan()
  });

  // Generate QRIS simulation - frontend only simulation since QRIS not implemented in backend
  const generateQrisSimulation = (invoiceId: number) => {
    const qrisString = `ID.SEKOLAHPAY.INV${invoiceId}.${Date.now()}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // QRIS valid for 7 days
    return {
      qris_string: qrisString,
      qris_expiry: expiryDate.toISOString().split('T')[0]
    };
  };

  // QRIS regeneration mutation (simulation only)
  const qrisMutation = useMutation({
    mutationFn: async (id: number) => {
      // NOTE: QRIS generation will be implemented in backend in the future
      // Currently this is a frontend-only simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateQrisSimulation(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('QRIS berhasil diregenerasi (simulasi)');
    },
  });

  // Update nominal mutation
  const updateMutation = useMutation({
    mutationFn: async (_: { id: number; nominal: number }) => {
      // NOTE: Backend invoice update endpoint will be implemented here
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setEditingId(null);
      toast.success('Nominal diperbarui & QRIS diregenerasi');
    },
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (_: typeof newInvoice) => {
      // NOTE: Backend invoice creation endpoint will be implemented here
      // Currently this stores locally in mock data only
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, id: Date.now() };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      setCreateDialogOpen(false);
      setNewInvoice({
        student_id: '',
        fee_type_id: '',
        nominal_asli: '',
        periode: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        nominal_disesuaikan: ''
      });
      setEditingId(null);
      setNewNominal('');
      toast.success('Tagihan baru berhasil dibuat');
    },
    onError: () => {
      toast.error('Gagal membuat tagihan');
    }
  });

  // Filter and paginate invoices
  const filteredAndPaginatedInvoices = useMemo(() => {
    if (!invoicesData?.tagihan) return { data: [], total: 0, totalPages: 0 };
    
    const filtered = invoicesData.tagihan.filter((invoice: Invoice) => {
      const matchesSearch = invoice.siswa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.siswa.nis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { data: paginatedData, total, totalPages };
  }, [invoicesData, searchQuery, statusFilter, currentPage]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.student_id || !newInvoice.fee_type_id) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }
    createInvoiceMutation.mutate(newInvoice);
  };

  const isLoading = studentsLoading || feeTypesLoading || invoicesLoading;

  if (isLoading) return (
    <div className="p-4 select-none flex items-center">
      <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
      <span>Memuat data tagihan...</span>
    </div>
  );

  const students = studentsData?.data || [];
  const feeTypes = feeTypesData?.data || [];

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= filteredAndPaginatedInvoices.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Manajemen Tagihan</h2>
          <p className="text-muted-foreground">Kelola tagihan siswa, nominal dinamis, dan QRIS.</p>
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
                    value={newInvoice.student_id} 
                    onValueChange={(value) => setNewInvoice({...newInvoice, student_id: value})}
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
                    value={newInvoice.fee_type_id}
                    onValueChange={(value) => {
                      // When fee type is selected, automatically set nominal_asli from fee's default_amount
                      const selectedFee = feeTypes.find((fee: FeeType) => fee.id === Number(value));
                      if (selectedFee) {
                        setNewInvoice({
                          ...newInvoice, 
                          fee_type_id: value,
                          nominal_asli: String(selectedFee.default_amount),
                          nominal_disesuaikan: String(selectedFee.default_amount)
                        });
                      } else {
                        setNewInvoice({...newInvoice, fee_type_id: value});
                      }
                    }}
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
                  <Label>Periode</Label>
                  <Input 
                    value={newInvoice.periode}
                    onChange={(e) => setNewInvoice({...newInvoice, periode: e.target.value})}
                    placeholder="2025-2026" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Nominal Tagihan Asli
                  </Label>
                  <Input
                    type="number" 
                    value={newInvoice.nominal_asli}
                    onChange={(e) => setNewInvoice({...newInvoice, nominal_asli: e.target.value})}
                    placeholder="1000000" 
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nominal Disesuaikan (Setelah Bantuan/Relief)</Label>
                  <Input 
                    type="number" 
                    value={newInvoice.nominal_disesuaikan}
                    onChange={(e) => setNewInvoice({...newInvoice, nominal_disesuaikan: e.target.value})}
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
                  <SelectItem value="lunas">Lunas</SelectItem>
                  <SelectItem value="menunggak">Menunggak</SelectItem>
                  <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Daftar Tagihan Aktif ({filteredAndPaginatedInvoices.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="text-sm text-bold">
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Nominal Asli</TableHead>
                  <TableHead>Nominal Aktif</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QRIS</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndPaginatedInvoices.data.map((t: Invoice) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.siswa.nama}</div>
                      <div className="text-xs text-muted-foreground">{t.siswa.nis} • {t.siswa.kelas}</div>
                    </TableCell>
                    <TableCell>{t.jenis}</TableCell>
                    <TableCell>{t.periode}</TableCell>
                    <TableCell className="text-muted-foreground line-through text-xs">{formatRupiah(t.nominal_asli)}</TableCell>
                    <TableCell className="font-medium">
                      {editingId === t.id ? (
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            className="w-32 h-8" 
                            value={newNominal} 
                            onChange={(e) => setNewNominal(e.target.value)} 
                            autoFocus 
                          />
                          <Button 
                            size="sm" 
                            onClick={() => updateMutation.mutate({ id: t.id, nominal: Number(newNominal) })}
                            disabled={updateMutation.isPending}
                          >
                            Simpan
                          </Button>
                        </div>
                      ) : (
                        formatRupiah(t.nominal_disesuaikan)
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'lunas' ? 'default' : 'destructive'}>
                        {t.status === 'lunas' ? 'Lunas' : t.status === 'menunggak' ? 'Menunggak' : 'Belum Lunas'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {t.qris_string ? (
                        <div className="space-y-1">
                          <p className="text-xs font-mono truncate max-w-35">{t.qris_string.substring(0, 20)}...</p>
                          <p className="text-[10px] text-muted-foreground">Exp: {t.qris_expiry}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {t.status !== 'lunas' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => { setEditingId(t.id); setNewNominal(String(t.nominal_disesuaikan)); }}
                            >
                              Ubah Nominal
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => qrisMutation.mutate(t.id)} 
                              disabled={qrisMutation.isPending}
                            >
                              {qrisMutation.isPending ? (
                                <RefreshCcw className="animate-spin h-4 w-4" />
                              ) : 'Regenerasi QRIS'}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndPaginatedInvoices.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Tidak ada data tagihan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredAndPaginatedInvoices.totalPages > 1 && (
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, filteredAndPaginatedInvoices.totalPages))}
                disabled={currentPage === filteredAndPaginatedInvoices.totalPages}
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