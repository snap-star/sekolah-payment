import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Summary {
  total_tagihan_keseluruhan: number;
  total_terbayar: number;
  total_kekurangan: number;
  persentase_pembayaran: number;
}

interface SummaryCardsProps {
  summary: Summary;
  formatRupiah: (n: number) => string;
}

export function SummaryCards({ summary, formatRupiah }: SummaryCardsProps) {
  return (
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
  );
}