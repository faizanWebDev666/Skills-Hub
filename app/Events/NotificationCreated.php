<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Notification $notification
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->notification->user_id}.notifications"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->notification->id,
            'type' => $this->notification->type,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'from_user' => $this->notification->fromUser ? [
                'id' => $this->notification->fromUser->id,
                'name' => $this->notification->fromUser->name,
                'avatar' => $this->notification->fromUser->avatar,
            ] : null,
            'read' => $this->notification->read,
            'conversation_id' => $this->notification->conversation ? $this->notification->conversation->uuid : null,
            'created_at' => $this->notification->created_at->toIso8601String(),
        ];
    }
}
