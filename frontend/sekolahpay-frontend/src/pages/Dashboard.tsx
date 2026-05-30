import { StatCard } from '../components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../mock/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DashboardStats, RecentTransaction } from '../types';
import { RefreshCcw } from 'lucide-react';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => mockApi.getDashboard(),
  });

  if (isLoading) return <div className="p-4 select-none">
    <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
    <span className="select-none">Memuat...</span>
    </div>;
  const { stats, rekap_per_bulan, jenis_tagihan_breakdown, recent_transactions } = data!;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold tracking-tight dark:text-mist-200 select-none">Ringkasan Transaksi</h2>
        <p className="text-muted-foreground select-none">Pantau pembayaran tuition secara real-time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 cursor-pointer">
        <StatCard 
          title="Total Tunggakan" 
          value={formatRupiah(stats.total_tunggakan)} 
          subtitle="Seluruh siswa" 
          className="animate-fade-in-up delay-100 hover-lift"
        />
        <StatCard 
          title="Terbayar Bulan Ini" 
          value={formatRupiah(stats.total_terbayar_bulan_ini)} 
          subtitle="Mei 2026" 
          className="border-l-4 border-l-primary animate-fade-in-up delay-200 hover-lift" 
        />
        <StatCard 
          title="Siswa Menunggak" 
          value={String(stats.jumlah_siswa_menunggak)} 
          subtitle="Perlu perhatian" 
          className="border-l-4 border-l-destructive animate-fade-in-up delay-300 hover-lift" 
        />
        <StatCard 
          title="Transaksi Hari Ini" 
          value={String(stats.total_transaksi_hari_ini)} 
          subtitle="Via QRIS" 
          className="animate-fade-in-up delay-400 hover-lift dark:hover-lift" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border animate-scale-in delay-300 hover-lift">
          <CardHeader>
            <CardTitle className="text-sm font-medium select-none">Rekap Bulanan </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rekap_per_bulan.map((item, index) => (
                <div key={item.bulan} className="flex items-center justify-between select-none" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <span className="text-sm font-medium">{item.bulan}</span>
                  <div className="flex gap-4 text-xs cursor-pointer">
                    <Badge className="bg-primary items-center justify-center">
                    <span className="text-primary-foreground">Terbayar: {formatRupiah(item.terbayar)}</span>
                    </Badge>
                    <Badge className="bg-red-800/20 items-center justify-center hover:bg-red-800">
                    <span className="text-destructive hover:text-white">Tunggakan: {formatRupiah(item.tunggakan)}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border animate-scale-in delay-400 hover-lift">
          <CardHeader>
            <CardTitle className="text-sm font-medium select-none">Breakdown per Jenis Tagihan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jenis_tagihan_breakdown.map((item, index) => {
                const percent = Math.round((item.terbayar / item.total) * 100);
                return (
                  <div key={item.nama}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.nama}</span>
                      <span className="text-muted-foreground">{percent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary animate-progress" 
                        style={{ width: `${percent}%`, animationDelay: `${(index + 5) * 100}ms` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border animate-fade-in-up delay-600 hover-lift">
        <CardHeader>
          <CardTitle className="text-sm font-medium border-border select-none">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="select-none">
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent_transactions.map((trx, index) => (
                <TableRow key={trx.id} className="animate-fade-in" style={{ animationDelay: `${(index + 7) * 100}ms` }}>
                  <TableCell className="font-mono text-xs">{trx.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{trx.siswa}</div>
                    <div className="text-xs text-muted-foreground">{trx.kelas}</div>
                  </TableCell>
                  <TableCell>{formatRupiah(trx.nominal)}</TableCell>
                  <TableCell>
                    <Badge variant={trx.status === 'success' ? 'default' : 'secondary'}>
                      {trx.status === 'success' ? 'Sukses' : 'Pending'}
                    </Badge>
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