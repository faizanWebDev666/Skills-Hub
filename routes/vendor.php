<?php

use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:freelancer|vendor|admin'])->prefix('vendor')->name('vendor.')->group(function () {
    Route::get('/dashboard', [VendorController::class, 'dashboard'])->name('dashboard');
    Route::get('/order-stats', [VendorController::class, 'getOrderStats'])->name('order-stats');
    Route::get('/orders', [VendorController::class, 'orders'])->name('orders');
    Route::get('/gigs', [VendorController::class, 'gigs'])->name('gigs');
    Route::get('/gigs/create', [VendorController::class, 'createGig'])->name('gigs.create');
    Route::post('/gigs', [VendorController::class, 'storeGig'])->name('gigs.store');
    Route::get('/gigs/{gig}/edit', [VendorController::class, 'editGig'])->name('gigs.edit');
    Route::put('/gigs/{gig}', [VendorController::class, 'updateGig'])->name('gigs.update');
    Route::delete('/gigs/{gig}', [VendorController::class, 'deleteGig'])->name('gigs.delete');
    Route::patch('/gigs/{gig}/toggle', [VendorController::class, 'toggleGig'])->name('gigs.toggle');
    Route::get('/profile', [VendorController::class, 'profile'])->name('profile');
    Route::get('/subscriptions', [VendorController::class, 'subscriptions'])->name('subscriptions');
    Route::post('/subscriptions/purchase', [VendorController::class, 'purchaseSubscription'])->name('subscriptions.purchase');
    Route::get('/subscriptions/success', [VendorController::class, 'subscriptionSuccess'])->name('subscriptions.success');
    Route::get('/subscriptions/cancel', [VendorController::class, 'subscriptionCancel'])->name('subscriptions.cancel');
    Route::get('/reviews', [VendorController::class, 'reviews'])->name('reviews');
    Route::post('/reviews/{review}/reply', [VendorController::class, 'replyReview'])->name('reviews.reply');

    Route::put('/profile', [VendorController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/avatar', [VendorController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile/avatar', [VendorController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::post('/profile/certificates', [VendorController::class, 'uploadCertificate'])->name('profile.certificates.upload');
    Route::delete('/profile/certificates/{index}', [VendorController::class, 'removeCertificate'])->name('profile.certificates.remove');
    Route::post('/profile/portfolio/images', [VendorController::class, 'uploadPortfolioImage'])->name('profile.portfolio.images.upload');
    Route::delete('/profile/portfolio/images/{index}', [VendorController::class, 'removePortfolioImage'])->name('profile.portfolio.images.remove');
    Route::post('/profile/portfolio/videos', [VendorController::class, 'uploadPortfolioVideo'])->name('profile.portfolio.videos.upload');
    Route::delete('/profile/portfolio/videos/{index}', [VendorController::class, 'removePortfolioVideo'])->name('profile.portfolio.videos.remove');
    Route::post('/profile/resume', [VendorController::class, 'uploadResume'])->name('profile.resume.upload');
    Route::delete('/profile/resume', [VendorController::class, 'removeResume'])->name('profile.resume.remove');
});
