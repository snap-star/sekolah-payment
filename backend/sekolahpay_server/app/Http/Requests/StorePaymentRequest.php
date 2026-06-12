<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => [
                'required',
                'exists:invoices,id'
            ],

            'payment_method_id' => [
                'required',
                'exists:payment_methods,id'
            ],

            'receipt_number' => [
                'nullable',
                'string',
                'max:100'
            ],

            'amount_paid' => [
                'required',
                'numeric',
                'min:1'
            ],

            'paid_at' => [
                'required',
                'date'
            ],

            'paid_by' => [
                'nullable',
                'string',
                'max:100'
            ],

            'note' => [
                'nullable',
                'string'
            ],
        ];
    }
}
