import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import VendorNavbar from '../../components/VendorNavbar';
import VendorSidebar from '../../components/VendorSidebar';

export default function VendorDashboard({ stats, recentOrders, myGigs, user, subscription, conversations, totalUnreadMessages }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cream-50">
            <VendorNavbar user={user} />

            <div className="flex">
                <VendorSidebar user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} conversations={conversations || []} totalUnreadMessages={totalUnreadMessages || 0} />

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back, {user?.name?.split(' ')[0] || 'Vendor'}</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100 border-l-4 border-l-emerald-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Revenue</p>
                                        <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-1">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100 border-l-4 border-l-brand-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Active Gigs</p>
                                        <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-1">{stats?.activeGigs || 0}</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100 border-l-4 border-l-amber-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Pending</p>
                                        <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-1">{stats?.pendingOrders || 0}</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100 border-l-4 border-l-brand-400">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Completed</p>
                                        <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-1">{stats?.completedOrders || 0}</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100 border-l-4 border-l-purple-500">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Wallet</p>
                                        <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-1">View balance</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <Link
                                    href="/wallet"
                                    className="mt-6 inline-flex items-center justify-center w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                                >
                                    Go to Wallet
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
                            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Freelancer Profile</h2>
                                            {subscription && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold">
                                                    {subscription.plan?.charAt(0).toUpperCase() + subscription.plan?.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">View and update your public profile, bio, gigs, and customer chat actions.</p>
                                    </div>
                                    <Link
                                        href={route('vendor.profile')}
                                        className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="max-w-2xl">
                                    <p className="text-xs uppercase tracking-[0.35em] text-brand-600 font-semibold mb-3">Sell Faster</p>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Boost your gigs and book more projects.</h2>
                                    <p className="mt-3 text-sm text-slate-600">Choose a subscription package that gives your gigs premium exposure, priority buyer matching, and higher trust for faster sales.</p>
                                </div>
                                <Link
                                    href={route('vendor.subscriptions')}
                                    className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-colors"
                                >
                                    View Subscription Plans
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white mb-4">
                                        <span className="text-lg">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Faster Sales</h3>
                                    <p className="mt-2 text-sm text-slate-600">Featured placement for your top gigs so buyers discover you quicker.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white mb-4">
                                        <span className="text-lg">⭐</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Higher Conversions</h3>
                                    <p className="mt-2 text-sm text-slate-600">Boost trust with badges, promotional placement, and verified seller support.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600 text-white mb-4">
                                        <span className="text-lg">🚀</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">More Bookings</h3>
                                    <p className="mt-2 text-sm text-slate-600">Get matched with active buyers and receive more requests for your services.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Recent Orders */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>
                                        <span className="text-xs sm:text-sm text-gray-500">{stats?.totalOrders || 0} total</span>
                                    </div>
                                    <div className="space-y-3">
                                        {recentOrders?.length > 0 ? recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                        {order.customer?.name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm truncate">{order.gig?.title || 'Service Order'}</h3>
                                                        <p className="text-xs text-gray-500">#{order.id} • {order.customer?.name || 'Customer'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-3 space-y-2">
                                                    <p className="font-bold text-gray-900 text-sm">${Number(order.amount).toLocaleString()}</p>
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        order.status === 'completed' ? 'bg-success-100 text-success-700 ring-1 ring-success-200' :
                                                        order.status === 'delivered' ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200' :
                                                        order.status === 'in_progress' ? 'bg-brand-100 text-brand-700 ring-1 ring-brand-200' :
                                                        'bg-accent-100 text-accent-600 ring-1 ring-accent-200'
                                                    }`}>
                                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1).replace('_', ' ') || 'Pending'}
                                                    </span>
                                                    <div className="flex flex-col gap-2 mt-2">
                                                        {order.status === 'in_progress' && (
                                                            <button
                                                                onClick={() => {
                                                                    if(confirm('Are you sure you want to mark this order as delivered? The customer will be notified.')) {
                                                                        router.post(`/orders/${order.id}/deliver`);
                                                                    }
                                                                }}
                                                                className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                                                            >
                                                                Deliver Order
                                                            </button>
                                                        )}
                                                        {order.customer?.id && (
                                                            <Link
                                                                href={route('chat.with-user', order.customer.id)}
                                                                className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full hover:bg-brand-200"
                                                            >
                                                                Chat with customer
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 text-gray-400">
                                                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <p className="font-medium">No orders yet</p>
                                                <p className="text-sm mt-1">Orders will appear here when clients purchase your services</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* My Gigs */}
                            <div>
                                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Gigs</h2>
                                        <Link href="/vendor/gigs/create" className="text-xs sm:text-sm text-brand-600 hover:text-brand-700 font-medium">
                                            + New
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {myGigs?.length > 0 ? myGigs.map((gig) => (
                                            <Link key={gig.id} href={`/gigs/${gig.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                    {gig.image ? (
                                                        <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-brand-100"></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-sm truncate">{gig.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-medium text-gray-900">${Number(gig.price).toLocaleString()}</span>
                                                        <span className={`w-2 h-2 rounded-full ${gig.active ? 'bg-success-500' : 'bg-gray-400'}`}></span>
                                                        <span className="text-xs text-gray-500">{gig.active ? 'Active' : 'Paused'}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <p className="font-medium text-sm">No gigs yet</p>
                                                <Link href="/vendor/gigs/create" className="text-xs text-brand-600 hover:text-brand-700 mt-1 inline-block">Create your first gig</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
