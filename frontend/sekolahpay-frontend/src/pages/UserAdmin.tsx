import { Dialog, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { LoadingState } from '../components/userAdmin/LoadingState';
import { UserTable } from '../components/userAdmin/UserTable';
import { CreateUserDialog } from '../components/userAdmin/CreateUserDialog';
import { useUserAdminPage } from '../components/userAdmin/UserAdminHandler';

export default function UserAdminPage() {
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    itemsPerPage,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isLoading,
    progress,
    newUserForm,
    setNewUserForm,
    createUserMutation,
    deleteUserMutation,
    handleCreateUser,
    handleDeleteUser,
    resetForm,
    users,
    totalItems,
    roleOptions
  } = useUserAdminPage();

  if (isLoading || progress < 100) {
    return <LoadingState progress={progress} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gemini-page-title">Manajemen User Admin</h2>
          <p className="text-muted-foreground">Kelola akses guru, bendahara, dan operator.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Tambah User</Button>
          </DialogTrigger>
          <CreateUserDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            newUserForm={newUserForm}
            setNewUserForm={setNewUserForm}
            onSubmit={handleCreateUser}
            isPending={createUserMutation.isPending}
            roleOptions={roleOptions}
            resetForm={resetForm}
          />
        </Dialog>
      </div>

      <UserTable
        users={users}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalItems={totalItems}
        roleOptions={roleOptions}
        isDeletePending={deleteUserMutation.isPending}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}