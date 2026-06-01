<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGatewayTransaction extends Model
{
    protected $fillable = [
        'payment_id',
        'provider',
        'external_id',
        'status',
        'qr_string',
        'raw_response',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
