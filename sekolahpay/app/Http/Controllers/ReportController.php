<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Report/Index', [
            'filters' => request()->only(['kelas','status', 'periode','jenis_tagihan']),
            'reports' => [
                [
                    'id' => 101,
                    'siswa' => ['nama' => 'Citra Lestari' , 'nis' => '123456', 'kelas' => 'XII IPA 1'],
                    'jenis_tagihan' => 'SPP Bulanan',
                    'periode' => 'Mei 2026',
                    'nominal_tagihan' => 1500000,
                    'total_dibayar' => 1500000,
                    'kekurangan' => 0,
                    'status' => 'Lunas',
                    'riwayat_pembayaran' => [
                        ['tanggal' => '2026-05-29', 'nominal' => 1500000, 'metode'=> 'QRIS', 'ref'=> 'TRX-001'],
                    ],
                ],
                [
                    'id' => 102,
                    'siswa' => ['nama' => 'Budi Santoto' , 'nis' => '123456', 'kelas' => 'XII IPA 2'],
                    'jenis_tagihan' => 'SPP Bulanan',
                    'periode' => 'Mei 2026',
                    'nominal_tagihan' => 1200000,
                    'total_dibayar' => 0,
                    'kekurangan' => 1200000,
                    'status' => 'hutang',
                    'riwayat_pembayaran' => [
                        [],
                    ],
                ],
                [
                    'id' => 103,
                    'siswa' => ['nama' => 'Citra Lestari' , 'nis' => '123456', 'kelas' => 'XII IPA 1'],
                    'jenis_tagihan' => 'Uang Pangkal',
                    'periode' => '2026/2027',
                    'nominal_tagihan' => 5000000,
                    'total_dibayar' => 2000000,
                    'kekurangan' => 3000000,
                    'status' => 'belum_lunas',
                    'riwayat_pembayaran' => [
                        ['tanggal' => '2026-04-10', 'nominal' => 1000000, 'metode'=> 'QRIS', 'ref'=> 'TRX-002'],
                        ['tanggal' => '2026-05-28', 'nominal' => 1000000, 'metode'=> 'QRIS', 'ref'=> 'TRX-003'],
                    ],
                ],
                [
                    'id' => 105,
                    'siswa' => ['nama' => 'Eko Prasetyo' , 'nis' => '123456', 'kelas' => 'XI IPA 2'],
                    'jenis_tagihan' => 'SPP Bulanan',
                    'periode' => 'Mei 2026',
                    'nominal_tagihan' => 1500000,
                    'total_dibayar' => 1500000,
                    'kekurangan' => 0,
                    'status' => 'belum_lunas',
                    'riwayat_pembayaran' => [
                        ['tanggal' => '2026-05-10', 'nominal' => 1000000, 'metode'=> 'QRIS', 'ref'=> 'TRX-001'],
                    ],
                ],
                [
                    'id' => 109,
                    'siswa' => ['nama' => 'Fani Wulandari' , 'nis' => '123456', 'kelas' => 'XI IPA 3'],
                    'jenis_tagihan' => 'Uang Buku',
                    'periode' => 'Semester 1 2026',
                    'nominal_tagihan' => 750000,
                    'total_dibayar' => 200000,
                    'kekurangan' => 550000,
                    'status' => 'belum_lunas',
                    'riwayat_pembayaran' => [
                        ['tanggal' => '2026-03-10', 'nominal' => 200000, 'metode'=> 'QRIS', 'ref'=> 'TRX-002'],
                    ],
                ],
            ],
            'summary' => [
                'total_tagihan_keseluruhan' => 25000000,
                'total_terbayar' => 12000000,
                'total_kekurangan' => 13000000,
                'persentase_pembayaran' => 48,
            ],
            'kelas_options' => ['XI IPA 1','XI IPA 2','XII IPA 1','XII IPA 2','XI IPA 3','XI IPA 4', 'XII IPA 1', 'XII IPA 2', 'XI IPA 3', 'XI IPA 4', 'XIII IPA 1', 'XIII IPA 2', 'XIII IPA 3', 'XIII IPA 4'],
            'periode_options' => ['Mei 2026','Juni 2026','Juli 2026','Agustus 2026','September 2026','Oktober 2026','Novemberember 2026','Desember 2026'],
            'jenis_tagihan_options' => ['SPP Bulanan','Uang Pangkal','Uang Buku', 'Uang Kegiatan', 'Uang Seragam'],
        ]);
    }
}
