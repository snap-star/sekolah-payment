import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { RefreshCcw, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useFeeTypes, useCreateFeeType, useUpdateFeeType, useDeleteFeeType } from '@/hooks/useApi';
import type { FeeType } from '@/types/server/api';
import { Progress } from '@/components/ui/progress';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function SetJenisTagihanPage() {
  const qc = useQueryClient();
  
  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  
  // Form state for new fee type
  const [newFeeType, setNewFeeType] = useState({
    code: '',
    name: '',
    default_amount: '',
    recurring_type: 'once' as 'once' | 'monthly' | 'yearly',
    description: '',
    is_active: true
  });

  // Edit form state
  const [editFeeType, setEditFeeType] = useState({
    name: '',
    default_amount: '',
    recurring_type: 'once' as 'once' | 'monthly' | 'yearly',
    description: '',
    is_active: true
  });

  // Fetch real fee types data from backend
  const { data: feeTypesData, isLoading } = useFeeTypes({
    page: 1,
    perPage: 100
  });

  // Mutations for CRUD operations
  const createMutation = useCreateFeeType();
  const updateMutation = useUpdateFeeType();
  const deleteMutation = useDeleteFeeType();

  const feeTypes = feeTypesData?.data || [];

  const handleCreateFeeType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeType.code || !newFeeType.name || !newFeeType.default_amount) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    createMutation.mutate({
      code: newFeeType.code,
      name: newFeeType.name,
      default_amount: Number(newFeeType.default_amount),
      recurring_type: newFeeType.recurring_type,
      description: newFeeType.description || null,
      is_active: newFeeType.is_active
    }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['fee-types'] });
        setCreateDialogOpen(false);
        setNewFeeType({
          code: '',
          name: '',
          default_amount: '',
          recurring_type: 'once',
          description: '',
          is_active: true
        });
        toast.success('Jenis tagihan baru berhasil dibuat');
      },
      onError: () => {
        toast.error('Gagal membuat jenis tagihan');
      }
    });
  };

  const handleEditClick = (fee: FeeType) => {
    setEditingId(fee.id);
    setEditFeeType({
      name: fee.name,
      default_amount: String(fee.default_amount),
      recurring_type: fee.recurring_type,
      description: fee.description || '',
      is_active: fee.is_active
    });
  };

  const handleUpdateFeeType = (id: number) => {
    if (!editFeeType.name || !editFeeType.default_amount) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    updateMutation.mutate({
      id,
      data: {
        name: editFeeType.name,
        default_amount: Number(editFeeType.default_amount),
        recurring_type: editFeeType.recurring_type,
        description: editFeeType.description || null,
        is_active: editFeeType.is_active
      }
    }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['fee-types'] });
        setEditingId(null);
        toast.success('Jenis tagihan berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui jenis tagihan');
      }
    });
  };

  const handleDeleteFeeType = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['fee-types'] });
        setDeleteDialogOpen(null);
        toast.success('Jenis tagihan berhasil dihapus');
      },
      onError: () => {
        toast.error('Gagal menghapus jenis tagihan');
      }
    });
  };

  const [progress, setProgress] = useState(0);

  // Animate progress bar while loading
  useEffect(() => {
    if (isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Pengaturan Jenis Tagihan</h2>
          <p className="text-muted-foreground">Kelola jenis tagihan dan nominal default untuk pembayaran sekolah.</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Jenis Tagihan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="gemini-page-title">Buat Jenis Tagihan Baru</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateFeeType}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kode *</Label>
                  <Input 
                    value={newFeeType.code}
                    onChange={(e) => setNewFeeType({...newFeeType, code: e.target.value})}
                    placeholder="SPP" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nama Jenis *</Label>
                  <Input 
                    value={newFeeType.name}
                    onChange={(e) => setNewFeeType({...newFeeType, name: e.target.value})}
                    placeholder="SPP/UangGedung/Biaya Buku/Lainnya" 
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nominal Default (IDR) *</Label>
                  <Input 
                    type="number"
                    value={newFeeType.default_amount}
                    onChange={(e) => setNewFeeType({...newFeeType, default_amount: e.target.value})}
                    placeholder="500000" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipe Pengulangan</Label>
                  <Select 
                    value={newFeeType.recurring_type}
                    onValueChange={(value: 'once' | 'monthly' | 'yearly') => 
                      setNewFeeType({...newFeeType, recurring_type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Sekali Bayar</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea 
                  value={newFeeType.description}
                  onChange={(e) => setNewFeeType({...newFeeType, description: e.target.value})}
                  placeholder="Deskripsi tambahan tentang jenis tagihan ini..."
                  className="min-h-20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-active"
                  checked={newFeeType.is_active}
                  onCheckedChange={(checked) => setNewFeeType({...newFeeType, is_active: checked})}
                />
                <Label htmlFor="is-active">Aktifkan jenis tagihan ini</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <><RefreshCcw className="animate-spin mr-2 h-4 w-4" /><Save className="mr-2 h-4 w-4 animate-pulse" /> Menyimpan...</>
                ) : <><Save className="mr-2 h-4 w-4" />Simpan Jenis Tagihan</>}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Daftar Jenis Tagihan ({feeTypes.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Nominal Default</TableHead>
                  <TableHead>Tipe Pengulangan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeTypes.map((fee: FeeType) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-mono font-medium">{fee.code}</TableCell>
                    <TableCell>
                      {editingId === fee.id ? (
                        <Input 
                          value={editFeeType.name}
                          onChange={(e) => setEditFeeType({...editFeeType, name: e.target.value})}
                          className="w-48"
                        />
                      ) : (
                        fee.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === fee.id ? (
                        <Input 
                          type="number"
                          value={editFeeType.default_amount}
                          onChange={(e) => setEditFeeType({...editFeeType, default_amount: e.target.value})}
                          className="w-32"
                        />
                      ) : (
                        formatRupiah(fee.default_amount)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === fee.id ? (
                        <Select 
                          value={editFeeType.recurring_type}
                          onValueChange={(value: 'once' | 'monthly' | 'yearly') => 
                            setEditFeeType({...editFeeType, recurring_type: value})
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Sekali</SelectItem>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary">
                          {fee.recurring_type === 'once' ? 'Sekali Bayar' : 
                           fee.recurring_type === 'monthly' ? 'Bulanan' : 'Tahunan'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === fee.id ? (
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={editFeeType.is_active}
                            onCheckedChange={(checked) => setEditFeeType({...editFeeType, is_active: checked})}
                          />
                        </div>
                      ) : (
                        <Badge variant={fee.is_active ? 'default' : 'outline'}>
                          {fee.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === fee.id ? (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateFeeType(fee.id)}
                              disabled={updateMutation.isPending}
                            >
                              Simpan
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Batal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditClick(fee)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Dialog open={deleteDialogOpen === fee.id} onOpenChange={(open) => setDeleteDialogOpen(open ? fee.id : null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                </DialogHeader>
                                <p className="text-sm text-muted-foreground">
                                  Apakah Anda yakin ingin menghapus jenis tagihan "{fee.name}"? Tindakan ini tidak dapat dibatalkan.
                                </p>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                                    Batal
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleDeleteFeeType(fee.id)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    {deleteMutation.isPending ? (
                                      <RefreshCcw className="animate-spin h-4 w-4 mr-2" />
                                    ) : null}
                                    Hapus
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {feeTypes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada jenis tagihan yang dibuat
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}