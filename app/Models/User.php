<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
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
        'emergency_service',
        'linkedin',
        'github',
        'behance',
        'dribbble',
        'website',
        'facebook',
        'instagram',
        'wallet_balance',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
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
        ];
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
}
