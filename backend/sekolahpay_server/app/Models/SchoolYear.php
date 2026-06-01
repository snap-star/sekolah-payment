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

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function studentClassrooms()
    {
        return $this->hasMany(StudentClassroom::class);
    }
}
