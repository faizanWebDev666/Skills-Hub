import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import { echo } from '../../echo';

export default function ChatShow({ conversation, conversations, user }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(() => {
        const initial = conversation?.messages || [];
        return [...initial].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    });
    const [convList, setConvList] = useState(conversations || []);
    const messagesEndRef = useRef(null);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatChatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (a, b) => (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );

        if (isSameDay(date, today)) return 'Today';
        if (isSameDay(date, yesterday)) return 'Yesterday';

        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const isSameDay = (a, b) => (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!conversation?.id || !user?.id) return;

        const channel = echo.private(`chat.${conversation.id}`);

        channel.listen('.message.sent', (e) => {
            setMessages(prev => {
                if (prev.some((msg) => msg.id === e.message.id)) {
                    return prev;
                }
                return [...prev, e.message];
            });

            setConvList(prev => {
                const updated = prev.map(c => {
                    if (c.id === e.conversationId) {
                        return {
                            ...c,
                            latest_message: e.message,
                            unread_count: c.id === conversation.id ? 0 : (c.unread_count || 0) + 1,
                            last_message_at: new Date().toISOString(),
                        };
                    }
                    return c;
                });

                return updated.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
            });
        });

        const userChannel = echo.private(`user.${user.id}`);
        userChannel.listen('.message.sent', (e) => {
            if (e.conversationId !== conversation.id) {
                setConvList(prev => {
                    const updated = prev.map(c => {
                        if (c.id === e.conversationId) {
                            return {
                                ...c,
                                latest_message: e.message,
                                unread_count: (c.unread_count || 0) + 1,
                                last_message_at: new Date().toISOString(),
                            };
                        }
                        return c;
                    });

                    return updated.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
                });
            }
        });

        return () => {
            channel.stopListening('.message.sent');
            userChannel.stopListening('.message.sent');
        };
    }, [conversation?.id, user?.id]);

    useEffect(() => {
        if (!conversation?.id) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(route('chat.messages', conversation.id), {
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setMessages(data.messages || []);
            } catch (error) {
                console.error('Chat polling failed:', error);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [conversation?.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        router.post(route('chat.store', conversation.id), {
            content: message,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage('');
            },
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />
            
            <div className="flex h-[calc(100vh-80px)]">
                <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-bold text-lg text-gray-900">Messages</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {convList?.map((conv) => (
                            <Link
                                key={conv.id}
                                href={route('chat.show', conv.id)}
                                className={`flex items-center gap-3 p-4 transition-colors ${
                                    conv.id === conversation.id ? 'bg-brand-50' : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {conv.other_user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                                            <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                {conv.unread_count} new
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white">
                    <div className="p-4 border-b border-gray-200 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={route('chat.index')} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                                {conversation?.other_user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{conversation?.other_user?.name}</h3>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadge(conversation?.other_user)}`}>
                                    {getRoleLabel(conversation?.other_user)}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Messages are sent securely through your real-time chat channel.
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_top,#f8fafc,transparent_35%),radial-gradient(circle_at_bottom,#eef2ff,transparent_40%)]">
                        {messages?.map((msg, idx) => {
                            const messageUserId = msg.user_id ?? msg.user?.id ?? msg.sender_id ?? msg.sender?.id;
                            const isOwn = String(messageUserId) === String(user?.id);
                            const showDateLabel = idx === 0 || !isSameDay(new Date(messages[idx - 1].created_at), new Date(msg.created_at));

                            return (
                                <React.Fragment key={msg.id || idx}>
                                    {showDateLabel && (
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center px-4 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold">
                                                {formatChatDate(msg.created_at)}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        {!isOwn && (
                                            <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-semibold items-center justify-center">
                                                {conversation?.other_user?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}

                                        <div className={`max-w-[72%] ${isOwn ? 'text-right' : 'text-left'}`}>
                                            <div className="inline-flex flex-col">
                                                <div className={`px-4 py-3 text-sm shadow-sm ${isOwn ? 'bg-brand-600 text-white rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-none ml-auto' : 'bg-white text-slate-900 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-none border border-slate-200 mr-auto'}`}>
                                                    {msg.content}
                                                </div>
                                                <div className={`mt-1 flex items-center gap-1 text-[11px] text-slate-400 ${isOwn ? 'justify-end' : 'justify-start'} flex ${isOwn ? 'ml-auto' : ''}`}>
                                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {isOwn && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-slate-300">
                                                            <path fill="currentColor" d="M1.5 13.25L5.75 17.5L11.5 11.75L9.75 10L5.75 14L3.25 11.5L1.5 13.25ZM12.5 13.25L16.75 17.5L22.5 11.75L20.75 10L16.75 14L14.25 11.5L12.5 13.25Z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="px-6 py-3 bg-linear-to-r from-brand-600 to-brand-800 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}