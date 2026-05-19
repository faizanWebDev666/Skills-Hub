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
        if (role === 'admin') return 'bg-danger-50 text-danger-600 border border-danger-100';
        if (role === 'vendor' || role === 'freelancer') return 'bg-brand-50 text-brand-600 border border-brand-100';
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar user={user} />
            
            <div className="flex-1 flex overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto flex h-[calc(100vh-76px)] shadow-sm bg-white overflow-hidden lg:my-6 lg:rounded-3xl lg:border lg:border-gray-200 lg:h-[calc(100vh-120px)]">
                    
                    {/* Sidebar */}
                    <div className="w-full lg:w-[380px] flex flex-col bg-white border-r border-gray-100 z-10 flex-shrink-0">
                        <div className="p-5 lg:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-20 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)] relative">
                            <h2 className="font-bold text-2xl text-gray-900 tracking-tight">Messages</h2>
                            <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-4 border-b border-gray-50">
                            <div className="relative">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input 
                                    type="text" 
                                    placeholder="Search messages..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-2xl text-sm transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
                            {conversations?.length > 0 ? (
                                conversations.map((conv) => {
                                    const isUnread = conv.unread_count > 0;
                                    return (
                                        <Link
                                            key={conv.id}
                                            href={route('chat.show', conv.id)}
                                            className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 relative"
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-50 rounded-2xl flex items-center justify-center text-brand-700 font-bold text-xl ring-1 ring-black/5 shadow-inner">
                                                    {conv.other_user?.avatar ? (
                                                        <img src={`/storage/${conv.other_user.avatar}`} alt={conv.other_user.name} className="w-full h-full object-cover rounded-2xl" />
                                                    ) : (
                                                        conv.other_user?.name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h3 className={`font-semibold text-[15px] truncate pr-2 ${isUnread ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900 transition-colors'}`}>
                                                        {conv.other_user?.name}
                                                    </h3>
                                                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                                                        {conv.latest_message ? new Date(conv.latest_message.created_at).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : ''}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-[13px] truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                                        {conv.latest_message?.content || 'Started a conversation'}
                                                    </p>
                                                    {isUnread && (
                                                        <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-brand-600 text-white text-[11px] font-bold rounded-full shadow-sm shadow-brand-500/30">
                                                            {conv.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    )
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
                    </div>

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
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome to your Inbox</h3>
                            <p className="text-gray-500 text-[15px] leading-relaxed">
                                Select a conversation from the sidebar to start chatting, or browse profiles to initiate a new connection.
                            </p>
                            <Link href="/gigs" className="mt-8 px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-brand-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
                                Explore Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
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
            `}} />
        </div>
    );
}