<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    /**
     * Redirect to Google OAuth provider
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->scopes(['profile', 'email'])
            ->redirect();
    }

    /**
     * Handle callback from Google OAuth provider
     */
    public function handleGoogleCallback()
    {
        try {
            $user = Socialite::driver('google')->stateless()->user();

            return $this->loginOrCreateUser($user, 'google');
        } catch (Exception $e) {
            \Log::error('Google OAuth error: '.get_class($e).' - '.$e->getMessage(), ['exception' => $e]);

            return redirect('/login')->with('error', 'Unable to authenticate with Google. Please try again.');
        }
    }

    /**
     * Redirect to Facebook OAuth provider
     */
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')
            ->scopes(['public_profile'])
            ->fields(['id', 'name', 'picture.type(large)'])
            ->redirect();
    }

    /**
     * Handle callback from Facebook OAuth provider
     */
    public function handleFacebookCallback()
    {
        try {
            $user = Socialite::driver('facebook')->stateless()->user();

            return $this->loginOrCreateUser($user, 'facebook');
        } catch (Exception $e) {
            \Log::error('Facebook OAuth error: '.get_class($e).' - '.$e->getMessage(), ['exception' => $e]);

            return redirect('/login')->with('error', 'Unable to authenticate with Facebook. Please try again.');
        }
    }

    /**
     * Login or create user from OAuth provider
     */
    private function loginOrCreateUser($oauthUser, $provider)
    {
        // Check if user exists by oauth_id and provider first
        $user = User::where('oauth_id', $oauthUser->getId())
            ->where('oauth_provider', $provider)
            ->first();

        // If not found, check by email (if available)
        if (! $user && $oauthUser->getEmail()) {
            $user = User::where('email', $oauthUser->getEmail())->first();
        }

        if (! $user) {
            // Generate unique username/email if email is not available
            $name = $oauthUser->getName() ?? 'Facebook User';
            
            // Create a dummy email if Facebook doesn't provide one
            $email = $oauthUser->getEmail() ?? "facebook_{$oauthUser->getId()}@example.com";

            // Create new user
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'oauth_id' => $oauthUser->getId(),
                'oauth_provider' => $provider,
                'avatar' => $oauthUser->getAvatar(),
                'password' => bcrypt(Str::random(32)), // Generate random password
            ]);

            // Assign default customer role
            $user->assignRole('customer');

            \Log::info("New user created via {$provider}: ".$user->email);
        } else {
            // Update OAuth information if not present
            if (! $user->oauth_id || ! $user->oauth_provider) {
                $user->update([
                    'oauth_id' => $oauthUser->getId(),
                    'oauth_provider' => $provider,
                ]);
                \Log::info('OAuth info added for existing user: '.$user->email);
            }

            // Update avatar if available and not set
            if ($oauthUser->getAvatar() && ! $user->avatar) {
                $user->update(['avatar' => $oauthUser->getAvatar()]);
            }
        }

        // Log user in
        Auth::login($user);
        \Log::info("User logged in via {$provider}: ".$user->email);

        // Redirect based on role
        return redirect($this->redirectAfterLogin($user));
    }

    /**
     * Determine redirect path after login based on user role
     */
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
}
