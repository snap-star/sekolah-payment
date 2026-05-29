export interface Siswa {
  nama: string;
  nis: string;
  kelas: string;
}

export interface Tagihan {
  id: number;
  siswa: Siswa;
  jenis: string;
  nominal_asli: number;
  nominal_disesuaikan: number;
  periode: string;
  status: 'lunas' | 'menunggak' | 'belum_lunas';
  qris_string: string | null;
  qris_expiry: string | null;
  dibayar_pada: string | null;
}

export interface ReportItem {
  id: number;
  siswa: Siswa;
  jenis_tagihan: string;
  periode: string;
  nominal_tagihan: number;
  total_dibayar: number;
  kekurangan_bayar: number;
  status: string;
  riwayat_pembayaran: Array<{
    tanggal: string;
    nominal: number;
    metode: string;
    ref: string;
  }>;
}

export interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  total_tunggakan: number;
  total_terbayar_bulan_ini: number;
  jumlah_siswa_menunggak: number;
  total_transaksi_hari_ini: number;
}

export interface RecentTransaction {
  id: string;
  siswa: string;
  kelas: string;
  nominal: number;
  status: 'success' | 'pending';
  metode: string;
  waktu: string;
}