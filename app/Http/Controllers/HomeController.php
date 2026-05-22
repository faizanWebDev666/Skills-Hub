<?php

namespace App\Http\Controllers;

use App\Models\Gig;
use App\Models\User;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $topSellerIds = User::withAvg('reviewsReceived', 'rating')
            ->having('reviews_received_avg_rating', '>=', 4.9)
            ->orderByDesc('reviews_received_avg_rating')
            ->limit(4)
            ->pluck('id')
            ->toArray();

        $featuredGigsQuery = Gig::with(['user' => function ($query) {
            $query->withAvg('reviewsReceived', 'rating')->withCount('reviewsReceived');
        }])->active()->latest();

        if (!empty($topSellerIds)) {
            $featuredGigsQuery->whereIn('user_id', $topSellerIds);
        }

        $featuredGigs = $featuredGigsQuery->take(4)->get();

        if ($featuredGigs->isEmpty()) {
            $featuredGigs = Gig::with(['user' => function ($query) {
                $query->withAvg('reviewsReceived', 'rating')->withCount('reviewsReceived');
            }])->active()->latest()->take(4)->get();
        }

        return Inertia::render('Home', [
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
            'featuredGigs' => $featuredGigs,
        ]);
    }

    public function howItWorks()
    {
        return Inertia::render('HowItWorks', [
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
        ]);
    }
}
