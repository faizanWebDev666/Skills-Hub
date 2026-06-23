<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'plan',
        'price',
        'active',
        'expires_at',
    ];

    protected $casts = [
        'active' => 'boolean',
        'expires_at' => 'datetime',
        'price' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (Subscription $subscription) {
            if (empty($subscription->uuid)) {
                $subscription->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
