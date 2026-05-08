import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminSidebar({ user, sidebarLinks, sidebarOpen, setSidebarOpen }) {
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
                        <div className="w-10 h-10 bg-danger-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
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
                        <p className="font-bold text-sm">System Health</p>
                        <p className="text-xs text-brand-100 mt-1">All systems operational</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs text-brand-100">Online</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
