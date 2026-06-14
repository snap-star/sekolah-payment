import { Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { UserRowProps } from './types';

export function UserRow({
  user,
  index,
  currentPage,
  itemsPerPage,
  roleOptions,
  isDeletePending,
  onDelete
}: UserRowProps) {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
      <TableCell className="font-medium">{user.nama || user.name}</TableCell>
      <TableCell className="text-xs">{user.email}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {roleOptions.find(r => r.value === user.role)?.label || user.role.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="text-xs">{user.no_hp}</TableCell>
      <TableCell>
        <Badge variant={user.aktif ? 'default' : 'secondary'}>
          {user.aktif ? 'Aktif' : 'Nonaktif'}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {user.terakhir_login || '-'}
      </TableCell>
      <TableCell className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
          <span className="ml-2 text-sm">Edit</span>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(user.id)}
          disabled={isDeletePending}
        >
          <Trash className="h-4 w-4" />
          <span className="ml-2 text-sm">Hapus</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}