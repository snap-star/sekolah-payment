<?php

namespace Database\Seeders;

use App\Models\FeeType;
use Illuminate\Database\Seeder;

class FeeTypeSeeder extends Seeder
{
    public function run(): void
    {
        $fees = [
            [
                'code' => 'SPP',
                'name' => 'SPP Bulanan',
                'default_amount' => 300000,
                'recurring_type' => 'monthly',
            ],
            [
                'code' => 'GEDUNG',
                'name' => 'Uang Gedung',
                'default_amount' => 2000000,
                'recurring_type' => 'one_time',
            ],
            [
                'code' => 'SERAGAM',
                'name' => 'Seragam',
                'default_amount' => 750000,
                'recurring_type' => 'one_time',
            ],
            [
                'code' => 'PRAMUKA',
                'name' => 'Pramuka',
                'default_amount' => 100000,
                'recurring_type' => 'yearly',
            ],
        ];

        foreach ($fees as $fee) {
            FeeType::create([
                ...$fee,
                'description' => null,
                'is_active' => true,
            ]);
        }
    }
}
