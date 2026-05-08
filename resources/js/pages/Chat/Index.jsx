import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

export default function ChatIndex({ conversations, user }) {
    const getRoleLabel = (otherUser) => {
        const role = otherUser?.roles?.[0]?.name;
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Customer';
    };

    const getBadgeClasses = (otherUser) => {
        const role = otherUser?.roles?.[0]?.name;
        if (role === 'admin') return 'bg-danger-100 text-danger-700';
        if (role === 'vendor' || role === 'freelancer') return 'bg-brand-100 text-brand-700';
        return 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                        {conversations?.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {conversations.map((conv) => (
                                    <Link
                                        key={conv.id}
                                        href={route('chat.show', conv.id)}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0">
                                            {conv.other_user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900 truncate">{conv.other_user?.name}</h3>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(conv.other_user)}`}>
                                                            {getRoleLabel(conv.other_user)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-2 truncate">
                                                        {conv.latest_message?.content || 'No messages yet'}
                                                    </p>
                                                </div>
                                                {conv.unread_count > 0 && (
                                                    <span className="inline-flex items-center bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                                        {conv.unread_count} new
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                                <p className="text-gray-500">Chat is ready. Start a conversation from a user profile, order page, or admin dashboard.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}