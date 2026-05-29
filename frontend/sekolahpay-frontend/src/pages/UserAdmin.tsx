import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { mockApi } from '@/mock/api';

export default function UserAdminPage() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => mockApi.getUserAdmin() });

  if (isLoading) return <div>Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen User Admin</h2>
          <p className="text-muted-foreground">Kelola akses guru, bendahara, dan operator.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button>Tambah User</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Tambah Admin Baru</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Demo: User ditambahkan'); }}>
              <div className="space-y-2"><Label>Nama Lengkap</Label><Input /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" /></div>
              <div className="space-y-2"><Label>No. HP</Label><Input placeholder="081234567890" /></div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Pilih role" /></SelectTrigger>
                  <SelectContent>
                    {data!.roles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" /></div>
              <Button type="submit" className="w-full">Simpan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader><CardTitle className="text-sm font-medium">Daftar User Admin</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terakhir Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data!.users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nama}</TableCell>
                  <TableCell className="text-xs">{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{u.role.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-xs">{u.no_hp}</TableCell>
                  <TableCell>
                    <Badge variant={u.aktif ? 'default' : 'secondary'}>{u.aktif ? 'Aktif' : 'Nonaktif'}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.terakhir_login}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}