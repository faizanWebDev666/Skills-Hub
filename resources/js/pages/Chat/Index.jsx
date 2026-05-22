import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import ChatSidebar from "../../components/ChatSidebar";

export default function ChatIndex({ conversations, user }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar user={user} />

            <div className="flex-1 flex overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto flex h-[calc(100vh-76px)] shadow-sm bg-slate-50 overflow-hidden lg:rounded-3xl lg:border lg:border-slate-200 lg:h-[calc(100vh-76px)]">
                    {/* Sidebar */}
                    <ChatSidebar
                        conversations={conversations}
                        activeConversationId={null}
                        onlineUsers={new Set()}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    {/* Main Area Empty State */}
                    <div className="hidden lg:flex flex-1 bg-gray-50 flex-col items-center justify-center p-8 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-50/80 to-transparent"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
                        <div className="absolute bottom-12 -left-12 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                            <div className="w-24 h-24 mb-6 relative">
                                <div className="absolute inset-0 bg-brand-100 rounded-3xl rotate-6 opacity-50"></div>
                                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center text-brand-600 transition-transform hover:scale-105 duration-300">
                                    <svg
                                        className="w-10 h-10"
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
                                </div>
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                Welcome to your Inbox
                            </h3>
                            <p className="text-gray-500 text-[15px] leading-relaxed">
                                Select a conversation from the sidebar to start
                                chatting, or browse profiles to initiate a new
                                connection.
                            </p>
                            <Link
                                href="/gigs"
                                className="mt-8 px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-brand-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Explore Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
