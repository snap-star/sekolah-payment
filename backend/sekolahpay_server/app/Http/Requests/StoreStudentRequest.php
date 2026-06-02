<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nis' => [
                'required',
                'string',
                'max:50',
                'unique:students,nis'
            ],

            'nisn' => [
                'nullable',
                'string',
                'max:50',
                'unique:students,nisn'
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
