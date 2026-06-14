import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TableCell, TableRow } from '@/components/ui/table';
import type { FeeTypeRowProps } from './types';

export function FeeTypeRow({
  fee,
  isEditing,
  editFeeType,
  setEditFeeType,
  onEdit,
  onUpdate,
  onCancelEdit,
  isUpdatePending,
  isDeletePending,
  formatRupiah,
  setDeleteDialogOpen
}: FeeTypeRowProps) {
  return (
    <TableRow key={fee.id}>
      <TableCell className="font-mono font-medium">{fee.code}</TableCell>
      <TableCell>
        {isEditing ? (
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
        {isEditing ? (
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
        {isEditing ? (
          <Select 
            value={editFeeType.recurring_type}
            onValueChange={(value: 'once' | 'monthly' | 'yearly') => 
              setEditFeeType({...editFeeType, recurring_type: value})
            }
          >
            <SelectTrigger className="w-32">
              <span>{editFeeType.recurring_type === 'once' ? 'Sekali' : editFeeType.recurring_type === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
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
        {isEditing ? (
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
          {isEditing ? (
            <>
              <Button 
                size="sm"
                onClick={() => onUpdate(fee.id)}
                disabled={isUpdatePending}
              >
                Simpan
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onCancelEdit}
              >
                Batal
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(fee)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                disabled={isDeletePending}
                onClick={() => setDeleteDialogOpen(fee.id)}
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}