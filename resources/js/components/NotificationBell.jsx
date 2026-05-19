import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [wsConnectionTimeout, setWsConnectionTimeout] = useState(null);
    const [usePolling, setUsePolling] = useState(false);

    // Load initial notifications and subscribe to real-time updates
    useEffect(() => {
        fetchUnreadCount();
        fetchNotifications();

        // Start polling immediately as a fallback
        startPolling();

        // Set WebSocket timeout - if no WebSocket connection, fall back to polling
        const wsTimeout = setTimeout(() => {
            if (!window.Echo?.connector?.socket?.connected) {
                console.log('WebSocket not connected, using polling for notifications');
                setUsePolling(true);
            }
        }, 5000);
        setWsConnectionTimeout(wsTimeout);

        // Subscribe to real-time notifications via WebSocket
        if (window.Echo && window.userId) {
            window.Echo.private(`user.${window.userId}.notifications`)
                .listen('NotificationCreated', (data) => {
                    // Extract notification from event data
                    const notification = data.notification;
                    // Add new notification to the top
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                });
        }

        return () => {
            // Cleanup
            if (wsConnectionTimeout) clearTimeout(wsConnectionTimeout);
            if (pollingInterval) clearInterval(pollingInterval);
            if (window.Echo && window.userId) {
                window.Echo.leave(`user.${window.userId}.notifications`);
            }
        };
    }, []);

    // Polling effect - runs every 2 seconds
    const startPolling = () => {
        const interval = setInterval(() => {
            fetchUnreadCount();
            // Only fetch full notifications if panel is open to reduce server load
            if (isOpen) {
                fetchNotifications();
            }
        }, 2000);
        setPollingInterval(interval);
    };

    // Fetch notifications when panel opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch('/notifications/unread-count');
            const data = await response.json();
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/notifications');
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }

        if (notification.type === 'message' && notification.conversation_id) {
            router.visit(`/chat/${notification.conversation_id}`);
        }

        setIsOpen(false);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-600 hover:text-brand-600 hover:bg-cream-100 p-2 sm:p-2.5 rounded-lg transition-colors"
                title="Notifications"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Notification Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden flex flex-col max-h-96">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <svg className="animate-spin h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-sm font-medium">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`w-full px-4 py-3 text-left transition-all hover:bg-cream-50 ${
                                                !notification.read ? 'bg-brand-50 border-l-4 border-brand-600' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Avatar */}
                                                {notification.from_user?.avatar ? (
                                                    <img
                                                        src={`/storage/${notification.from_user.avatar}`}
                                                        alt={notification.from_user.name}
                                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-xs flex-shrink-0 mt-1">
                                                        {notification.from_user?.name?.charAt(0) || '?'}
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {formatTime(notification.created_at)}
                                                    </p>
                                                </div>

                                                {/* Read indicator */}
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0 mt-2" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-2.5">
                            <Link
                                href="/chat"
                                className="block w-full text-center text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors py-1"
                            >
                                View all messages →
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
