# Workflow

```
Admin buat jenis tagihan
↓
Generate invoice siswa
↓
Siswa bayar
↓
Masuk payments
↓
Invoice update status
↓
Muncul di laporan
```

# Migration Order

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

---

Hak Akses yang Sudah Kita Sepakati
Role Hak Akses

```
admin Semua
bendahara Kelola pembayaran & tagihan
guru Lihat data siswa
student Lihat data sendiri
guardian Lihat data anaknya
```

---

CRUD
StudentController
StudentRequest
StudentResource

---

standar response

GET /students
{
"success": true,
"message": "Students retrieved successfully",
"data": [...]
}
POST /students
{
"success": true,
"message": "Student created successfully",
"data": {...}
}
Validation Error
{
"success": false,
"message": "Validation failed",
"errors": {
"nis": [
"The nis field is required."
]
}
}
