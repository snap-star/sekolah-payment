import type { Student } from '@/types/server/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StudentRow } from './StudentRow';
import { getStatusBadge, getGenderLabel } from './StudentBadge';
import { StudentPagination } from './StudentPagination';

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

interface StudentTableProps {
  students: Student[];
  meta?: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTable({
  students,
  meta,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
}: StudentTableProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base font-bold">Daftar Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead>No.</TableHead>
              <TableHead>NIS</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>JK</TableHead>
              <TableHead>Tanggal Lahir</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orang Tua/Wali</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <StudentRow
                key={student.id}
                student={student}
                index={index}
                currentPage={currentPage}
                perPage={10}
                onEdit={onEdit}
                onDelete={onDelete}
                getGenderLabel={getGenderLabel}
                getStatusBadge={getStatusBadge}
              />
            ))}
            
            {(!students || students.length === 0) && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Belum ada data siswa
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {meta && <StudentPagination meta={meta} onPageChange={onPageChange} />}
      </CardContent>
    </Card>
  );
}