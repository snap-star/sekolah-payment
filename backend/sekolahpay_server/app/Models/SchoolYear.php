<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_active',
    ];

    // Hanya boleh ada 1 tahun ajaran aktif (is_active = true) dalam satu waktu.
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function studentClassrooms()
    {
        return $this->hasMany(StudentClassroom::class);
    }
}
