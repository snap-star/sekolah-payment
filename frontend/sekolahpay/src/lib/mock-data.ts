export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'bendahara' | 'kepala sekolah';
  avatar?: string;
};

export type Student = {
  id: string;
  name: string;
  nisn: string;
  kelas: string;
  jurusan: string;
  photo?: string;
};

export type Tagihan = {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  jenisTagihan: string;
  jumlah: number;
  jatuhTempo: string;
  status: 'lunas' | 'belum_lunas' | 'tertunda';
  tanggalBayar?: string;
  metodeBayar?: string;
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Sekolah',
    email: 'admin@sekolahpay.sch.id',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Bendahara Sekolah',
    email: 'bendahara@sekolahpay.sch.id',
    role: 'bendahara',
  },
  {
    id: '3',
    name: 'Kepala Sekolah',
    email: 'kepala@sekolahpay.sch.id',
    role: 'kepala sekolah',
  },
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    nisn: '0012345678',
    kelas: 'X IPA 1',
    jurusan: 'Ilmu Pengetahuan Alam',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    nisn: '0012345679',
    kelas: 'X IPA 1',
    jurusan: 'Ilmu Pengetahuan Alam',
  },
  {
    id: '3',
    name: 'Cindy Permata',
    nisn: '0012345680',
    kelas: 'X IPS 1',
    jurusan: 'Ilmu Pengetahuan Sosial',
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    nisn: '0012345681',
    kelas: 'XI IPA 2',
    jurusan: 'Ilmu Pengetahuan Alam',
  },
  {
    id: '5',
    name: 'Eko Prasetyo',
    nisn: '0012345682',
    kelas: 'XI IPS 1',
    jurusan: 'Ilmu Pengetahuan Sosial',
  },
  {
    id: '6',
    name: 'Fani Amelia',
    nisn: '0012345683',
    kelas: 'XII IPA 1',
    jurusan: 'Ilmu Pengetahuan Alam',
  },
];

export const mockTagihan: Tagihan[] = [
  {
    id: 'INV-001',
    studentId: '1',
    studentName: 'Ahmad Rizki',
    kelas: 'X IPA 1',
    jenisTagihan: 'SPP Januari 2024',
    jumlah: 500000,
    jatuhTempo: '2024-01-25',
    status: 'lunas',
    tanggalBayar: '2024-01-20',
    metodeBayar: 'QRIS',
  },
  {
    id: 'INV-002',
    studentId: '2',
    studentName: 'Budi Santoso',
    kelas: 'X IPA 1',
    jenisTagihan: 'SPP Januari 2024',
    jumlah: 500000,
    jatuhTempo: '2024-01-25',
    status: 'belum_lunas',
  },
  {
    id: 'INV-003',
    studentId: '3',
    studentName: 'Cindy Permata',
    kelas: 'X IPS 1',
    jenisTagihan: 'SPP Januari 2024',
    jumlah: 450000,
    jatuhTempo: '2024-01-25',
    status: 'lunas',
    tanggalBayar: '2024-01-22',
    metodeBayar: 'Transfer',
  },
  {
    id: 'INV-004',
    studentId: '4',
    studentName: 'Dewi Lestari',
    kelas: 'XI IPA 2',
    jenisTagihan: 'SPP Januari 2024',
    jumlah: 550000,
    jatuhTempo: '2024-01-25',
    status: 'belum_lunas',
  },
  {
    id: 'INV-005',
    studentId: '5',
    studentName: 'Eko Prasetyo',
    kelas: 'XI IPS 1',
    jenisTagihan: 'SPP Januari 2024',
    jumlah: 450000,
    jatuhTempo: '2024-01-25',
    status: 'tertunda',
  },
  {
    id: 'INV-006',
    studentId: '6',
    studentName: 'Fani Amelia',
    kelas: 'XII IPA 1',
    jenisTagihan: 'SPP Januari 2024',
    jumlah: 600000,
    jatuhTempo: '2024-01-25',
    status: 'lunas',
    tanggalBayar: '2024-01-18',
    metodeBayar: 'QRIS',
  },
  {
    id: 'INV-007',
    studentId: '1',
    studentName: 'Ahmad Rizki',
    kelas: 'X IPA 1',
    jenisTagihan: 'SPP Februari 2024',
    jumlah: 500000,
    jatuhTempo: '2024-02-25',
    status: 'belum_lunas',
  },
  {
    id: 'INV-008',
    studentId: '2',
    studentName: 'Budi Santoso',
    kelas: 'X IPA 1',
    jenisTagihan: 'SPP Februari 2024',
    jumlah: 500000,
    jatuhTempo: '2024-02-25',
    status: 'belum_lunas',
  },
  {
    id: 'INV-009',
    studentId: '3',
    studentName: 'Cindy Permata',
    kelas: 'X IPS 1',
    jenisTagihan: 'SPP Februari 2024',
    jumlah: 450000,
    jatuhTempo: '2024-02-25',
    status: 'lunas',
    tanggalBayar: '2024-02-20',
    metodeBayar: 'QRIS',
  },
  {
    id: 'INV-010',
    studentId: '4',
    studentName: 'Dewi Lestari',
    kelas: 'XI IPA 2',
    jenisTagihan: 'SPP Februari 2024',
    jumlah: 550000,
    jatuhTempo: '2024-02-25',
    status: 'belum_lunas',
  },
];

export const getDashboardStats = () => {
  const totalTagihan = mockTagihan.reduce((sum, t) => sum + t.jumlah, 0);
  const tagihanLunas = mockTagihan.filter((t) => t.status === 'lunas');
  const totalLunas = tagihanLunas.reduce((sum, t) => sum + t.jumlah, 0);
  const tagihanBelumLunas = mockTagihan.filter((t) => t.status === 'belum_lunas');
  const totalBelumLunas = tagihanBelumLunas.reduce((sum, t) => sum + t.jumlah, 0);
  const tagihanTertunda = mockTagihan.filter((t) => t.status === 'tertunda');
  const totalTertunda = tagihanTertunda.reduce((sum, t) => sum + t.jumlah, 0);

  return {
    totalSiswa: mockStudents.length,
    totalTagihan: mockTagihan.length,
    totalNilaiTagihan: totalTagihan,
    totalLunas,
    totalBelumLunas,
    totalTertunda,
    jumlahLunas: tagihanLunas.length,
    jumlahBelumLunas: tagihanBelumLunas.length,
    jumlahTertunda: tagihanTertunda.length,
    persentaseLunas: Math.round((tagihanLunas.length / mockTagihan.length) * 100),
  };
};