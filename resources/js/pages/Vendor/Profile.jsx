import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import VendorSidebar from '../../components/VendorSidebar';

export default function VendorProfile({ user }) {
    const roleLabel = user?.roles?.[0]?.name ? user.roles[0].name.charAt(0).toUpperCase() + user.roles[0].name.slice(1) : 'Freelancer';

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <VendorSidebar user={user} sidebarOpen={false} setSidebarOpen={() => {}} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8 grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Your Profile</p>
                                        <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Your Name'}</h1>
                                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold">{roleLabel}</span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-cream-100 text-gray-600 text-sm">{user?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">About You</h2>
                                        <p className="mt-3 text-gray-600 leading-7 whitespace-pre-line">
                                            {user?.bio || 'Add a short bio to tell clients what you do best and why they should work with you.'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-3xl bg-cream-100 p-5">
                                            <p className="text-sm text-gray-500">Total Gigs</p>
                                            <p className="mt-3 text-2xl font-bold text-gray-900">{user?.gigs?.length || 0}</p>
                                        </div>
                                        <div className="rounded-3xl bg-cream-100 p-5">
                                            <p className="text-sm text-gray-500">Total Orders</p>
                                            <p className="mt-3 text-2xl font-bold text-gray-900">{user?.freelancerOrders?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
                                    <div className="space-y-3">
                                        <Link href="/chat" className="block w-full text-center px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
                                            Open Chat Inbox
                                        </Link>
                                        <Link href="/vendor/gigs" className="block w-full text-center px-4 py-3 rounded-2xl bg-cream-50 border border-gray-200 text-gray-700 hover:border-brand-200 transition-colors">
                                            Manage Gigs
                                        </Link>
                                        <Link href="/gigs" className="block w-full text-center px-4 py-3 rounded-2xl bg-cream-50 border border-gray-200 text-gray-700 hover:border-brand-200 transition-colors">
                                            Browse Services
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Profile Settings</h2>
                                    <p className="text-sm text-gray-600">Update your bio, contact info, and service settings from the sidebar settings page.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
