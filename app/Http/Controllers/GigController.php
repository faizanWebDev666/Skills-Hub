<?php

namespace App\Http\Controllers;

use App\Models\Gig;
use App\Models\Order;
use App\Models\User;
use App\Models\CommissionSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

class GigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Gig::with('user')->active();

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        switch ($request->get('sort', 'recommended')) {
            case 'newest':
                $query->latest();
                break;
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->latest();
                break;
        }

        $gigs = $query->paginate(12)->withQueryString();

        // Get user's wishlist IDs
        $wishlistGigIds = auth()->check() 
            ? auth()->user()->wishlists()->pluck('gig_id')->toArray() 
            : [];

        return Inertia::render('Gigs/Index', [
            'gigs' => $gigs,
            'filters' => [
                'category' => $request->get('category', 'all'),
                'search' => $request->get('search', ''),
                'sort' => $request->get('sort', 'recommended'),
            ],
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
            'wishlistGigIds' => $wishlistGigIds,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Gigs/Create', [
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gigs', 'public');
        }

        Gig::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'tags' => $request->tags,
            'image' => $imagePath,
        ]);

        return redirect()->route('vendor.gigs')->with('success', 'Gig created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gig $gig)
    {
        $gig->load('user');

        $seller = $gig->user;
        $stats = [
            'totalOrders' => $seller->freelancerOrders->count(),
            'completedOrders' => $seller->freelancerOrders->where('status', 'completed')->count(),
            'reviewsCount' => $seller->reviewsReceived->count(),
            'avgRating' => $seller->reviewsReceived->count() > 0 
                ? number_format($seller->reviewsReceived->avg('rating'), 1) 
                : 0,
        ];

        $isInWishlist = auth()->check() 
            ? auth()->user()->wishlists()->where('gig_id', $gig->id)->exists() 
            : false;

        return Inertia::render('Gigs/Show', [
            'gig' => $gig,
            'sellerStats' => $stats,
            'reviews' => $seller->reviewsReceived->load('reviewer'),
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
            'isInWishlist' => $isInWishlist,
        ]);
    }

    /**
     * Show checkout page.
     */
    public function checkout(Gig $gig)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        if ($gig->user_id === auth()->id()) {
            return back()->with('error', 'You cannot purchase your own gig.');
        }

        if (!$gig->active) {
            return back()->with('error', 'This gig is not available for purchase right now.');
        }

        $gig->load('user');

        return Inertia::render('Gigs/Checkout', [
            'gig' => $gig,
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
        ]);
    }

    /**
     * Store a new order for a gig and initiate Stripe Checkout.
     */
    public function order(Request $request, Gig $gig)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        if ($gig->user_id === auth()->id()) {
            return back()->with('error', 'You cannot purchase your own gig.');
        }

        if (!$gig->active) {
            return back()->with('error', 'This gig is not available for purchase right now.');
        }

        $request->validate([
            'requirements' => 'nullable|string|max:2000',
        ]);

        // Create the order as pending_payment
        $order = Order::create([
            'customer_id' => auth()->id(),
            'freelancer_id' => $gig->user_id,
            'gig_id' => $gig->id,
            'amount' => $gig->price,
            'requirements' => $request->requirements,
            'status' => 'pending_payment',
        ]);

        // Initiate Stripe Checkout
        Stripe::setApiKey(config('services.stripe.secret'));

        $checkout_session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => $gig->price * 100, // Amount in cents
                    'product_data' => [
                        'name' => 'Gig: ' . $gig->title,
                        'description' => 'Service from ' . $gig->user->name,
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('gigs.payment.success', $order->id) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('gigs.payment.cancel', $order->id),
            'client_reference_id' => $order->id,
        ]);

        return Inertia::location($checkout_session->url);
    }

    public function paymentSuccess(Request $request, Order $order)
    {
        // Ideally verify the session with Stripe using $request->session_id
        if ($order->status === 'pending_payment') {
            $order->update([
                'status' => 'in_progress', // Changed from pending_payment to in_progress
            ]);
        }

        return redirect()->route('profile.show')->with('success', 'Payment successful! Your order is now in progress.');
    }

    public function paymentCancel(Order $order)
    {
        if ($order->status === 'pending_payment') {
            $order->update(['status' => 'cancelled']);
        }

        return redirect()->route('gigs.show', $order->gig)->with('error', 'Payment was cancelled.');
    }

    public function deliverOrder(Order $order)
    {
        if (auth()->id() !== $order->freelancer_id) {
            return back()->with('error', 'Unauthorized.');
        }

        $order->update(['status' => 'delivered']);

        return back()->with('success', 'Order marked as delivered. Waiting for customer approval.');
    }

    public function completeOrder(Order $order)
    {
        if (auth()->id() !== $order->customer_id) {
            return back()->with('error', 'Unauthorized.');
        }

        if ($order->status === 'completed') {
            return back()->with('error', 'Order is already completed.');
        }

        DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Note: The payment was held in Stripe/Admin account. 
            // The vendor will receive the funds when the Admin explicitly releases them from the Admin dashboard.
        });

        return back()->with('success', 'Order completed! The admin will release the funds to the freelancer shortly.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gig $gig)
    {
        $this->authorize('update', $gig);

        return Inertia::render('Gigs/Edit', [
            'gig' => $gig,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gig $gig)
    {
        $this->authorize('update', $gig);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'active' => 'boolean',
        ]);

        $gig->update($request->only(['title', 'description', 'price', 'category', 'tags', 'active']));

        return redirect()->route('gigs.show', $gig)->with('success', 'Gig updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gig $gig)
    {
        $this->authorize('delete', $gig);

        $gig->delete();

        return redirect()->route('vendor.gigs')->with('success', 'Gig deleted successfully.');
    }
}
