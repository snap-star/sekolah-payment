<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('auth')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);

        Route::post('/refresh', [AuthController::class, 'refresh']);

        Route::post('/logout', [AuthController::class, 'logout']);
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

    Route::middleware([
        'auth:api',
        'role:admin,bendahara'
    ])->get('/finance-test', function () {

        return response()->json([
            'message' => 'Finance Area'
        ]);
    });
});
