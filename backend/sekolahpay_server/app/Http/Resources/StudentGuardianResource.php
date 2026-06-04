<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// student guardian resource
class StudentGuardianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'student' => [
                'id' => $this->student?->id,
                'nis' => $this->student?->nis,
                'name' => $this->student?->name,
            ],

            'name' => $this->name,
            'relationship' => $this->relationship,
            'phone' => $this->phone,
            'occupation' => $this->occupation,
            'address' => $this->address,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
