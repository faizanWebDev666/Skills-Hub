<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Call extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'caller_id',
        'receiver_id',
        'conversation_id',
        'twilio_call_sid',
        'status',
        'started_at',
        'ended_at',
        'duration',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'duration' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Call $call) {
            if (empty($call->uuid)) {
                $call->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the duration in human readable format (MM:SS)
     */
    public function getFormattedDurationAttribute(): string
    {
        if (!$this->duration) {
            return '00:00';
        }

        $minutes = intdiv($this->duration, 60);
        $seconds = $this->duration % 60;

        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    /**
     * Check if call is active
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['calling', 'ringing', 'accepted']);
    }

    /**
     * Mark call as accepted
     */
    public function accept(): void
    {
        $this->update([
            'status' => 'accepted',
            'started_at' => now(),
        ]);
    }

    /**
     * Mark call as rejected
     */
    public function reject(): void
    {
        $this->update([
            'status' => 'rejected',
            'ended_at' => now(),
        ]);
    }

    /**
     * Mark call as missed
     */
    public function markMissed(): void
    {
        $this->update([
            'status' => 'missed',
            'ended_at' => now(),
        ]);
    }

    /**
     * End the call and calculate duration
     */
    public function end(): void
    {
        if ($this->started_at) {
            $duration = $this->started_at->diffInSeconds(now());
            $this->update([
                'status' => 'ended',
                'ended_at' => now(),
                'duration' => $duration,
            ]);
        } else {
            $this->update([
                'status' => 'ended',
                'ended_at' => now(),
            ]);
        }
    }
}
