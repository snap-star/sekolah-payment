import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { mockApi } from '../mock/api';
import { Pencil, RefreshCcw, Trash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

export default function UserAdminPage() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => mockApi.getUserAdmin() });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Manajemen User Admin</h2>
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
        <CardHeader>
          <CardTitle className="text-base font-bold">Daftar User Admin</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow
              className="text-sm"
              >
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terakhir Login</TableHead>
                <TableHead>Aksi</TableHead>
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
                  <TableCell className="text-xs text-muted-foreground">
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                      <span className="ml-2 text-sm">Edit</span>
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4" />
                      <span className="ml-2 text-sm">Delete</span>
                    </Button>
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