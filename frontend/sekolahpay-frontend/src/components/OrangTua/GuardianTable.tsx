import { GuardianRow } from './GuardianRow';
import { getRelationBadge } from './getRelationBadge';
import type { StudentGuardian } from '@/types/server/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GuardianTableProps {
  paginatedGuardians: StudentGuardian[];
  currentPage: number;
  perPage: number;
  totalPages: number;
  filteredGuardians: StudentGuardian[];
  handlePageChange: (page: number) => void;
  onEdit: (guardian: StudentGuardian) => void;
  onDelete: (guardian: StudentGuardian) => void;
}

export function GuardianTable({
  paginatedGuardians,
  currentPage,
  perPage,
  totalPages,
  filteredGuardians,
  handlePageChange,
  onEdit,
  onDelete,
}: GuardianTableProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base font-bold">Daftar Orang Tua/Wali</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead>No.</TableHead>
              <TableHead>Siswa</TableHead>
              <TableHead>NIS Siswa</TableHead>
              <TableHead>Nama Wali</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Hubungan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGuardians.map((guardian, index) => (
              <GuardianRow
                key={guardian.id}
                index={index}
                guardian={guardian}
                perPage={perPage}
                currentPage={currentPage}
                onEdit={onEdit}
                onDelete={onDelete}
                getRelationBadge={getRelationBadge}
              />
            ))}
            {paginatedGuardians.length === 0 && (
              <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Belum ada data wali/orang tua
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-self-auto mt-4 pt-4 border-t gap-4">
            <div className="text-xs text-muted-foreground">
              Halaman {currentPage} dari {totalPages} • Total: {filteredGuardians.length} Wali/Orang Tua
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    text="Sebelumnya"
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    text="Selanjutnya"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}