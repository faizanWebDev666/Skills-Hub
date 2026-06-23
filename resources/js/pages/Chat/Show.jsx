import React, { useState, useEffect, useRef } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import VendorNavbar from "../../components/VendorNavbar";
import ChatSidebar from "../../components/ChatSidebar";
import { echo } from "../../echo";

const EMOJIS = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "👍",
    "👎",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💅",
    "🤳",
    "💪",
    "🦾",
    "🦵",
    "🦿",
    "🦶",
    "👣",
    "👂",
    "🦻",
    "👃",
    "🫀",
    "🫁",
    "🧠",
    "🦷",
    "🦴",
    "👀",
    "👁️",
    "👅",
    "👄",
    "💋",
    "🩸",
];

export default function ChatShow({ conversation, conversations }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const [message, setMessage] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const isVendor = user?.roles?.some(
        (role) => role.name === "freelancer" || role.name === "vendor",
    );
    const NavbarComponent = isVendor ? VendorNavbar : Navbar;

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [messages, setMessages] = useState(() => {
        const initial = conversation?.messages || [];
        return [...initial].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
    });
    const [convList, setConvList] = useState(conversations || []);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [usePolling, setUsePolling] = useState(false);
    const wsConnectionTimeoutRef = useRef(null);

    // Function to fetch messages from server
    const fetchMessages = async () => {
        try {
            const response = await fetch(
                route("chat.messages", conversation.id)
            );
            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => {
                    // Merge new messages, avoiding duplicates
                    const msgMap = new Map();
                    [...prev, ...data.messages].forEach((msg) => {
                        if (!msgMap.has(msg.id)) {
                            msgMap.set(msg.id, msg);
                        }
                    });
                    const merged = Array.from(msgMap.values());
                    return merged.sort(
                        (a, b) =>
                            new Date(a.created_at) - new Date(b.created_at),
                    );
                });
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Start polling for messages
    const startPolling = () => {
        if (pollingInterval) return; // Already polling

        const interval = setInterval(() => {
            fetchMessages();
        }, 2000); // Poll every 2 seconds

        setPollingInterval(interval);
    };

    // Stop polling
    const stopPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    };

    // Sync messages when Inertia props update (e.g. after sending a message)
    useEffect(() => {
        if (conversation?.messages) {
            setMessages((prev) => {
                // Merge new messages from props, avoiding duplicates
                const newMessages = [...conversation.messages];

                // Sort by creation time
                return newMessages.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
            });
        }
    }, [conversation?.messages]);

    // Sync conversations list when Inertia props update
    useEffect(() => {
        if (conversations) {
            setConvList(conversations);
        }
    }, [conversations]);

    const getRoleLabel = (otherUser) => {
        const role = otherUser?.roles?.[0]?.name;
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Customer";
    };

    const getRoleBadge = (otherUser) => {
        const role = otherUser?.roles?.[0]?.name;
        if (role === "admin")
            return "bg-danger-50 text-danger-600 border border-danger-100";
        if (role === "vendor" || role === "freelancer")
            return "bg-brand-50 text-brand-600 border border-brand-100";
        return "bg-gray-50 text-gray-600 border border-gray-200";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatChatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        if (isSameDay(date, today)) return "Today";
        if (isSameDay(date, yesterday)) return "Yesterday";

        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const getLastActiveString = (lastActiveDate) => {
        if (!lastActiveDate) return "Offline";

        const now = new Date();
        const past = new Date(lastActiveDate);
        const diffInMs = now - past;
        const diffInMins = Math.floor(diffInMs / 60000);

        if (diffInMins < 1) return "Active just now";
        if (diffInMins < 60)
            return `Last active ${diffInMins} minute${diffInMins !== 1 ? "s" : ""} ago`;

        const diffInHours = Math.floor(diffInMins / 60);
        if (diffInHours < 24)
            return `Last active ${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "Last active yesterday";
        if (diffInDays < 7)
            return `Last active ${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

        return `Last active on ${past.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const channel = echo
            .join("online")
            .here((users) => {
                setOnlineUsers(new Set(users.map((u) => u.id)));
            })
            .joining((u) => {
                setOnlineUsers((prev) => {
                    const next = new Set(prev);
                    next.add(u.id);
                    return next;
                });
            })
            .leaving((u) => {
                setOnlineUsers((prev) => {
                    const next = new Set(prev);
                    next.delete(u.id);
                    return next;
                });
            });

        return () => {
            echo.leave("online");
        };
    }, []);

    useEffect(() => {
        if (!conversation?.id || !user?.id) return;

        const channel = echo.private(`chat.${conversation.id}`);

        channel.listen(".message.sent", (e) => {
            setMessages((prev) => {
                if (prev.some((msg) => msg.id === e.message.id)) {
                    return prev;
                }
                return [...prev, e.message];
            });

            setConvList((prev) => {
                const updated = prev.map((c) => {
                    if (c.id === e.conversationId) {
                        return {
                            ...c,
                            latest_message: e.message,
                            unread_count:
                                c.id === conversation.id
                                    ? 0
                                    : (c.unread_count || 0) + 1,
                            last_message_at: new Date().toISOString(),
                        };
                    }
                    return c;
                });

                return updated.sort(
                    (a, b) =>
                        new Date(b.last_message_at) -
                        new Date(a.last_message_at),
                );
            });
        });

        const userChannel = echo.private(`user.${user.id}`);
        userChannel.listen(".message.sent", (e) => {
            if (e.conversationId !== conversation.id) {
                setConvList((prev) => {
                    const updated = prev.map((c) => {
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

                    return updated.sort(
                        (a, b) =>
                            new Date(b.last_message_at) -
                            new Date(a.last_message_at),
                    );
                });
            }
        });

        return () => {
            channel.stopListening(".message.sent");
            userChannel.stopListening(".message.sent");
        };
    }, [conversation?.id, user?.id]);

    // Always enable polling as fallback for WebSocket issues
    useEffect(() => {
        if (conversation?.id && !pollingInterval && !usePolling) {
            // Start polling after 3 seconds to give WebSocket time to connect
            const timeout = setTimeout(() => {
                setUsePolling(true);
                startPolling();
            }, 3000);

            return () => clearTimeout(timeout);
        }

        return () => {
            stopPolling();
        };
    }, [conversation?.id]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
            setShowEmojiPicker(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() && !attachment) return;

        setIsSubmitting(true);

        const formData = new FormData();
        if (message.trim()) formData.append("content", message);
        if (attachment) formData.append("attachment", attachment);

        router.post(route("chat.store", conversation.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setMessage("");
                setAttachment(null);
                setShowEmojiPicker(false);
                setIsSubmitting(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
                if (cameraInputRef.current) cameraInputRef.current.value = "";
                // Fetch latest messages immediately after successful submission
                setTimeout(() => {
                    fetchMessages();
                }, 500);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <NavbarComponent user={user} />

            <div className="flex-1 flex overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto flex h-[calc(100vh-76px)] shadow-sm bg-slate-50 overflow-hidden lg:rounded-3xl lg:border lg:border-slate-200 lg:h-[calc(100vh-76px)]">
                    {/* Sidebar */}
                    <ChatSidebar
                        conversations={convList}
                        activeConversationId={conversation?.id}
                        onlineUsers={onlineUsers}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isHiddenOnMobile={true}
                    />

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-slate-50 relative">
                        {/* Header */}
                        <div className="p-4 lg:px-8 lg:py-5 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur z-20 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("chat.index")}
                                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
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
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </Link>

                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-brand-100 to-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-xl ring-1 ring-black/5 shadow-inner overflow-hidden">
                                        {conversation?.other_user?.avatar ? (
                                            <img
                                                src={`/storage/${conversation.other_user.avatar}`}
                                                alt={
                                                    conversation.other_user.name
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            conversation?.other_user?.name?.charAt(
                                                0,
                                            ) || "U"
                                        )}
                                    </div>
                                    {onlineUsers.has(
                                        conversation?.other_user?.id,
                                    ) && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                                        )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-bold text-gray-900 text-base lg:text-lg tracking-tight">
                                            {conversation?.other_user?.name}
                                        </h3>
                                        <span
                                            className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(conversation?.other_user)}`}
                                        >
                                            {getRoleLabel(
                                                conversation?.other_user,
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center gap-1.5 text-xs font-medium ${onlineUsers.has(conversation?.other_user?.id) ? "text-green-600" : "text-gray-400"}`}
                                    >
                                        {onlineUsers.has(
                                            conversation?.other_user?.id,
                                        ) ? (
                                            <>
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                Online
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                {getLastActiveString(
                                                    conversation?.other_user
                                                        ?.last_active_at,
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                                    title="Video Call"
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
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors hidden sm:block"
                                    title="Call"
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
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                                    title="More Options"
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
                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#FAF9F6] relative custom-scrollbar">
                            {/* Decorative background pattern */}
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(#4F46E5 1px, transparent 1px)",
                                    backgroundSize: "24px 24px",
                                }}
                            ></div>

                            <div className="relative z-10 space-y-6">
                                {messages?.map((msg, idx) => {
                                    const messageUserId =
                                        msg.user_id ??
                                        msg.user?.id ??
                                        msg.sender_id ??
                                        msg.sender?.id;
                                    const isOwn =
                                        String(messageUserId) ===
                                        String(user?.id);
                                    const showDateLabel =
                                        idx === 0 ||
                                        !isSameDay(
                                            new Date(
                                                messages[idx - 1].created_at,
                                            ),
                                            new Date(msg.created_at),
                                        );
                                    const showAvatar =
                                        !isOwn &&
                                        (idx === 0 ||
                                            String(
                                                messages[idx - 1]?.user_id ??
                                                messages[idx - 1]?.user
                                                    ?.id ??
                                                messages[idx - 1]
                                                    ?.sender_id ??
                                                messages[idx - 1]?.sender
                                                    ?.id,
                                            ) !== String(messageUserId) ||
                                            showDateLabel);

                                    return (
                                        <React.Fragment key={msg.id || idx}>
                                            {showDateLabel && (
                                                <div className="flex justify-center my-8">
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                                        {formatChatDate(
                                                            msg.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                                            >
                                                {!isOwn && (
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold overflow-hidden">
                                                        {showAvatar ? (
                                                            conversation
                                                                ?.other_user
                                                                ?.avatar ? (
                                                                <img
                                                                    src={`/storage/${conversation.other_user.avatar}`}
                                                                    alt="avatar"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                conversation?.other_user?.name?.charAt(
                                                                    0,
                                                                ) || "U"
                                                            )
                                                        ) : null}
                                                    </div>
                                                )}

                                                <div
                                                    className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                                                >
                                                    <div
                                                        className={`
                                                        px-5 py-3.5 text-[15px] leading-relaxed shadow-sm
                                                        ${isOwn
                                                                ? "bg-brand-600 text-white rounded-2xl rounded-br-sm"
                                                                : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                                                            }
                                                    `}
                                                    >
                                                        {msg.attachment && (
                                                            <div
                                                                className={`mb-2 ${msg.content ? "pb-3 border-b border-white/20" : ""}`}
                                                            >
                                                                {msg.attachment_type ===
                                                                    "image" ? (
                                                                    <a
                                                                        href={`/storage/${msg.attachment}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <img
                                                                            src={`/storage/${msg.attachment}`}
                                                                            alt="attachment"
                                                                            className="max-w-full rounded-xl object-cover"
                                                                            style={{
                                                                                maxHeight:
                                                                                    "300px",
                                                                            }}
                                                                        />
                                                                    </a>
                                                                ) : (
                                                                    <a
                                                                        href={`/storage/${msg.attachment}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isOwn ? "bg-black/10 hover:bg-black/20 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-800"}`}
                                                                    >
                                                                        <div
                                                                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isOwn ? "bg-white/20" : "bg-white shadow-sm"}`}
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
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="truncate max-w-[180px] font-medium text-sm">
                                                                            {msg.attachment_name ||
                                                                                "Download File"}
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg.content}
                                                    </div>
                                                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-gray-400 px-1">
                                                        <span>
                                                            {new Date(
                                                                msg.created_at,
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                },
                                                            )}
                                                        </span>
                                                        {isOwn && (
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                className="w-4 h-4 text-brand-500 ml-0.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                <div ref={messagesEndRef} className="h-2" />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 lg:p-6 bg-white border-t border-gray-100 z-20">
                            <form
                                onSubmit={handleSubmit}
                                className="flex items-end gap-3 max-w-5xl mx-auto relative"
                            >
                                {/* Emoji Picker Popover */}
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full left-0 mb-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl shadow-brand-500/5 w-[320px] max-w-[calc(100vw-32px)] h-72 overflow-y-auto z-50 custom-scrollbar">
                                        <div className="grid grid-cols-6 gap-2">
                                            {EMOJIS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    className="text-2xl hover:bg-gray-50 p-2 rounded-xl transition-colors hover:scale-110 active:scale-95 duration-200"
                                                    onClick={() => {
                                                        setMessage(
                                                            (prev) =>
                                                                prev + emoji,
                                                        );
                                                    }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Attachment Preview */}
                                {attachment && (
                                    <div className="absolute bottom-full left-0 mb-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-lg shadow-brand-500/5 flex items-center gap-4 z-40 max-w-sm w-full">
                                        {attachment.type.startsWith(
                                            "image/",
                                        ) ? (
                                            <img
                                                src={URL.createObjectURL(
                                                    attachment,
                                                )}
                                                alt="preview"
                                                className="w-14 h-14 rounded-xl object-cover ring-1 ring-gray-100"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 ring-1 ring-brand-100">
                                                <svg
                                                    className="w-7 h-7"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                {attachment.name}
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                {(
                                                    attachment.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAttachment(null)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
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
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    ref={cameraInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl flex items-center shadow-sm focus-within:bg-white focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEmojiPicker(!showEmojiPicker)
                                        }
                                        className={`p-3.5 transition-colors shrink-0 ml-1 rounded-full ${showEmojiPicker ? "text-brand-600 bg-brand-50" : "text-gray-400 hover:text-brand-600 hover:bg-gray-100"}`}
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
                                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="p-3.5 -ml-2 text-gray-400 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
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
                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent py-3.5 px-2 outline-none text-[15px] text-gray-800 placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            cameraInputRef.current?.click()
                                        }
                                        className="p-3.5 text-gray-400 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors shrink-0 mr-1"
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
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={
                                        (!message.trim() && !attachment) ||
                                        isSubmitting
                                    }
                                    className="w-[52px] h-[52px] shrink-0 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none shadow-md shadow-brand-500/20"
                                >
                                    {isSubmitting ? (
                                        <svg
                                            className="w-6 h-6 animate-spin"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-6 h-6 -mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
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
            `,
                }}
            />
        </div>
    );
}
