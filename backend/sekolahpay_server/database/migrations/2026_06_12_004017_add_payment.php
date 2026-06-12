<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {

            $table->id();

            $table->foreignId('invoice_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('payment_method_id')
                ->constrained()
                ->restrictOnDelete();

            $table->string('payment_code')
                ->unique();

            $table->string('receipt_number')
                ->nullable();

            $table->decimal('amount_paid', 15, 2);

            $table->timestamp('paid_at');

            $table->string('paid_by')
                ->nullable();

            $table->text('note')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
