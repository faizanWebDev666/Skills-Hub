<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'currency',
        'is_active',
        'metadata'
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)->orderBy('created_at', 'desc');
    }

    // Helper methods for balance operations
    public function credit(float $amount, string $type, string $description, ?array $metadata = null, $referenceType = null, $referenceId = null): WalletTransaction
    {
        return $this->createTransaction($amount, $type, $description, $metadata, $referenceType, $referenceId);
    }

    public function debit(float $amount, string $type, string $description, ?array $metadata = null, $referenceType = null, $referenceId = null): WalletTransaction
    {
        return $this->createTransaction(-$amount, $type, $description, $metadata, $referenceType, $referenceId);
    }

    protected function createTransaction(float $amount, string $type, string $description, ?array $metadata = null, $referenceType = null, $referenceId = null): WalletTransaction
    {
        $balanceBefore = $this->balance;
        $this->balance += $amount;
        $this->save();

        return $this->transactions()->create([
            'type' => $type,
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $this->balance,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'description' => $description,
            'metadata' => $metadata,
            'processed_at' => now(),
        ]);
    }

    public function getAvailableBalanceAttribute(): float
    {
        // Could implement holds/pending transactions logic here
        return $this->balance;
    }

    public function canDebit(float $amount): bool
    {
        return $this->available_balance >= $amount;
    }
}
