<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\AuthController;

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.post');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

// Katalog utama untuk pencarian dan filter
Route::get('/', [BookController::class, 'index'])->name('katalog.index');

// Switch Role Simulation Route
Route::get('/switch-role/{role}', function ($role) {
    if (in_array($role, ['user', 'admin'])) {
        session(['role' => $role]);
    }
    return redirect()->back()->with('success_role', 'Peran berhasil diubah menjadi ' . ($role === 'admin' ? 'Pustakawan / Admin' : 'Anggota / Siswa'));
})->name('role.switch');

// Portal Admin
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [BookController::class, 'adminIndex'])->name('index');
    Route::post('/books', [BookController::class, 'store'])->name('books.store');
    Route::delete('/books/{book}', [BookController::class, 'destroy'])->name('books.destroy');
});

// Peminjaman
Route::prefix('peminjaman')->name('peminjaman.')->group(function () {
    Route::get('/', [LoanController::class, 'index'])->name('index');
    Route::get('/create/{book_id}', [LoanController::class, 'create'])->name('create');
    Route::post('/store', [LoanController::class, 'store'])->name('store');
    Route::post('/return/{loan_id}', [LoanController::class, 'returnBook'])->name('return');
});
