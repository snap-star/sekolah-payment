import { useReport } from '@/hooks/useApi';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { RangePicker } from '../components/ui/range-picker';
import type { Invoice } from '@/types/server/api';
import { Printer, RefreshCcw, Search, ArrowUpDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEffect, useState, useMemo } from 'react';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

type SortField = 'student.name' | 'amount' | 'paid_amount' | 'remaining_amount' | 'status';
type SortDirection = 'asc' | 'desc';

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('student.name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const itemsPerPage = 10;
  
  // Use real API with parameters
  const apiParams = useMemo(() => ({
    page: currentPage,
    perPage: itemsPerPage,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined
  }), [currentPage, searchQuery, statusFilter]);
  
  const { data, isLoading } = useReport(apiParams);
  
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

  // Calculate summary statistics from the real invoice data
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

  // Get server-side pagination info
  const serverPagination = data?.meta;
  const totalPages = serverPagination?.last_page || 1;
  const totalItems = serverPagination?.total || 0;
  const startNumber = ((currentPage - 1) * itemsPerPage + 1);

  // Handle sorting and client-side filtering if needed
  const processedData = useMemo(() => {
    if (!data?.data) return [];
    
    const filtered = [...data.data] as Invoice[];
    
    // Apply sorting client-side since server doesn't handle sorting yet
    filtered.sort((a, b) => {
      // eslint-disable-next-line no-useless-assignment
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

  const paginatedData = processedData;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const startNumberValue = startNumber;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="gemini-page-title">Laporan Pembayaran</h2>
        <p className="text-muted-foreground">Rekapitulasi tagihan, pembayaran, dan kekurangan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Tagihan</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold">{formatRupiah(summary.total_tagihan_keseluruhan)}</div></CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Terbayar</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold text-primary">{formatRupiah(summary.total_terbayar)}</div></CardContent>
        </Card>
        <Card className="border-border border-l-4 border-l-destructive">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Kekurangan</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold text-destructive">{formatRupiah(summary.total_kekurangan)}</div></CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">% Pembayaran</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold">{summary.persentase_pembayaran}%</div></CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="">Detail Laporan per Siswa</CardTitle>
            <div className="flex items-center gap-2">
            <Button variant="default">
              <Printer className="mr-2 inline-block h-5 w-5 text-primary-foreground dark:text-primary-foreground" />
              Cetak
            </Button>
            <Button variant="default">
              <Download className="mr-2 inline-block h-5 w-5 text-primary-foreground dark:text-primary-foreground" />
              Download Laporan
            </Button>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="unpaid">Belum Lunas</SelectItem>
                  <SelectItem value="overdue">Menunggak</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
              <div className="flex items-center gap-2">
              <RangePicker />
              </div>
            </div>
          </div>
          
          {/* Filter and Search Section TODO: debounced filtering and search*/}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa, NIS, atau tagihan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="unpaid">Belum Lunas</SelectItem>
                  <SelectItem value="overdue">Menunggak</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('student.name')} className="flex items-center gap-1 -ml-3">
                    Siswa
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Jenis Tagihan</TableHead>
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="flex items-center gap-1 ml-auto">
                    Nominal
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('paid_amount')} className="flex items-center gap-1 ml-auto">
                    Dibayar
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('remaining_amount')} className="flex items-center gap-1 ml-auto">
                    Kekurangan
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="flex items-center gap-1 -ml-3">
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((r: Invoice, index: number) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{startNumberValue + index}</TableCell>
                  <TableCell>
                    <div className="font-medium">{r.student.name}</div>
                    <div className="text-xs text-muted-foreground">{r.student.nis}</div>
                  </TableCell>
                  <TableCell>{r.fee_type.name}</TableCell>
                  <TableCell>{r.school_year.name}</TableCell>
                  <TableCell className="text-right">{formatRupiah(r.amount)}</TableCell>
                  <TableCell className="text-right text-primary">{formatRupiah(r.paid_amount)}</TableCell>
                  <TableCell className="text-right font-bold text-destructive">{formatRupiah(r.remaining_amount)}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'paid' ? 'default' : r.status === 'unpaid' ? 'secondary' : 'destructive'}>
                      {r.status === 'paid' ? 'Lunas' : r.status === 'unpaid' ? 'Belum Lunas' : 'Menunggak'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">Aksi</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit Tagihan</DropdownMenuItem>
                        <DropdownMenuItem>Catat Pembayaran</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    Tidak ada data yang cocok dengan filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
              Total: {totalItems} data
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}