import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

export default function ChatIndex({ conversations, user }) {
    const getRoleLabel = (otherUser) => {
        const role = otherUser?.roles?.[0]?.name;
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Customer';
    };

    const getRoleBadge = (otherUser) => {
        const role = otherUser?.roles?.[0]?.name;
        if (role === 'admin') return 'bg-danger-100 text-danger-700';
        if (role === 'vendor' || role === 'freelancer') return 'bg-brand-100 text-brand-700';
        return 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />
            
            <div className="flex h-[calc(100vh-80px)]">
                {/* Sidebar */}
                <div className="w-full lg:w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
                    <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10">
                        <h2 className="font-bold text-xl text-gray-900">Messages</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {conversations?.length > 0 ? (
                            conversations.map((conv) => (
                                <Link
                                    key={conv.id}
                                    href={route('chat.show', conv.id)}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                                        {conv.other_user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.other_user?.name}</h3>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${getRoleBadge(conv.other_user)}`}>
                                                        {getRoleLabel(conv.other_user)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                    {conv.latest_message?.content || 'No messages yet'}
                                                </p>
                                            </div>
                                            {conv.unread_count > 0 && (
                                                <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1 sm:mt-0 self-start sm:self-center shrink-0">
                                                    {conv.unread_count} new
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">No messages yet</h4>
                                <p className="text-xs text-gray-500">Your conversations will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Area Empty State */}
                <div className="hidden lg:flex flex-1 bg-[radial-gradient(circle_at_top,#f8fafc,transparent_35%),radial-gradient(circle_at_bottom,#eef2ff,transparent_40%)] flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-300 mb-6">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Your Messages</h3>
                    <p className="text-slate-500 max-w-sm text-center text-sm leading-relaxed">
                        Select a conversation from the sidebar to view messages or start a new chat directly from a user's profile.
                    </p>
                </div>
            </div>
        </div>
    );
}