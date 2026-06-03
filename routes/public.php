<?php

use App\Http\Controllers\GigController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index']);
Route::get('/how-it-works', [HomeController::class, 'howItWorks'])->name('how-it-works');
Route::get('/gigs/suggestions', [GigController::class, 'suggestions'])->name('gigs.suggestions');
Route::resource('gigs', GigController::class)->only(['index', 'show']);
Route::get('/freelancers/{user}', [VendorController::class, 'showFreelancer'])->name('freelancers.show');
