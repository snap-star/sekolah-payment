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
  email: z.email(),
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
  email: z.email('Email harus valid'),
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
// Student Module Types
// ============================================================================

/**
 * Student gender enum
 */
export const StudentGenderSchema = z.enum(['L', 'P']);
export type StudentGender = z.infer<typeof StudentGenderSchema>;

/**
 * Student status enum
 */
export const StudentStatusSchema = z.enum(['active', 'inactive', 'graduated']);
export type StudentStatus = z.infer<typeof StudentStatusSchema>;

/**
 * Student schema (matches StudentResource from backend)
 */
export const StudentSchema = z.object({
  id: z.number().int().positive(),
  nis: z.string().max(50),
  nisn: z.string().max(50).nullable(),
  name: z.string().max(255),
  gender: StudentGenderSchema,
  birth_date: z.string().nullable(), // ISO date string
  status: StudentStatusSchema,
  created_at: z.string(), // ISO datetime string
  updated_at: z.string(), // ISO datetime string
});
export type Student = z.infer<typeof StudentSchema>;

/**
 * Pagination metadata schema
 */
export const PaginationMetaSchema = z.object({
  current_page: z.number().int().positive(),
  last_page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().positive(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

/**
 * Get all students response schema
 */
export const GetStudentsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(StudentSchema),
  meta: PaginationMetaSchema,
});
export type GetStudentsResponse = z.infer<typeof GetStudentsResponseSchema>;

/**
 * Create student input schema (matches StoreStudentRequest from backend)
 */
export const CreateStudentInputSchema = z.object({
  nis: z.string().max(50),
  nisn: z.string().max(50).optional().nullable(),
  name: z.string().max(255),
  gender: StudentGenderSchema,
  birth_date: z.string().optional().nullable(),
  status: StudentStatusSchema,
});
export type CreateStudentInput = z.infer<typeof CreateStudentInputSchema>;

/**
 * Update student input schema (matches UpdateStudentRequest from backend)
 */
export const UpdateStudentInputSchema = CreateStudentInputSchema.partial();
export type UpdateStudentInput = z.infer<typeof UpdateStudentInputSchema>;

// ============================================================================
// Student Guardian Module Types (Orang Tua/Wali)
// ============================================================================

/**
 * Student guardian schema (matches StudentGuardianResource from backend)
 * Updated to support both 'relation' and 'relationship' field names from API responses
 * API docs use 'relation' in requests, but some responses return 'relationship'
 */
export const StudentGuardianSchema = z.object({
  id: z.number().int().positive(), // Orang tua wali ID
  student: z.object({
    id: z.number().int().positive(), // Siswa ID
    nis: z.string(),
    name: z.string(),
  }),
  name: z.string().max(255),
  // Support both field names that might come from the backend
  relation: z.string().nullable().optional(), // Ayah, Ibu, Wali, etc. (request field name)
  //relationship: z.string().nullable().optional(), // Alternative response field name
  phone: z.string().max(50).nullable(),
  occupation: z.string().nullable(),
  address: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  isPrimary: z.boolean(),
});
export type StudentGuardian = z.infer<typeof StudentGuardianSchema>;

/**
 * Get all parents/guardians response schema
 */
export const GetParentsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(StudentGuardianSchema),
  meta: PaginationMetaSchema,
});
export type GetParentsResponse = z.infer<typeof GetParentsResponseSchema>;

/**
 * Create guardian input schema
 */
export const CreateStudentGuardianInputSchema = z.object({
  student_id: z.number().int().positive(),
  student_name: z.string().max(255),
  guardian_name: z.string().max(255),
  phone: z.string().max(50),
  relation: z.string().max(100), // Ayah, Ibu, Wali, etc.
  occupation: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});
export type CreateStudentGuardianInput = z.infer<typeof CreateStudentGuardianInputSchema>;

// ============================================================================
// Fee Type Module Types (Jenis Biaya)
// ============================================================================

/**
 * Fee type recurring type enum
 */
export const FeeTypeRecurringSchema = z.enum(['once', 'monthly', 'yearly']);
export type FeeTypeRecurring = z.infer<typeof FeeTypeRecurringSchema>;

/**
 * Fee type schema (matches FeeTypeResource from backend)
 */
export const FeeTypeSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().max(50),
  name: z.string().max(255),
  default_amount: z.number().int().positive(),
  recurring_type: FeeTypeRecurringSchema,
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(), // ISO datetime string
  updated_at: z.string(), // ISO datetime string
});
export type FeeType = z.infer<typeof FeeTypeSchema>;

/**
 * Get all fee types response schema
 */
export const GetFeeTypesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(FeeTypeSchema),
  meta: PaginationMetaSchema,
});
export type GetFeeTypesResponse = z.infer<typeof GetFeeTypesResponseSchema>;

/**
 * Create fee type input schema (matches StoreFeeTypeRequest from backend)
 */
export const CreateFeeTypeInputSchema = z.object({
  code: z.string().max(50),
  name: z.string().max(255),
  default_amount: z.number().int().positive(),
  recurring_type: FeeTypeRecurringSchema,
  description: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});
export type CreateFeeTypeInput = z.infer<typeof CreateFeeTypeInputSchema>;

/**
 * Update fee type input schema (matches UpdateFeeTypeRequest from backend)
 */
export const UpdateFeeTypeInputSchema = CreateFeeTypeInputSchema.partial();
export type UpdateFeeTypeInput = z.infer<typeof UpdateFeeTypeInputSchema>;

/**
 * Single fee type response schema
 */
export const FeeTypeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: FeeTypeSchema,
});
export type FeeTypeResponse = z.infer<typeof FeeTypeResponseSchema>;

/**
 * Delete fee type response schema
 */
export const DeleteFeeTypeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteFeeTypeResponse = z.infer<typeof DeleteFeeTypeResponseSchema>;

/**
 * Update guardian input schema
 */
export const UpdateStudentGuardianInputSchema = CreateStudentGuardianInputSchema.partial();
export type UpdateStudentGuardianInput = z.infer<typeof UpdateStudentGuardianInputSchema>;

/**
 * Get all guardians response schema
 */
export const GetStudentGuardiansResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(StudentGuardianSchema),
  meta: PaginationMetaSchema,
});
export type GetStudentGuardiansResponse = z.infer<typeof GetStudentGuardiansResponseSchema>;

/**
 * Single guardian response schema
 */
export const StudentGuardianResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: StudentGuardianSchema,
});
export type StudentGuardianResponse = z.infer<typeof StudentGuardianResponseSchema>;

// ============================================================================
// Continue Student Module Types
// ============================================================================

/**
 * Single student response schema
 */
export const StudentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: StudentSchema,
});
export type StudentResponse = z.infer<typeof StudentResponseSchema>;

/**
 * Delete student response schema
 */
export const DeleteStudentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteStudentResponse = z.infer<typeof DeleteStudentResponseSchema>;

// ============================================================================
// School Year Types (Tahun Ajaran)
// ============================================================================

/**
 * School year schema (matches SchoolYearResource from backend)
 */
export const SchoolYearSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(255),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type SchoolYear = z.infer<typeof SchoolYearSchema>;

/**
 * Get all school years response schema
 */
export const GetSchoolYearsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(SchoolYearSchema),
  meta: PaginationMetaSchema,
});
export type GetSchoolYearsResponse = z.infer<typeof GetSchoolYearsResponseSchema>;

/**
 * Create school year input schema
 */
export const CreateSchoolYearInputSchema = z.object({
  name: z.string().max(255),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(false),
});
export type CreateSchoolYearInput = z.infer<typeof CreateSchoolYearInputSchema>;

/**
 * Update school year input schema
 */
export const UpdateSchoolYearInputSchema = CreateSchoolYearInputSchema.partial();
export type UpdateSchoolYearInput = z.infer<typeof UpdateSchoolYearInputSchema>;

/**
 * Single school year response schema
 */
export const SchoolYearResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: SchoolYearSchema,
});
export type SchoolYearResponse = z.infer<typeof SchoolYearResponseSchema>;

/**
 * Delete school year response schema
 */
export const DeleteSchoolYearResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteSchoolYearResponse = z.infer<typeof DeleteSchoolYearResponseSchema>;

// ============================================================================
// Invoice / Tagihan Types (based on actual Laravel backend implementation)
// ============================================================================

/**
 * Invoice status enum from backend
 */
export const InvoiceStatusSchema = z.enum([
  'unpaid',
  'paid',
  'overdue'
]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

/**
 * Student schema in invoice response
 */
export const InvoiceStudentSchema = z.object({
  id: z.number().int().positive(),
  nis: z.string(),
  name: z.string(),
});
export type InvoiceStudent = z.infer<typeof InvoiceStudentSchema>;

/**
 * Fee type schema in invoice response
 */
export const InvoiceFeeTypeSchema = z.object({
  id: z.number().int().positive(),
  code: z.string(),
  name: z.string(),
});
export type InvoiceFeeType = z.infer<typeof InvoiceFeeTypeSchema>;

/**
 * School year schema in invoice response
 */
export const InvoiceSchoolYearSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});
export type InvoiceSchoolYear = z.infer<typeof InvoiceSchoolYearSchema>;

/**
 * Invoice schema (matches InvoiceResource from backend)
 */
export const InvoiceSchema = z.object({
  id: z.number().int().positive(),
  invoice_number: z.string(),
  student: InvoiceStudentSchema,
  fee_type: InvoiceFeeTypeSchema,
  school_year: InvoiceSchoolYearSchema,
  amount: z.number(),
  discount_amount: z.number(),
  paid_amount: z.number(),
  remaining_amount: z.number(),
  due_date: z.string().nullable(),
  status: InvoiceStatusSchema,
  created_at: z.string(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

/**
 * Get all invoices response schema
 */
export const GetInvoicesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(InvoiceSchema),
  meta: PaginationMetaSchema,
});
export type GetInvoicesResponse = z.infer<typeof GetInvoicesResponseSchema>;

/**
 * Single invoice response schema
 */
export const InvoiceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: InvoiceSchema,
});
export type InvoiceResponse = z.infer<typeof InvoiceResponseSchema>;

/**
 * Create invoice input schema (matches StoreInvoiceRequest from backend)
 */
export const CreateInvoiceInputSchema = z.object({
  student_id: z.number().int().positive(),
  fee_type_id: z.number().int().positive(),
  school_year_id: z.number().int().positive(),
  amount: z.number().int().positive(),
  discount_amount: z.number().optional().nullable(),
  due_date: z.string().optional().nullable(),
});
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceInputSchema>;

/**
 * Update invoice input schema (matches UpdateInvoiceRequest from backend)
 */
export const UpdateInvoiceInputSchema = z.object({
  due_date: z.string().optional().nullable(),
});
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceInputSchema>;

/**
 * Delete invoice response schema
 */
export const DeleteInvoiceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteInvoiceResponse = z.infer<typeof DeleteInvoiceResponseSchema>;

// ============================================================================
// Report Types (for backward compatibility)
// ============================================================================

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
  siswa: z.object({
    nama: z.string(),
    nis: z.string(),
    kelas: z.string(),
  }),
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

// ============================================================================
// tRPC Router Definition
// ============================================================================

export const appRouter = t.router({
  // Fee Type procedures (Admin & Bendahara only)
  feeTypes: t.router({
    getAll: t.procedure
      .output(GetFeeTypesResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    getById: t.procedure
      .input(z.number().int().positive())
      .output(FeeTypeResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    create: t.procedure
      .input(CreateFeeTypeInputSchema)
      .output(FeeTypeResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    update: t.procedure
      .input(z.object({ id: z.number().int().positive(), data: UpdateFeeTypeInputSchema }))
      .output(FeeTypeResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    delete: t.procedure
      .input(z.number().int().positive())
      .output(DeleteFeeTypeResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
  }),

  // Auth procedures
  auth: t.router({
    login: t.procedure
      .input(LoginInputSchema)
      .output(LoginResponseSchema)
      .mutation(async () => {
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
  }),

  // School Year procedures (Admin & Bendahara only)
  schoolYears: t.router({
    getAll: t.procedure
      .output(GetSchoolYearsResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    getById: t.procedure
      .input(z.number().int().positive())
      .output(SchoolYearResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    create: t.procedure
      .input(CreateSchoolYearInputSchema)
      .output(SchoolYearResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    update: t.procedure
      .input(z.object({ id: z.number().int().positive(), data: UpdateSchoolYearInputSchema }))
      .output(SchoolYearResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    delete: t.procedure
      .input(z.number().int().positive())
      .output(DeleteSchoolYearResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
  }),

  // Invoice procedures (Admin & Bendahara only)
  invoices: t.router({
    getAll: t.procedure
      .output(GetInvoicesResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    getById: t.procedure
      .input(z.number().int().positive())
      .output(InvoiceResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    create: t.procedure
      .input(CreateInvoiceInputSchema)
      .output(InvoiceResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    update: t.procedure
      .input(z.object({ id: z.number().int().positive(), data: UpdateInvoiceInputSchema }))
      .output(InvoiceResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
    
    delete: t.procedure
      .input(z.number().int().positive())
      .output(DeleteInvoiceResponseSchema)
      .mutation(async () => {
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

  // Student procedures
  students: t.router({
    getAll: t.procedure
      .output(GetStudentsResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    getById: t.procedure
      .input(z.number().int().positive())
      .output(StudentResponseSchema)
      .query(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    create: t.procedure
      .input(CreateStudentInputSchema)
      .output(StudentResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    update: t.procedure
      .input(z.object({
        id: z.number().int().positive(),
        data: UpdateStudentInputSchema,
      }))
      .output(StudentResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),

    delete: t.procedure
      .input(z.number().int().positive())
      .output(DeleteStudentResponseSchema)
      .mutation(async () => {
        throw new Error('Use apiClient to call the actual backend');
      }),
  }),
});

// Export router type for client usage
export type AppRouter = typeof appRouter;