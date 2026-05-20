<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasUuids;
    use HasUuids;

    protected $fillable = ['uuid', 'user_id', 'gig_id'];
    public function getRouteKeyName(): string
    {
        return 'uuid';
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
