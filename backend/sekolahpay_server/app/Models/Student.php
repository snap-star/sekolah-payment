<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nis',
        'nisn',
        'name',
        'gender',
        'birth_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function guardians()
    {
        return $this->hasMany(StudentGuardian::class);
    }

    public function primaryGuardian()
    {
        return $this->hasOne(StudentGuardian::class)
            ->where('is_primary', true);
    }

    public function classrooms()
    {
        return $this->hasMany(StudentClassroom::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
