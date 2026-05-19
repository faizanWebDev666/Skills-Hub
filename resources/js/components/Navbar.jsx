import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import WishlistDrawer from './WishlistDrawer';
import NotificationBell from './NotificationBell';

export default function Navbar({ user }) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const currentUser = user ?? authUser;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/gigs?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const isVendor = currentUser?.roles?.some(role => role.name === 'freelancer' || role.name === 'vendor');
    const isAdmin = currentUser?.roles?.some(role => role.name === 'admin');

    return (
        <nav className="bg-cream-50 shadow-sm sticky top-0 z-50 transition-all duration-300">
            {/* Top Thin Bar - Visible on medium and above */}
            <div className="bg-white border-b border-gray-100 hidden md:block">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-end items-center py-2 space-x-4 sm:space-x-6 text-xs sm:text-sm font-medium">
                        <Link href="/home" className="text-gray-500 hover:text-brand-600 transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                            How It Works
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 sm:py-4">
                    <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 lg:space-x-12">
                        <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            <img src="/assets/logo/logo.png" alt="SkillHub Logo" className="h-8 sm:h-10 object-contain" />
                        </Link>
                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            <Link href="/gigs" className="text-gray-700 hover:text-brand-600 font-medium transition-colors text-sm lg:text-base">
                                Browse Services
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation - Visible on medium and above */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative flex-shrink-0">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services..."
                                className="w-56 md:w-64 lg:w-80 pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                            />
                        </form>

                        {currentUser ? (
                            <>
                                {/* Wishlist Button */}
                                <button
                                    onClick={() => setIsWishlistOpen(true)}
                                    className="relative text-gray-600 hover:text-brand-600 transition-colors p-2.5 hover:bg-gray-100 rounded-lg"
                                    aria-label="Wishlist"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                {/* Notifications */}
                                <NotificationBell />

                                {/* Messages */}
                                <Link
                                    href="/chat"
                                    className="relative text-gray-600 hover:text-brand-600 transition-colors p-2.5 hover:bg-gray-100 rounded-lg"
                                    aria-label="Messages"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </Link>

                                {isAdmin && (
                                    <Link 
                                        href="/admin/dashboard" 
                                        className="text-gray-700 hover:text-danger-600 font-medium transition-colors px-3 lg:px-4 py-2 text-sm"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                
                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-xl hover:bg-cream-200 transition-colors"
                                    >
                                        <div className="w-8 lg:w-10 h-8 lg:h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                                            {currentUser?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-medium text-gray-700 hidden lg:inline text-sm">{currentUser?.name}</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                                            {isVendor && (
                                                <Link 
                                                    href="/vendor/dashboard" 
                                                    className="block px-4 py-3 text-gray-700 hover:bg-cream-200 transition-colors text-sm"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                            {!isVendor && (
                                                <Link 
                                                    href="/profile" 
                                                    className="block px-4 py-3 text-gray-700 hover:bg-cream-200 transition-colors text-sm"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    My Profile
                                                </Link>
                                            )}
                                            {isVendor && (
                                                <Link 
                                                    href="/vendor/gigs/create" 
                                                    className="block px-4 py-3 text-gray-700 hover:bg-cream-200 transition-colors text-sm"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Create Gig
                                                </Link>
                                            )}
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <form method="post" action="/logout">
                                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
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
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="text-gray-700 hover:text-brand-600 font-medium transition-colors px-3 py-2 text-sm"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-brand-600 to-brand-800 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-sm lg:text-base"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Visible on small screens */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
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
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-4 border-t">
                        <div className="flex flex-col space-y-3">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative px-1">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search services..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                                />
                            </form>

                            <Link href="/home" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                Home
                            </Link>
                            <Link href="/gigs" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                Browse Services
                            </Link>
                            <Link href="#" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                How It Works
                            </Link>

                            {currentUser && (
                                <div className="flex items-center gap-4 py-3 px-1 border-t">
                                    <button 
                                        onClick={() => { setIsWishlistOpen(true); setIsMenuOpen(false); }} 
                                        className="flex items-center gap-2 text-gray-700 hover:text-brand-600 font-medium transition-colors flex-1 text-sm"
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Wishlist
                                    </button>
                                    <Link
                                        href="/chat"
                                        className="flex items-center gap-2 text-gray-700 hover:text-brand-600 transition-colors flex-1 text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>Messages</span>
                                    </Link>
                                </div>
                            )}

                            {currentUser && isAdmin && (
                                <Link href="/admin/dashboard" className="text-gray-700 hover:text-danger-600 font-medium py-2 px-1 text-sm">
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-4 border-t flex flex-col space-y-3">
                                {currentUser ? (
                                    <>
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {currentUser.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="font-medium text-gray-900 text-sm">{currentUser.name}</span>
                                        </div>
                                        {isVendor && (
                                            <Link href="/vendor/dashboard" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                                Dashboard
                                            </Link>
                                        )}
                                        {!isVendor && (
                                            <Link href="/profile" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                                My Profile
                                            </Link>
                                        )}
                                        {isVendor && (
                                            <Link href="/vendor/gigs/create" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                                Create Gig
                                            </Link>
                                        )}
                                        <form method="post" action="/logout">
                                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
                                            <button type="submit" className="w-full text-left text-danger-600 font-medium py-2 px-1 text-sm">
                                                Log Out
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium py-2 px-1 text-sm">
                                            Log In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-gradient-to-r from-brand-600 to-brand-800 text-white px-4 py-2.5 rounded-xl font-semibold text-center text-sm"
                                        >
                                            Join Now
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <WishlistDrawer 
                isOpen={isWishlistOpen} 
                onClose={() => setIsWishlistOpen(false)} 
            />
        </nav>
    );
}
