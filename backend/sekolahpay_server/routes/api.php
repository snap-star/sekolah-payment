<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentGuardianController;
use App\Http\Controllers\Api\FeeTypeController;
use App\Http\Controllers\Api\SchoolYearController;

// auth resource
Route::prefix('auth')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);

        Route::post('/refresh', [AuthController::class, 'refresh']);

        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// test admin role
Route::middleware([
    'auth:api',
    'role:admin'
])->get('/admin-test', function () {

    return response()->json([
        'message' => 'Halo Admin'
    ]);
});

// Admin and Bendahara role
Route::middleware([
    'auth:api',
    'role:admin,bendahara'
])->group(function () {

    Route::apiResource('students', StudentController::class); // student resource
    Route::apiResource('student-guardians', StudentGuardianController::class); // student guardian resource
    Route::apiResource('fee-types', FeeTypeController::class);
    Route::apiResource('school-years', SchoolYearController::class);
});
