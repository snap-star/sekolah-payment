<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TagihanController extends Controller{
    public function index(){
        return Inertia::render('Tagihan/Index', [
            'jenis_tagihan' => [
                ['id' => 1, 'nama' => 'SPP Bulanan', 'nominal_default' => 1500000, 'periode' => 'bulanan' ],
                ['id' => 2, 'nama' => 'Uang Pangkal', 'nominal_default' => 5000000, 'periode' => 'tahunan' ],
                ['id' => 3, 'nama' => 'Uang Buku', 'nominal_default' => 750000, 'periode' => 'semester' ],
                ['id' => 4, 'nama' => 'Uang Kegiatan', 'nominal_default' => 500000, 'periode' => 'tahunan' ],
                ['id' => 5, 'nama' => 'Uang Seragam', 'nominal_default' => 650000, 'periode' => 'tahunan' ],
            ],
            'tagihan' => [
                [
                    'id'=> 101,
                    'siswa' => ['nama'=>'Citra Lestari', 'nis'=>'123456', 'kelas'=>'XII IPA 1'],
                    'jenis' => 'SPP Bulanan',
                    'fixed_nominal' => 1500000,
                    'nominal' => 1500000,
                    'periode' => 'Mei 2026',
                    'status' => 'lunas',
                    'qris_string' => null,
                    'qris_expiry' => null,
                    'dibayar_pada' => '2026-05-20 10:00:00'
                ],
                [
                    'id'=> 102,
                    'siswa' => ['nama'=>'Budi Santoto', 'nis'=>'123456', 'kelas'=>'XII IPA 2'],
                    'jenis' => 'SPP Bulanan',
                    'fixed_nominal' => 5000000,
                    'nominal' => 1200000, //disesuaikan karena keringanan
                    'periode' => '2026',
                    'status' => 'hutang',
                    'qris_string' => '00020101021126570014COM.GO-PAY.WWW0118936009114SK2026052800010309SK2026052800015204123453033605802ID5910SEKOLAHXYZ6013MADIUN610512401621501112345678',
                    'qris_expiry' => '2026-05-20 10:00:00',
                    'dibayar_pada' => '2026-05-20 10:00:00'
                ],
                [
                    'id'=> 103,
                    'siswa' => ['nama'=>'Ari Wagyu', 'nis'=>'123456', 'kelas'=>'XII IPA 3'],
                    'jenis' => 'Uang Pangkal',
                    'fixed_nominal' => 5000000,
                    'nominal' => 5000000,
                    'periode' => '2026',
                    'status' => 'lunas',
                    'qris_string' => '00020101021126570014COM.GO-PAY.WWW0118936009114SK2026052800010309SK2026052800015204123453033605802ID5910SEKOLAHXYZ6013MADIUN610512401621501112345678',
                    'qris_expiry' => '2026-05-20 10:00:00',
                    'dibayar_pada' => '2026-05-20 10:00:00'
                ],
                [
                    'id'=> 104,
                    'siswa' => ['nama'=>'Citra Lestari', 'nis'=>'123456', 'kelas'=>'XII IPA 1'],
                    'jenis' => 'Uang Pangkal',
                    'fixed_nominal' => 5000000,
                    'nominal' => 5000000,
                    'periode' => '2026/2027',
                    'status' => 'lunas',
                    'qris_string' => '00020101021126570014COM.GO-PAY.WWW0118936009114SK2026052800010309SK2026052800015204123453033605802ID5910SEKOLAHXYZ6013MADIUN610512401621501112345678',
                    'qris_expiry' => '2026-05-29 10:00:00',
                    'dibayar_pada' => '2026-05-29 10:00:00'
                ],
                [
                    'id'=> 105,
                    'siswa' => ['nama'=>'Dewi Lestari', 'nis'=>'123456', 'kelas'=>'XII IPA 3'],
                    'jenis' => 'Uang Pangkal',
                    'fixed_nominal' => 1500000,
                    'nominal' => 1500000,
                    'periode' => 'Mei 2026',
                    'status' => 'lunas',
                    'qris_string' => '00020101021126570014COM.GO-PAY.WWW0118936009114SK2026052800010309SK2026052800015204123453033605802ID5910SEKOLAHXYZ6013MADIUN610512401621501112345678',
                    'qris_expiry' => '2026-05-25 10:00:00',
                    'dibayar_pada' => '2026-05-25 10:00:00'
                ],
            ],
            'flash'=> session()->get('flash'),
        ]);
    }

    public function store()
    {
        //backend
        return back()->with('flash', ['type'=>'success', 'message' => 'Tagihan berhasil dibuat']);
    }

    public function update($id)
    {
        //backend
        return back()->with('flash', ['type'=>'success', 'message' => 'Nominal tagihan diperbaharui & QRIS diregenerate']);
    }

    public function generateQris($id)
    {
        //backend
        $mockQris = '00020101021126570014COM.GO-PAY.WWW0118936009114SK2026052800010309SK2026052800015204123453033605802ID5910SEKOLAHXYZ6013MADIUN610512401621501112345678';

        return back()->with('flash',
        ['type'=>'success',
        'message' => 'QRIS berhasil diregenerate',
        'qris' => $mockQris,
        ]);
       }
}
