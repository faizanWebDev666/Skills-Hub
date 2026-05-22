import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const sidebarLinks = [
    {
        href: "/vendor/dashboard",
        label: "Dashboard",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
    },
    {
        href: "/vendor/gigs",
        label: "My Gigs",
        icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
        href: "/vendor/orders",
        label: "Orders",
        icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
        href: "/wallet",
        label: "Wallet",
        icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
        href: "/vendor/reviews",
        label: "Reviews",
        icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    },
    {
        href: "/vendor/profile",
        label: "Profile",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
];

export default function VendorSidebar({
    user,
    sidebarOpen,
    setSidebarOpen,
    conversations = [],
    totalUnreadMessages = 0,
}) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const currentUser = user ?? authUser;
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);

    const isActive = (href) => {
        if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            return currentPath === href || currentPath.startsWith(href + "/");
        }
        return false;
    };

    return (
        <>
            {/* Mobile sidebar toggle - Floating button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all hover:scale-110"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Sidebar overlay on mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:overflow-y-auto custom-scrollbar inset-y-0 left-0 z-40 w-64 bg-white pt-20 lg:pt-0 px-0 transform transition-all duration-300 border-r border-gray-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Sidebar Content */}
                <div className="py-6 space-y-6">
                    {/* User Profile Card */}
                    <div className="px-4">
                        <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl border border-brand-100">
                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {currentUser?.name?.charAt(0) || "V"}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                    {currentUser?.name || "Vendor"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Vendor Account
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Navigation */}
                    <div>
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Main Menu
                        </p>
                        <nav className="space-y-0.5 px-2">
                            {sidebarLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive(link.href)
                                            ? "bg-brand-50 text-brand-700 border-l-[3px] border-brand-600 pl-[9px]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent pl-[9px]"
                                    }`}
                                >
                                    <svg
                                        className={`w-5 h-5 flex-shrink-0 ${isActive(link.href) ? "text-brand-600" : "text-gray-400"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d={link.icon}
                                        />
                                    </svg>
                                    <span>{link.label}</span>
                                </Link>
                            ))}

                            {/* Messages Section */}
                            <div className="mt-2">
                                <button
                                    onClick={() =>
                                        setIsMessagesOpen(!isMessagesOpen)
                                    }
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                                        isActive("/chat")
                                            ? "bg-brand-50 text-brand-700 border-l-[3px] border-brand-600 pl-[9px]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent pl-[9px]"
                                    }`}
                                >
                                    <svg
                                        className={`w-5 h-5 flex-shrink-0 ${isActive("/chat") ? "text-brand-600" : "text-gray-400"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <span className="flex-1">Messages</span>
                                    {totalUnreadMessages > 0 && (
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-danger-600 rounded-full">
                                            {totalUnreadMessages > 99
                                                ? "99+"
                                                : totalUnreadMessages}
                                        </span>
                                    )}
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform ${isMessagesOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                </button>

                                {/* Messages List */}
                                {isMessagesOpen && (
                                    <div className="mt-1 ml-2 border-l-2 border-gray-200 pl-2 space-y-1">
                                        {conversations.length > 0 ? (
                                            conversations.map(
                                                (conversation) => (
                                                    <Link
                                                        key={conversation.id}
                                                        href={`/chat/${conversation.id}`}
                                                        onClick={() => {
                                                            setIsMessagesOpen(
                                                                false,
                                                            );
                                                            setSidebarOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        {conversation.other_user
                                                            ?.avatar ? (
                                                            <img
                                                                src={
                                                                    conversation
                                                                        .other_user
                                                                        .avatar
                                                                }
                                                                alt={
                                                                    conversation
                                                                        .other_user
                                                                        .name
                                                                }
                                                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-xs flex-shrink-0">
                                                                {conversation.other_user?.name?.charAt(
                                                                    0,
                                                                ) || "?"}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-700 truncate">
                                                                {
                                                                    conversation
                                                                        .other_user
                                                                        ?.name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate line-clamp-1">
                                                                {conversation
                                                                    .latest_message
                                                                    ?.content ||
                                                                    "No messages yet"}
                                                            </p>
                                                        </div>
                                                        {conversation.unread_count >
                                                            0 && (
                                                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-brand-600 rounded-full flex-shrink-0">
                                                                {
                                                                    conversation.unread_count
                                                                }
                                                            </span>
                                                        )}
                                                    </Link>
                                                ),
                                            )
                                        ) : (
                                            <div className="px-3 py-4 text-center">
                                                <p className="text-xs text-gray-400">
                                                    No conversations yet
                                                </p>
                                            </div>
                                        )}
                                        <Link
                                            href="/chat"
                                            onClick={() => {
                                                setIsMessagesOpen(false);
                                                setSidebarOpen(false);
                                            }}
                                            className="block px-3 py-2 text-xs text-center text-brand-600 hover:text-brand-700 font-medium mt-2 pt-2 border-t border-gray-200"
                                        >
                                            View all messages →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>

                    {/* Create Gig - Primary CTA */}
                    <div className="px-4">
                        <Link
                            href="/vendor/gigs/create"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
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
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <span>New Gig</span>
                        </Link>
                    </div>

                    {/* Upgrade Plan */}
                    <div className="px-4">
                        <div className="bg-brand-600 rounded-xl p-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <p className="font-bold text-sm">
                                    Upgrade Plan
                                </p>
                            </div>
                            <p className="text-xs text-brand-100 mb-3">
                                Get featured listings, priority support &
                                analytics
                            </p>
                            <a href="/vendor/subscriptions">
                                <button className="w-full bg-white text-brand-600 text-xs font-bold py-2 px-3 rounded-lg hover:bg-brand-50 transition-colors">
                                    View Plans
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
