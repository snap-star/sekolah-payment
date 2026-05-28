export interface Siswa {
    nama: string;
    nis: string;
    kelas: string;
}

export interface Tagihan {
    id: number;
    siswa: Siswa;
    jenis: string;
    fixed_nominal: number;
    nominal: number;
    periode: string;
    status: 'lunas' | 'belum_lunas' | 'hutang' | 'dibatalkan';
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
    riwayat: string[];
    riwayat_pembayaran: Array<{
        tanggal: string;
        nominal: number;
        metode: string;
        ref: string;
    }>;
}

export interface FlashMessage {
    type: 'success' | 'error';
    message: string;
    qris?: string;
}
