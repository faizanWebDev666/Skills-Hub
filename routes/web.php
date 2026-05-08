<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GigController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return redirect('/home');
});

Route::get('/home', [HomeController::class, 'index']);
Route::resource('gigs', GigController::class);

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'role:freelancer|vendor|admin'])->group(function () {
    Route::get('/vendor/dashboard', [VendorController::class, 'dashboard'])->name('vendor.dashboard');
    Route::get('/vendor/gigs', [VendorController::class, 'gigs'])->name('vendor.gigs');
    Route::get('/vendor/gigs/{gig}/edit', [VendorController::class, 'editGig'])->name('vendor.gigs.edit');
    Route::put('/vendor/gigs/{gig}', [VendorController::class, 'updateGig'])->name('vendor.gigs.update');
    Route::delete('/vendor/gigs/{gig}', [VendorController::class, 'deleteGig'])->name('vendor.gigs.delete');
    Route::patch('/vendor/gigs/{gig}/toggle', [VendorController::class, 'toggleGig'])->name('vendor.gigs.toggle');
    Route::get('/vendor/profile', [VendorController::class, 'profile'])->name('vendor.profile');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/admin/gigs', [AdminController::class, 'gigs'])->name('admin.gigs');
    Route::get('/admin/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::get('/admin/reports', [AdminController::class, 'reports'])->name('admin.reports');
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
});