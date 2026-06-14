import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRow } from './UserRow';
import type { UserTableProps } from './types';

export function UserTable({
  users,
  currentPage,
  itemsPerPage,
  searchQuery,
  onSearchChange,
  totalItems,
  roleOptions,
  isDeletePending,
  onDelete
}: UserTableProps) {
  return (
    <Card className="border-border">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base font-bold">Daftar User Admin</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari user..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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
            {users.map((u, index) => (
              <UserRow
                key={u.id}
                user={u}
                index={index}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                roleOptions={roleOptions}
                isDeletePending={isDeletePending}
                onDelete={onDelete}
              />
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
  );
}