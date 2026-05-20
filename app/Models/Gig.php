<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gig extends Model
{
    use HasUuids;

    protected $fillable = [
        'uuid',
        'user_id',
        'title',
        'description',
        'price',
        'category',
        'tags',
        'image',
        'active',
        'category_fields',
    ];

    protected $casts = [
        'tags' => 'array',
        'price' => 'decimal:2',
        'active' => 'boolean',
        'category_fields' => 'array',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
}