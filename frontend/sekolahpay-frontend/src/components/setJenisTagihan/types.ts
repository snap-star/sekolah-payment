import type { FeeType } from '@/types/server/api';

export type NewFeeType = {
  code: string;
  name: string;
  default_amount: string;
  recurring_type: 'once' | 'monthly' | 'yearly';
  description: string;
  is_active: boolean;
};

export type EditFeeType = {
  name: string;
  default_amount: string;
  recurring_type: 'once' | 'monthly' | 'yearly';
  description: string;
  is_active: boolean;
};

export type FeeTypeRowProps = {
  fee: FeeType;
  isEditing: boolean;
  editFeeType: EditFeeType;
  setEditFeeType: (fee: EditFeeType) => void;
  onEdit: (fee: FeeType) => void;
  onUpdate: (id: number) => void;
  onCancelEdit: () => void;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  formatRupiah: (n: number) => string;
  setDeleteDialogOpen: (id: number | null) => void;
};

export type DeleteFeeTypeDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fee: FeeType | undefined;
  onSubmit: () => void;
  isPending: boolean;
  resetForm: () => void;
};