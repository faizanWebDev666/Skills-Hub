<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'email',
        'password',
        'oauth_id',
        'oauth_provider',
        'avatar',
        'bio',
        'phone',
        'location',
        'professional_title',
        'country',
        'city',
        'address',
        'languages',
        'years_of_experience',
        'custom_years_of_experience',
        'cnic',
        'selfie_verification',
        'business_registration',
        'portfolio_images',
        'portfolio_videos',
        'previous_work_links',
        'resume_cv',
        'certifications',
        'hourly_rate',
        'delivery_time',
        'available_days',
        'service_type',
        'custom_service_type',
        'emergency_service',
        'linkedin',
        'github',
        'behance',
        'dribbble',
        'website',
        'facebook',
        'instagram',
        'wallet_balance',
        'vendor_level',
        'banned_at',
        'last_active_at',
        'locked_until',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'banned_at' => 'datetime',
            'locked_until' => 'datetime',
            'last_active_at' => 'datetime',
            'password' => 'hashed',
            'languages' => 'array',
            'portfolio_images' => 'array',
            'portfolio_videos' => 'array',
            'previous_work_links' => 'array',
            'certifications' => 'array',
            'available_days' => 'array',
            'emergency_service' => 'boolean',
            'hourly_rate' => 'decimal:2',
            'wallet_balance' => 'decimal:2',
            'vendor_level' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    public function gigs(): HasMany
    {
        return $this->hasMany(Gig::class);
    }

    public function customerOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function freelancerOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'freelancer_id');
    }

    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->where('active', true)->latestOfMany();
    }

    public function outgoingCalls(): HasMany
    {
        return $this->hasMany(Call::class, 'caller_id');
    }

    public function incomingCalls(): HasMany
    {
        return $this->hasMany(Call::class, 'receiver_id');
    }

    // Backward compatibility for wallet_balance
    public function getWalletBalanceAttribute(): float
    {
        return $this->wallet?->balance ?? $this->attributes['wallet_balance'] ?? 0;
    }
}
