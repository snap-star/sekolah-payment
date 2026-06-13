import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/useApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Pencil, RefreshCcw, Trash, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useMemo } from 'react';
import type { CreateUserInput, AdminUser, UserRole } from '@/types/server/api';

// Role options that match the UserRole schema with Indonesian labels
const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'bendahara', label: 'Bendahara' },
  { value: 'guru', label: 'Guru' },
  { value: 'student', label: 'Siswa' },
  { value: 'guardian', label: 'Orang Tua/Wali' },
];

export default function UserAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // API parameters
  const apiParams = useMemo(() => ({
    page: currentPage,
    perPage: itemsPerPage,
    search: searchQuery || undefined
  }), [currentPage, searchQuery]);

  // Use the real useUsers hook
  const { data, isLoading } = useUsers(apiParams);
  const createUserMutation = useCreateUser({
    onSuccess: () => {
      toast.success('User berhasil ditambahkan!');
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error('Gagal menambahkan user. Silakan coba lagi.');
    }
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success('User berhasil dihapus!');
    },
    onError: () => {
      toast.error('Gagal menghapus user. Silakan coba lagi.');
    }
  });

  const [progress, setProgress] = useState(0);
  const [newUserForm, setNewUserForm] = useState<Omit<CreateUserInput, 'role'> & { role: string }>({
    name: '',
    email: '',
    no_hp: '',
    role: '',
    password: ''
  });

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

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.no_hp || !newUserForm.role || !newUserForm.password) {
      toast.error('Semua field harus diisi!');
      return;
    }
    
    createUserMutation.mutate(newUserForm as CreateUserInput);
    // Reset form
    setNewUserForm({
      name: '',
      email: '',
      no_hp: '',
      role: '',
      password: ''
    });
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      deleteUserMutation.mutate(id);
    }
  };

  if (isLoading || progress < 100) return (
    <div className="p-4 select-none flex flex-col gap-4 items-center justify-center min-h-[60vh]">
      <RefreshCcw className="animate-spin mr-2 inline-block h-8 w-8 text-primary" />
      <Label htmlFor="progress" className="text-2xl font-semibold">Memuat data user ...</Label>
      <div className="w-80 mt-2">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-center text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );

  const displayRoles = data?.roles || roleOptions;
  const users = data?.data || [];
  const totalItems = data?.meta?.total || users.length;
  // const totalPages = data?.meta?.last_page || Math.ceil(users.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Manajemen User Admin</h2>
          <p className="text-muted-foreground">Kelola akses guru, bendahara, dan operator.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild><Button>Tambah User</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Admin Baru</DialogTitle>
              <DialogDescription>
                Isi informasi user baru di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateUser}>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  type="text"
                  autoComplete="off"
                  placeholder="Nama Lengkap"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  autoComplete="off"
                  placeholder="Email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_hp">No. HP</Label>
                <Input 
                  id="no_hp" 
                  type="tel"
                  autoComplete="off"
                  maxLength={12}
                  pattern="[0-9]{12}"
                  placeholder="081234567890" 
                  value={newUserForm.no_hp}
                  onChange={(e) => setNewUserForm({...newUserForm, no_hp: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  autoComplete="off"
                  value={newUserForm.role} 
                  onValueChange={(value) => setNewUserForm({...newUserForm, role: value})}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {displayRoles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  autoComplete="off"
                  placeholder="Password"
                  minLength={8}
                  maxLength={20}
                  pattern="[a-zA-Z0-9#@!%*()\\-+=,./[\\]_`{|}~]{8,20}"
                  aria-autoComplete="off"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                  required 
                />
              </div>
              <Button 
                type="submit"
                id="submit-btn"
                className="w-full" 
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-base font-bold">Daftar User Admin</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {totalItems} user
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead className="w-12">#</TableHead>
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
              {users.map((u: AdminUser, index: number) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="font-medium">{u.nama || u.name}</TableCell>
                  <TableCell className="text-xs">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {roleOptions.find(r => r.value === u.role)?.label || u.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{u.no_hp}</TableCell>
                  <TableCell>
                    <Badge variant={u.aktif ? 'default' : 'secondary'}>
                      {u.aktif ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {u.terakhir_login || '-'}
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                      <span className="ml-2 text-sm">Edit</span>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={deleteUserMutation.isPending}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="ml-2 text-sm">Hapus</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Tidak ada user yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}