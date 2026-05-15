import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

const StatCard = ({ title, value, subtitle, icon, color, trend }) => {
    const colorClasses = {
        primary: 'from-brand-50 to-brand-100 text-brand-700 border-brand-200',
        success: 'from-success-50 to-success-100 text-success-700 border-success-200',
        warning: 'from-warning-50 to-warning-100 text-warning-700 border-warning-200',
        accent: 'from-accent-50 to-accent-100 text-accent-700 border-accent-200',
        danger: 'from-danger-50 to-danger-100 text-danger-700 border-danger-200',
    };

    return (
        <div className={`bg-linear-to-br ${colorClasses[color]} rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium opacity-80">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-sm opacity-70 mt-2">{subtitle}</p>
                    )}
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            <svg className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>{Math.abs(trend)}% from last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl bg-white/60`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const MiniChart = ({ data }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.orders), 1), [data]);
    
    return (
        <div className="h-32 flex items-end gap-1">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                        className="w-full bg-linear-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all duration-300 hover:from-brand-700 hover:to-brand-500"
                        style={{ height: `${(d.orders / maxValue) * 100}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-gray-500">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

const ActivityItem = ({ icon, title, time, color }) => {
    const colorMap = {
        primary: 'bg-brand-100 text-brand-600',
        success: 'bg-success-100 text-success-600',
        warning: 'bg-warning-100 text-warning-600',
        danger: 'bg-danger-100 text-danger-600',
    };

    return (
        <div className="flex items-center gap-3 py-3">
            <div className={`w-10 h-10 rounded-full ${colorMap[color]} flex items-center justify-center shrink-0`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    );
};

export default function AdminDashboard({ stats, recentUsers, recentGigs, recentOrders, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="flex">
                <AdminSidebar user={user} sidebarLinks={sidebarLinks} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Admin'}! Here's what's happening today.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export
                                </button>
                                <button className="px-4 py-2 bg-linear-to-r from-brand-600 to-brand-800 text-white rounded-xl font-medium hover:shadow-lg transition-all shadow-brand-500/30">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Report
                                </button>
                                <Link
                                    href="/admin/wallet"
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-brand-600 font-medium hover:bg-brand-50 transition-colors shadow-sm"
                                >
                                    Manage Wallets
                                </Link>
                            </div>
                        </div>

                        <div className="inline-flex gap-2 mb-6 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
                            {['overview', 'analytics', 'reports'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                        activeTab === tab 
                                            ? 'bg-brand-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            <StatCard 
                                title="Total Revenue" 
                                value={`$${Number(stats?.totalRevenue || 0).toLocaleString()}`}
                                subtitle={`$${Number(stats?.monthlyRevenue || 0).toLocaleString()} this month`}
                                icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                color="success"
                                trend={12.5}
                            />
                            <StatCard 
                                title="Total Users" 
                                value={(stats?.totalUsers || 0).toLocaleString()}
                                subtitle={`${stats?.vendors || 0} vendors, ${stats?.customers || 0} customers`}
                                icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                color="primary"
                                trend={8.2}
                            />
                            <StatCard 
                                title="Active Gigs" 
                                value={(stats?.activeGigs || 0).toLocaleString()}
                                subtitle={`${stats?.totalGigs || 0} total gigs`}
                                icon="M13 10V3L4 14h7v7l9-11h-7z"
                                color="accent"
                                trend={5.1}
                            />
                            <StatCard 
                                title="Orders" 
                                value={(stats?.totalOrders || 0).toLocaleString()}
                                subtitle={`${stats?.pendingOrders || 0} pending`}
                                icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                color="warning"
                                trend={-2.3}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Weekly Performance</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 bg-brand-600 rounded-full"></span>
                                            <span className="text-sm text-gray-600">Orders</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 bg-success-500 rounded-full"></span>
                                            <span className="text-sm text-gray-600">Revenue</span>
                                        </div>
                                    </div>
                                </div>
                                <MiniChart data={stats?.chartData || []} />
                                <div className="grid grid-cols-7 gap-2 mt-4">
                                    {(stats?.chartData || []).map((d, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-xs font-bold text-gray-900">${Number(d.revenue).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{d.orders} orders</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                                <div className="divide-y divide-gray-100">
                                    {recentOrders?.slice(0, 4).map((order) => (
                                        <ActivityItem 
                                            key={order.id}
                                            icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            title={`New order #${order.id} - ${order.gig?.title || 'Service'}`}
                                            time="Just now"
                                            color="primary"
                                        />
                                    ))}
                                    {recentUsers?.slice(0, 2).map((u) => (
                                        <ActivityItem 
                                            key={u.id}
                                            icon="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                            title={`New user registered: ${u.name}`}
                                            time="2 hours ago"
                                            color="success"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
                                    <Link href="/admin/users" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {recentUsers?.length > 0 ? recentUsers.map((u) => (
                                        <div key={u.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {u.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900 text-sm truncate">{u.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                u.roles?.[0]?.name === 'admin' ? 'bg-danger-100 text-danger-700' :
                                                u.roles?.[0]?.name === 'vendor' ? 'bg-brand-100 text-brand-700' :
                                                'bg-success-100 text-success-700'
                                            }`}>
                                                {u.roles?.[0]?.name || 'customer'}
                                            </span>
                                            <Link
                                                href={route('chat.with-user', u.id)}
                                                className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold hover:bg-brand-200 transition-colors"
                                            >
                                                Chat
                                            </Link>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-400 py-6 text-sm">No users yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Gigs</h2>
                                    <Link href="/admin/gigs" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {recentGigs?.length > 0 ? recentGigs.map((gig) => (
                                        <div key={gig.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                                {gig.image ? (
                                                    <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-brand-100 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900 text-sm truncate">{gig.title}</p>
                                                <p className="text-xs text-gray-500">{gig.user?.name || 'Unknown'}</p>
                                            </div>
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${gig.active ? 'bg-success-500' : 'bg-gray-400'}`}></span>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-400 py-6 text-sm">No gigs yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                                    <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {recentOrders?.length > 0 ? recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900 text-sm">#{order.id}</p>
                                                <p className="text-xs text-gray-500 truncate">{order.gig?.title || 'Service'}</p>
                                            </div>
                                            <div className="text-right shrink-0 ml-2">
                                                <p className="font-bold text-gray-900 text-sm">${Number(order.amount).toLocaleString()}</p>
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    order.status === 'completed' ? 'bg-success-100 text-success-700' :
                                                    order.status === 'in_progress' ? 'bg-brand-100 text-brand-700' :
                                                    order.status === 'cancelled' ? 'bg-danger-100 text-danger-700' :
                                                    'bg-accent-100 text-accent-600'
                                                }`}>
                                                    {order.status?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-400 py-6 text-sm">No orders yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="bg-linear-to-br from-brand-600 to-brand-800 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    <Link href="/admin/users" className="group bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-all duration-300 backdrop-blur-sm">
                                        <svg className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                                        </svg>
                                        <span className="text-sm font-medium">Manage Users</span>
                                    </Link>
                                    <Link href="/admin/gigs" className="group bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-all duration-300 backdrop-blur-sm">
                                        <svg className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="text-sm font-medium">Moderate Gigs</span>
                                    </Link>
                                    <Link href="/admin/orders" className="group bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-all duration-300 backdrop-blur-sm">
                                        <svg className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-sm font-medium">View Orders</span>
                                    </Link>
                                    <Link href="/admin/settings" className="group bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-all duration-300 backdrop-blur-sm">
                                        <svg className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm font-medium">Settings</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}