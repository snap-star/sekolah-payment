import Layout from '@/Components/Layout';
import { StatCard } from '@/Components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { usePage } from '@inertiajs/react';

interface DashboardProps {
  stats: {
    total_tunggakan: number;
    total_terbayar_bulan_ini: number;
    jumlah_siswa_menunggak: number;
    total_transaksi_hari_ini: number;
  };
  rekap_per_bulan: Array<<{
    bulan: string;
    terbayar: number;
    tunggakan: number;
  }>;
  jenis_tagihan_breakdown: Array<<{
    nama: string;
    total: number;
    terbayar: number;
  }>;
  recent_transactions: Array<<{
    id: string;
    siswa: string;
    kelas: string;
    nominal: number;
    status: string;
    metode: string;
    waktu: string;
  }>;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const { stats, rekap_per_bulan, jenis_tagihan_breakdown, recent_transactions } = usePage().props as unknown as DashboardProps;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ringkasan Transaksi</h2>
          <p className="text-muted-foreground">Pantau pembayaran tuition secara real-time.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Tunggakan" value={formatRupiah(stats.total_tunggakan)} subtitle="Seluruh siswa" />
          <StatCard title="Terbayar Bulan Ini" value={formatRupiah(stats.total_terbayar_bulan_ini)} subtitle="Mei 2026" className="border-l-4 border-l-primary" />
          <StatCard title="Siswa Menunggak" value={stats.jumlah_siswa_menunggak.toString()} subtitle="Perlu perhatian" className="border-l-4 border-l-destructive" />
          <StatCard title="Transaksi Hari Ini" value={stats.total_transaksi_hari_ini.toString()} subtitle="Via QRIS" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Rekap Bulanan</CardTitle>
            </CardHeader>
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
            <CardHeader>
              <CardTitle className="text-sm font-medium">Breakdown per Jenis Tagihan</CardTitle>
            </CardHeader>
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
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transaksi Terbaru</CardTitle>
          </CardHeader>
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
    </Layout>
  );
}
