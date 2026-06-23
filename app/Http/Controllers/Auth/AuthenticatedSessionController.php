<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\User;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Throttle key combines email and IP to avoid easy account-wide lockouts
        $throttleKey = Str::lower($request->input('email')) . '|' . $request->ip();
        $maxAttempts = 3;
        $decaySeconds = 60 * 60 * 3; // 3 hours

        // If user exists and is locked via DB, deny login immediately
        $user = User::where('email', $request->input('email'))->first();
        if ($user && $user->locked_until && $user->locked_until->isFuture()) {
            $seconds = now()->diffInSeconds($user->locked_until);
            $hoursLeft = (int) ceil($seconds / 3600);

            return back()->withErrors([
                'email' => "Account is locked due to multiple failed attempts. Try again after {$hoursLeft} hour(s).",
            ])->with([
                'lockedUntil' => $user->locked_until,
                'lockedEmail' => $request->input('email'),
            ]);
        }

        if (RateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
            // Mark DB lock for the user if exists
            if ($user) {
                $user->update(['locked_until' => now()->addSeconds($decaySeconds)]);
            }

            $seconds = RateLimiter::availableIn($throttleKey);
            $hoursLeft = (int) ceil($seconds / 3600);

            return back()->withErrors([
                'email' => "Too many failed attempts. Try again after {$hoursLeft} hour(s).",
            ])->with([
                'lockedUntil' => now()->addSeconds($decaySeconds),
                'lockedEmail' => $request->input('email'),
            ]);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            // Successful login: clear attempts and regenerate session
            RateLimiter::clear($throttleKey);
            // Clear DB lock if present
            if ($user && $user->locked_until) {
                $user->update(['locked_until' => null]);
            }
            $request->session()->regenerate();

            return redirect()->intended($this->redirectAfterLogin(Auth::user()));
        }

        // Failed login: record attempt
        $attempts = RateLimiter::hit($throttleKey, $decaySeconds);

        // If attempts reached threshold, also set DB lock for existing user
        if ($attempts >= $maxAttempts && $user) {
            $user->update(['locked_until' => now()->addSeconds($decaySeconds)]);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput($request->only('email'));
    }

    protected function redirectAfterLogin($user)
    {
        if ($user->hasRole('admin')) {
            return route('admin.dashboard');
        }

        if ($user->hasAnyRole(['vendor', 'freelancer'])) {
            return route('vendor.dashboard');
        }

        return route('home');
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
