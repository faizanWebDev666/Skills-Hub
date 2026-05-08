import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

export default function AdminDashboard({ stats, recentActivity }) {
    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar />
            
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
                    <p className="text-gray-600 mt-1">Moderate users, gigs, and manage the platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalUsers?.toLocaleString() || '0'}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">👥</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{stats?.vendors || 0} Vendors</span>
                            <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">{stats?.customers || 0} Customers</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Gigs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.activeGigs?.toLocaleString() || '0'}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">🚀</span>
                            </div>
                        </div>
                        <p className="text-sm text-accent-600 mt-3 flex items-center gap-1">
                            <span className="text-accent-500">⚠️</span> {stats?.pendingGigs || 0} pending review
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">💵</span>
                            </div>
                        </div>
                        <p className="text-sm text-success-600 mt-3">This month: ${stats?.monthlyRevenue?.toLocaleString() || '0'}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Reports</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.openReports || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-danger-500 to-danger-700 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">🚨</span>
                            </div>
                        </div>
                        <p className="text-sm text-danger-600 mt-3">Requires immediate attention</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                                <Link href="/admin/activity" className="text-brand-600 hover:text-brand-700 font-medium">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentActivity?.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                            activity.type === 'user' ? 'bg-brand-500' :
                                            activity.type === 'gig' ? 'bg-brand-400' :
                                            activity.type === 'order' ? 'bg-success-500' :
                                            'bg-gray-500'
                                        }`}>
                                            {activity.type === 'user' ? '👤' : activity.type === 'gig' ? '🚀' : activity.type === 'order' ? '📦' : '📄'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{activity.message}</p>
                                            <p className="text-sm text-gray-500">{activity.time}</p>
                                        </div>
                                        {activity.action && (
                                            <button className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                                activity.action === 'approve' ? 'bg-success-100 text-success-700 hover:bg-success-200' :
                                                activity.action === 'reject' ? 'bg-danger-100 text-danger-700 hover:bg-danger-200' :
                                                'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}>
                                                {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {(!recentActivity || recentActivity.length === 0) && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-4xl mb-2">📋</p>
                                        <p>No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Moderation</h2>
                            <div className="space-y-3">
                                <Link href="/admin/users" className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors">
                                    <span className="text-2xl">👥</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">Manage Users</p>
                                        <p className="text-sm text-gray-500">View and moderate users</p>
                                    </div>
                                </Link>
                                <Link href="/admin/gigs" className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors">
                                    <span className="text-2xl">🚀</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">Moderate Gigs</p>
                                        <p className="text-sm text-gray-500">Approve or reject gigs</p>
                                    </div>
                                </Link>
                                <Link href="/admin/orders" className="flex items-center gap-3 p-4 bg-success-50 rounded-xl hover:bg-success-100 transition-colors">
                                    <span className="text-2xl">📦</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">View Orders</p>
                                        <p className="text-sm text-gray-500">Monitor all transactions</p>
                                    </div>
                                </Link>
                                <Link href="/admin/reports" className="flex items-center gap-3 p-4 bg-danger-50 rounded-xl hover:bg-danger-100 transition-colors">
                                    <span className="text-2xl">🚨</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">Reports</p>
                                        <p className="text-sm text-gray-500">Review user reports</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">Platform Settings</h3>
                            <p className="text-white/90 text-sm mb-4">Configure platform-wide settings and policies.</p>
                            <Link href="/admin/settings" className="block w-full bg-white text-brand-600 font-bold py-3 rounded-xl hover:bg-cream-100 transition-colors text-center">
                                Open Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
