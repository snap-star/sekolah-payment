<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeeType;
use App\Http\Resources\FeeTypeResource;
use App\Http\Requests\StoreFeeTypeRequest;
use App\Http\Requests\UpdateFeeTypeRequest;

class FeeTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $feeTypes = FeeType::latest()
            ->paginate(
                $request->get('per_page', 10)
            );

        return response()->json([
            'success' => true,
            'message' => 'Data jenis biaya berhasil diambil',
            'data' => FeeTypeResource::collection($feeTypes),
            'meta' => [
                'current_page' => $feeTypes->currentPage(),
                'last_page' => $feeTypes->lastPage(),
                'per_page' => $feeTypes->perPage(),
                'total' => $feeTypes->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreFeeTypeRequest $request
    ) {
        $feeType = FeeType::create([
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'default_amount' => $request->default_amount,
            'recurring_type' => $request->recurring_type,
            'description' => $request->description,
            'is_active' => $request->boolean(
                'is_active',
                true
            ),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Jenis biaya berhasil dibuat',
            'data' => new FeeTypeResource($feeType)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(FeeType $feeType)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail jenis biaya',
            'data' => new FeeTypeResource($feeType)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateFeeTypeRequest $request,
        FeeType $feeType
    ) {
        $feeType->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Jenis biaya berhasil diperbarui',
            'data' => new FeeTypeResource(
                $feeType->fresh()
            )
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeType $feeType)
    {
        $feeType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jenis biaya berhasil dihapus'
        ]);
    }
}
