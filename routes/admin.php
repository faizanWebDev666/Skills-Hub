<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminWalletController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
    Route::put('/profile', [AdminController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/avatar', [AdminController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile/avatar', [AdminController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::put('/profile/password', [AdminController::class, 'updatePassword'])->name('profile.password');

    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/users/trash', [AdminController::class, 'trashUsers'])->name('users.trash');
    Route::put('/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
    Route::post('/users/{user}/ban', [AdminController::class, 'banUser'])->name('users.ban');
    Route::post('/users/{user}/unban', [AdminController::class, 'unbanUser'])->name('users.unban');
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');
    Route::post('/users/{user}/restore', [AdminController::class, 'restoreUser'])->name('users.restore');
    Route::delete('/users/{user}/force', [AdminController::class, 'forceDeleteUser'])->name('users.force-delete');

    Route::get('/gigs', [AdminController::class, 'gigs'])->name('gigs');
    Route::get('/gigs/trash', [AdminController::class, 'trashGigs'])->name('gigs.trash');
    Route::patch('/gigs/{gig}/toggle', [AdminController::class, 'toggleGig'])->name('gigs.toggle');
    Route::delete('/gigs/{gig}', [AdminController::class, 'deleteGig'])->name('gigs.delete');
    Route::post('/gigs/{gig}/restore', [AdminController::class, 'restoreGig'])->name('gigs.restore');
    Route::delete('/gigs/{gig}/force', [AdminController::class, 'forceDeleteGig'])->name('gigs.force-delete');

    Route::get('/vendor-levels', [AdminController::class, 'vendorLevels'])->name('vendor-levels');
    Route::put('/vendor-levels/{user}', [AdminController::class, 'updateVendorLevel'])->name('vendor-levels.update');

    Route::get('/orders', [AdminController::class, 'orders'])->name('orders');
    Route::get('/orders/trash', [AdminController::class, 'trashOrders'])->name('orders.trash');
    Route::patch('/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('orders.status');
    Route::post('/orders/{order}/release-funds', [AdminController::class, 'releaseFunds'])->name('orders.release-funds');
    Route::delete('/orders/{order}', [AdminController::class, 'deleteOrder'])->name('orders.delete');
    Route::post('/orders/{order}/restore', [AdminController::class, 'restoreOrder'])->name('orders.restore');
    Route::delete('/orders/{order}/force', [AdminController::class, 'forceDeleteOrder'])->name('orders.force-delete');

    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::put('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    Route::get('/settings/commissions', [AdminController::class, 'commissionSettings'])->name('settings.commissions');
    Route::put('/settings/commissions', [AdminController::class, 'updateCommissionSettings'])->name('settings.commissions.update');

    Route::get('/reviews', [AdminController::class, 'reviews'])->name('reviews');
    Route::get('/reviews/{user}', [AdminController::class, 'vendorReviews'])->name('reviews.show');
    Route::post('/reviews/{user}/toggle-status', [AdminController::class, 'toggleVendorStatus'])->name('reviews.toggle-status');

    Route::get('/wallet', [AdminWalletController::class, 'dashboard'])->name('wallet.dashboard');
    Route::get('/wallet/wallets', [AdminWalletController::class, 'wallets'])->name('wallet.wallets');
    Route::get('/wallet/transactions', [AdminWalletController::class, 'transactions'])->name('wallet.transactions');
    Route::get('/wallet/withdrawals', [AdminWalletController::class, 'withdrawals'])->name('wallet.withdrawals');
    Route::post('/wallet/withdrawals/{transaction}/approve', [AdminWalletController::class, 'approveWithdrawal'])->name('wallet.withdrawals.approve');
    Route::post('/wallet/withdrawals/{transaction}/reject', [AdminWalletController::class, 'rejectWithdrawal'])->name('wallet.withdrawals.reject');
    Route::get('/wallet/users/{user}', [AdminWalletController::class, 'viewUserWallet'])->name('wallet.users.show');
    Route::post('/wallet/users/{user}/adjust', [AdminWalletController::class, 'adjustBalance'])->name('wallet.users.adjust');
    Route::get('/wallet/export', [AdminWalletController::class, 'exportTransactions'])->name('wallet.export');
});
