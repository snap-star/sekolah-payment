import { DeleteInvoiceDialog } from '../components/Tagihan/DeleteInvoiceDialog';
import { InvoiceTable } from '../components/Tagihan/InvoiceTable';
import { LoadingState } from '../components/Tagihan/LoadingState';
import { PageHeader } from '../components/Tagihan/PageHeader';
import { SearchFilterBar } from '../components/Tagihan/SearchFilterBar';
import { useTagihanPage } from '../components/Tagihan/TagihanHandler';

export default function TagihanPage() {
  const {
    // States
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createDialogOpen,
    setCreateDialogOpen,
    newInvoice,
    setNewInvoice,
    editingId,
    editDueDate,
    setEditDueDate,
    deleteDialogOpen,
    setDeleteDialogOpen,
    
    // Loading states
    isLoading,
    progress,
    
    // Data
    invoices,
    students,
    feeTypes,
    schoolYears,
    paginationMeta,
    pageNumbers,
    
    // Mutations
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Handlers
    resetCreateForm,
    resetFilters,
    handleCreateInvoice,
    handleUpdateDueDate,
    handleDeleteInvoice,
    handleFeeTypeChange,
    openEditDialog,
    openDeleteDialog,
    getStatusBadge,
    formatRupiah
  } = useTagihanPage();

  // Get the currently selected invoice for delete dialog
  const selectedInvoice = invoices.find(inv => inv.id === deleteDialogOpen);
  
  if (isLoading || progress < 100) {
    return <LoadingState progress={progress} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Create Invoice Dialog */}
      <PageHeader
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        newInvoice={newInvoice}
        setNewInvoice={setNewInvoice}
        handleCreateInvoice={handleCreateInvoice}
        students={students}
        feeTypes={feeTypes}
        schoolYears={schoolYears}
        handleFeeTypeChange={handleFeeTypeChange}
        isCreatePending={createInvoice.isPending}
        resetForm={resetCreateForm}
        formatRupiah={formatRupiah}
      />

      {/* Search and Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setCurrentPage={setCurrentPage}
        resetFilters={resetFilters}
      />

      {/* Delete Invoice Dialog */}
      <DeleteInvoiceDialog
        isOpen={!!deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open ? deleteDialogOpen : null)}
        invoice={selectedInvoice}
        onSubmit={() => selectedInvoice && handleDeleteInvoice(selectedInvoice.id)}
        isPending={deleteInvoice.isPending}
        resetForm={() => setDeleteDialogOpen(null)}
      />

      {/* Main Invoice Table with Pagination */}
      <InvoiceTable
        invoices={invoices}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        paginationMeta={paginationMeta}
        pageNumbers={pageNumbers}
        editingId={editingId}
        editDueDate={editDueDate}
        setEditDueDate={setEditDueDate}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        handleUpdateDueDate={handleUpdateDueDate}
        isUpdatePending={updateInvoice.isPending}
        isDeletePending={deleteInvoice.isPending}
        getStatusBadge={getStatusBadge}
        formatRupiah={formatRupiah}
      />
    </div>
  );
}