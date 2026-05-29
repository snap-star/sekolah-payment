import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { mockApi } from '../mock/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tagihan } from '../types';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function TagihanPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['tagihan'], queryFn: () => mockApi.getTagihan() });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newNominal, setNewNominal] = useState('');

  const updateMutation = useMutation({
    mutationFn: ({ id, nominal }: { id: number; nominal: number }) => mockApi.updateTagihan(id, { nominal_disesuaikan: nominal }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tagihan'] });
      setEditingId(null);
      toast.success('Nominal diperbarui & QRIS diregenerasi');
    },
  });

  const qrisMutation = useMutation({
    mutationFn: (id: number) => mockApi.generateQris(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tagihan'] });
      toast.success('QRIS berhasil diregenerasi');
    },
  });

  if (isLoading) return <div>Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Tagihan</h2>
          <p className="text-muted-foreground">Kelola tagihan siswa, nominal dinamis, dan QRIS.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button>Buat Tagihan Baru</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Buat Tagihan Siswa</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Demo: Tagihan dibuat'); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nama Siswa</Label><Input placeholder="Ahmad Fauzi" /></div>
                <div className="space-y-2"><Label>NIS</Label><Input placeholder="202501001" /></div>
              </div>
              <div className="space-y-2"><Label>Kelas</Label><Input placeholder="X IPA 1" /></div>
              <div className="space-y-2">
                <Label>Jenis Tagihan</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Pilih jenis tagihan" /></SelectTrigger>
                  <SelectContent>
                    {data!.jenis_tagihan.map((j) => (
                      <SelectItem key={j.id} value={String(j.id)}>{j.nama} ({formatRupiah(j.nominal_default)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Simpan Tagihan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader><CardTitle className="text-sm font-medium">Daftar Tagihan Aktif</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
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
              {data!.tagihan.map((t) => (
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
                        <Input type="number" className="w-32 h-8" value={newNominal} onChange={(e) => setNewNominal(e.target.value)} autoFocus />
                        <Button size="sm" onClick={() => updateMutation.mutate({ id: t.id, nominal: Number(newNominal) })}>Simpan</Button>
                      </div>
                    ) : (
                      formatRupiah(t.nominal_disesuaikan)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'lunas' ? 'default' : 'destructive'}>
                      {t.status === 'lunas' ? 'Lunas' : 'Menunggak'}
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
                          <Button size="sm" variant="outline" onClick={() => { setEditingId(t.id); setNewNominal(String(t.nominal_disesuaikan)); }}>
                            Ubah Nominal
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => qrisMutation.mutate(t.id)} disabled={qrisMutation.isPending}>
                            Regenerate QRIS
                          </Button>
                        </>
                      )}
                    </div>
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