<?php

namespace App\Http\Controllers;

use App\Models\Gig;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class VendorController extends Controller
{
    use AuthorizesRequests;
    public function dashboard()
    {
        $user = auth()->user();

        $totalRevenue = Order::where('freelancer_id', $user->id)
            ->where('status', 'completed')
            ->sum('amount');

        $activeGigs = Gig::where('user_id', $user->id)
            ->where('active', true)
            ->count();

        $pendingOrders = Order::where('freelancer_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $completedOrders = Order::where('freelancer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $totalOrders = Order::where('freelancer_id', $user->id)->count();

        $stats = [
            'totalRevenue' => $totalRevenue,
            'activeGigs' => $activeGigs,
            'pendingOrders' => $pendingOrders,
            'completedOrders' => $completedOrders,
            'totalOrders' => $totalOrders,
            'averageRating' => 4.9,
            'totalReviews' => 0,
        ];

        $recentOrders = Order::where('freelancer_id', $user->id)
            ->with(['customer', 'gig'])
            ->latest()
            ->take(5)
            ->get();

        $myGigs = Gig::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Vendor/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'myGigs' => $myGigs,
            'user' => $user->load('roles'),
        ]);
    }

    public function profile()
    {
        return Inertia::render('Vendor/Profile', [
            'user' => auth()->user()->load('roles'),
        ]);
    }

    public function gigs()
    {
        $user = auth()->user();

        $gigs = Gig::where('user_id', $user->id)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $totalGigs = Gig::where('user_id', $user->id)->count();
        $activeGigs = Gig::where('user_id', $user->id)->where('active', true)->count();
        $pausedGigs = $totalGigs - $activeGigs;

        return Inertia::render('Vendor/Gigs', [
            'gigs' => $gigs,
            'counts' => [
                'total' => $totalGigs,
                'active' => $activeGigs,
                'paused' => $pausedGigs,
            ],
            'user' => $user->load('roles'),
        ]);
    }

    public function editGig(Gig $gig)
    {
        $this->authorize('update', $gig);

        return Inertia::render('Vendor/GigEdit', [
            'gig' => $gig,
            'user' => auth()->user()->load('roles'),
        ]);
    }

    public function updateGig(Request $request, Gig $gig)
    {
        $this->authorize('update', $gig);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $updateData = $request->only(['title', 'description', 'price', 'category', 'tags']);

        if ($request->hasFile('image')) {
            $updateData['image'] = $request->file('image')->store('gigs', 'public');
        }

        $gig->update($updateData);

        return redirect()->route('vendor.gigs')->with('success', 'Gig updated successfully.');
    }

    public function deleteGig(Gig $gig)
    {
        $this->authorize('delete', $gig);

        $gig->delete();

        return redirect()->route('vendor.gigs')->with('success', 'Gig deleted successfully.');
    }

    public function toggleGig(Gig $gig)
    {
        $this->authorize('update', $gig);

        $gig->update(['active' => !$gig->active]);

        return back()->with('success', $gig->active ? 'Gig activated.' : 'Gig paused.');
    }
}
