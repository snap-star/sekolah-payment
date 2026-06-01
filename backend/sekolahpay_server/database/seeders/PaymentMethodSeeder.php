<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            'Tunai',
            'QRIS',
            'Transfer',
        ];

        foreach ($methods as $method) {
            PaymentMethod::create([
                'name' => $method,
                'is_active' => true,
            ]);
        }
    }
}
