<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Gig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = Wishlist::where('user_id', auth()->id())
            ->with(['gig.user'])
            ->latest()
            ->get();

        return Inertia::render('Wishlist/Index', [
            'wishlistItems' => $wishlistItems
        ]);
    }

    public function toggle(Gig $gig)
    {
        $wishlist = Wishlist::where('user_id', auth()->id())
            ->where('gig_id', $gig->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            $status = 'removed';
        } else {
            Wishlist::create([
                'user_id' => auth()->id(),
                'gig_id' => $gig->id
            ]);
            $status = 'added';
        }

        return back()->with('message', "Gig $status from wishlist");
    }
}
