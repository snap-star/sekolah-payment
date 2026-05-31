<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        */

        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();

            $table->string('password');

            $table->string('role');

            // FK ditambahkan nanti setelah semua tabel dibuat
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('guardian_id')->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->timestamp('last_login_at')
                ->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        /*
        |--------------------------------------------------------------------------
        | SCHOOL YEARS
        |--------------------------------------------------------------------------
        */

        Schema::create('school_years', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->date('start_date');
            $table->date('end_date');

            $table->boolean('is_active')
                ->default(false);

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | CLASSROOMS
        |--------------------------------------------------------------------------
        */

        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();

            $table->string('level');
            $table->string('major');
            $table->string('name');

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();
            $table->softDeletes();
        });

        /*
        |--------------------------------------------------------------------------
        | STUDENTS
        |--------------------------------------------------------------------------
        */

        Schema::create('students', function (Blueprint $table) {
            $table->id();

            $table->string('nis')->nullable()
                ->unique();

            $table->string('nisn')->nullable()
                ->unique();

            $table->string('name');

            $table->string('gender');

            $table->date('birth_date')
                ->nullable();

            $table->string('status');

            $table->timestamps();
            $table->softDeletes();
        });

        /*
        |--------------------------------------------------------------------------
        | STUDENT GUARDIANS
        |--------------------------------------------------------------------------
        */

        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('phone');

            $table->string('relation');

            $table->boolean('is_primary')
                ->default(false);

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | STUDENT CLASSROOMS
        |--------------------------------------------------------------------------
        */

        Schema::create('student_classrooms', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('classroom_id')
                ->constrained('classrooms')
                ->cascadeOnDelete();

            $table->foreignId('school_year_id')
                ->constrained('school_years')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'student_id',
                'school_year_id'
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | FEE TYPES
        |--------------------------------------------------------------------------
        */

        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();

            $table->string('code')
                ->unique();

            $table->string('name');

            $table->decimal('default_amount', 15, 2);

            $table->string('recurring_type');

            $table->text('description')
                ->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();
            $table->softDeletes();
        });

        /*
        |--------------------------------------------------------------------------
        | PAYMENT METHODS
        |--------------------------------------------------------------------------
        */

        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | INVOICES
        |--------------------------------------------------------------------------
        */

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            $table->string('invoice_number')
                ->unique();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('fee_type_id')
                ->constrained('fee_types')
                ->cascadeOnDelete();

            $table->foreignId('school_year_id')
                ->constrained('school_years')
                ->cascadeOnDelete();

            $table->decimal('amount', 15, 2);

            $table->decimal('discount_amount', 15, 2)
                ->default(0);

            $table->decimal('paid_amount', 15, 2)
                ->default(0);

            $table->decimal('remaining_amount', 15, 2);

            $table->date('due_date')
                ->nullable();

            $table->string('status');

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | PAYMENTS
        |--------------------------------------------------------------------------
        */

        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('invoice_id')
                ->constrained('invoices')
                ->cascadeOnDelete();

            $table->foreignId('payment_method_id')
                ->constrained('payment_methods')
                ->cascadeOnDelete();

            $table->string('payment_code')
                ->unique();

            $table->string('receipt_number')
                ->nullable();

            $table->decimal('amount_paid', 15, 2);

            $table->timestamp('paid_at');

            $table->foreignId('paid_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('note')
                ->nullable();

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | PAYMENT GATEWAY TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        Schema::create('payment_gateway_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('payment_id')
                ->constrained('payments')
                ->cascadeOnDelete();

            $table->string('provider');

            $table->string('external_id');

            $table->string('status');

            $table->text('qr_string')
                ->nullable();

            $table->longText('raw_response')
                ->nullable();

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | ACTIVITY LOGS
        |--------------------------------------------------------------------------
        */

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('action');

            $table->string('table_name');

            $table->unsignedBigInteger('record_id');

            $table->text('old_values')
                ->nullable();

            $table->text('new_values')
                ->nullable();

            $table->string('ip_address')
                ->nullable();

            $table->timestamp('created_at');
        });

        /*
        |--------------------------------------------------------------------------
        | USERS FOREIGN KEYS
        |--------------------------------------------------------------------------
        |
        | Diletakkan paling akhir untuk menghindari circular dependency:
        | users -> student_guardians
        | student_guardians -> students
        |
        */

        Schema::table('users', function (Blueprint $table) {

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->nullOnDelete();

            $table->foreign('guardian_id')
                ->references('id')
                ->on('student_guardians')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropForeign(['guardian_id']);
        });

        Schema::dropIfExists('activity_logs');

        Schema::dropIfExists('payment_gateway_transactions');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoices');

        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('fee_types');
        Schema::dropIfExists('student_classrooms');
        Schema::dropIfExists('student_guardians');

        Schema::dropIfExists('students');
        Schema::dropIfExists('classrooms');
        Schema::dropIfExists('school_years');
        Schema::dropIfExists('users');
    }
};
