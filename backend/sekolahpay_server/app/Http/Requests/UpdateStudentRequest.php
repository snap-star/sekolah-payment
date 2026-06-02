<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $student = $this->route('student');

        return [

            'nis' => [
                'required',
                'string',
                'max:50',
                Rule::unique('students', 'nis')->ignore($student),
            ],

            'nisn' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('students', 'nisn')->ignore($student),
            ],

            'name' => [
                'required',
                'string',
                'max:255'
            ],

            'gender' => [
                'required',
                'in:L,P'
            ],

            'birth_date' => [
                'nullable',
                'date'
            ],

            'status' => [
                'required',
                'in:active,inactive,graduated'
            ],
        ];
    }
}
