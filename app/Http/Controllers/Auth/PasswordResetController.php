<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    // Show request form
    public function showRequest()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    // Handle request and send email
    public function sendReset(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = $request->email;

        // Rate limit: max 2 tokens per 24 hours for same email
        $countLast24 = DB::table('password_resets')
            ->where('email', $email)
            ->where('created_at', '>=', Carbon::now()->subDay())
            ->count();

        if ($countLast24 >= 2) {
            return back()->withErrors(['email' => 'You have reached the password reset limit. Please try again later.']);
        }

        $token = Str::random(64);

        try {
            Mail::to($email)->send(new PasswordResetMail($token, $email));
        } catch (\Exception $e) {
            \Log::error('Password reset mail error: '.$e->getMessage());

            return back()->withErrors(['email' => 'Could not send reset email.']);
        }

        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now(),
        ]);

        return redirect()->route('login')->with('status', 'Password reset email sent. Check your inbox.');
    }

    // Show reset form if token valid
    public function showReset(Request $request, $token)
    {
        $email = $request->query('email');
        if (! $email) {
            return redirect()->route('login')->withErrors(['email' => 'Invalid reset link.']);
        }

        $record = DB::table('password_resets')
            ->where('email', $email)
            ->orderByDesc('created_at')
            ->first();

        if (! $record) {
            return redirect()->route('login')->withErrors(['email' => 'Invalid or expired token.']);
        }

        // Check token expiry (10 minutes)
        $created = Carbon::parse($record->created_at);
        if ($created->diffInMinutes(Carbon::now()) > 10) {
            return redirect()->route('login')->withErrors(['email' => 'Token has expired.']);
        }

        // Verify token
        if (! Hash::check($token, $record->token)) {
            return redirect()->route('login')->withErrors(['email' => 'Invalid token.']);
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    // Handle actual reset
    public function reset(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required'],
            'password' => ['required', 'confirmed', 'min:8', 'regex:/[A-Z]/', 'regex:/[!@#$%^&*(),.?":{}|<>]/'],
        ]);

        $email = $request->email;
        $token = $request->token;

        $record = DB::table('password_resets')
            ->where('email', $email)
            ->orderByDesc('created_at')
            ->first();

        if (! $record) {
            return back()->withErrors(['email' => 'Invalid or expired token.']);
        }

        $created = Carbon::parse($record->created_at);
        if ($created->diffInMinutes(Carbon::now()) > 10) {
            return back()->withErrors(['email' => 'Token has expired.']);
        }

        if (! Hash::check($token, $record->token)) {
            return back()->withErrors(['email' => 'Invalid token.']);
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            return back()->withErrors(['email' => 'No user found with that email.']);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Optionally delete used tokens for this email
        DB::table('password_resets')->where('email', $email)->delete();

        return redirect()->route('login')->with('status', 'Password has been reset. You can now log in.');
    }
}
