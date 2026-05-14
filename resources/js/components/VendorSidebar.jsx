import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const sidebarLinks = [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
    { href: '/vendor/orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { href: '/vendor/gigs', label: 'My Gigs', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { href: '/vendor/gigs/create', label: 'Create Gig', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { href: '/vendor/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function VendorSidebar({ user, sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const currentUser = user ?? authUser;

    const isActive = (href) => {
        if (typeof window !== 'undefined') {
            return window.location.pathname === href;
        }
        return false;
    };

    return (
        <>
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar overlay on mobile */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar pt-20 lg:pt-6 px-4 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="mb-6 px-3">
                    <div className="flex items-center gap-3 p-3 bg-sidebar-light rounded-xl">
                        <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold">
                            {currentUser?.name?.charAt(0) || 'V'}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{currentUser?.name || 'Vendor'}</p>
                            <p className="text-xs text-slate-300">Vendor</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isActive(link.href)
                                    ? 'bg-brand-600 text-white'
                                    : 'text-slate-300 hover:bg-sidebar-light hover:text-white'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                            </svg>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 px-3">
                    <div className="bg-gradient-to-br from-brand-500 to-brand-800 rounded-xl p-4 text-white">
                        <p className="font-bold text-sm">Upgrade Plan</p>
                        <p className="text-xs text-brand-100 mt-1">Get featured listings & priority support</p>
                        <button className="mt-3 w-full bg-white text-brand-600 text-xs font-bold py-2 rounded-lg hover:bg-brand-50 transition-colors">
                            View Plans
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
