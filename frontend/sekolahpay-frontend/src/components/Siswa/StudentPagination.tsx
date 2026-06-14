import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

interface StudentPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function StudentPagination({ meta, onPageChange }: StudentPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-self-auto mt-4 pt-4 border-t gap-4">
      <div className="text-xs text-muted-foreground">
        Halaman {meta.current_page} dari {meta.last_page} • Total: {meta.total} Siswa
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (meta.current_page > 1) {
                  onPageChange(meta.current_page - 1);
                }
              }}
              className={meta.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              text="Sebelumnya"
            />
          </PaginationItem>
          {Array.from({ length: meta.last_page }, (_, i) => i + 1)
            .filter((page) => {
              if (page === 1 || page === meta.last_page) return true;
              if (page >= meta.current_page - 1 && page <= meta.current_page + 1) return true;
              return false;
            })
            .map((page, index, array) => {
              if (index > 0 && page - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(page);
                        }}
                        isActive={page === meta.current_page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                );
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={page === meta.current_page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (meta.current_page < meta.last_page) {
                  onPageChange(meta.current_page + 1);
                }
              }}
              className={meta.current_page === meta.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
              text="Berikutnya"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}