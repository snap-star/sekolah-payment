import { Card } from '@/components/ui/card';
import { useReportPage } from '@/components/Report/ReportHandler';
import { LoadingState } from '@/components/Report/LoadingState';
import { SummaryCards } from '@/components/Report/SummaryCards';
import { PageHeader } from '@/components/Report/PageHeader';
import { ReportTable } from '@/components/Report/ReportTable';

export default function ReportPage() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    isLoading,
    progress,
    summary,
    processedData,
    totalPages,
    totalItems,
    startNumber,
    formatRupiah,
    handleSort
  } = useReportPage();

  if (isLoading || progress < 100) {
    return <LoadingState progress={progress} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="gemini-page-title">Laporan Pembayaran</h2>
        <p className="text-muted-foreground">Rekapitulasi tagihan, pembayaran, dan kekurangan.</p>
      </div>

      <SummaryCards summary={summary} formatRupiah={formatRupiah} />

      <Card className="border-border">
        <PageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <ReportTable
          invoices={processedData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startNumber={startNumber}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          formatRupiah={formatRupiah}
        />
      </Card>
    </div>
  );
}