import React from 'react';
import { Link } from '@inertiajs/react';

const sidebarLinks = [
    { href: '/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', section: 'profile' },
    { href: '/wallet', label: 'My Wallet', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { href: '/profile', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', section: 'orders' },
    { href: '/profile', label: 'Pending Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', section: 'reviews' },
    { href: '/profile', label: 'My Reviews', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', section: 'my_reviews' },
    { href: '/profile', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', section: 'password' },
    { href: '/chat', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { href: '/gigs', label: 'Browse Services', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
];

export default function CustomerSidebar({ user, sidebarOpen, setSidebarOpen, activeSection, onSectionChange }) {
    const isActive = (link) => {
        if (link.section) {
            return activeSection === link.section;
        }
        if (typeof window !== 'undefined') {
            return window.location.pathname === link.href;
        }
        return false;
    };

    const roleLabel = user?.roles?.[0]?.name
        ? user.roles[0].name.charAt(0).toUpperCase() + user.roles[0].name.slice(1)
        : 'Member';

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
            <aside className={`fixed lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:overflow-y-auto custom-scrollbar inset-y-0 left-0 z-40 w-72 bg-white pt-20 lg:pt-0 px-0 transform transition-transform duration-300 border-r border-gray-200 lg:min-h-[calc(100vh-76px)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* User Card */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-600 flex items-center justify-center ring-2 ring-brand-100">
                                {user?.avatar ? (
                                    <img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </span>
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{user?.name || 'Customer'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Welcome {roleLabel}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-0.5">
                    {sidebarLinks.map((link) => {
                        const active = isActive(link);
                        const handleClick = (e) => {
                            if (link.section && onSectionChange) {
                                e.preventDefault();
                                onSectionChange(link.section);
                            }
                            setSidebarOpen(false);
                        };

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={handleClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    active
                                        ? 'bg-brand-50 text-brand-700 border-l-[3px] border-brand-600 pl-[13px]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent pl-[13px]'
                                }`}
                            >
                                <svg className={`w-[18px] h-[18px] ${active ? 'text-brand-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={link.icon} />
                                </svg>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA Card */}
                <div className="mx-4 mt-6">
                    <div className="bg-brand-600 rounded-xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <p className="font-bold text-sm">Need something done?</p>
                        </div>
                        <p className="text-xs text-brand-100 leading-relaxed">Find the perfect freelancer for your project</p>
                        <Link href="/gigs" className="mt-4 flex items-center justify-center gap-2 w-full bg-white text-brand-700 text-sm font-bold py-2.5 rounded-lg hover:bg-brand-50 transition-colors">
                            Explore Services
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
