<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TagihanController;
use App\Http\Controllers\UserAdminController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'authenticate']);

// Authenticated with mock auth
Route::middleware(\App\Http\Middleware\CheckMockAuth::class)->group(function () {
    Route::get('/', fn() => redirect()->route('dashboard'));
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/tagihan', [TagihanController::class, 'index'])->name('tagihan');
    Route::post('/tagihan', [TagihanController::class, 'store'])->name('tagihan.store');
    Route::put('/tagihan/{id}', [TagihanController::class, 'update'])->name('tagihan.update');
    Route::post('/tagihan/{id}/generate-qris', [TagihanController::class, 'generateQris'])->name('tagihan.qris');

    Route::get('/user-admin', [UserAdminController::class, 'index'])->name('user-admin.index');
    Route::post('/user-admin', [UserAdminController::class, 'store'])->name('user-admin.store');

    Route::get('/report', [ReportController::class, 'index'])->name('report.index');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
