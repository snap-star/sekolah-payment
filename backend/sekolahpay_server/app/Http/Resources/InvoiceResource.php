<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'invoice_number' => $this->invoice_number,

            'student' => [
                'id' => $this->student?->id,
                'nis' => $this->student?->nis,
                'name' => $this->student?->name,
            ],

            'fee_type' => [
                'id' => $this->feeType?->id,
                'code' => $this->feeType?->code,
                'name' => $this->feeType?->name,
            ],

            'school_year' => [
                'id' => $this->schoolYear?->id,
                'name' => $this->schoolYear?->name,
            ],

            'amount' => $this->amount,

            'discount_amount' => $this->discount_amount,

            'paid_amount' => $this->paid_amount,

            'remaining_amount' => $this->remaining_amount,

            'due_date' => $this->due_date,

            'status' => $this->status,

            'created_at' => $this->created_at,
        ];
    }
}
