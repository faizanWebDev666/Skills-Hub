<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\GigController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/become-vendor', [ProfileController::class, 'becomeVendor'])->name('become-vendor');

    Route::resource('gigs', GigController::class)->only(['create', 'store', 'edit', 'update', 'destroy']);

    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::get('/wishlist/items', [WishlistController::class, 'getItems'])->name('wishlist.items');
    Route::post('/wishlist/{gig}/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    Route::get('/wallet', [WalletController::class, 'show'])->name('wallet.show');
    Route::get('/wallet/transactions', [WalletController::class, 'transactions'])->name('wallet.transactions');
    Route::post('/wallet/deposit', [WalletController::class, 'deposit'])->name('wallet.deposit');
    Route::post('/wallet/deposit/stripe', [WalletController::class, 'createStripeCheckout'])->name('wallet.deposit.stripe');
    Route::post('/wallet/deposit/paypal', [WalletController::class, 'createPayPalPayment'])->name('wallet.deposit.paypal');
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw'])->name('wallet.withdraw');
    Route::post('/wallet/transfer', [WalletController::class, 'transfer'])->name('wallet.transfer');
    Route::get('/wallet/deposit/success', [WalletController::class, 'paymentSuccess'])->name('wallet.deposit.success');
    Route::get('/wallet/deposit/cancel', [WalletController::class, 'depositCancel'])->name('wallet.deposit.cancel');

    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/{conversation}/messages', [ChatController::class, 'messages'])->name('chat.messages');
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat/{conversation}', [ChatController::class, 'store'])->name('chat.store');
    Route::get('/chat/user/{user}', [ChatController::class, 'createWithUser'])->name('chat.with-user');
    Route::get('/chat/users/search', [ChatController::class, 'searchUsers'])->name('chat.users.search');

    // Voice calling routes
    Route::prefix('calls')->name('calls.')->group(function () {
        Route::post('/initiate', [\App\Http\Controllers\CallController::class, 'initiate'])->name('initiate');
        Route::post('/{callUuid}/accept', [\App\Http\Controllers\CallController::class, 'accept'])->name('accept');
        Route::post('/{callUuid}/reject', [\App\Http\Controllers\CallController::class, 'reject'])->name('reject');
        Route::post('/{callUuid}/end', [\App\Http\Controllers\CallController::class, 'end'])->name('end');
        Route::post('/{callUuid}/missed', [\App\Http\Controllers\CallController::class, 'markMissed'])->name('missed');
        Route::get('/{callUuid}', [\App\Http\Controllers\CallController::class, 'show'])->name('show');
        Route::get('/active/list', [\App\Http\Controllers\CallController::class, 'active'])->name('active');
        Route::get('/history/list', [\App\Http\Controllers\CallController::class, 'history'])->name('history');
        Route::get('/missed/list', [\App\Http\Controllers\CallController::class, 'missedCalls'])->name('missed-list');
        Route::get('/statistics/user', [\App\Http\Controllers\CallController::class, 'statistics'])->name('statistics');
        Route::get('/token/generate', [\App\Http\Controllers\CallController::class, 'generateToken'])->name('token');
    });

    Route::get('/notifications/unread-count', [ChatController::class, 'getUnreadNotifications'])->name('notifications.unread-count');
    Route::get('/notifications', [ChatController::class, 'getNotifications'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [ChatController::class, 'markNotificationAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [ChatController::class, 'markAllNotificationsAsRead'])->name('notifications.mark-all-read');

    Route::get('/gigs/{gig}/checkout', [GigController::class, 'checkout'])->name('gigs.checkout');
    Route::post('/gigs/{gig}/order', [GigController::class, 'order'])->name('gigs.order');
    Route::get('/orders/{order}/success', [GigController::class, 'paymentSuccess'])->name('gigs.payment.success');
    Route::get('/orders/{order}/cancel', [GigController::class, 'paymentCancel'])->name('gigs.payment.cancel');
    Route::post('/orders/{order}/deliver', [GigController::class, 'deliverOrder'])->name('orders.deliver');
    Route::post('/orders/{order}/complete', [GigController::class, 'completeOrder'])->name('orders.complete');
    Route::post('/orders/{order}/reviews', [ReviewController::class, 'store'])->name('orders.reviews.store');
});
