<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Http\Resources\InvoiceResource;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;

class InvoiceController extends Controller
{

    // helper generate invoice number
    private function generateInvoiceNumber(): string
    {
        $lastId = Invoice::max('id') + 1;

        return 'INV-' .
            now()->format('Y') .
            '-' .
            str_pad($lastId, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $invoices = Invoice::with([
            'student',
            'feeType',
            'schoolYear'
        ])
            ->latest()
            ->paginate(
                $request->get('per_page', 10)
            );

        return response()->json([
            'success' => true,
            'message' => 'Data invoice berhasil diambil',
            'data' => InvoiceResource::collection($invoices),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreInvoiceRequest $request
    ) {
        $amount = $request->amount;

        $discount =
            $request->discount_amount ?? 0;

        $remaining =
            $amount - $discount;

        $invoice = Invoice::create([
            'invoice_number' =>
            $this->generateInvoiceNumber(),

            'student_id' =>
            $request->student_id,

            'fee_type_id' =>
            $request->fee_type_id,

            'school_year_id' =>
            $request->school_year_id,

            'amount' =>
            $amount,

            'discount_amount' =>
            $discount,

            'paid_amount' => 0,

            'remaining_amount' =>
            $remaining,

            'due_date' =>
            $request->due_date,

            'status' => 'unpaid',

            'created_by' =>
            auth()->id(),
        ]);

        $invoice->load([
            'student',
            'feeType',
            'schoolYear'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice berhasil dibuat',
            'data' => new InvoiceResource($invoice)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(
        Invoice $invoice
    ) {
        $invoice->load([
            'student',
            'feeType',
            'schoolYear'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Detail invoice',
            'data' => new InvoiceResource($invoice)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateInvoiceRequest $request,
        Invoice $invoice
    ) {
        if ($invoice->paid_amount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice yang sudah memiliki pembayaran tidak dapat diubah'
            ], 422);
        }

        $invoice->update([
            'due_date' => $request->due_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice berhasil diperbarui',
            'data' => new InvoiceResource(
                $invoice->fresh()
            )
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Invoice $invoice
    ) {
        if ($invoice->paid_amount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice yang sudah memiliki pembayaran tidak dapat dihapus'
            ], 422);
        }

        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice berhasil dihapus'
        ]);
    }
}
