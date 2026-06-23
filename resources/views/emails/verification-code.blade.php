<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'Skills Hub') }} Verification Code</title>
</head>
<body style="margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8fafc; min-width:100%;">
        <tr>
            <td align="center" style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 16px 40px rgba(15,23,42,0.08);">
                    <tr>
                        <td style="padding:24px; text-align:left; border-bottom:1px solid #e2e8f0;">
                            <img src="{{ asset('assets/logo/logo.png') }}" alt="{{ config('app.name', 'Skills Hub') }} logo" width="120" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px; text-align:center;">
                            <h1 style="margin:0 auto 16px; max-width:520px; font-size:28px; font-weight:700; line-height:1.1; color:#0f172a;">Your Registration Verification Code</h1>
                            <p style="margin:0 auto 24px; max-width:520px; font-size:16px; line-height:1.75; color:#475569;">Please use the following 8-digit code to complete your registration at {{ config('app.name', 'Skills Hub') }}.</p>
                            <div style="display:inline-flex; align-items:center; justify-content:center; min-width:220px; padding:22px 28px; background:#eef2ff; border-radius:18px; font-size:32px; font-weight:700; letter-spacing:0.25em; color:#4338ca; margin:0 auto;">{{ $code }}</div>
                            <p style="margin:24px auto 0; max-width:520px; font-size:15px; line-height:1.75; color:#64748b;">This code is valid for the next 15 minutes. If you did not request this email, you can safely ignore it.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px; background:#f8fafc; border-top:1px solid #e2e8f0;">
                            <p style="margin:0; font-size:14px; line-height:1.7; color:#6b7280;">Need help? Visit our website or contact support for assistance.</p>
                        </td>
                    </tr>
                </table>
                <p style="margin:20px 0 0; font-size:13px; color:#94a3b8; text-align:center;">{{ config('app.name', 'Skills Hub') }} • <a href="{{ config('app.url', url('/')) }}" style="color:#6366f1; text-decoration:none;">{{ config('app.url', url('/')) }}</a></p>
            </td>
        </tr>
    </table>
</body>
</html>
