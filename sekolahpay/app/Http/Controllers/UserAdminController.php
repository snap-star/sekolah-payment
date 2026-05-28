<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class UserAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('UserAdmin/Index', [
            'users' => [
                [
                    'id' => 1,
                    'nama' => 'Pak Surya',
                    'email' => 'kepala_sekolah@example.com',
                    'role' => 'kepala_sekolah',
                    'no_hp' => '081234567890',
                    'aktif' => true,
                    'terakhir_login' => '2026-05-25 10:00:00',
                ],
                [
                    'id' => 2,
                    'nama' => 'Bu Rina',
                    'email' => 'bu_rina@example.com',
                    'role' => 'bendahara',
                    'no_hp' => '081234567890',
                    'aktif' => true,
                    'terakhir_login' => '2026-05-29 10:00:00',
                ],
                [
                    'id' => 3,
                    'nama' => 'Pak Joko Susilo',
                    'email' => 'joko_susilo@example.com',
                    'role' => 'admin',
                    'no_hp' => '081234567890',
                    'aktif' => true,
                    'terakhir_login' => '2026-05-29 10:00:00',
                ],
                [
                    'id' => 4,
                    'nama' => 'Hanif',
                    'email' => 'hanif@example.com',
                    'role' => 'operator',
                    'no_hp' => '081234567890',
                    'aktif' => true,
                    'terakhir_login' => '2026-05-29 10:00:00',
                ],
            ],
            'roles' => [
                ['value' => 'kepala_sekolah', 'label' => 'Kepala Sekolah'],
                ['value' => 'bendahara', 'label' => 'Bendahara'],
                ['value' => 'admin', 'label' => 'Admin'],
                ['value' => 'operator', 'label' => 'Operator'],
            ],
        ]);
    }
    public function store()
    {
        return back()->with('flash', ['type' => 'success', 'message' => 'User Admin berhasil ditambahkan']);
    }
}
