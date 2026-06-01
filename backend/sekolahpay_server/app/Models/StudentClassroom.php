<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentClassroom extends Model
{
    protected $fillable = [
        'student_id',
        'classroom_id',
        'school_year_id',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }
}
