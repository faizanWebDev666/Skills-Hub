<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Gig;
use App\Models\Message;
use App\Models\Review;
use App\Models\Subscription;
use App\Models\User;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user()->load('gigs');
        $stats = [
            'totalGigs' => $user->gigs->count(),
            'activeGigs' => $user->gigs->where('active', true)->count(),
            'totalOrders' => $user->freelancerOrders->count(),
            'completedOrders' => $user->freelancerOrders->where('status', 'completed')->count(),
        ];

        $recentOrders = $user->freelancerOrders()
            ->with(['customer', 'gig'])
            ->latest()
            ->take(5)
            ->get();

        $myGigs = $user->gigs()->latest()->take(5)->get();

        $currentSubscription = Subscription::where('user_id', $user->id)->where('active', true)->latest()->first();

        // Load conversations and unread message count
        $conversations = Conversation::forUser($user)
            ->with(['userOne:id,name,avatar', 'userTwo:id,name,avatar', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $otherUser = $conversation->getOtherUser($user);
                $unreadCount = Message::where('conversation_id', $conversation->id)
                    ->where('user_id', '!=', $user->id)
                    ->where('read', false)
                    ->count();

                return [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                    ],
                    'latest_message' => $conversation->latestMessage,
                    'unread_count' => $unreadCount,
                    'last_message_at' => $conversation->last_message_at,
                ];
            });

        $totalUnreadMessages = $conversations->sum('unread_count');

        // Get initial chart data (last 7 days)
        $initialChartData = $this->getChartDataForPeriod($user, '7days');

        return Inertia::render('Vendor/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'myGigs' => $myGigs,
            'subscription' => $currentSubscription,
            'conversations' => $conversations,
            'totalUnreadMessages' => $totalUnreadMessages,
            'initialChartData' => $initialChartData,
        ]);
    }

    private function getChartDataForPeriod($user, $period, $startDate = null, $endDate = null)
    {
        $query = $user->freelancerOrders();

        // Determine date range
        if ($period === 'today') {
            $query->whereDate('created_at', today());
        } elseif ($period === 'yesterday') {
            $query->whereDate('created_at', today()->subDay());
        } elseif ($period === '7days') {
            $query->where('created_at', '>=', today()->subDays(7));
        } elseif ($period === '30days') {
            $query->where('created_at', '>=', today()->subDays(30));
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } else {
            $query->where('created_at', '>=', today()->subDays(7));
        }

        $orders = $query->orderBy('created_at')->get();

        // Group orders by date
        $groupedOrders = $orders->groupBy(function ($order) {
            return $order->created_at->format('Y-m-d');
        });

        // Prepare chart data
        $chartData = [];
        $statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

        // Get date range
        if ($period === 'today') {
            $dates = [today()];
        } elseif ($period === 'yesterday') {
            $dates = [today()->subDay()];
        } elseif ($period === '7days') {
            $dates = collect();
            for ($i = 6; $i >= 0; $i--) {
                $dates->push(today()->subDays($i));
            }
        } elseif ($period === '30days') {
            $dates = collect();
            for ($i = 29; $i >= 0; $i--) {
                $dates->push(today()->subDays($i));
            }
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $start = \Illuminate\Support\Carbon::parse($startDate);
            $end = \Illuminate\Support\Carbon::parse($endDate);
            $dates = collect();
            for ($date = $start; $date->lte($end); $date->addDay()) {
                $dates->push($date->copy());
            }
        } else {
            $dates = collect();
            for ($i = 6; $i >= 0; $i--) {
                $dates->push(today()->subDays($i));
            }
        }

        foreach ($dates as $date) {
            $dateStr = $date->format('Y-m-d');
            $dayOrders = $groupedOrders->get($dateStr, collect());

            $dataPoint = [
                'date' => $date->format('M d'),
            ];

            foreach ($statuses as $status) {
                $dataPoint[$status] = $dayOrders->where('status', $status)->count();
            }

            $chartData[] = $dataPoint;
        }

        return $chartData;
    }

    public function getOrderStats(Request $request)
    {
        $user = auth()->user();
        $period = $request->query('period', '7days');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        \Log::info('Fetching order stats for user: ' . $user->id . ', period: ' . $period);

        $chartData = $this->getChartDataForPeriod($user, $period, $startDate, $endDate);
        
        // Get total orders for the period
        $query = $user->freelancerOrders();
        if ($period === 'today') {
            $query->whereDate('created_at', today());
        } elseif ($period === 'yesterday') {
            $query->whereDate('created_at', today()->subDay());
        } elseif ($period === '7days') {
            $query->where('created_at', '>=', today()->subDays(7));
        } elseif ($period === '30days') {
            $query->where('created_at', '>=', today()->subDays(30));
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } else {
            $query->where('created_at', '>=', today()->subDays(7));
        }
        $totalOrders = $query->count();

        \Log::info('Chart data prepared: ' . json_encode($chartData));

        return response()->json([
            'chartData' => $chartData,
            'totalOrders' => $totalOrders,
        ]);
    }

    public function subscriptions()
    {
        $user = auth()->user();
        $currentSubscription = Subscription::where('user_id', $user->id)->where('active', true)->latest()->first();

        return Inertia::render('Vendor/Subscriptions', [
            'user' => $user,
            'subscription' => $currentSubscription,
        ]);
    }

    public function purchaseSubscription(Request $request, StripePaymentService $stripeService)
    {
        $request->validate([
            'plan' => 'required|string|in:starter,growth,pro',
        ]);

        $user = auth()->user();

        $prices = [
            'starter' => 29.00,
            'growth' => 59.00,
            'pro' => 99.00,
        ];

        $plan = $request->plan;
        $price = $prices[$plan] ?? 0;

        // Create inactive subscription to store intent
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $plan,
            'price' => $price,
            'active' => false,
            'expires_at' => null, // Will be set on success
        ]);

        $session = $stripeService->createCheckoutSessionForSubscription(
            $plan,
            $price,
            'usd',
            route('vendor.subscriptions.success'),
            route('vendor.subscriptions.cancel'),
            $subscription->id
        );

        if (! $session['success']) {
            return response()->json(['error' => $session['error']], 500);
        }

        return response()->json(['session_url' => $session['session_url']]);
    }

    public function subscriptionSuccess(Request $request, StripePaymentService $stripeService)
    {
        $sessionId = $request->query('session_id');
        $subscriptionId = $request->query('subscription_id');

        if (! $sessionId || ! $subscriptionId) {
            return redirect()->route('vendor.subscriptions')->with('error', 'Invalid payment return data.');
        }

        $subscription = Subscription::where('id', $subscriptionId)
            ->where('user_id', auth()->id())
            ->first();

        if (! $subscription || $subscription->active) {
            return redirect()->route('vendor.subscriptions')->with('error', 'Invalid or already processed subscription.');
        }

        $sessionData = $stripeService->retrieveSession($sessionId);
        if (! $sessionData['success'] || $sessionData['session']->payment_status !== 'paid') {
            return redirect()->route('vendor.subscriptions')->with('error', 'Payment not completed successfully.');
        }

        $durations = [
            'starter' => 7,
            'growth' => 14,
            'pro' => 30,
        ];
        $expiresAt = now()->addDays($durations[$subscription->plan] ?? 7);

        // deactivate other subscriptions
        Subscription::where('user_id', auth()->id())->update(['active' => false]);

        $subscription->update([
            'active' => true,
            'expires_at' => $expiresAt,
        ]);

        return redirect()->route('vendor.dashboard')->with('success', 'Subscription activated: '.ucfirst($subscription->plan));
    }

    public function subscriptionCancel()
    {
        return redirect()->route('vendor.subscriptions')->with('error', 'Subscription payment was cancelled.');
    }

    public function orders(Request $request)
    {
        $status = $request->query('status', 'all');
        $user = auth()->user();

        $query = $user->freelancerOrders()->with(['customer', 'gig']);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Vendor/Orders', [
            'orders' => $orders,
            'filters' => compact('status'),
            'user' => $user,
        ]);
    }

    public function gigs()
    {
        $gigs = auth()->user()->gigs()->latest()->paginate(10);

        return Inertia::render('Vendor/Gigs', [
            'gigs' => $gigs,
        ]);
    }

    public function createGig()
    {
        return Inertia::render('Gigs/Create', [
            'user' => auth()->user(),
            'submitPath' => route('vendor.gigs.store'),
            'cancelPath' => route('vendor.gigs'),
            'backPath' => route('vendor.dashboard'),
        ]);
    }

    public function storeGig(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'category_fields' => 'nullable|array',
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
            'category_fields' => $request->category_fields,
            'image' => $imagePath,
        ]);

        return redirect()->route('vendor.gigs')->with('success', 'Gig created successfully.');
    }

    public function editGig(Gig $gig)
    {
        if ($gig->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Vendor/GigEdit', [
            'gig' => $gig,
            'user' => auth()->user(),
        ]);
    }

    public function updateGig(Request $request, Gig $gig)
    {
        if ($gig->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'category_fields' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'tags' => $request->tags,
            'category_fields' => $request->category_fields,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('gigs', 'public');
        }

        $gig->update($data);

        return redirect()->route('vendor.gigs')->with('success', 'Gig updated successfully.');
    }

    public function deleteGig(Gig $gig)
    {
        if ($gig->user_id !== auth()->id()) {
            abort(403);
        }

        $gig->delete();

        return back()->with('success', 'Gig deleted successfully.');
    }

    public function toggleGig(Gig $gig)
    {
        if ($gig->user_id !== auth()->id()) {
            abort(403);
        }

        $gig->update(['active' => ! $gig->active]);

        return back()->with('success', 'Gig status updated.');
    }

    public function profile()
    {
        $user = auth()->user()->load('gigs');

        // Calculate category distribution
        $categoryDistribution = $user->gigs->groupBy('category')->map(function ($gigs, $category) {
            return [
                'name' => $category,
                'count' => $gigs->count(),
            ];
        })->values();

        // Calculate profile completion percentage
        $fields = [
            'name' => ! empty($user->name),
            'email' => ! empty($user->email),
            'bio' => ! empty($user->bio),
            'phone' => ! empty($user->phone),
            'location' => ! empty($user->location),
            'professional_title' => ! empty($user->professional_title),
            'country' => ! empty($user->country),
            'city' => ! empty($user->city),
            'address' => ! empty($user->address),
            'languages' => ! empty($user->languages) && count($user->languages) > 0,
            'years_of_experience' => ! empty($user->years_of_experience),
            'hourly_rate' => ! empty($user->hourly_rate),
            'delivery_time' => ! empty($user->delivery_time),
            'available_days' => ! empty($user->available_days) && count($user->available_days) > 0,
            'service_type' => ! empty($user->service_type),
            'portfolio_images' => ! empty($user->portfolio_images) && count($user->portfolio_images) > 0,
            'certifications' => ! empty($user->certifications) && count($user->certifications) > 0,
        ];

        $completedFields = array_sum($fields);
        $totalFields = count($fields);
        $profileCompletion = round(($completedFields / $totalFields) * 100);

        return Inertia::render('Vendor/Profile', [
            'user' => $user,
            'profileCompletion' => $profileCompletion,
            'categoryDistribution' => $categoryDistribution,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'professional_title' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'languages' => 'nullable|array',
            'years_of_experience' => 'nullable|string|max:255',
            'custom_years_of_experience' => 'nullable|string|max:255',
            'hourly_rate' => 'nullable|numeric|min:0',
            'delivery_time' => 'nullable|string|max:255',
            'available_days' => 'nullable|array',
            'service_type' => 'nullable|string|max:255',
            'custom_service_type' => 'nullable|string|max:255',
            'emergency_service' => 'nullable|boolean',
            'linkedin' => 'nullable|url|max:255',
            'github' => 'nullable|url|max:255',
            'behance' => 'nullable|url|max:255',
            'dribbble' => 'nullable|url|max:255',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'previous_work_links' => 'nullable|array',
        ]);

        $user->update($request->only([
            'name',
            'email',
            'bio',
            'phone',
            'location',
            'professional_title',
            'country',
            'city',
            'address',
            'languages',
            'years_of_experience',
            'custom_years_of_experience',
            'hourly_rate',
            'delivery_time',
            'available_days',
            'service_type',
            'custom_service_type',
            'emergency_service',
            'linkedin',
            'github',
            'behance',
            'dribbble',
            'website',
            'facebook',
            'instagram',
            'previous_work_links',
        ]));

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = auth()->user();
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Profile photo updated.');
    }

    public function removeAvatar()
    {
        $user = auth()->user();
        $user->update(['avatar' => null]);

        return back()->with('success', 'Profile photo removed.');
    }

    public function uploadCertificate(Request $request)
    {
        $request->validate([
            'certificate' => 'required|image|mimes:jpeg,png,jpg,webp,pdf|max:5120',
        ]);

        $user = auth()->user();
        $path = $request->file('certificate')->store('certificates', 'public');

        $certificates = $user->certifications ?? [];
        $certificates[] = $path;
        $user->update(['certifications' => $certificates]);

        return back()->with('success', 'Certificate uploaded successfully.');
    }

    public function removeCertificate($index)
    {
        $user = auth()->user();
        $certificates = $user->certifications ?? [];

        if (isset($certificates[$index])) {
            unset($certificates[$index]);
            $user->update(['certifications' => array_values($certificates)]);
        }

        return back()->with('success', 'Certificate removed.');
    }

    public function uploadPortfolioImage(Request $request)
    {
        $request->validate([
            'portfolio_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $user = auth()->user();
        $path = $request->file('portfolio_image')->store('portfolio/images', 'public');

        $images = $user->portfolio_images ?? [];
        $images[] = $path;
        $user->update(['portfolio_images' => $images]);

        return back()->with('success', 'Portfolio image uploaded successfully.');
    }

    public function removePortfolioImage($index)
    {
        $user = auth()->user();
        $images = $user->portfolio_images ?? [];

        if (isset($images[$index])) {
            unset($images[$index]);
            $user->update(['portfolio_images' => array_values($images)]);
        }

        return back()->with('success', 'Portfolio image removed.');
    }

    public function uploadPortfolioVideo(Request $request)
    {
        $request->validate([
            'portfolio_video' => 'required|file|mimes:mp4,mov,avi,webm|max:51200',
        ]);

        $user = auth()->user();
        $path = $request->file('portfolio_video')->store('portfolio/videos', 'public');

        $videos = $user->portfolio_videos ?? [];
        $videos[] = $path;
        $user->update(['portfolio_videos' => $videos]);

        return back()->with('success', 'Portfolio video uploaded successfully.');
    }

    public function removePortfolioVideo($index)
    {
        $user = auth()->user();
        $videos = $user->portfolio_videos ?? [];

        if (isset($videos[$index])) {
            unset($videos[$index]);
            $user->update(['portfolio_videos' => array_values($videos)]);
        }

        return back()->with('success', 'Portfolio video removed.');
    }

    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $user = auth()->user();
        $path = $request->file('resume')->store('resumes', 'public');
        $user->update(['resume_cv' => $path]);

        return back()->with('success', 'Resume/CV uploaded successfully.');
    }

    public function removeResume()
    {
        $user = auth()->user();
        $user->update(['resume_cv' => null]);

        return back()->with('success', 'Resume/CV removed.');
    }

    public function reviews(Request $request)
    {
        $user = auth()->user();

        $gigId = $request->query('gig_id', 'all');
        $status = $request->query('status', 'all');

        $query = Review::where('reviewee_id', $user->id)
            ->with(['order.gig', 'reviewer']);

        if ($gigId !== 'all') {
            $query->whereHas('order', function ($q) use ($gigId) {
                $q->where('gig_id', $gigId);
            });
        }

        if ($status === 'pending') {
            $query->whereNull('reply');
        } elseif ($status === 'replied') {
            $query->whereNotNull('reply');
        }

        $reviews = $query->latest()->paginate(15)->withQueryString();

        $gigs = $user->gigs()->select('id', 'title')->get();

        return Inertia::render('Vendor/Reviews', [
            'reviews' => $reviews,
            'gigs' => $gigs,
            'filters' => [
                'gig_id' => $gigId,
                'status' => $status,
            ],
        ]);
    }

    public function replyReview(Request $request, Review $review)
    {
        if ($review->reviewee_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $review->update([
            'reply' => $request->reply,
            'replied_at' => now(),
        ]);

        return back()->with('success', 'Reply posted successfully.');
    }

    public function showFreelancer($user)
    {
        $user = User::with(['gigs', 'reviewsReceived'])->findOrFail($user);

        return Inertia::render('Vendor/Show', [
            'user' => $user,
        ]);
    }
}
