<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallRejected implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public Call $call;
    public string $reason;

    public function __construct(Call $call, string $reason = 'User rejected the call')
    {
        $this->call = $call;
        $this->reason = $reason;
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
        return 'call.rejected';
    }

    public function broadcastWith(): array
    {
        return [
            'call_uuid' => $this->call->uuid,
            'reason' => $this->reason,
        ];
    }
}
