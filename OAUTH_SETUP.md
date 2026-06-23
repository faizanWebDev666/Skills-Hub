# Google & Facebook OAuth Setup Guide

## Overview
This guide explains how to set up Google and Facebook OAuth authentication for your SkillHub marketplace. The UI components are already added to the login and register pages.

## Prerequisites
1. Laravel Socialite package needs to be installed
2. Google OAuth 2.0 credentials from Google Cloud Console
3. Facebook App credentials from Facebook Developer Console

## Step 1: Install Laravel Socialite

Run the following command in your project directory:

```bash
composer require laravel/socialite
```

## Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Click "Enable APIs and Services"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" in the left menu
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized redirect URI: `https://yourdomain.com/auth/google/callback`
   - Click "Create"
5. Copy the Client ID and Client Secret

## Step 3: Get Facebook App Credentials

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app:
   - Click "My Apps" → "Create App"
   - Choose "Consumer" as app type
   - Fill in app details
3. Add Facebook Login product:
   - Click "Add Product"
   - Find "Facebook Login" and click "Set Up"
4. Configure OAuth redirect URIs:
   - Go to Settings → Basic
   - Copy App ID and App Secret
   - Go to Facebook Login → Settings
   - Add Valid OAuth Redirect URIs: `https://yourdomain.com/auth/facebook/callback`
5. Copy the App ID and App Secret

## Step 4: Update Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://yourdomain.com/auth/facebook/callback
```

Replace `yourdomain.com` with your actual domain.

## Step 5: Update Socialite Configuration

Create or update `config/socialite.php` if it doesn't exist:

```php
<?php

return [
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],
    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect' => env('FACEBOOK_REDIRECT_URI'),
    ],
];
```

## Step 6: Run Database Migrations

Run the migration to add OAuth fields to the users table:

```bash
php artisan migrate
```

This will add `oauth_id` and `oauth_provider` columns to the users table.

## Step 7: Test the OAuth Flow

1. Start your development server:
   ```bash
   php artisan serve
   ```

2. Go to the login or register page
3. Click the Google or Facebook button
4. Complete the OAuth flow
5. You should be redirected to your marketplace

## How It Works

1. **Frontend**: Users see Google and Facebook buttons on login/register pages (SocialLogin.jsx component)
2. **Redirect to Provider**: Clicking a button redirects to `/auth/google` or `/auth/facebook`
3. **OAuth Controller**: The OAuthController handles the redirect and callback
4. **User Creation/Login**: If user doesn't exist, they're created with default "customer" role
5. **Auto-login**: User is logged in and redirected to dashboard

## File Changes Made

### Frontend Components
- **`resources/js/components/SocialLogin.jsx`** - New reusable component with Google & Facebook buttons
- **`resources/js/pages/Auth/Login.jsx`** - Updated to include SocialLogin component
- **`resources/js/pages/Auth/Register.jsx`** - Updated to include SocialLogin component

### Backend
- **`app/Http/Controllers/Auth/OAuthController.php`** - New OAuth controller
- **`config/services.php`** - Updated with Google and Facebook configuration
- **`routes/web.php`** - Added OAuth routes
- **`app/Models/User.php`** - Updated fillable array with OAuth fields
- **`database/migrations/2026_05_16_000000_add_oauth_to_users_table.php`** - New migration

## Troubleshooting

### "Class 'Laravel\Socialite\Facades\Socialite' not found"
- Make sure Laravel Socialite is installed: `composer require laravel/socialite`

### OAuth buttons not showing
- Check that SocialLogin component is imported in Login.jsx and Register.jsx
- Verify the component is rendered before the form

### Redirect loop
- Make sure `GOOGLE_REDIRECT_URI` and `FACEBOOK_REDIRECT_URI` match exactly in:
  - Your `.env` file
  - Google Cloud Console
  - Facebook Developer Console

### User not created
- Check that the `users` table migration has been run
- Verify the User model's fillable array includes oauth fields

## Security Notes

- Never commit `.env` file with real credentials
- Use environment variables for all sensitive data
- Ensure HTTPS is enabled in production
- Regularly update Socialite and dependencies

## Production Deployment

Before deploying to production:
1. Generate OAuth credentials for your production domain
2. Update `.env` with production credentials
3. Ensure HTTPS is enabled
4. Test the OAuth flow thoroughly
5. Monitor logs for any authentication errors
