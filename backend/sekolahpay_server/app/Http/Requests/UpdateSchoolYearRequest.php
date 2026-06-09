<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolYearRequest extends FormRequest
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
        $schoolYear = $this->route('school_year');

        return [
            'name' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('school_years', 'name')
                    ->ignore($schoolYear)
            ],

            'start_date' => [
                'sometimes',
                'date'
            ],

            'end_date' => [
                'sometimes',
                'date',
                'after:start_date'
            ],

            'is_active' => [
                'nullable',
                'boolean'
            ]
        ];
    }
}
