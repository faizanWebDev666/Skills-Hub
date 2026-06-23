<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/register/verify', [RegisteredUserController::class, 'verify'])->name('register.verify');
    Route::post('/register/verify', [RegisteredUserController::class, 'verifySubmit']);

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/forgot-password', [PasswordResetController::class, 'showRequest'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendReset'])->name('password.email');
    Route::get('/password/reset/{token}', [PasswordResetController::class, 'showReset'])->name('password.reset');
    Route::post('/password/reset', [PasswordResetController::class, 'reset'])->name('password.update');

    Route::get('/auth/google', [OAuthController::class, 'redirectToGoogle'])->name('oauth.google');
    Route::get('/auth/google/callback', [OAuthController::class, 'handleGoogleCallback'])->name('oauth.google.callback');
    Route::get('/auth/facebook', [OAuthController::class, 'redirectToFacebook'])->name('oauth.facebook');
    Route::get('/auth/facebook/callback', [OAuthController::class, 'handleFacebookCallback'])->name('oauth.facebook.callback');
});
