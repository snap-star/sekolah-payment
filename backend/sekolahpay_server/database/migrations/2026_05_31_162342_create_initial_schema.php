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
            $table->string('phone');

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

            $table->string('nis')
                ->unique();

            $table->string('nisn')
                ->unique();

            $table->string('name');

            $table->string('gender');

            $table->date('birth_date')
                ->nullable();

            $table->string('status');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
        Schema::dropIfExists('classrooms');
        Schema::dropIfExists('school_years');
        Schema::dropIfExists('users');
    }
};
