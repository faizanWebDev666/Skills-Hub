@component('mail::message')
# Password Reset Request

You requested a password reset. Click the button below to reset your password. This link expires in 10 minutes.

@component('mail::button', ['url' => $resetUrl])
Reset Password
@endcomponent

If you didn't request this, you can safely ignore this email.

Thanks,
{{ config('app.name') }}
@endcomponent
