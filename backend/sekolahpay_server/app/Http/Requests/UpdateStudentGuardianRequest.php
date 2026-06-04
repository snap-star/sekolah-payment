<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentGuardianRequest extends FormRequest
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

    // validation rules
    public function rules(): array
    {
        return [
            'student_id' => ['sometimes', 'exists:students,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'relation' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:20'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
        ];
    }
}
