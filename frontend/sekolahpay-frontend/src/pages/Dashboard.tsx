import { StatCard } from '../components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../mock/api';
import { RefreshCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => mockApi.getDashboard(),
  });

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
  
  const { stats, rekap_per_bulan, jenis_tagihan_breakdown, recent_transactions } = data!;

  return (
    <div className="space-y-8">
      {/* Gemini-style page header */}
      <div className="gemini-page-header animate-gemini-fade-in-up">
        <h2 className="gemini-page-title">Ringkasan Transaksi</h2>
        <p className="gemini-page-subtitle">Pantau pembayaran sekolah secara real-time.</p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Tunggakan" 
          value={formatRupiah(stats.total_tunggakan)} 
          subtitle="Seluruh siswa" 
          className="animate-gemini-fade-in-up gemini-delay-100"
        />
        <StatCard 
          title="Terbayar Bulan Ini" 
          value={formatRupiah(stats.total_terbayar_bulan_ini)} 
          subtitle="Mei 2026" 
          className="animate-gemini-fade-in-up gemini-delay-200"
        />
        <StatCard 
          title="Siswa Menunggak" 
          value={String(stats.jumlah_siswa_menunggak)} 
          subtitle="Perlu perhatian" 
          className="animate-gemini-fade-in-up gemini-delay-300" 
        />
        <StatCard 
          title="Transaksi Hari Ini" 
          value={String(stats.total_transaksi_hari_ini)} 
          subtitle="Via QRIS" 
          className="animate-gemini-fade-in-up gemini-delay-400"
        />
      </div>

      {/* Main Dashboard Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gemini-card animate-gemini-scale-in gemini-delay-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Rekap Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {rekap_per_bulan.map((item, index) => (
                <div 
                  key={item.bulan} 
                  className="flex items-center justify-between animate-gemini-fade-in gemini-table-row rounded-lg px-3 py-2 -mx-3" 
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <span className="text-sm font-semibold">{item.bulan}</span>
                  <div className="flex gap-3">
                    <span className="gemini-badge gemini-badge-primary">
                      Terbayar: {formatRupiah(item.terbayar)}
                    </span>
                    <span className="gemini-badge gemini-badge-pending">
                      Tunggakan: {formatRupiah(item.tunggakan)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gemini-card animate-gemini-scale-in gemini-delay-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Breakdown per Jenis Tagihan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {jenis_tagihan_breakdown.map((item, index) => {
                const percent = Math.round((item.terbayar / item.total) * 100);
                return (
                  <div 
                    key={item.nama} 
                    className="animate-gemini-fade-in gemini-table-row rounded-lg px-3 py-2 -mx-3"
                    style={{ animationDelay: `${(index + 5) * 100}ms` }}
                  >
                    <div className="flex justify-between text-sm mb-3">
                      <span>{item.nama}</span>
                      <span className="text-muted-foreground font-medium">{percent}%</span>
                    </div>
                    <div className="gemini-progress-bar">
                      <div 
                        className="gemini-progress-bar-fill animate-gemini-progress" 
                        style={{ width: `${percent}%`, animationDelay: `${(index + 5) * 150}ms` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="gemini-card animate-gemini-fade-in-up gemini-delay-600">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead className="font-semibold">ID Transaksi</TableHead>
                <TableHead className="font-semibold">Siswa</TableHead>
                <TableHead className="font-semibold">Nominal</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent_transactions.map((trx, index) => (
                <TableRow 
                  key={trx.id} 
                  className="gemini-table-row animate-gemini-fade-in" 
                  style={{ animationDelay: `${(index + 7) * 100}ms` }}
                >
                  <TableCell className="font-mono text-xs">{trx.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{trx.siswa}</div>
                    <Badge className="gemini-badge gemini-badge-primary">{trx.kelas}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatRupiah(trx.nominal)}</TableCell>
                  <TableCell>
                    <span className={trx.status === 'success' ? 'gemini-badge gemini-badge-success' : 'gemini-badge gemini-badge-pending'}>
                      {trx.status === 'success' ? 'Sukses' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{trx.waktu}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}