import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const isVendor = user?.roles?.some(role => role.name === 'freelancer' || role.name === 'vendor');
    const isAdmin = user?.roles?.some(role => role.name === 'admin');

    return (
        <nav className="bg-cream-50 shadow-sm sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4 lg:space-x-12">
                        <Link href="/home" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-brand-600 to-brand-800 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">S</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                                SkillHub
                            </span>
                        </Link>
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link href="/home" className="text-gray-700 hover:text-brand-600 font-medium transition-colors">
                                Home
                            </Link>
                            <Link href="/gigs" className="text-gray-700 hover:text-brand-600 font-medium transition-colors">
                                Browse Services
                            </Link>
                            <Link href="#" className="text-gray-700 hover:text-brand-600 font-medium transition-colors">
                                How It Works
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <>
                                {isVendor && (
                                    <Link 
                                        href="/vendor/dashboard" 
                                        className="text-gray-700 hover:text-brand-600 font-medium transition-colors px-4 py-2"
                                    >
                                        Vendor Dashboard
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link 
                                        href="/admin/dashboard" 
                                        className="text-gray-700 hover:text-danger-600 font-medium transition-colors px-4 py-2"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-cream-200 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-medium text-gray-700">{user.name}</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                                            <Link 
                                                href="/profile" 
                                                className="block px-4 py-3 text-gray-700 hover:bg-cream-200 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            {isVendor && (
                                                <Link 
                                                    href="/gigs/create" 
                                                    className="block px-4 py-3 text-gray-700 hover:bg-cream-200 transition-colors"
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
                                                    className="w-full text-left px-4 py-3 text-danger-600 hover:bg-danger-50 transition-colors"
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
                                    className="text-gray-700 hover:text-brand-600 font-medium transition-colors px-4 py-2"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-brand-600 to-brand-800 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-4 border-t">
                        <div className="flex flex-col space-y-3">
                            <Link href="/home" className="text-gray-700 hover:text-brand-600 font-medium py-2">
                                Home
                            </Link>
                            <Link href="/gigs" className="text-gray-700 hover:text-brand-600 font-medium py-2">
                                Browse Services
                            </Link>
                            <Link href="#" className="text-gray-700 hover:text-brand-600 font-medium py-2">
                                How It Works
                            </Link>

                            {user && isVendor && (
                                <Link href="/vendor/dashboard" className="text-gray-700 hover:text-brand-600 font-medium py-2">
                                    Vendor Dashboard
                                </Link>
                            )}
                            {user && isAdmin && (
                                <Link href="/admin/dashboard" className="text-gray-700 hover:text-danger-600 font-medium py-2">
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-4 border-t flex flex-col space-y-3 pb-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                        <Link href="/profile" className="text-gray-700 hover:text-brand-600 font-medium py-2">
                                            My Profile
                                        </Link>
                                        {isVendor && (
                                            <Link href="/gigs/create" className="text-gray-700 hover:text-brand-600 font-medium py-2">
                                                Create Gig
                                            </Link>
                                        )}
                                        <form method="post" action="/logout">
                                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
                                            <button type="submit" className="w-full text-left text-danger-600 font-medium py-2">
                                                Log Out
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium">
                                            Log In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-gradient-to-r from-brand-600 to-brand-800 text-white px-6 py-2.5 rounded-xl font-semibold text-center"
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
        </nav>
    );
}
