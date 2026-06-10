<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use App\Http\Resources\PaymentMethodResource;
use App\Http\Requests\StorePaymentMethodRequest;
use App\Http\Requests\UpdatePaymentMethodRequest;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $paymentMethods = PaymentMethod::latest()
            ->paginate(
                $request->get('per_page', 10)
            );

        return response()->json([
            'success' => true,
            'message' => 'Data metode pembayaran berhasil diambil',
            'data' => PaymentMethodResource::collection($paymentMethods),
            'meta' => [
                'current_page' => $paymentMethods->currentPage(),
                'last_page' => $paymentMethods->lastPage(),
                'per_page' => $paymentMethods->perPage(),
                'total' => $paymentMethods->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StorePaymentMethodRequest $request
    ) {
        $paymentMethod = PaymentMethod::create([
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->boolean(
                'is_active',
                true
            ),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Metode pembayaran berhasil dibuat',
            'data' => new PaymentMethodResource($paymentMethod)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(
        PaymentMethod $paymentMethod
    ) {
        return response()->json([
            'success' => true,
            'message' => 'Detail metode pembayaran',
            'data' => new PaymentMethodResource(
                $paymentMethod
            )
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdatePaymentMethodRequest $request,
        PaymentMethod $paymentMethod
    ) {
        $paymentMethod->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Metode pembayaran berhasil diperbarui',
            'data' => new PaymentMethodResource(
                $paymentMethod->fresh()
            )
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        PaymentMethod $paymentMethod
    ) {
        if ($paymentMethod->payments()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Metode pembayaran sudah digunakan dan tidak dapat dihapus'
            ], 422);
        }

        $paymentMethod->delete();

        return response()->json([
            'success' => true,
            'message' => 'Metode pembayaran berhasil dihapus'
        ]);
    }
}
