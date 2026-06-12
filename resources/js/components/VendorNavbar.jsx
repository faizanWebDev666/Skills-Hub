import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import NotificationBell from "./NotificationBell";

export default function VendorNavbar({ user }) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const currentUser = user ?? authUser;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="bg-cream-50 shadow-sm sticky top-0 z-50">
            {/* Status Bar */}
            <div className="bg-white border-b border-cream-200 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-2 text-xs sm:text-sm font-medium max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                        <span>Vendor Dashboard</span>
                    </div>
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-brand-600 transition-colors"
                    >
                        ← Back to Marketplace
                    </Link>
                </div>
            </div>

            {/* Main Navbar - Minimal & Clean */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 sm:py-4 max-w-7xl mx-auto">
                    {/* Branding */}
                    <Link
                        href="/vendor/dashboard"
                        className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                        <img
                            src="/assets/logo/logo.png"
                            alt="SkillHub Logo"
                            className="h-8 sm:h-10 object-contain"
                        />
                    </Link>

                    {/* Action Items - Right Side */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Create Gig Button - Primary Action */}
                        <Link
                            href="/vendor/gigs/create"
                            className="bg-brand-600 text-white px-3 sm:px-5 py-2 rounded-xl font-semibold hover:bg-brand-700 transition-colors text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                        >
                            <span className="text-lg">+</span>
                            <span className="hidden sm:inline">Create Gig</span>
                            <span className="sm:hidden">New</span>
                        </Link>

                        {/* Notifications */}
                        <NotificationBell />

                        {/* Messages */}
                        <Link
                            href="/chat"
                            className="text-gray-600 hover:text-brand-600 hover:bg-cream-100 p-2 sm:p-2.5 rounded-lg transition-colors"
                            title="Messages"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsUserMenuOpen(!isUserMenuOpen)
                                }
                                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-cream-100 transition-colors"
                                title={currentUser?.name}
                            >
                                {currentUser?.avatar ? (
                                    <img
                                        src={`/storage/${currentUser.avatar}`}
                                        alt={currentUser.name}
                                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 sm:w-9 h-8 sm:h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                                        {currentUser?.name?.charAt(0) || "V"}
                                    </div>
                                )}
                                <svg
                                    className="w-4 h-4 text-gray-600 hidden sm:block"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* User Dropdown Menu */}
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40">
                                        <div className="px-4 py-3 border-b border-cream-200">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {currentUser?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Vendor Account
                                            </p>
                                        </div>
                                        <Link
                                            href="/vendor/profile"
                                            className="block px-4 py-2.5 text-gray-700 hover:bg-cream-50 transition-colors text-sm"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        >
                                            Profile Settings
                                        </Link>
                                        <Link
                                            href="/wallet"
                                            className="block px-4 py-2.5 text-gray-700 hover:bg-cream-50 transition-colors text-sm"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        >
                                            Wallet & Earnings
                                        </Link>
                                        <div className="border-t border-cream-200 my-1"></div>
                                        <form
                                            method="post"
                                            action="/logout"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        >
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value={
                                                    document.querySelector(
                                                        'meta[name="csrf-token"]',
                                                    )?.content || ""
                                                }
                                            />
                                            <button
                                                type="submit"
                                                className="w-full text-left px-4 py-2.5 text-danger-600 hover:bg-danger-50 transition-colors text-sm font-medium"
                                            >
                                                Log Out
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
