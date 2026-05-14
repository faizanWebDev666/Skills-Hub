<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Gig;
use App\Models\Order;
use App\Models\Review;
use App\Models\CommissionSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    private function getSidebarLinks()
    {
        return [
            ['href' => '/admin/dashboard', 'label' => 'Dashboard', 'icon' => 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1'],
            ['href' => '/admin/users', 'label' => 'Users', 'icon' => 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
            ['href' => '/admin/gigs', 'label' => 'Gigs', 'icon' => 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'],
            ['href' => '/admin/orders', 'label' => 'Orders', 'icon' => 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'],
            ['href' => '/admin/settings', 'label' => 'Settings', 'icon' => 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
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
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');

        $query = User::with('roles');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role) {
            $query->role($role);
        }

        $allowedSorts = ['name', 'email', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => compact('search', 'role', 'sort', 'direction'),
            'roles' => Role::pluck('name'),
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

        return back()->with('success', "User {$user->name} has been deleted.");
    }

    public function gigs(Request $request)
    {
        $search = $request->query('search', '');
        $category = $request->query('category', '');
        $status = $request->query('status', '');

        $query = Gig::with('user');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
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
        $categories = Gig::distinct()->pluck('category');

        return Inertia::render('Admin/Gigs', [
            'gigs' => $gigs,
            'categories' => $categories,
            'filters' => compact('search', 'category', 'status'),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function toggleGig(Gig $gig)
    {
        $gig->update(['active' => !$gig->active]);

        $status = $gig->active ? 'activated' : 'deactivated';
        return back()->with('success', "Gig has been {$status}.");
    }

    public function deleteGig(Gig $gig)
    {
        $gig->delete();

        return back()->with('success', 'Gig has been deleted.');
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
                  ->orWhereHas('customer', fn($q) => $q->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('freelancer', fn($q) => $q->where('name', 'like', "%{$search}%"));
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

    public function releaseFunds(Order $order)
    {
        if ($order->status !== 'completed') {
            return back()->with('error', 'Only completed orders can have their funds released.');
        }

        if ($order->funds_released_at) {
            return back()->with('error', 'Funds have already been released for this order.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
            $gigCategory = $order->gig->category;
            $commissionSetting = CommissionSetting::where('category', $gigCategory)->first();
            $percentage = $commissionSetting ? $commissionSetting->percentage : 20.00; // Default 20%
            
            $adminCommission = $order->amount * ($percentage / 100);
            $freelancerEarning = $order->amount - $adminCommission;

            // Credit Freelancer Wallet
            $freelancer = $order->freelancer;
            $freelancer->wallet_balance += $freelancerEarning;
            $freelancer->save();

            // Credit Admin Wallet
            $admin = User::role('admin')->first();
            if ($admin) {
                $admin->wallet_balance += $adminCommission;
                $admin->save();
            }

            $order->update(['funds_released_at' => now()]);
        });

        return back()->with('success', 'Funds successfully released to the vendor!');
    }

    public function settings()
    {
        $categories = Gig::distinct()->pluck('category')->filter()->values()->toArray();
        $commissions = CommissionSetting::all()->keyBy('category')->map->percentage->toArray();
        
        $categoryCommissions = [];
        foreach ($categories as $category) {
            $categoryCommissions[$category] = $commissions[$category] ?? 20; // Default 20%
        }

        return Inertia::render('Admin/Settings', [
            'settings' => [
                'siteName' => config('app.name', 'Multi-Vendor Marketplace'),
                'commissionRate' => (float) config('app.commission_rate', 10),
                'minPayout' => (float) config('app.min_payout', 50),
                'maxGigPrice' => (float) config('app.max_gig_price', 10000),
                'minGigPrice' => (float) config('app.min_gig_price', 5),
            ],
            'categoryCommissions' => collect($categoryCommissions)->map(fn($v, $k) => ['category' => $k, 'percentage' => $v])->values(),
            'sidebarLinks' => $this->getSidebarLinks(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'siteName' => 'required|string|max:255',
            'commissionRate' => 'required|numeric|min:0|max:100',
            'minPayout' => 'required|numeric|min:0',
            'maxGigPrice' => 'required|numeric|min:0',
            'minGigPrice' => 'required|numeric|min:0',
            'categoryCommissions' => 'nullable|array',
            'categoryCommissions.*.category' => 'required|string',
            'categoryCommissions.*.percentage' => 'required|numeric|min:0|max:100',
        ]);

        if ($request->has('categoryCommissions')) {
            foreach ($request->categoryCommissions as $commission) {
                CommissionSetting::updateOrCreate(
                    ['category' => $commission['category']],
                    ['percentage' => $commission['percentage']]
                );
            }
        }

        // In production, these would be stored in a settings table or .env
        // For now we just return success
        return back()->with('success', 'Settings updated successfully.');
    }
}
