import type { Invoice } from '@/types/server/api';

export type SortField = 'student.name' | 'amount' | 'paid_amount' | 'remaining_amount' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface Summary {
  total_tagihan_keseluruhan: number;
  total_terbayar: number;
  total_kekurangan: number;
  persentase_pembayaran: number;
}

export { type Invoice };