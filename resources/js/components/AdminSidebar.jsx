import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminSidebar({
    user,
    sidebarLinks,
    sidebarOpen,
    setSidebarOpen,
}) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const currentUser = user ?? authUser;
    const [expandedSections, setExpandedSections] = useState(['My Trash']);

    const toggleSection = (label) => {
        setExpandedSections(prev => 
            prev.includes(label) 
                ? prev.filter(l => l !== label) 
                : [...prev, label]
        );
    };

    const isActive = (href) => {
        if (typeof window !== "undefined") {
            return window.location.pathname === href;
        }
        return false;
    };

    const isSectionActive = (children) => {
        if (!children) return false;
        if (typeof window !== "undefined") {
            return children.some(child => window.location.pathname === child.href);
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
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar pt-20 lg:pt-6 px-4 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="mb-6 px-3">
                    <div className="flex items-center gap-3 p-3 bg-sidebar-light rounded-xl">
                        {currentUser?.avatar ? (
                            <img
                                src={`/storage/${currentUser.avatar}`}
                                alt={currentUser.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-danger-500 rounded-full flex items-center justify-center text-white font-bold">
                                {currentUser?.name?.charAt(0) || "A"}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-semibold text-white text-sm truncate">
                                {currentUser?.name || "Admin"}
                            </p>
                            <p className="text-xs text-slate-400">
                                Administrator
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {sidebarLinks.map((link) => (
                        <div key={link.href || link.label}>
                            {link.href ? (
                                <Link
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        isActive(link.href)
                                            ? "bg-brand-600 text-white"
                                            : "text-slate-300 hover:bg-sidebar-light hover:text-white"
                                    }`}
                                >
                                    {link.icon && (
                                        <svg
                                            className="w-5 h-5"
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
                                    )}
                                    {link.label}
                                </Link>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => toggleSection(link.label)}
                                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            isSectionActive(link.children)
                                                ? "bg-brand-600 text-white"
                                                : "text-slate-300 hover:bg-sidebar-light hover:text-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {link.icon && (
                                                <svg
                                                    className="w-5 h-5"
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
                                            )}
                                            {link.label}
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${expandedSections.includes(link.label) ? "rotate-180" : ""}`}
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
                                </div>
                            )}
                            {link.children && expandedSections.includes(link.label) && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {link.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                                isActive(child.href)
                                                    ? "bg-brand-600 text-white"
                                                    : "text-slate-400 hover:bg-sidebar-light hover:text-white"
                                            }`}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="mt-6 px-3">
                    <Link
                        href="/chat"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive("/chat")
                                ? "bg-brand-600 text-white"
                                : "text-slate-300 hover:bg-sidebar-light hover:text-white"
                        }`}
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
                                strokeWidth={1.5}
                                d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2"
                            />
                        </svg>
                        Chat Inbox
                    </Link>
                </div>

                <div className="mt-8 px-3">
                    <div className="bg-gradient-to-br from-brand-500 to-brand-800 rounded-xl p-4 text-white">
                        <p className="font-bold text-sm">System Health</p>
                        <p className="text-xs text-brand-100 mt-1">
                            All systems operational
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs text-brand-100">
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
