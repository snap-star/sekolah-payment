<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\PaymentResource;
use App\Http\Requests\StorePaymentRequest;

class PaymentController extends Controller
{
    // Helper Recalculate Invoice
    private function recalculateInvoice(Invoice $invoice): void
    {
        $paidAmount = $invoice->payments()
            ->sum('amount_paid');

        $netAmount =
            $invoice->amount -
            $invoice->discount_amount;

        $remainingAmount =
            $netAmount - $paidAmount;

        if ($paidAmount <= 0) {

            $status = 'unpaid';
        } elseif ($remainingAmount <= 0) {

            $status = 'paid';
        } else {

            $status = 'partial';
        }

        $invoice->update([
            'paid_amount' => $paidAmount,
            'remaining_amount' => max(
                0,
                $remainingAmount
            ),
            'status' => $status,
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with([
            'invoice',
            'paymentMethod'
        ])
            ->latest()
            ->paginate();

        return PaymentResource::collection(
            $payments
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StorePaymentRequest $request
    ) {
        return DB::transaction(function ()
        use ($request) {

            $invoice = Invoice::lockForUpdate()
                ->findOrFail(
                    $request->invoice_id
                );

            if (
                $request->amount_paid >
                $invoice->remaining_amount
            ) {
                return response()->json([
                    'message' =>
                    'Payment exceeds remaining amount.'
                ], 422);
            }

            $payment = Payment::create([

                'invoice_id'
                => $request->invoice_id,

                'payment_method_id'
                => $request->payment_method_id,

                'payment_code'
                => 'PAY-' .
                    strtoupper(
                        Str::uuid()
                    ),

                'receipt_number'
                => $request->receipt_number,

                'amount_paid'
                => $request->amount_paid,

                'paid_at'
                => $request->paid_at,

                'paid_by'
                => $request->paid_by,

                'note'
                => $request->note,
            ]);

            $this->recalculateInvoice(
                $invoice
            );

            return new PaymentResource(
                $payment->load([
                    'invoice',
                    'paymentMethod'
                ])
            );
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return new PaymentResource(
            $payment->load([
                'invoice',
                'paymentMethod'
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Payment $payment
    ) {
        return DB::transaction(function ()
        use ($payment) {

            $invoice = $payment->invoice;

            $payment->delete();

            $this->recalculateInvoice(
                $invoice
            );

            return response()->json([
                'message' =>
                'Payment deleted successfully'
            ]);
        });
    }
}
