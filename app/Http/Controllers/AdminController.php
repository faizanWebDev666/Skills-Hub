<?php

namespace App\Http\Controllers;

use App\Models\CommissionSetting;
use App\Models\Gig;
use App\Models\Order;
use App\Models\Review;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    private function getSidebarLinks()
    {
        return [
            ['href' => '/admin/dashboard', 'label' => 'Dashboard', 'icon' => 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1'],
            ['href' => '/admin/profile', 'label' => 'Profile', 'icon' => 'M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 7a6 6 0 00-6 6h12a6 6 0 00-6-6z'],
            ['href' => '/admin/users', 'label' => 'Users', 'icon' => 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
            ['href' => '/admin/vendor-levels', 'label' => 'Vendor Levels', 'icon' => 'M12 8c-1.657 0-3 1.343-3 3v5h6v-5c0-1.657-1.343-3-3-3zm0-2c2.761 0 5 2.239 5 5v4a1 1 0 01-1 1H8a1 1 0 01-1-1v-4c0-2.761 2.239-5 5-5z'],
            ['href' => '/admin/gigs', 'label' => 'Gigs', 'icon' => 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'],
            ['href' => '/admin/orders', 'label' => 'Orders', 'icon' => 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'],
            ['href' => '/admin/reviews', 'label' => 'Reviews & Ratings', 'icon' => 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
            ['href' => '/admin/settings', 'label' => 'Settings', 'icon' => 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
            ['label' => 'My Trash', 'icon' => 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', 
             'children' => [
                 ['href' => '/admin/users/trash', 'label' => 'Deleted Users'],
                 ['href' => '/admin/gigs/trash', 'label' => 'Deleted Gigs'],
                 ['href' => '/admin/orders/trash', 'label' => 'Deleted Orders'],
             ]],
        ];
    }

    public function dashboard()
    {
        $userCount = User::selectRaw('COUNT(*) as total, 
            SUM(CASE WHEN EXISTS (SELECT 1 FROM model_has_roles WHERE model_has_roles.model_id = users.id AND model_has_roles.model_type = ? AND model_has_roles.role_id = (SELECT id FROM roles WHERE name = ?)) THEN 1 ELSE 0 END) as vendors,
            SUM(CASE WHEN EXISTS (SELECT 1 FROM model_has_roles WHERE model_has_roles.model_id = users.id AND model_has_roles.model_type = ? AND model_has_roles.role_id = (SELECT id FROM roles WHERE name = ?)) THEN 1 ELSE 0 END) as customers',
            ['App\Models\User', 'vendor', 'App\Models\User', 'customer']
        )->first();

        $gigCount = Gig::selectRaw('COUNT(*) as total, SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active')->first();

        $orderStats = Order::selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = "completed" THEN amount ELSE 0 END) as totalRevenue,
            SUM(CASE WHEN status = "completed" AND MONTH(completed_at) = ? AND YEAR(completed_at) = ? THEN amount ELSE 0 END) as monthlyRevenue',
            [now()->month, now()->year]
        )->first();

        $recentUsers = User::with('roles')->latest()->take(5)->get();
        $recentGigs = Gig::with('user')->latest()->take(5)->get();
        $recentOrders = Order::with(['customer', 'freelancer', 'gig'])->latest()->take(5)->get();

        $orderTrends = Order::selectRaw('
            DATE(created_at) as date,
            COUNT(*) as count,
            SUM(amount) as revenue
        ')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dates = collect();
        for ($i = 6; $i >= 0; $i--) {
            $dates->push(now()->subDays($i)->toDateString());
        }

        $chartData = $dates->map(function ($date) use ($orderTrends) {
            $day = $orderTrends->get($date);

            return [
                'date' => $date,
                'label' => now()->parse($date)->format('D'),
                'orders' => $day ? $day->count : 0,
                'revenue' => $day ? $day->revenue : 0,
            ];
        });

        $stats = [
            'totalUsers' => $userCount->total ?? 0,
            'vendors' => $userCount->vendors ?? 0,
            'customers' => $userCount->customers ?? 0,
            'activeGigs' => $gigCount->active ?? 0,
            'totalGigs' => $gigCount->total ?? 0,
            'totalRevenue' => $orderStats->totalRevenue ?? 0,
            'monthlyRevenue' => $orderStats->monthlyRevenue ?? 0,
            'pendingOrders' => $orderStats->pending ?? 0,
            'totalOrders' => $orderStats->total ?? 0,
            'chartData' => $chartData,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentGigs' => $recentGigs,
            'recentOrders' => $recentOrders,
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function users(Request $request)
    {
        $search = $request->query('search', '');
        $role = $request->query('role', '');
        $status = $request->query('status', '');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');

        $query = User::with('roles');

        // Exclude admin users
        $query->whereDoesntHave('roles', function ($q) {
            $q->where('name', 'admin');
        });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role) {
            $query->role($role);
        }

        if ($status === 'banned') {
            $query->whereNotNull('banned_at');
        } elseif ($status === 'active') {
            $query->whereNull('banned_at');
        }

        $allowedSorts = ['name', 'email', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => compact('search', 'role', 'status', 'sort', 'direction'),
            'roles' => Role::where('name', '!=', 'admin')->pluck('name'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->syncRoles([$request->role]);

        return back()->with('success', "User role updated to {$request->role}.");
    }

    public function banUser(User $user)
    {
        $user->update(['banned_at' => now()]);

        return back()->with('success', "User {$user->name} has been banned.");
    }

    public function unbanUser(User $user)
    {
        $user->update(['banned_at' => null]);

        return back()->with('success', "User {$user->name} has been unbanned.");
    }

    public function deleteUser(User $user)
    {
        $user->delete();

        return back()->with('success', "User {$user->name} has been moved to trash.");
    }

    public function trashUsers(Request $request)
    {
        $search = $request->query('search', '');

        $query = User::onlyTrashed()->with('roles');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/UsersTrash', [
            'users' => $users,
            'filters' => compact('search'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function restoreUser($uuid)
    {
        $user = User::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        $user->restore();

        return back()->with('success', "User {$user->name} has been restored from trash.");
    }

    public function forceDeleteUser($uuid)
    {
        $user = User::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        $user->forceDelete();

        return back()->with('success', "User {$user->name} has been permanently deleted.");
    }

    public function gigs(Request $request)
    {
        $search = $request->query('search', '');
        $seller = $request->query('seller', '');
        $category = $request->query('category', '');
        $status = $request->query('status', '');

        $query = Gig::with('user');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($seller) {
            $query->whereHas('user', function ($q) use ($seller) {
                $q->where('name', 'like', "%{$seller}%")
                    ->orWhere('email', 'like', "%{$seller}%");
            });
        }

        if ($category) {
            $query->where('category', $category);
        }

        if ($status === 'active') {
            $query->where('active', true);
        } elseif ($status === 'inactive') {
            $query->where('active', false);
        }

        $gigs = $query->latest()->paginate(20)->withQueryString();
        $categories = Gig::distinct()->pluck('category')->filter()->values();

        return Inertia::render('Admin/Gigs', [
            'gigs' => $gigs,
            'categories' => $categories,
            'filters' => compact('search', 'seller', 'category', 'status'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function toggleGig(Gig $gig)
    {
        $gig->update(['active' => ! $gig->active]);

        $status = $gig->active ? 'activated' : 'deactivated';

        return back()->with('success', "Gig has been {$status}.");
    }

    public function deleteGig(Gig $gig)
    {
        $gig->delete();

        return back()->with('success', 'Gig has been moved to trash.');
    }

    public function trashGigs(Request $request)
    {
        $search = $request->query('search', '');

        $query = Gig::onlyTrashed()->with('user');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        $gigs = $query->latest()->paginate(20)->withQueryString();
        $categories = Gig::distinct()->pluck('category')->filter()->values();

        return Inertia::render('Admin/GigsTrash', [
            'gigs' => $gigs,
            'categories' => $categories,
            'filters' => compact('search'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function restoreGig($uuid)
    {
        $gig = Gig::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        $gig->restore();

        return back()->with('success', 'Gig has been restored from trash.');
    }

    public function forceDeleteGig($uuid)
    {
        $gig = Gig::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        $gig->forceDelete();

        return back()->with('success', 'Gig has been permanently deleted.');
    }

    public function vendorLevels(Request $request)
    {
        $search = $request->query('search', '');
        $category = $request->query('category', '');

        // Get vendor level criteria from settings
        $levelCriteria = [
            1 => [
                'minOrders' => (int) Setting::get('vendor_level_1_min_orders', 0),
                'minReviews' => (int) Setting::get('vendor_level_1_min_reviews', 0),
                'minRating' => (float) Setting::get('vendor_level_1_min_rating', 0),
            ],
            2 => [
                'minOrders' => (int) Setting::get('vendor_level_2_min_orders', 10),
                'minReviews' => (int) Setting::get('vendor_level_2_min_reviews', 5),
                'minRating' => (float) Setting::get('vendor_level_2_min_rating', 3.5),
            ],
            3 => [
                'minOrders' => (int) Setting::get('vendor_level_3_min_orders', 50),
                'minReviews' => (int) Setting::get('vendor_level_3_min_reviews', 20),
                'minRating' => (float) Setting::get('vendor_level_3_min_rating', 4.2),
            ],
            4 => [
                'minOrders' => (int) Setting::get('vendor_level_4_min_orders', 200),
                'minReviews' => (int) Setting::get('vendor_level_4_min_reviews', 50),
                'minRating' => (float) Setting::get('vendor_level_4_min_rating', 4.7),
            ],
        ];

        $query = User::role(['vendor', 'freelancer'])
            ->with('roles')
            ->withCount(['freelancerOrders as completed_orders_count' => function ($q) {
                $q->where('status', 'completed');
            }])
            ->withCount('reviewsReceived as reviews_count')
            ->withAvg('reviewsReceived as avg_rating', 'rating')
            ->select('users.*');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($category) {
            $query->whereHas('gigs', function ($q) use ($category) {
                $q->where('category', $category);
            });
        }

        $vendors = $query->selectSub(function ($q) {
                $q->from('gigs')
                    ->select('category')
                    ->whereColumn('gigs.user_id', 'users.id')
                    ->groupBy('category')
                    ->orderByRaw('COUNT(*) DESC')
                    ->limit(1);
            }, 'primary_category')
            ->paginate(20)
            ->withQueryString();

        // Calculate suggested level for each vendor
        foreach ($vendors as $vendor) {
            $completedOrders = $vendor->completed_orders_count ?? 0;
            $reviewsCount = $vendor->reviews_count ?? 0;
            $avgRating = $vendor->avg_rating ?? 0;

            $suggestedLevel = 1;
            // Check from highest level down
            for ($level = 4; $level >= 1; $level--) {
                $criteria = $levelCriteria[$level];
                if ($completedOrders >= $criteria['minOrders'] &&
                    $reviewsCount >= $criteria['minReviews'] &&
                    $avgRating >= $criteria['minRating']) {
                    $suggestedLevel = $level;
                    break;
                }
            }
            $vendor->suggested_level = $suggestedLevel;
        }

        $categories = Gig::distinct()->pluck('category')->filter()->values();

        return Inertia::render('Admin/VendorLevels', [
            'vendors' => $vendors,
            'categories' => $categories,
            'filters' => compact('search', 'category'),
            'levelCriteria' => $levelCriteria,
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function updateVendorLevel(Request $request, $id)
    {
        $request->validate([
            'vendor_level' => 'required|integer|min:1|max:4',
        ]);

        $user = User::find($id);
        if (! $user) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['message' => 'User not found.'], 404);
            }
            return back()->with('error', 'User not found.');
        }

        if (! $user->hasAnyRole(['vendor', 'freelancer'])) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['message' => 'Only vendors and freelancers can be assigned levels.'], 403);
            }
            return back()->with('error', 'Only vendors and freelancers can be assigned levels.');
        }

        $user->update(['vendor_level' => $request->vendor_level]);

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json(['message' => "Vendor level updated to {$request->vendor_level}."], 200);
        }

        return back()->with('success', "Vendor level updated to {$request->vendor_level}.");
    }

    public function orders(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', '');

        $query = Order::with(['customer', 'freelancer', 'gig']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('freelancer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'filters' => compact('search', 'status'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
            'completed_at' => $request->status === 'completed' ? now() : null,
        ]);

        return back()->with('success', 'Order status updated.');
    }

    public function deleteOrder(Order $order)
    {
        $order->delete();

        return back()->with('success', 'Order has been moved to trash.');
    }

    public function trashOrders(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', '');

        $query = Order::onlyTrashed()->with(['customer', 'freelancer', 'gig']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('freelancer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/OrdersTrash', [
            'orders' => $orders,
            'filters' => compact('search', 'status'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function restoreOrder($uuid)
    {
        $order = Order::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        $order->restore();

        return back()->with('success', 'Order has been restored from trash.');
    }

    public function forceDeleteOrder($uuid)
    {
        $order = Order::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        $order->forceDelete();

        return back()->with('success', 'Order has been permanently deleted.');
    }

    public function reviews(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        $minRating = $request->query('min_rating', '');
        $sort = $request->query('sort', 'rating_desc');

        // Get all users who have the vendor or freelancer role
        $query = User::role(['vendor', 'freelancer'])
            ->withCount(['freelancerOrders as delivered_orders_count' => function ($query) {
                $query->whereIn('status', ['delivered', 'completed']);
            }])
            ->withAvg('reviewsReceived as average_rating', 'rating')
            ->withCount('reviewsReceived as total_reviews');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->whereNull('banned_at');
        } elseif ($status === 'deactivated') {
            $query->whereNotNull('banned_at');
        }

        if ($minRating !== '') {
            $query->having('average_rating', '>=', (float) $minRating);
        }

        if ($sort === 'rating_desc') {
            $query->orderByDesc('average_rating');
        } elseif ($sort === 'rating_asc') {
            $query->orderBy('average_rating');
        } elseif ($sort === 'orders_desc') {
            $query->orderByDesc('delivered_orders_count');
        } elseif ($sort === 'orders_asc') {
            $query->orderBy('delivered_orders_count');
        } else {
            $query->orderByDesc('average_rating')->orderByDesc('delivered_orders_count');
        }

        $vendors = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Reviews', [
            'vendors' => $vendors,
            'filters' => compact('search', 'status', 'minRating', 'sort'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function vendorReviews(User $user)
    {
        // Ensure the user is actually a vendor/freelancer
        if (! $user->hasAnyRole(['vendor', 'freelancer'])) {
            return redirect()->route('admin.reviews')->with('error', 'User is not a vendor.');
        }

        // Fetch vendor details along with overall stats
        $vendor = $user->loadCount(['freelancerOrders as delivered_orders_count' => function ($query) {
            $query->whereIn('status', ['delivered', 'completed']);
        }])->loadAvg('reviewsReceived as average_rating', 'rating')
            ->loadCount('reviewsReceived as total_reviews');

        // Fetch detailed reviews
        $reviews = Review::where('reviewee_id', $vendor->id)
            ->with(['reviewer', 'order.gig'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/VendorReviews', [
            'vendor' => $vendor,
            'reviews' => $reviews,
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function toggleVendorStatus(User $user)
    {
        if ($user->banned_at) {
            $user->update(['banned_at' => null]);
            $status = 'activated';
        } else {
            $user->update(['banned_at' => now()]);
            $status = 'deactivated';
        }

        return back()->with('success', "Vendor has been {$status}.");
    }

    public function releaseFunds(Order $order)
    {
        if ($order->status !== 'completed') {
            return back()->with('error', 'Only completed orders can have their funds released.');
        }

        if ($order->funds_released_at) {
            return back()->with('error', 'Funds have already been released for this order.');
        }

        DB::transaction(function () use ($order) {
            $gigCategory = $order->gig->category;
            $commissionSetting = CommissionSetting::where('category', $gigCategory)->first();
            $percentage = $commissionSetting ? $commissionSetting->percentage : 20.00; // Default 20%

            $adminCommission = $order->amount * ($percentage / 100);
            $freelancerEarning = $order->amount - $adminCommission;

            // Get or create wallets
            $freelancerWallet = $order->freelancer->wallet ?? $order->freelancer->wallet()->create(['balance' => 0, 'currency' => 'USD']);
            $adminWallet = User::role('admin')->first()->wallet ?? User::role('admin')->first()->wallet()->create(['balance' => 0, 'currency' => 'USD']);

            // Credit freelancer
            $freelancerWallet->credit(
                $freelancerEarning,
                'commission',
                "Earnings from order #{$order->id}",
                ['order_id' => $order->id, 'type' => 'freelancer_earning']
            );

            // Credit admin commission
            $adminWallet->credit(
                $adminCommission,
                'commission',
                "Commission from order #{$order->id}",
                ['order_id' => $order->id, 'type' => 'platform_commission']
            );

            $order->update(['funds_released_at' => now()]);
        });

        return back()->with('success', 'Funds successfully released to the vendor!');
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'generalSettings' => [
                'siteName' => Setting::get('site_name', 'Multi-Vendor Marketplace'),
                'commissionRate' => (float) Setting::get('commission_rate', 10),
                'minPayout' => (float) Setting::get('min_payout', 50),
                'maxGigPrice' => (float) Setting::get('max_gig_price', 10000),
                'minGigPrice' => (float) Setting::get('min_gig_price', 5),
            ],
            'categoryCommissions' => $this->getCategoryCommissions(),
            'vendorLevelSettings' => [
                'level1' => [
                    'minOrders' => (int) Setting::get('vendor_level_1_min_orders', 0),
                    'minReviews' => (int) Setting::get('vendor_level_1_min_reviews', 0),
                    'minRating' => (float) Setting::get('vendor_level_1_min_rating', 0),
                ],
                'level2' => [
                    'minOrders' => (int) Setting::get('vendor_level_2_min_orders', 10),
                    'minReviews' => (int) Setting::get('vendor_level_2_min_reviews', 5),
                    'minRating' => (float) Setting::get('vendor_level_2_min_rating', 3.5),
                ],
                'level3' => [
                    'minOrders' => (int) Setting::get('vendor_level_3_min_orders', 50),
                    'minReviews' => (int) Setting::get('vendor_level_3_min_reviews', 20),
                    'minRating' => (float) Setting::get('vendor_level_3_min_rating', 4.2),
                ],
                'level4' => [
                    'minOrders' => (int) Setting::get('vendor_level_4_min_orders', 200),
                    'minReviews' => (int) Setting::get('vendor_level_4_min_reviews', 50),
                    'minRating' => (float) Setting::get('vendor_level_4_min_rating', 4.7),
                ],
            ],
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function profile()
    {
        $user = auth()->user()->load('roles');

        return Inertia::render('Admin/Profile', [
            'user' => $user,
            'sidebarLinks' => $this->getSidebarLinks(),
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
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name',
            'email',
            'bio',
            'phone',
            'location',
            'country',
            'city',
            'address',
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

    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if (! Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    private function getCategoryCommissions()
    {
        $categories = Gig::distinct()->pluck('category')->filter()->values()->toArray();
        $commissions = CommissionSetting::all()->keyBy('category')->map->percentage->toArray();

        $categoryCommissions = [];
        foreach ($categories as $category) {
            $categoryCommissions[] = [
                'category' => $category,
                'percentage' => $commissions[$category] ?? 20,
            ];
        }

        return $categoryCommissions;
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'siteName' => 'required|string|max:255',
            'commissionRate' => 'required|numeric|min:0|max:100',
            'minPayout' => 'required|numeric|min:0',
            'maxGigPrice' => 'required|numeric|min:0',
            'minGigPrice' => 'required|numeric|min:0',
            'vendorLevels' => 'required|array',
            'vendorLevels.level1' => 'required|array',
            'vendorLevels.level1.minOrders' => 'required|integer|min:0',
            'vendorLevels.level1.minReviews' => 'required|integer|min:0',
            'vendorLevels.level1.minRating' => 'required|numeric|min:0|max:5',
            'vendorLevels.level2' => 'required|array',
            'vendorLevels.level2.minOrders' => 'required|integer|min:0',
            'vendorLevels.level2.minReviews' => 'required|integer|min:0',
            'vendorLevels.level2.minRating' => 'required|numeric|min:0|max:5',
            'vendorLevels.level3' => 'required|array',
            'vendorLevels.level3.minOrders' => 'required|integer|min:0',
            'vendorLevels.level3.minReviews' => 'required|integer|min:0',
            'vendorLevels.level3.minRating' => 'required|numeric|min:0|max:5',
            'vendorLevels.level4' => 'required|array',
            'vendorLevels.level4.minOrders' => 'required|integer|min:0',
            'vendorLevels.level4.minReviews' => 'required|integer|min:0',
            'vendorLevels.level4.minRating' => 'required|numeric|min:0|max:5',
        ]);

        // Save general settings
        Setting::set('site_name', $request->siteName);
        Setting::set('commission_rate', $request->commissionRate);
        Setting::set('min_payout', $request->minPayout);
        Setting::set('max_gig_price', $request->maxGigPrice);
        Setting::set('min_gig_price', $request->minGigPrice);

        // Save vendor level settings - NOTE: level keys are like "level1", "level2", etc., we need just the number
        foreach ($request->vendorLevels as $level => $criteria) {
            $levelNumber = str_replace('level', '', $level);
            Setting::set("vendor_level_{$levelNumber}_min_orders", $criteria['minOrders']);
            Setting::set("vendor_level_{$levelNumber}_min_reviews", $criteria['minReviews']);
            Setting::set("vendor_level_{$levelNumber}_min_rating", $criteria['minRating']);
        }

        return back()->with('success', 'Settings updated successfully.');
    }

    public function updateCommissionSettings(Request $request)
    {
        $request->validate([
            'categoryCommissions' => 'required|array',
            'categoryCommissions.*.category' => 'required|string',
            'categoryCommissions.*.percentage' => 'required|numeric|min:0|max:100',
        ]);

        foreach ($request->categoryCommissions as $commission) {
            CommissionSetting::updateOrCreate(
                ['category' => $commission['category']],
                ['percentage' => $commission['percentage']]
            );
        }

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json(['message' => 'Category commissions updated successfully.']);
        }

        return back()->with('success', 'Category commissions updated successfully.');
    }
}
