import type { AdminUser, UserRole } from '@/types/server/api';

export type NewUserForm = {
  name: string;
  email: string;
  no_hp: string;
  role: string;
  password: string;
};

export type UserRowProps = {
  user: AdminUser;
  index: number;
  currentPage: number;
  itemsPerPage: number;
  roleOptions: { value: UserRole; label: string }[];
  isDeletePending: boolean;
  onDelete: (id: number) => void;
};

export type UserTableProps = {
  users: AdminUser[];
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalItems: number;
  roleOptions: { value: UserRole; label: string }[];
  isDeletePending: boolean;
  onDelete: (id: number) => void;
};

export type PageHeaderProps = {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
};

export type CreateUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUserForm: NewUserForm;
  setNewUserForm: (form: NewUserForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  roleOptions: { value: UserRole; label: string }[];
  resetForm: () => void;
};

export type LoadingStateProps = {
  progress: number;
};