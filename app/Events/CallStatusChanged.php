<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public Call $call;
    public string $previousStatus;

    public function __construct(Call $call, string $previousStatus)
    {
        $this->call = $call->load(['caller', 'receiver']);
        $this->previousStatus = $previousStatus;
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
        return 'call.status-changed';
    }

    public function broadcastWith(): array
    {
        return [
            'call_uuid' => $this->call->uuid,
            'status' => $this->call->status,
            'previous_status' => $this->previousStatus,
            'started_at' => $this->call->started_at,
            'duration' => $this->call->duration,
        ];
    }
}
