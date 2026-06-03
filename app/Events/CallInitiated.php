<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallInitiated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public Call $call;

    public function __construct(Call $call)
    {
        $this->call = $call->load(['caller', 'receiver']);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->call->receiver_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'call.initiated';
    }

    public function broadcastWith(): array
    {
        return [
            'call' => [
                'uuid' => $this->call->uuid,
                'caller_id' => $this->call->caller_id,
                'caller_name' => $this->call->caller->name,
                'caller_avatar' => $this->call->caller->avatar,
                'receiver_id' => $this->call->receiver_id,
                'status' => $this->call->status,
                'created_at' => $this->call->created_at,
            ],
        ];
    }
}
