import { Plus, RefreshCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { NewFeeType } from './types';

interface PageHeaderProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  newFeeType: NewFeeType;
  setNewFeeType: (fee: NewFeeType) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreatePending: boolean;
  resetForm: () => void;
}

export function PageHeader({
  createDialogOpen,
  setCreateDialogOpen,
  newFeeType,
  setNewFeeType,
  onSubmit,
  isCreatePending,
  resetForm
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="gemini-page-title">Pengaturan Jenis Tagihan</h2>
        <p className="text-muted-foreground">Kelola jenis tagihan dan nominal default untuk pembayaran sekolah.</p>
      </div>
      <Dialog open={createDialogOpen} onOpenChange={(open) => { setCreateDialogOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jenis Tagihan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="gemini-page-title">Buat Jenis Tagihan Baru</DialogTitle>
            <DialogDescription>
              Isi semua field dengan benar untuk membuat jenis tagihan baru.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
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
              disabled={isCreatePending}
            >
              {isCreatePending ? (
                <><RefreshCcw className="animate-spin mr-2 h-4 w-4" /><Save className="mr-2 h-4 w-4 animate-pulse" /> Menyimpan...</>
              ) : <><Save className="mr-2 h-4 w-4" />Simpan Jenis Tagihan</>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}