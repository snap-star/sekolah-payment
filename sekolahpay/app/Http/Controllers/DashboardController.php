<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller {
    public function index() {
        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_hutang' => 45200000, // Rp.45.200.000
                'total_terbayarkan_bulan_ini' => 28300000, // Rp.28.300.000
                'jumlah_siswa_menunggak' => 127,
                'total_transaksi_hari_ini' => 42,
            ],
            'rekap_per_bulan' => [
                ['bulan' => 'Januari', 'terbayar' => 12000000 , 'tunggakan' => 3000000 ],
                ['bulan' => 'Februari', 'terbayar' => 12000000 , 'tunggakan' => 3000000 ],
                ['bulan' => 'Maret', 'terbayar' => 12000000 , 'tunggakan' => 3000000 ],
                ['bulan' => 'April', 'terbayar' => 12000000 , 'tunggakan' => 3000000 ],
                ['bulan' => 'Mei', 'terbayar' => 12000000 , 'tunggakan' => 3000000 ],
                ['bulan' => 'Juni', 'terbayar' => 12000000 , 'tunggakan' => 3000000 ],
            ],
            'jenis_tagihan_breakdown' => [
                ['nama' => 'SPP Bulanan', 'total' => 85000000, 'terbayar' => 72000000 ],
                ['nama' => 'Uang Pangkal', 'total' => 45000000, 'terbayar' => 38000000 ],
                ['nama' => 'Uang Buku', 'total' => 12000000, 'terbayar' => 9000000 ],
                ['nama' => 'Uang Kegiatan', 'total' => 8000000, 'terbayar' => 5000000 ],
                ['nama' => 'Uang Seragam', 'total' => 120000000, 'terbayar' => 30000000 ],
            ],
            'recent_transaction' => [
                [
                    'id' => 'TRX-20260528-001',
                    'siswa' => 'Ari Wagyu',
                    'kelas' => 'XII A',
                    'nominal' => 12000000,
                    'status' => 'success',
                    'metode' => 'Qris',
                    'waktu' => '2026-05-28 10:00:00'
                ],
                [
                    'id' => 'TRX-20260528-002',
                    'siswa' => 'Budi Santoso',
                    'kelas' => 'XII B',
                    'nominal' => 12000000,
                    'status' => 'success',
                    'metode' => 'Qris',
                    'waktu' => '2026-05-28 10:00:00'
                ],
                [
                    'id' => 'TRX-20260528-003',
                    'siswa' => 'Citra Lestari',
                    'kelas' => 'XII C',
                    'nominal' => 12000000,
                    'status' => 'pending',
                    'metode' => 'Qris',
                    'waktu' => '2026-05-28 10:00:00'
                ],
            ],
        ]);
    }
}
