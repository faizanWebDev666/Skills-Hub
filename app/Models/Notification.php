<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'type',
        'related_id',
        'conversation_id',
        'title',
        'message',
        'from_user_id',
        'read',
        'read_at',
    ];

    protected $casts = [
        'read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Notification $notification) {
            if (empty($notification->uuid)) {
                $notification->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the user this notification belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who triggered the notification
     */
    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): void
    {
        if (! $this->read) {
            $this->update([
                'read' => true,
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(): void
    {
        $this->update([
            'read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Get the conversation related to this notification
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
