import { RefreshCcw } from 'lucide-react';
import { useOrangTuaPage } from '../components/OrangTua/OrangTuaHandler';
import { EditGuardianDialog } from '../components/OrangTua/EditGuardianDialog';
import { DeleteGuardianDialog } from '../components/OrangTua/DeleteGuardianDialog';
import { GuardianTable } from '../components/OrangTua/GuardianTable';
import { HeaderActions } from '../components/OrangTua/HeaderActions';

export default function OrangTuaPage() {
  const {
    // States
    currentPage,
    searchQuery,
    setSearchQuery,
    setStudentSearchQuery,
    formData,
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    guardiansLoading,
    
    // Computed values
    filteredStudents,
    filteredGuardians,
    paginatedGuardians,
    totalPages,
    perPage,
    
    // Handlers
    resetForm,
    resetFilters,
    handlePageChange,
    openEditDialog,
    openDeleteDialog,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteSubmit,
    
    // Mutations
    createGuardian,
    updateGuardian,
    deleteGuardian,
  } = useOrangTuaPage();
  
  if (guardiansLoading) return (
    <div className="p-4 select-none flex items-center justify-center h-64">
      <RefreshCcw className="animate-spin mr-2 inline-block h-5 w-5 text-muted-foreground" />
      <span className="select-none">Memuat data wali/orang tua...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header and Filters + Create Dialog Trigger */}
      <HeaderActions
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resetFilters={resetFilters}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        formData={formData}
        setFormData={setFormData}
        handleCreateSubmit={handleCreateSubmit}
        setStudentSearchQuery={setStudentSearchQuery}
        filteredStudents={filteredStudents}
        isCreatePending={createGuardian.isPending}
        resetForm={resetForm}
      />

      {/* Edit Dialog */}
      <EditGuardianDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        isPending={updateGuardian.isPending}
        resetForm={resetForm}
      />

      {/* Delete Dialog */}
      <DeleteGuardianDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSubmit={handleDeleteSubmit}
        isPending={deleteGuardian.isPending}
        resetForm={resetForm}
      />

      {/* Guardian Table with Pagination */}
      <GuardianTable
        paginatedGuardians={paginatedGuardians}
        currentPage={currentPage}
        perPage={perPage}
        totalPages={totalPages}
        filteredGuardians={filteredGuardians}
        handlePageChange={handlePageChange}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />
    </div>
  );
}