<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GigController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return redirect('/home');
});

Route::get('/home', [HomeController::class, 'index']);
Route::resource('gigs', GigController::class)->only(['index', 'show']);

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Gigs (auth required)
    Route::resource('gigs', GigController::class)->only(['create', 'store', 'edit', 'update', 'destroy']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{gig}/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/{conversation}/messages', [ChatController::class, 'messages'])->name('chat.messages');
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat/{conversation}', [ChatController::class, 'store'])->name('chat.store');
    Route::get('/chat/user/{user}', [ChatController::class, 'createWithUser'])->name('chat.with-user');
    Route::get('/freelancers/{user}', [VendorController::class, 'showFreelancer'])->name('freelancers.show');
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

    // Users
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
    Route::put('/admin/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('admin.users.role');
    Route::post('/admin/users/{user}/ban', [AdminController::class, 'banUser'])->name('admin.users.ban');
    Route::post('/admin/users/{user}/unban', [AdminController::class, 'unbanUser'])->name('admin.users.unban');
    Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');

    // Gigs
    Route::get('/admin/gigs', [AdminController::class, 'gigs'])->name('admin.gigs');
    Route::patch('/admin/gigs/{gig}/toggle', [AdminController::class, 'toggleGig'])->name('admin.gigs.toggle');
    Route::delete('/admin/gigs/{gig}', [AdminController::class, 'deleteGig'])->name('admin.gigs.delete');

    // Orders
    Route::get('/admin/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::patch('/admin/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.status');

    // Settings
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::put('/admin/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
});