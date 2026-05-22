import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminNavbar({ user }) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const currentUser = user ?? authUser;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-lg sticky top-0 z-50 transition-all duration-300">
            {/* Top Thin Bar - Admin Status */}
            <div className="bg-red-900/50 border-b border-red-500/30">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-2 space-x-4 sm:space-x-6 text-xs sm:text-sm font-medium text-red-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span>Admin Panel</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-red-200 hover:text-white transition-colors"
                            >
                                ← Back to Site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 sm:py-4">
                    <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 lg:space-x-12">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
                        >
                            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 sm:w-6 h-5 sm:h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <span className="text-white font-bold text-sm sm:text-base">
                                Admin Panel
                            </span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            <Link
                                href="/admin/dashboard"
                                className="text-red-100 hover:text-white font-medium transition-colors text-sm lg:text-base"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/users"
                                className="text-red-100 hover:text-white font-medium transition-colors text-sm lg:text-base"
                            >
                                Users
                            </Link>
                            <Link
                                href="/admin/gigs"
                                className="text-red-100 hover:text-white font-medium transition-colors text-sm lg:text-base"
                            >
                                Gigs
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="text-red-100 hover:text-white font-medium transition-colors text-sm lg:text-base"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/admin/reports"
                                className="text-red-100 hover:text-white font-medium transition-colors text-sm lg:text-base"
                            >
                                Reports
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation - Visible on medium and above */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
                        {/* System Status */}
                        <div className="flex items-center gap-2 text-red-100 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="hidden lg:inline">
                                System Online
                            </span>
                        </div>

                        {/* Notifications */}
                        <Link
                            href="/admin/notifications"
                            className="relative text-red-100 hover:text-white transition-colors p-2.5 hover:bg-red-700/50 rounded-lg"
                            aria-label="Notifications"
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
                                    d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 0110.293-4.293L15 6.414V17z"
                                />
                            </svg>
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsUserMenuOpen(!isUserMenuOpen)
                                }
                                className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-xl hover:bg-red-700/50 transition-colors"
                            >
                                <div className="w-8 lg:w-10 h-8 lg:h-10 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-sm lg:text-base">
                                    {currentUser?.name?.charAt(0) || "A"}
                                </div>
                                <span className="font-medium text-white hidden lg:inline text-sm">
                                    {currentUser?.name}
                                </span>
                                <svg
                                    className="w-4 h-4 text-red-200"
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

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                                    <Link
                                        href="/admin/profile"
                                        className="block px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors text-sm"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Admin Profile
                                    </Link>
                                    <Link
                                        href="/admin/settings"
                                        className="block px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors text-sm"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        System Settings
                                    </Link>
                                    <Link
                                        href="/admin/logs"
                                        className="block px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors text-sm"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        System Logs
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <form method="post" action="/logout">
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
                                            className="w-full text-left px-4 py-3 text-danger-600 hover:bg-danger-50 transition-colors text-sm"
                                        >
                                            Log Out
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button - Visible on small screens */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 rounded-lg hover:bg-red-700/50 transition-colors flex-shrink-0"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu - Visible only on small screens */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <div className="py-4 border-t border-red-500/30">
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/admin/dashboard"
                                className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/users"
                                className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                            >
                                Users
                            </Link>
                            <Link
                                href="/admin/gigs"
                                className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                            >
                                Gigs
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/admin/reports"
                                className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                            >
                                Reports
                            </Link>

                            <div className="pt-4 border-t border-red-500/30 flex flex-col space-y-3">
                                <div className="flex items-center gap-2 px-2 py-2 text-red-100 text-sm">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>System Online</span>
                                </div>

                                <div className="flex items-center gap-3 px-2 py-2">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                                        {currentUser?.name?.charAt(0) || "A"}
                                    </div>
                                    <span className="font-medium text-white text-sm">
                                        {currentUser?.name}
                                    </span>
                                </div>

                                <Link
                                    href="/admin/profile"
                                    className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                                >
                                    Admin Profile
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                                >
                                    System Settings
                                </Link>
                                <Link
                                    href="/admin/logs"
                                    className="text-red-100 hover:text-white font-medium py-2 px-1 text-sm"
                                >
                                    System Logs
                                </Link>

                                <form method="post" action="/logout">
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
                                        className="w-full text-left text-red-300 hover:text-red-100 font-medium py-2 px-1 text-sm"
                                    >
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
