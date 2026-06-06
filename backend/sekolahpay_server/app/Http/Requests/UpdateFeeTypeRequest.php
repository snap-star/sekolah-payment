<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeeTypeRequest extends FormRequest
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
        $feeType = $this->route('fee_type');

        return [
            'code' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('fee_types', 'code')
                    ->ignore($feeType)
            ],

            'name' => [
                'sometimes',
                'string',
                'max:255'
            ],

            'default_amount' => [
                'sometimes',
                'numeric',
                'min:0'
            ],

            'recurring_type' => [
                'sometimes',
                'in:once,monthly,yearly'
            ],

            'description' => [
                'nullable',
                'string'
            ],

            'is_active' => [
                'nullable',
                'boolean'
            ]
        ];
    }
}
