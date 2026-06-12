<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'payment_code' => $this->payment_code,

            'receipt_number' => $this->receipt_number,

            'amount_paid' => $this->amount_paid,

            'paid_at' => $this->paid_at,

            'paid_by' => $this->paid_by,

            'note' => $this->note,

            'invoice' => [
                'id' => $this->invoice_id,
                'invoice_number'
                => $this->invoice?->invoice_number,
            ],

            'payment_method' => [
                'id' => $this->payment_method_id,
                'name'
                => $this->paymentMethod?->name,
            ],

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
