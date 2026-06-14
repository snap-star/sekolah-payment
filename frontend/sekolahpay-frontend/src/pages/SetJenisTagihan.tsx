import { DeleteFeeTypeDialog } from '../components/setJenisTagihan/DeleteFeeTypeDialog';
import { FeeTypeTable } from '../components/setJenisTagihan/FeeTypeTable';
import { LoadingState } from '../components/setJenisTagihan/LoadingState';
import { PageHeader } from '../components/setJenisTagihan/PageHeader';
import { useSetJenisTagihanPage } from '../components/setJenisTagihan/SetJenisTagihanHandler';

export default function SetJenisTagihanPage() {
  const {
    // States
    createDialogOpen,
    setCreateDialogOpen,
    editingId,
    deleteDialogOpen,
    setDeleteDialogOpen,
    newFeeType,
    setNewFeeType,
    editFeeType,
    setEditFeeType,
    
    // Loading states
    isLoading,
    progress,
    
    // Data
    feeTypes,
    
    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
    
    // Helpers
    resetCreateForm,
    formatRupiah,
    
    // Handlers
    handleCreateFeeType,
    handleEditClick,
    handleUpdateFeeType,
    handleDeleteFeeType,
    cancelEdit
  } = useSetJenisTagihanPage();

  // Get currently selected fee for delete dialog
  const selectedFee = feeTypes.find(fee => fee.id === deleteDialogOpen);
  
  if (isLoading || progress < 100) {
    return <LoadingState progress={progress} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Create Fee Type Dialog */}
      <PageHeader
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        newFeeType={newFeeType}
        setNewFeeType={setNewFeeType}
        onSubmit={handleCreateFeeType}
        isCreatePending={createMutation.isPending}
        resetForm={resetCreateForm}
      />

      {/* Delete Fee Type Dialog */}
      <DeleteFeeTypeDialog
        isOpen={!!deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open ? deleteDialogOpen : null)}
        fee={selectedFee}
        onSubmit={() => selectedFee && handleDeleteFeeType(selectedFee.id)}
        isPending={deleteMutation.isPending}
        resetForm={() => setDeleteDialogOpen(null)}
      />

      {/* Main Fee Type Table */}
      <FeeTypeTable
        feeTypes={feeTypes}
        editingId={editingId}
        editFeeType={editFeeType}
        setEditFeeType={setEditFeeType}
        onEdit={handleEditClick}
        onUpdate={handleUpdateFeeType}
        onCancelEdit={cancelEdit}
        isUpdatePending={updateMutation.isPending}
        isDeletePending={deleteMutation.isPending}
        formatRupiah={formatRupiah}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
    </div>
  );
}