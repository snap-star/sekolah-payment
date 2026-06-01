import { z } from 'zod';
import { initTRPC } from '@trpc/server';

// Initialize tRPC
const t = initTRPC.create();

// ============================================================================
// Shared Types & Schemas
// ============================================================================

/**
 * User role enum based on Laravel User model
 */
export const UserRoleSchema = z.enum([
  'admin',
  'bendahara',
  'guru',
  'student',
  'guardian'
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * Authenticated user schema
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
});
export type User = z.infer<typeof UserSchema>;

/**
 * Generic API response schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema.optional(),
  });

// ============================================================================
// Auth Module Types
// ============================================================================

/**
 * Login input schema
 */
export const LoginInputSchema = z.object({
  email: z.string().email('Email harus valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

/**
 * Token response schema from Laravel backend
 */
export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().int().positive(),
  user: UserSchema,
});
export type TokenResponse = z.infer<typeof TokenResponseSchema>;

/**
 * Login response schema
 */
export const LoginResponseSchema = TokenResponseSchema;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * Me response schema
 */
export const MeResponseSchema = UserSchema;
export type MeResponse = z.infer<typeof MeResponseSchema>;

/**
 * Logout response schema
 */
export const LogoutResponseSchema = z.object({
  message: z.string(),
});
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;

/**
 * Refresh token response schema
 */
export const RefreshTokenResponseSchema = TokenResponseSchema;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

/**
 * Admin test response schema
 */
export const AdminTestResponseSchema = z.object({
  message: z.string(),
});
export type AdminTestResponse = z.infer<typeof AdminTestResponseSchema>;

/**
 * Finance test response schema
 */
export const FinanceTestResponseSchema = z.object({
  message: z.string(),
});
export type FinanceTestResponse = z.infer<typeof FinanceTestResponseSchema>;

// ============================================================================
// Invoice / Tagihan Types (based on mock data and Laravel models)
// ============================================================================

/**
 * Student info schema for invoices
 */
export const StudentInfoSchema = z.object({
  nama: z.string(),
  nis: z.string(),
  kelas: z.string(),
});
export type StudentInfo = z.infer<typeof StudentInfoSchema>;

/**
 * Invoice status enum
 */
export const InvoiceStatusSchema = z.enum([
  'lunas',
  'menunggak',
  'belum_lunas'
]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

/**
 * Invoice schema
 */
export const InvoiceSchema = z.object({
  id: z.number().int().positive(),
  siswa: StudentInfoSchema,
  jenis: z.string(),
  nominal_asli: z.number().int().positive(),
  nominal_disesuaikan: z.number().int().positive(),
  periode: z.string(),
  status: InvoiceStatusSchema,
  qris_string: z.string().nullable(),
  qris_expiry: z.string().nullable(),
  dibayar_pada: z.string().nullable(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

/**
 * Payment history schema
 */
export const PaymentHistorySchema = z.object({
  tanggal: z.string(),
  nominal: z.number().int().positive(),
  metode: z.string(),
  ref: z.string(),
});
export type PaymentHistory = z.infer<typeof PaymentHistorySchema>;

/**
 * Report item schema
 */
export const ReportItemSchema = z.object({
  id: z.number().int().positive(),
  siswa: StudentInfoSchema,
  jenis_tagihan: z.string(),
  periode: z.string(),
  nominal_tagihan: z.number().int().positive(),
  total_dibayar: z.number().int().min(0),
  kekurangan_bayar: z.number().int().min(0),
  status: InvoiceStatusSchema,
  riwayat_pembayaran: z.array(PaymentHistorySchema),
});
export type ReportItem = z.infer<typeof ReportItemSchema>;

/**
 * Report summary schema
 */
export const ReportSummarySchema = z.object({
  total_tagihan_keseluruhan: z.number().int().positive(),
  total_terbayar: z.number().int().min(0),
  total_kekurangan: z.number().int().min(0),
  persentase_pembayaran: z.number().min(0).max(100),
});
export type ReportSummary = z.infer<typeof ReportSummarySchema>;

/**
 * Report response schema
 */
export const ReportResponseSchema = z.object({
  reports: z.array(ReportItemSchema),
  summary: ReportSummarySchema,
});
export type ReportResponse = z.infer<typeof ReportResponseSchema>;

/**
 * Get invoices response schema
 */
export const GetInvoicesResponseSchema = z.object({
  tagihan: z.array(InvoiceSchema),
});
export type GetInvoicesResponse = z.infer<typeof GetInvoicesResponseSchema>;

// ============================================================================
// tRPC Router Definition
// ============================================================================

export const appRouter = t.router({
  // Auth procedures
  auth: t.router({
    login: t.procedure
      .input(LoginInputSchema)
      .output(LoginResponseSchema)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mutation(async ({ input }) => {
        // This implementation is for type definition only
        // Actual implementation would call the Laravel API
        throw new Error('Use apiClient to call the actual backend');
      }),

    me: t.procedure
      .output(MeResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    refresh: t.procedure
      .output(RefreshTokenResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    logout: t.procedure
      .output(LogoutResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    adminTest: t.procedure
      .output(AdminTestResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    financeTest: t.procedure
      .output(FinanceTestResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
  }),

  // Invoice procedures
  invoices: t.router({
    getAll: t.procedure
      .output(GetInvoicesResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
  }),

  // Report procedures
  reports: t.router({
    getReport: t.procedure
      .output(ReportResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
  }),
});

// Export router type for client usage
export type AppRouter = typeof appRouter;