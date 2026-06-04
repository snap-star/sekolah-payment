<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\StudentGuardianResource;
use App\Models\StudentGuardian;
use App\Http\Requests\StoreStudentGuardianRequest;
use App\Http\Requests\UpdateStudentGuardianRequest;



// student guardian controller
class StudentGuardianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guardians = StudentGuardian::with('student')
            ->latest()
            ->paginate(
                $request->get('per_page', 10)
            );

        return response()->json([
            'success' => true,
            'message' => 'Data wali siswa berhasil diambil',
            'data' => StudentGuardianResource::collection($guardians),
            'meta' => [
                'current_page' => $guardians->currentPage(),
                'last_page' => $guardians->lastPage(),
                'per_page' => $guardians->perPage(),
                'total' => $guardians->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentGuardianRequest $request)
    {
        $guardian = StudentGuardian::create(
            $request->validated()
        );

        $guardian->load('student');

        return response()->json([
            'success' => true,
            'message' => 'Wali siswa berhasil dibuat',
            'data' => new StudentGuardianResource($guardian)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentGuardian $studentGuardian)
    {
        $studentGuardian->load('student');

        return response()->json([
            'success' => true,
            'message' => 'Detail wali siswa',
            'data' => new StudentGuardianResource($studentGuardian)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateStudentGuardianRequest $request,
        StudentGuardian $studentGuardian
    ) {
        $studentGuardian->update(
            $request->validated()
        );

        $studentGuardian->load('student');

        return response()->json([
            'success' => true,
            'message' => 'Wali siswa berhasil diperbarui',
            'data' => new StudentGuardianResource($studentGuardian)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentGuardian $studentGuardian)
    {
        $studentGuardian->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wali siswa berhasil dihapus'
        ]);
    }
}
