<?php

namespace App\Models;

use App\Mail\TransactionNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class WalletTransaction extends Model
{
    protected $fillable = [
        'uuid',
        'wallet_id',
        'type',
        'amount',
        'balance_before',
        'balance_after',
        'reference_type',
        'reference_id',
        'description',
        'status',
        'metadata',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (WalletTransaction $transaction) {
            if (empty($transaction->uuid)) {
                $transaction->uuid = (string) Str::uuid();
            }
        });
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    // Polymorphic relationship for reference
    public function reference()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForWallet($query, int $walletId)
    {
        return $query->where('wallet_id', $walletId);
    }

    // Helper methods
    public function isCredit(): bool
    {
        return $this->amount > 0;
    }

    public function isDebit(): bool
    {
        return $this->amount < 0;
    }

    public function getFormattedAmountAttribute(): string
    {
        $amount = floatval($this->amount);
        $symbol = $amount > 0 ? '+' : '';

        return $symbol.'$'.number_format(abs($amount), 2);
    }

    /**
     * Boot model events
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($transaction) {
            // Send email notification when transaction is completed
            if ($transaction->status === 'completed') {
                $user = $transaction->wallet->user;
                if ($user && $user->email) {
                    Mail::to($user->email)->queue(new TransactionNotification($transaction));
                }
            }
        });

        static::updated(function ($transaction) {
            if ($transaction->isDirty('status') && in_array($transaction->status, ['completed', 'approved', 'cancelled'])) {
                $user = $transaction->wallet->user;
                if ($user && $user->email) {
                    Mail::to($user->email)->queue(new TransactionNotification($transaction));
                }
            }
        });
    }
}
