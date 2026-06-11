<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => [
                'required',
                'exists:students,id'
            ],

            'fee_type_id' => [
                'required',
                'exists:fee_types,id'
            ],

            'school_year_id' => [
                'required',
                'exists:school_years,id'
            ],

            'amount' => [
                'required',
                'numeric',
                'min:0'
            ],

            'discount_amount' => [
                'nullable',
                'numeric',
                'min:0'
            ],

            'due_date' => [
                'nullable',
                'date'
            ]
        ];
    }
}
