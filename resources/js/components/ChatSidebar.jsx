import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

export default function ChatSidebar({
    conversations,
    activeConversationId,
    onlineUsers = new Set(),
    searchQuery = "",
    onSearchChange = () => {},
    isHiddenOnMobile = false,
}) {
    // User search (the plus button panel)
    const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [userResults, setUserResults] = useState([]);
    const [isUserSearchLoading, setIsUserSearchLoading] = useState(false);
    const [userSearchError, setUserSearchError] = useState("");

    useEffect(() => {
        if (!isUserSearchOpen) {
            setUserSearchQuery("");
            setUserResults([]);
            setUserSearchError("");
            setIsUserSearchLoading(false);
            return;
        }

        if (!userSearchQuery.trim()) {
            setUserResults([]);
            setUserSearchError("");
            setIsUserSearchLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsUserSearchLoading(true);
            setUserSearchError("");

            try {
                const response = await fetch(
                    route("chat.users.search") + `?query=${encodeURIComponent(userSearchQuery)}`,
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch sellers");
                }

                const data = await response.json();
                setUserResults(data.users || []);
            } catch (error) {
                setUserSearchError("Unable to load suggestions. Please try again.");
            } finally {
                setIsUserSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [isUserSearchOpen, userSearchQuery]);

    // Filter control for conversations
    const [filter, setFilter] = useState("all");

    const relativeTime = (dateString) => {
        if (!dateString) return "";
        const then = new Date(dateString).getTime();
        const diff = Date.now() - then;
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days}d ago`;
        return new Date(dateString).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    };

    const filteredConversations = conversations
        ? conversations
              .filter((conv) =>
                  conv.other_user?.name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()),
              )
              .filter((conv) => {
                  if (filter === "unread") return (conv.unread_count || 0) > 0;
                  if (filter === "read") return (conv.unread_count || 0) === 0;
                  return true;
              })
        : [];

    const containerClass = isHiddenOnMobile
        ? "hidden lg:flex w-[380px] flex-col bg-slate-950 border-r border-slate-800 z-10 flex-shrink-0"
        : "w-full lg:w-[380px] flex flex-col bg-slate-950 border-r border-slate-800 z-10 flex-shrink-0";

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="p-5 lg:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white z-20 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.25)] relative">
                <h2 className="font-bold text-2xl text-white tracking-tight">Messages</h2>

                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all"
                    onClick={() => setIsUserSearchOpen((v) => !v)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Plus-panel: search users */}
            {isUserSearchOpen && (
                <div className="p-4 border-b border-slate-800 bg-slate-950">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">Find sellers to start chatting</p>
                            <p className="text-xs text-slate-400">Search by name, title, or skill.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsUserSearchOpen(false)}
                            className="text-slate-400 hover:text-white bg-slate-900 rounded-full p-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search designers, developers, sellers..."
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 border-transparent focus:bg-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-2xl text-sm transition-all outline-none"
                        />
                    </div>

                    <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                        {userSearchError ? (
                            <p className="text-xs text-rose-400">{userSearchError}</p>
                        ) : isUserSearchLoading ? (
                            <p className="text-sm text-slate-400">Searching...</p>
                        ) : userSearchQuery.trim() ? (
                            userResults.length > 0 ? (
                                userResults.map((user) => (
                                    <Link
                                        key={user.uuid}
                                        href={route("chat.with-user", user.uuid)}
                                        className="block p-3 rounded-3xl bg-slate-950 border border-slate-800 hover:bg-slate-900 transition-colors"
                                        onClick={() => setIsUserSearchOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 font-semibold flex items-center justify-center overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{user.professional_title || user.service_type || "Seller"}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">No sellers found. Try a different name or keyword.</p>
                            )
                        ) : (
                            <p className="text-sm text-slate-400">Enter a name or skill to find sellers and start a conversation.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Search + Filters */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-300"}`}
                    >
                        All
                    </button>

                    <button
                        type="button"
                        onClick={() => setFilter("unread")}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "unread" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-300"}`}
                    >
                        Unread
                    </button>

                    <button
                        type="button"
                        onClick={() => setFilter("read")}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "read" ? "bg-slate-600 text-white" : "bg-slate-900 text-slate-300"}`}
                    >
                        Read
                    </button>
                </div>

                <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 border-transparent focus:bg-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-2xl text-sm transition-all outline-none"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
                {filteredConversations?.length > 0 ? (
                    filteredConversations.map((conv) => {
                        const isUnread = conv.unread_count > 0;
                        const isActive = conv.id === activeConversationId;

                        return (
                            <Link
                                key={conv.id}
                                href={route("chat.show", conv.id)}
                                className={`group flex items-center gap-4 p-3 rounded-3xl transition-all duration-200 relative ${
                                    isActive
                                        ? "bg-slate-900 border border-slate-700 shadow-sm"
                                        : "bg-slate-950 border border-slate-800 hover:bg-slate-900"
                                }`}
                            >
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full"></div>}

                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-50 rounded-2xl flex items-center justify-center text-brand-700 font-bold text-xl ring-1 ring-black/5 shadow-inner overflow-hidden">
                                        {conv.other_user?.avatar ? (
                                            <img src={`/storage/${conv.other_user.avatar}`} alt={conv.other_user?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            conv.other_user?.name?.charAt(0) || "U"
                                        )}
                                    </div>
                                    {onlineUsers.has(conv.other_user?.id) && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-950 rounded-full shadow-sm"></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className={`font-semibold text-[15px] truncate pr-2 ${isUnread ? "text-white" : "text-slate-300 group-hover:text-white transition-colors"}`}>
                                            {conv.other_user?.name}
                                        </h3>
                                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                            {conv.latest_message ? relativeTime(conv.latest_message.created_at) : ""}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-[13px] truncate ${isUnread ? "text-slate-200 font-medium" : "text-slate-400"}`}>
                                            {conv.latest_message?.content || (conv.latest_message?.attachment ? "Sent an attachment" : "Started a conversation")}
                                        </p>
                                        {isUnread && (
                                            <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-brand-600 text-white text-[11px] font-bold rounded-full shadow-sm shadow-brand-500/30">
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 mb-1">No messages</h4>
                        <p className="text-sm text-gray-500">When you connect with others, your chats will appear here.</p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.3);
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.5);
                }
            `
            }} />
        </div>
    );
}
