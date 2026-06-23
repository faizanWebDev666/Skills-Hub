<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastSeen
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Only update if last_active_at is empty or older than 1 minute to save database queries
            if (! $user->last_active_at || $user->last_active_at->diffInMinutes(now()) >= 1) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['last_active_at' => now()]);
            }
        }

        return $next($request);
    }
}
