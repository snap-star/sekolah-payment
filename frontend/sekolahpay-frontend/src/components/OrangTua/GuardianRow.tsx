import type { StudentGuardian } from "@/types/server/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";

// Guardian Row component that can safely use hooks
interface GuardianRowProps {
  guardian: StudentGuardian;
  onEdit: (guardian: StudentGuardian) => void;
  onDelete: (guardian: StudentGuardian) => void;
  getRelationBadge: (guardian: StudentGuardian) => React.JSX.Element;
  index: number;
  currentPage: number;
  perPage: number;
}

export const GuardianRow = ({ index, guardian, onEdit, onDelete, getRelationBadge, perPage, currentPage }: GuardianRowProps) => {
  const rowNumber = (currentPage - 1) * perPage + index + 1;
  return (
    <TableRow key={guardian.id}>
      <TableCell className="font-mono text-xs">{rowNumber}</TableCell>
      <TableCell className="font-medium">{guardian.student?.name || '-'}</TableCell>
      <TableCell className="font-mono text-xs">{guardian.student?.nis || '-'}</TableCell>
      <TableCell className="font-medium">{guardian.name}</TableCell>
      <TableCell className="text-xs">{guardian.phone || '-'}</TableCell>
      <TableCell>{getRelationBadge(guardian)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(guardian)}
          >
            <Pencil className="h-4 w-4" />
            <span className="ml-2 text-sm">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(guardian)}
          >
            <Trash className="h-4 w-4" />
            <span className="ml-2 text-sm">Hapus</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};