import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CreateUserDialogProps } from './types';

export function CreateUserDialog({
  isOpen,
  onOpenChange,
  newUserForm,
  setNewUserForm,
  onSubmit,
  isPending,
  roleOptions,
  resetForm
}: CreateUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Admin Baru</DialogTitle>
          <DialogDescription>
            Isi informasi user baru di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
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
                {roleOptions.map((r) => (
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
            disabled={isPending}
          >
            {isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}