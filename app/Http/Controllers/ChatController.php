<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\NotificationCreated;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $conversations = Conversation::forUser($user)
            ->with(['userOne.roles', 'userTwo.roles', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function (Conversation $conversation) use ($user) {
                $otherUser = $conversation->getOtherUser($user);
                $unreadCount = Message::where('conversation_id', $conversation->id)
                    ->where('user_id', '!=', $user->id)
                    ->where('read', false)
                    ->count();
                
                return [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'roles' => $otherUser->roles->map(fn ($role) => ['name' => $role->name]),
                    ],
                    'latest_message' => $conversation->latestMessage,
                    'unread_count' => $unreadCount,
                    'last_message_at' => $conversation->last_message_at,
                ];
            });

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Conversation $conversation)
    {
        $user = auth()->user();
        
        abort_if(
            $conversation->user_one_id !== $user->id && $conversation->user_two_id !== $user->id,
            403
        );

        $messages = $conversation->messages()
            ->with(['user.roles'])
            ->orderBy('created_at', 'asc')
            ->get();

        $otherUser = $conversation->getOtherUser($user);

        Message::where('conversation_id', $conversation->id)
            ->where('user_id', '!=', $user->id)
            ->where('read', false)
            ->update(['read' => true]);

        $conversations = Conversation::forUser($user)
            ->with(['userOne.roles', 'userTwo.roles', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function (Conversation $c) use ($user) {
                $otherUser = $c->getOtherUser($user);
                $unreadCount = Message::where('conversation_id', $c->id)
                    ->where('user_id', '!=', $user->id)
                    ->where('read', false)
                    ->count();
                
                return [
                    'id' => $c->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'roles' => $otherUser->roles->map(fn ($role) => ['name' => $role->name]),
                    ],
                    'latest_message' => $c->latestMessage,
                    'unread_count' => $unreadCount,
                    'last_message_at' => $c->last_message_at,
                ];
            });

        return Inertia::render('Chat/Show', [
            'conversation' => [
                'id' => $conversation->id,
                'other_user' => $otherUser,
                'messages' => $messages,
            ],
            'conversations' => $conversations,
            'user' => $user,
        ]);
    }

    public function messages(Conversation $conversation)
    {
        $user = auth()->user();

        abort_if(
            $conversation->user_one_id !== $user->id && $conversation->user_two_id !== $user->id,
            403
        );

        $messages = $conversation->messages()
            ->with(['user.roles'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    public function store(Request $request, Conversation $conversation)
    {
        $user = auth()->user();
        
        abort_if(
            $conversation->user_one_id !== $user->id && $conversation->user_two_id !== $user->id,
            403
        );

        $request->validate([
            'content' => 'required_without:attachment|string|max:2000|nullable',
            'attachment' => 'nullable|file|max:20480', // 20MB max
        ]);

        $messageData = [
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ];

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('chat-attachments', 'public');
            $messageData['attachment'] = $path;
            $messageData['attachment_name'] = $file->getClientOriginalName();
            
            if (str_starts_with($file->getMimeType(), 'image/')) {
                $messageData['attachment_type'] = 'image';
            } else {
                $messageData['attachment_type'] = 'file';
            }
        }

        $message = $conversation->messages()->create($messageData);

        $conversation->update(['last_message_at' => now()]);

        $recipientId = $conversation->user_one_id === $user->id 
            ? $conversation->user_two_id 
            : $conversation->user_one_id;

        broadcast(new MessageSent($message->load('user'), $conversation->id, $recipientId));

        // Create notification for recipient
        $notification = Notification::create([
            'user_id' => $recipientId,
            'type' => 'message',
            'related_id' => $message->id,
            'conversation_id' => $conversation->id,
            'title' => 'New Message from ' . $user->name,
            'message' => $message->content,
            'from_user_id' => $user->id,
        ]);

        // Broadcast the notification
        broadcast(new NotificationCreated($notification));

        return back();
    }

    public function createWithUser(User $user)
    {
        $authUser = auth()->user();
        
        if ($authUser->id === $user->id) {
            return redirect()->route('chat.index');
        }

        $conversation = Conversation::firstOrCreate(
            [
                'user_one_id' => min($authUser->id, $user->id),
                'user_two_id' => max($authUser->id, $user->id),
            ],
            [
                'last_message_at' => now(),
            ]
        );

        return redirect()->route('chat.show', $conversation);
    }

    /**
     * Get unread notifications count for the authenticated user
     */
    public function getUnreadNotifications()
    {
        $user = auth()->user();
        $unreadCount = Notification::where('user_id', $user->id)
            ->where('read', false)
            ->count();

        return response()->json([
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Get all notifications for the authenticated user
     */
    public function getNotifications()
    {
        $user = auth()->user();
        $notifications = Notification::where('user_id', $user->id)
            ->with(['fromUser:id,name,avatar'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'from_user' => $notification->fromUser ? [
                        'id' => $notification->fromUser->id,
                        'name' => $notification->fromUser->name,
                        'avatar' => $notification->fromUser->avatar,
                    ] : null,
                    'related_id' => $notification->related_id,
                    'conversation_id' => $notification->conversation_id,
                    'read' => $notification->read,
                    'created_at' => $notification->created_at,
                ];
            });

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(Notification $notification)
    {
        $user = auth()->user();
        
        abort_if($notification->user_id !== $user->id, 403);

        $notification->markAsRead();

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsAsRead()
    {
        $user = auth()->user();

        Notification::where('user_id', $user->id)
            ->where('read', false)
            ->update([
                'read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
        ]);
    }
}