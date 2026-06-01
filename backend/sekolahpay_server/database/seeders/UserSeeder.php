<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@sekolah.test',
            'phone' => '081111111111',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Bendahara',
            'email' => 'bendahara@sekolah.test',
            'phone' => '082222222222',
            'password' => Hash::make('password'),
            'role' => 'bendahara',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Guru',
            'email' => 'guru@sekolah.test',
            'phone' => '083333333333',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'is_active' => true,
        ]);
    }
}
