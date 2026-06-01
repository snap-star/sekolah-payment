import type { DashboardStats, RecentTransaction, User } from '@/types';
import type { ReportResponse, GetInvoicesResponse } from '@/types/server/api';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async login(creds: { email: string; password: string }) {
    await sleep(500);
    if (creds.password !== 'password') throw new Error('Invalid credentials');
    return {
      token: 'mock_token_12345',
      user: { id: 1, nama: 'Pak Surya', email: creds.email, role: 'bendahara' } as User,
    };
  },

  async me() {
    await sleep(300);
    return { id: 1, nama: 'Pak Surya', email: 'surya@sekolah.xyz', role: 'bendahara' } as User;
  },

  async logout() {
    await sleep(200);
    return { message: 'Logged out' };
  },

  async getDashboard() {
    await sleep(400);
    return {
      stats: {
        total_tunggakan: 45200000,
        total_terbayar_bulan_ini: 28300000,
        jumlah_siswa_menunggak: 127,
        total_transaksi_hari_ini: 42,
      } as DashboardStats,
      rekap_per_bulan: [
        { bulan: 'Jan', terbayar: 12000000, tunggakan: 3000000 },
        { bulan: 'Feb', terbayar: 15000000, tunggakan: 2500000 },
        { bulan: 'Mar', terbayar: 11000000, tunggakan: 4000000 },
        { bulan: 'Apr', terbayar: 18000000, tunggakan: 2000000 },
        { bulan: 'Mei', terbayar: 28300000, tunggakan: 1500000 },
      ],
      jenis_tagihan_breakdown: [
        { nama: 'SPP Bulanan', total: 85000000, terbayar: 72000000 },
        { nama: 'Uang Pangkal', total: 45000000, terbayar: 38000000 },
        { nama: 'Uang Buku', total: 12000000, terbayar: 9000000 },
        { nama: 'Uang Kegiatan', total: 8000000, terbayar: 5000000 },
        { nama: 'Uang Seragam', total: 5000000, terbayar: 3000000 },
      ],
      recent_transactions: [
        { id: 'TRX-20260528-001', siswa: 'Ahmad Fauzi', kelas: 'X IPA 1', nominal: 1500000, status: 'success', metode: 'QRIS', waktu: '2026-05-28 08:32:15' },
        { id: 'TRX-20260528-002', siswa: 'Budi Santoso', kelas: 'XI IPS 2', nominal: 2000000, status: 'success', metode: 'QRIS', waktu: '2026-05-28 09:15:44' },
        { id: 'TRX-20260528-003', siswa: 'Citra Lestari', kelas: 'X IPA 2', nominal: 1500000, status: 'pending', metode: 'QRIS', waktu: '2026-05-28 10:05:00' },
      ] as RecentTransaction[],
    };
  },

  async getTagihan(): Promise<GetInvoicesResponse> {
    await sleep(400);
    return {
      jenis_tagihan: [
        { id: 1, nama: 'SPP Bulanan', nominal_default: 1500000, periode: 'bulanan' },
        { id: 2, nama: 'Uang Pangkal', nominal_default: 5000000, periode: 'tahunan' },
        { id: 3, nama: 'Uang Buku', nominal_default: 750000, periode: 'semester' },
        { id: 4, nama: 'Uang Kegiatan', nominal_default: 500000, periode: 'tahunan' },
        { id: 5, nama: 'Uang Seragam', nominal_default: 650000, periode: 'tahunan' },
      ],
      tagihan: [
        {
          id: 101,
          siswa: { nama: 'Ahmad Fauzi', nis: '202501001', kelas: 'X IPA 1' },
          jenis: 'SPP Bulanan',
          nominal_asli: 1500000,
          nominal_disesuaikan: 1500000,
          periode: 'Mei 2026',
          status: 'lunas' as const,
          qris_string: null,
          qris_expiry: null,
          dibayar_pada: '2026-05-20 14:30:00',
        },
        {
          id: 102,
          siswa: { nama: 'Budi Santoso', nis: '202501002', kelas: 'XI IPS 2' },
          jenis: 'SPP Bulanan',
          nominal_asli: 1500000,
          nominal_disesuaikan: 1200000,
          periode: 'Mei 2026',
          status: 'menunggak' as const,
          qris_string: '00020101021126570014COM.GO-JEK.WWW011893600914SK2026052800010309SK2026052800015204123453033605802ID5910SEKOLAHXYZ6013JAKARTA SELATAN610512401621501112345678901234567893011SK2026052800016304A1B2',
          qris_expiry: '2026-05-28 23:59:59',
          dibayar_pada: null,
        },
        {
          id: 103,
          siswa: { nama: 'Citra Lestari', nis: '202501003', kelas: 'X IPA 2' },
          jenis: 'Uang Pangkal',
          nominal_asli: 5000000,
          nominal_disesuaikan: 5000000,
          periode: '2026/2027',
          status: 'menunggak' as const,
          qris_string: '00020101021126570014COM.GO-JEK.WWW011893600914SK2026052800020309SK2026052800025204123453033605802ID5910SEKOLAHXYZ6013JAKARTA SELATAN610512401621501112345678901234567893011SK2026052800026304C3D4',
          qris_expiry: '2026-05-29 23:59:59',
          dibayar_pada: null,
        },
        {
          id: 104,
          siswa: { nama: 'Dewi Anggraini', nis: '202501004', kelas: 'XII IPA 1' },
          jenis: 'SPP Bulanan',
          nominal_asli: 1500000,
          nominal_disesuaikan: 1500000,
          periode: 'Mei 2026',
          status: 'lunas' as const,
          qris_string: null,
          qris_expiry: null,
          dibayar_pada: '2026-05-25 09:15:00',
        },
      ],
    };
  },

  async updateTagihan(id: number, data: { nominal_disesuaikan: number }) {
    await sleep(300);
    console.log('Updated tagihan', id, data);
    return { success: true };
  },

  async generateQris(id: number) {
    await sleep(800);
    return { qris: `00020101021126570014COM.GO-JEK.WWW011893600914SK20260528000${id}` };
  },

  async getUserAdmin() {
    await sleep(300);
    return {
      users: [
        { id: 1, nama: 'Pak Surya', email: 'surya@sekolah.xyz', role: 'kepala_sekolah', no_hp: '081234567890', aktif: true, terakhir_login: '2026-05-28 07:45:00' },
        { id: 2, nama: 'Bu Rina', email: 'rina@sekolah.xyz', role: 'bendahara', no_hp: '081298765432', aktif: true, terakhir_login: '2026-05-27 16:20:00' },
        { id: 3, nama: 'Pak Joko', email: 'joko@sekolah.xyz', role: 'operator', no_hp: '081223344556', aktif: false, terakhir_login: '2026-05-15 11:00:00' },
      ],
      roles: [
        { value: 'kepala_sekolah', label: 'Kepala Sekolah' },
        { value: 'bendahara', label: 'Bendahara' },
        { value: 'operator', label: 'Operator' },
      ],
    };
  },

  async getReport(): Promise<ReportResponse> {
    await sleep(400);
    return {
      reports: [
        { id: 101, siswa: { nama: 'Ahmad Fauzi', nis: '202501001', kelas: 'X IPA 1' }, jenis_tagihan: 'SPP Bulanan', periode: 'Mei 2026', nominal_tagihan: 1500000, total_dibayar: 1500000, kekurangan_bayar: 0, status: 'lunas' as const, riwayat_pembayaran: [{ tanggal: '2026-05-20', nominal: 1500000, metode: 'QRIS', ref: 'TRX-001' }] },
        { id: 102, siswa: { nama: 'Budi Santoso', nis: '202501002', kelas: 'XI IPS 2' }, jenis_tagihan: 'SPP Bulanan', periode: 'Mei 2026', nominal_tagihan: 1200000, total_dibayar: 0, kekurangan_bayar: 1200000, status: 'menunggak' as const, riwayat_pembayaran: [] },
        { id: 103, siswa: { nama: 'Citra Lestari', nis: '202501003', kelas: 'X IPA 2' }, jenis_tagihan: 'Uang Pangkal', periode: '2026/2027', nominal_tagihan: 5000000, total_dibayar: 2000000, kekurangan_bayar: 3000000, status: 'belum_lunas' as const, riwayat_pembayaran: [{ tanggal: '2026-04-10', nominal: 1000000, metode: 'QRIS', ref: 'TRX-042' }, { tanggal: '2026-05-05', nominal: 1000000, metode: 'QRIS', ref: 'TRX-089' }] },
        { id: 105, siswa: { nama: 'Eko Prasetyo', nis: '202501005', kelas: 'XII IPA 1' }, jenis_tagihan: 'SPP Bulanan', periode: 'Mei 2026', nominal_tagihan: 1500000, total_dibayar: 1500000, kekurangan_bayar: 0, status: 'lunas' as const, riwayat_pembayaran: [{ tanggal: '2026-05-10', nominal: 1500000, metode: 'QRIS', ref: 'TRX-055' }] },
        { id: 106, siswa: { nama: 'Fani Wulandari', nis: '202501006', kelas: 'XI IPS 1' }, jenis_tagihan: 'Uang Buku', periode: 'Semester 1 2026', nominal_tagihan: 750000, total_dibayar: 0, kekurangan_bayar: 750000, status: 'menunggak' as const, riwayat_pembayaran: [] },
      ],
      summary: {
        total_tagihan_keseluruhan: 9950000,
        total_terbayar: 6000000,
        total_kekurangan: 3950000,
        persentase_pembayaran: 60.3,
      },
    };
  },
};