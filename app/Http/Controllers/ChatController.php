<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
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
            'content' => 'required|string|max:2000',
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ]);

        $conversation->update(['last_message_at' => now()]);

        $recipientId = $conversation->user_one_id === $user->id 
            ? $conversation->user_two_id 
            : $conversation->user_one_id;

        broadcast(new MessageSent($message->load('user'), $conversation->id, $recipientId));

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
}