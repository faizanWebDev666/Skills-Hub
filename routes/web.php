<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GigController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\AdminWalletController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\ReviewController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::resource('gigs', GigController::class)->only(['index', 'show']);

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    // OAuth routes
    Route::get('/auth/google', [OAuthController::class, 'redirectToGoogle'])->name('oauth.google');
    Route::get('/auth/google/callback', [OAuthController::class, 'handleGoogleCallback'])->name('oauth.google.callback');
    Route::get('/auth/facebook', [OAuthController::class, 'redirectToFacebook'])->name('oauth.facebook');
    Route::get('/auth/facebook/callback', [OAuthController::class, 'handleFacebookCallback'])->name('oauth.facebook.callback');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::resource('gigs', GigController::class)->only(['create', 'store', 'edit', 'update', 'destroy']);

    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::get('/wishlist/items', [WishlistController::class, 'getItems'])->name('wishlist.items');
    Route::post('/wishlist/{gig}/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    // Wallet routes
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
    
    // Notification routes
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
    Route::get('/freelancers/{user}', [VendorController::class, 'showFreelancer'])->name('freelancers.show');
});

Route::middleware(['auth', 'role:freelancer|vendor|admin'])->group(function () {
    Route::get('/vendor/dashboard', [VendorController::class, 'dashboard'])->name('vendor.dashboard');
    Route::get('/vendor/orders', [VendorController::class, 'orders'])->name('vendor.orders');
    Route::get('/vendor/gigs', [VendorController::class, 'gigs'])->name('vendor.gigs');
    Route::get('/vendor/gigs/create', [VendorController::class, 'createGig'])->name('vendor.gigs.create');
    Route::post('/vendor/gigs', [VendorController::class, 'storeGig'])->name('vendor.gigs.store');
    Route::get('/vendor/gigs/{gig}/edit', [VendorController::class, 'editGig'])->name('vendor.gigs.edit');
    Route::put('/vendor/gigs/{gig}', [VendorController::class, 'updateGig'])->name('vendor.gigs.update');
    Route::delete('/vendor/gigs/{gig}', [VendorController::class, 'deleteGig'])->name('vendor.gigs.delete');
    Route::patch('/vendor/gigs/{gig}/toggle', [VendorController::class, 'toggleGig'])->name('vendor.gigs.toggle');
    Route::get('/vendor/profile', [VendorController::class, 'profile'])->name('vendor.profile');
    Route::get('/vendor/subscriptions', [VendorController::class, 'subscriptions'])->name('vendor.subscriptions');
    Route::post('/vendor/subscriptions/purchase', [VendorController::class, 'purchaseSubscription'])->name('vendor.subscriptions.purchase');
    Route::get('/vendor/subscriptions/success', [VendorController::class, 'subscriptionSuccess'])->name('vendor.subscriptions.success');
    Route::get('/vendor/subscriptions/cancel', [VendorController::class, 'subscriptionCancel'])->name('vendor.subscriptions.cancel');
    Route::get('/vendor/reviews', [VendorController::class, 'reviews'])->name('vendor.reviews');
    Route::post('/vendor/reviews/{review}/reply', [VendorController::class, 'replyReview'])->name('vendor.reviews.reply');
    
    // Vendor Profile
    Route::put('/vendor/profile', [VendorController::class, 'updateProfile'])->name('vendor.profile.update');
    Route::post('/vendor/profile/avatar', [VendorController::class, 'updateAvatar'])->name('vendor.profile.avatar');
    Route::delete('/vendor/profile/avatar', [VendorController::class, 'removeAvatar'])->name('vendor.profile.avatar.remove');
    Route::post('/vendor/profile/certificates', [VendorController::class, 'uploadCertificate'])->name('vendor.profile.certificates.upload');
    Route::delete('/vendor/profile/certificates/{index}', [VendorController::class, 'removeCertificate'])->name('vendor.profile.certificates.remove');
    Route::post('/vendor/profile/portfolio/images', [VendorController::class, 'uploadPortfolioImage'])->name('vendor.profile.portfolio.images.upload');
    Route::delete('/vendor/profile/portfolio/images/{index}', [VendorController::class, 'removePortfolioImage'])->name('vendor.profile.portfolio.images.remove');
    Route::post('/vendor/profile/portfolio/videos', [VendorController::class, 'uploadPortfolioVideo'])->name('vendor.profile.portfolio.videos.upload');
    Route::delete('/vendor/profile/portfolio/videos/{index}', [VendorController::class, 'removePortfolioVideo'])->name('vendor.profile.portfolio.videos.remove');
    Route::post('/vendor/profile/resume', [VendorController::class, 'uploadResume'])->name('vendor.profile.resume.upload');
    Route::delete('/vendor/profile/resume', [VendorController::class, 'removeResume'])->name('vendor.profile.resume.remove');
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

    // Vendor Levels
    Route::get('/admin/vendor-levels', [AdminController::class, 'vendorLevels'])->name('admin.vendor-levels');
    Route::put('/admin/vendor-levels/{user}', [AdminController::class, 'updateVendorLevel'])->name('admin.vendor-levels.update');

    // Orders
    Route::get('/admin/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::patch('/admin/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.status');
    Route::post('/admin/orders/{order}/release-funds', [AdminController::class, 'releaseFunds'])->name('admin.orders.release-funds');

    // Settings
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::put('/admin/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');

    // Reviews & Ratings
    Route::get('/admin/reviews', [AdminController::class, 'reviews'])->name('admin.reviews');
    Route::get('/admin/reviews/{user}', [AdminController::class, 'vendorReviews'])->name('admin.reviews.show');
    Route::post('/admin/reviews/{user}/toggle-status', [AdminController::class, 'toggleVendorStatus'])->name('admin.reviews.toggle-status');

    // Wallet Management
    Route::get('/admin/wallet', [AdminWalletController::class, 'dashboard'])->name('admin.wallet.dashboard');
    Route::get('/admin/wallet/wallets', [AdminWalletController::class, 'wallets'])->name('admin.wallet.wallets');
    Route::get('/admin/wallet/transactions', [AdminWalletController::class, 'transactions'])->name('admin.wallet.transactions');
    Route::get('/admin/wallet/withdrawals', [AdminWalletController::class, 'withdrawals'])->name('admin.wallet.withdrawals');
    Route::post('/admin/wallet/withdrawals/{transaction}/approve', [AdminWalletController::class, 'approveWithdrawal'])->name('admin.wallet.withdrawals.approve');
    Route::post('/admin/wallet/withdrawals/{transaction}/reject', [AdminWalletController::class, 'rejectWithdrawal'])->name('admin.wallet.withdrawals.reject');
    Route::get('/admin/wallet/users/{user}', [AdminWalletController::class, 'viewUserWallet'])->name('admin.wallet.users.show');
    Route::post('/admin/wallet/users/{user}/adjust', [AdminWalletController::class, 'adjustBalance'])->name('admin.wallet.users.adjust');
    Route::get('/admin/wallet/export', [AdminWalletController::class, 'exportTransactions'])->name('admin.wallet.export');
});