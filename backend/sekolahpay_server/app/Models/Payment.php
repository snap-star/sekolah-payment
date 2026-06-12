<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'payment_method_id',
        'payment_code',
        'receipt_number',
        'amount_paid',
        'paid_at',
        'paid_by',
        'note',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount_paid' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
