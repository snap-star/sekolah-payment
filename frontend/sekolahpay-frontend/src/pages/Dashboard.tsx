import { StatCard } from '../components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../mock/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DashboardStats, RecentTransaction } from '../types';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => mockApi.getDashboard(),
  });

  if (isLoading) return <div className="p-4">Memuat...</div>;
  const { stats, rekap_per_bulan, jenis_tagihan_breakdown, recent_transactions } = data!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ringkasan Transaksi</h2>
        <p className="text-muted-foreground">Pantau pembayaran tuition secara real-time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tunggakan" value={formatRupiah(stats.total_tunggakan)} subtitle="Seluruh siswa" />
        <StatCard title="Terbayar Bulan Ini" value={formatRupiah(stats.total_terbayar_bulan_ini)} subtitle="Mei 2026" className="border-l-4 border-l-primary" />
        <StatCard title="Siswa Menunggak" value={String(stats.jumlah_siswa_menunggak)} subtitle="Perlu perhatian" className="border-l-4 border-l-destructive" />
        <StatCard title="Transaksi Hari Ini" value={String(stats.total_transaksi_hari_ini)} subtitle="Via QRIS" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm font-medium">Rekap Bulanan</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rekap_per_bulan.map((item) => (
                <div key={item.bulan} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.bulan}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-primary">Terbayar: {formatRupiah(item.terbayar)}</span>
                    <span className="text-destructive">Tunggakan: {formatRupiah(item.tunggakan)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm font-medium">Breakdown per Jenis Tagihan</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jenis_tagihan_breakdown.map((item) => {
                const percent = Math.round((item.terbayar / item.total) * 100);
                return (
                  <div key={item.nama}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.nama}</span>
                      <span className="text-muted-foreground">{percent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader><CardTitle className="text-sm font-medium">Transaksi Terbaru</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent_transactions.map((trx) => (
                <TableRow key={trx.id}>
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