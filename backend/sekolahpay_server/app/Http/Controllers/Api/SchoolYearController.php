<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use App\Http\Resources\SchoolYearResource;
use App\Http\Requests\StoreSchoolYearRequest;
use App\Http\Requests\UpdateSchoolYearRequest;

class SchoolYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $schoolYears = SchoolYear::latest()
            ->paginate(
                $request->get('per_page', 10)
            );

        return response()->json([
            'success' => true,
            'message' => 'Data tahun ajaran berhasil diambil',
            'data' => SchoolYearResource::collection($schoolYears),
            'meta' => [
                'current_page' => $schoolYears->currentPage(),
                'last_page' => $schoolYears->lastPage(),
                'per_page' => $schoolYears->perPage(),
                'total' => $schoolYears->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreSchoolYearRequest $request
    ) {
        if ($request->boolean('is_active')) {
            SchoolYear::query()
                ->update([
                    'is_active' => false
                ]);
        }

        $schoolYear = SchoolYear::create([
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->boolean(
                'is_active',
                false
            ),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil dibuat',
            'data' => new SchoolYearResource($schoolYear)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolYear $schoolYear)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail tahun ajaran',
            'data' => new SchoolYearResource($schoolYear)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateSchoolYearRequest $request,
        SchoolYear $schoolYear
    ) {
        if ($request->boolean('is_active')) {
            SchoolYear::query()
                ->where('id', '!=', $schoolYear->id)
                ->update([
                    'is_active' => false
                ]);
        }

        $schoolYear->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil diperbarui',
            'data' => new SchoolYearResource(
                $schoolYear->fresh()
            )
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        SchoolYear $schoolYear
    ) {
        if ($schoolYear->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran aktif tidak dapat dihapus'
            ], 422);
        }

        $schoolYear->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil dihapus'
        ]);
    }
}
