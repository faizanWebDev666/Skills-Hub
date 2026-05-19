<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\VerificationCodeMail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', 'min:8'],
            'role' => ['required', 'in:customer,freelancer'],
        ]);

        // Generate 8-digit code
        $code = str_pad(mt_rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);

        // Save data to session
        $request->session()->put('registration_data', [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'verification_code' => $code,
        ]);

        // Send Email
        try {
            Mail::to($request->email)->send(new VerificationCodeMail($code));
        } catch (\Exception $e) {
            \Log::error('Registration Mail Error: ' . $e->getMessage());
            // Clear session data since registration is cancelled
            $request->session()->forget('registration_data');
            return back()->withErrors(['email' => 'Could not send verification email. Please verify your SMTP credentials.']);
        }

        return redirect()->route('register.verify');
    }

    public function verify()
    {
        if (!session()->has('registration_data')) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyEmailCode', [
            'email' => session('registration_data')['email']
        ]);
    }

    public function verifySubmit(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:8'],
        ]);

        if (!session()->has('registration_data')) {
            return redirect()->route('register')->withErrors(['error' => 'Registration session expired.']);
        }

        $registrationData = session('registration_data');

        if ($request->code !== $registrationData['verification_code']) {
            return back()->withErrors(['code' => 'The provided code is incorrect.']);
        }

        // Create User
        $user = User::create([
            'name' => $registrationData['name'],
            'email' => $registrationData['email'],
            'password' => $registrationData['password'],
        ]);

        $user->assignRole($registrationData['role']);

        // Mark email as verified if you are using MustVerifyEmail
        $user->email_verified_at = now();
        $user->save();

        event(new Registered($user));

        Auth::login($user);

        // Clear session
        session()->forget('registration_data');

        return redirect('/home');
    }
}
