<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalUsers' => 2847,
            'vendors' => 423,
            'customers' => 2424,
            'activeGigs' => 1542,
            'pendingGigs' => 47,
            'totalRevenue' => 128500,
            'monthlyRevenue' => 18400,
            'openReports' => 12,
        ];

        $recentActivity = [
            [
                'type' => 'user',
                'message' => 'New vendor registered: Alex Developer',
                'time' => '5 minutes ago',
            ],
            [
                'type' => 'gig',
                'message' => 'Gig "Professional Web Design" submitted for review',
                'time' => '15 minutes ago',
                'action' => 'approve',
            ],
            [
                'type' => 'order',
                'message' => 'Order #1247 completed successfully',
                'time' => '1 hour ago',
            ],
            [
                'type' => 'report',
                'message' => 'New report filed against user @john_doe',
                'time' => '2 hours ago',
                'action' => 'review',
            ],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    public function users()
    {
        return Inertia::render('Admin/Users');
    }

    public function gigs()
    {
        return Inertia::render('Admin/Gigs');
    }

    public function orders()
    {
        return Inertia::render('Admin/Orders');
    }

    public function reports()
    {
        return Inertia::render('Admin/Reports');
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings');
    }
}
