<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallAccepted implements ShouldBroadcast
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
            new PrivateChannel('call.' . $this->call->uuid),
            new PrivateChannel('user.' . $this->call->caller_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'call.accepted';
    }

    public function broadcastWith(): array
    {
        return [
            'call_uuid' => $this->call->uuid,
            'receiver_id' => $this->call->receiver_id,
            'receiver_name' => $this->call->receiver->name,
            'started_at' => $this->call->started_at,
        ];
    }
}
