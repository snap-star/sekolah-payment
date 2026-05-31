Tahap 1

Prioritasnya:

1. Sanctum Authentication
2. Classroom API
3. School Year API
4. Student API
5. Fee Type API
6. Dashboard API
7. API Documentation

Setelah itu baru masuk Tahap 2:

Invoice
Generate Tagihan
Pembayaran
Cicilan
QRIS

ERD
JWT Auth
API Backend
Multi tahun ajaran
Riwayat kenaikan kelas
Cicilan pembayaran
QRIS
Audit log
Multi wali murid

Endpoint Tahap 1
Auth
POST /api/login
POST /api/logout
GET /api/me

Classrooms
GET /api/classrooms
POST /api/classrooms
GET /api/classrooms/{id}
PUT /api/classrooms/{id}
DELETE /api/classrooms/{id}

School Years
GET /api/school-years
POST /api/school-years
PUT /api/school-years/{id}
DELETE /api/school-years/{id}

Students
GET /api/students
POST /api/students
GET /api/students/{id}
PUT /api/students/{id}
DELETE /api/students/{id}

Fee Types
GET /api/fee-types
POST /api/fee-types
PUT /api/fee-types/{id}
DELETE /api/fee-types/{id}

Tahap 1 Migration Order

1. users
2. school_years
3. classrooms
4. students
5. student_guardians
6. student_classrooms
7. fee_types
8. payment_methods
9. invoices
10. payments
11. payment_gateway_transactions
12. activity_logs

Bagian 1: users, school_years, classrooms, students
Bagian 2: guardians, student_classrooms, fee_types
Bagian 3: invoices, payments, gateway
Bagian 4: activity_logs + foreign keys
