<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallEnded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public Call $call;

    public function __construct(Call $call)
    {
        $this->call = $call;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('call.' . $this->call->uuid),
            new PrivateChannel('user.' . $this->call->caller_id),
            new PrivateChannel('user.' . $this->call->receiver_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'call.ended';
    }

    public function broadcastWith(): array
    {
        return [
            'call_uuid' => $this->call->uuid,
            'status' => $this->call->status,
            'duration' => $this->call->duration,
            'formatted_duration' => $this->call->formatted_duration,
            'ended_at' => $this->call->ended_at,
        ];
    }
}
