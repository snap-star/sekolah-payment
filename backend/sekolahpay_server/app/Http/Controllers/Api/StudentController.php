<?php

namespace App\Http\Controllers\Api;

use App\Models\Student;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::latest()->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Students retrieved successfully',
            'data' => StudentResource::collection($students),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(StoreStudentRequest $request)
    {
        $student = Student::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => new StudentResource($student),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return response()->json([
            'success' => true,
            'message' => 'Student retrieved successfully',
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(
        UpdateStudentRequest $request,
        Student $student
    ) {
        $student->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => new StudentResource(
                $student->fresh()
            ),
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }
}
