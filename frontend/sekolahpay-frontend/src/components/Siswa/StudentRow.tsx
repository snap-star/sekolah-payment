import type { Student } from "@/types/server/api";
import { TableCell, TableRow } from "../ui/table";
import { useStudentGuardians } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";


// Student Row component that can safely use hooks
interface StudentRowProps {
  student: Student;
  index: number;
  currentPage: number;
  perPage: number;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  getGenderLabel: (gender: string) => string;
  getStatusBadge: (status: string) => React.JSX.Element;
}

/**
   * StudentRow component - displays individual student data in a table row
   * Fixed duplicate guardian fetch error by ensuring proper API usage
   * The duplicate error was caused by outdated API method signatures; now using the centralized parent API
   */
export const StudentRow = ({ student, index, currentPage, perPage, onEdit, onDelete, getGenderLabel, getStatusBadge }: StudentRowProps) => {
  // Get guardians for this specific student - hooks work here because it's a component
  // This uses useStudentGuardians which internally calls apiClient.students.getGuardians()
  // The getGuardians method is a convenience wrapper around apiClient.parent.getAll() with student_id filter
  const { data: guardiansData, isLoading: guardiansLoading } = useStudentGuardians(student.id, { perPage: 100 });
  
  // Client-side filtering: ensure we only get guardians that belong to THIS student
  // Fix for backend not applying student_id filter - mitigates the issue without backend changes
  const studentGuardians = guardiansData?.data?.filter(guardian => guardian.student.id === student.id) || [];
  
  // Get the first guardian (primary guardian) from the filtered array
  const primaryGuardian = studentGuardians[0];
  console.log(`Filtered guardians for student ${student.id} (${student.name}):`, studentGuardians);
  console.log(`Raw API response (all guardians):`, guardiansData);
  // Calculate the correct row number based on pagination
  const rowNumber = (currentPage - 1) * perPage + index + 1;

  return (
    <TableRow key={student.id}>
      <TableCell className="font-mono text-xs">{rowNumber}</TableCell>
      <TableCell className="font-mono text-xs">{student.nis}</TableCell>
      <TableCell className="font-mono text-xs">{student.nisn || '-'}</TableCell>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell className="text-xs">{getGenderLabel(student.gender)}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {student.birth_date ? new Date(student.birth_date).toLocaleDateString('id-ID') : '-'}
      </TableCell>
      <TableCell>{getStatusBadge(student.status)}</TableCell>
      <TableCell className="text-xs">
        {guardiansLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : primaryGuardian ? (
          <div className="flex flex-col items-start gap-1">
            <div className="font-medium">{primaryGuardian.name}</div>
            <div className="flex items-center gap-1">
              <Badge className="text-muted-foreground" variant="secondary">
                {primaryGuardian.relation || '-'}
              </Badge>
              <span className="text-muted-foreground">{primaryGuardian.phone || '-'}</span>
            </div>
            {studentGuardians.length > 1 && (
              <Badge variant="outline" className="text-xs">
                +{studentGuardians.length - 1} lainnya
              </Badge>
            )}
          </div>
        ) : '-'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(student)}
          >
            <Pencil className="h-4 w-4" />
            <span className="ml-2 text-sm">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(student)}
          >
            <Trash className="h-4 w-4" />
            <span className="ml-2 text-sm">Hapus</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};