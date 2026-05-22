<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CommissionSetting extends Model
{
    protected $fillable = ['uuid', 'category', 'percentage'];

    protected static function booted(): void
    {
        static::creating(function (CommissionSetting $setting) {
            if (empty($setting->uuid)) {
                $setting->uuid = (string) Str::uuid();
            }
        });
    }
}
