<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Gig extends Model
{
    use SoftDeletes;
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

    protected static function booted(): void
    {
        static::creating(function (Gig $gig) {
            if (empty($gig->uuid)) {
                $gig->uuid = (string) Str::uuid();
            }
        });
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
