<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Wishlist extends Model
{
    use SoftDeletes;
    protected $fillable = ['uuid', 'user_id', 'gig_id'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (Wishlist $wishlist) {
            if (empty($wishlist->uuid)) {
                $wishlist->uuid = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gig()
    {
        return $this->belongsTo(Gig::class);
    }
}
