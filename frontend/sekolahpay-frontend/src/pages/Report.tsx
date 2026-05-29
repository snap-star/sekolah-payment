import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockApi } from '../mock/api';
import type { ReportItem } from '../types';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function ReportPage() {
  const { data, isLoading } = useQuery({ queryKey: ['report'], queryFn: () => mockApi.getReport() });

  if (isLoading) return <div>Memuat...</div>;
  const { reports, summary } = data!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Laporan Pembayaran</h2>
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
        <CardHeader><CardTitle className="text-sm font-medium">Detail Laporan per Siswa</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Jenis Tagihan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead className="text-right">Nominal Tagihan</TableHead>
                <TableHead className="text-right">Total Dibayar</TableHead>
                <TableHead className="text-right text-destructive">Kekurangan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Riwayat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r: ReportItem) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.siswa.nama}</div>
                    <div className="text-xs text-muted-foreground">{r.siswa.nis} • {r.siswa.kelas}</div>
                  </TableCell>
                  <TableCell>{r.jenis_tagihan}</TableCell>
                  <TableCell>{r.periode}</TableCell>
                  <TableCell className="text-right">{formatRupiah(r.nominal_tagihan)}</TableCell>
                  <TableCell className="text-right text-primary">{formatRupiah(r.total_dibayar)}</TableCell>
                  <TableCell className="text-right font-bold text-destructive">{formatRupiah(r.kekurangan_bayar)}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'lunas' ? 'default' : r.status === 'belum_lunas' ? 'secondary' : 'destructive'}>
                      {r.status === 'lunas' ? 'Lunas' : r.status === 'belum_lunas' ? 'Belum Lunas' : 'Menunggak'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.riwayat_pembayaran.length > 0 ? (
                      <Accordion type="single" collapsible className="w-48">
                        <AccordionItem value={`riwayat-${r.id}`} className="border-0">
                          <AccordionTrigger className="text-xs py-0 hover:no-underline">{r.riwayat_pembayaran.length} pembayaran</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 mt-2">
                              {r.riwayat_pembayaran.map((rp, idx) => (
                                <div key={idx} className="text-xs bg-muted p-2 rounded">
                                  <div className="flex justify-between"><span>{rp.tanggal}</span><span className="font-medium">{formatRupiah(rp.nominal)}</span></div>
                                  <div className="text-muted-foreground">{rp.metode} • {rp.ref}</div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}