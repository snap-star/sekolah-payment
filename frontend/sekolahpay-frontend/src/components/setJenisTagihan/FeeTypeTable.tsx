import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { FeeType } from '@/types/server/api';
import { FeeTypeRow } from './FeeTypeRow';
import type { EditFeeType } from './types';

interface FeeTypeTableProps {
  feeTypes: FeeType[];
  editingId: number | null;
  editFeeType: EditFeeType;
  setEditFeeType: (fee: EditFeeType) => void;
  onEdit: (fee: FeeType) => void;
  onUpdate: (id: number) => void;
  onCancelEdit: () => void;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  formatRupiah: (n: number) => string;
  setDeleteDialogOpen: (id: number | null) => void;
}

export function FeeTypeTable({
  feeTypes,
  editingId,
  editFeeType,
  setEditFeeType,
  onEdit,
  onUpdate,
  onCancelEdit,
  isUpdatePending,
  isDeletePending,
  formatRupiah,
  setDeleteDialogOpen
}: FeeTypeTableProps) {
  return (
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
                <FeeTypeRow
                  key={fee.id}
                  fee={fee}
                  isEditing={editingId === fee.id}
                  editFeeType={editFeeType}
                  setEditFeeType={setEditFeeType}
                  onEdit={onEdit}
                  onUpdate={onUpdate}
                  onCancelEdit={onCancelEdit}
                  isUpdatePending={isUpdatePending}
                  isDeletePending={isDeletePending}
                  formatRupiah={formatRupiah}
                  setDeleteDialogOpen={setDeleteDialogOpen}
                />
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
  );
}