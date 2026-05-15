<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $icon }} {{ $type }} Notification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .content {
            padding: 30px 20px;
        }

        .transaction-card {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
        }

        .transaction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .transaction-type {
            font-size: 16px;
            font-weight: 600;
            color: #333;
        }

        .transaction-status {
            display: inline-block;
            background-color: #d4edda;
            color: #155724;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .transaction-amount {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin: 15px 0;
        }

        .transaction-amount.debit {
            color: #dc3545;
        }

        .transaction-details {
            background-color: white;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #666;
            font-size: 14px;
        }

        .detail-value {
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: 600;
            margin: 20px 0;
        }

        .button:hover {
            background-color: #764ba2;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e9ecef;
        }

        .support-text {
            margin-top: 20px;
            font-size: 13px;
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $icon }} {{ $type }} Notification</h1>
            <p>Your transaction has been processed</p>
        </div>

        <div class="content">
            <p>Hi {{ $user->name }},</p>

            <div class="transaction-card">
                <div class="transaction-header">
                    <span class="transaction-type">{{ $type }}</span>
                    <span class="transaction-status">{{ $transaction->status }}</span>
                </div>

                <div class="transaction-amount {{ $transaction->amount < 0 ? 'debit' : '' }}">
                    {{ $transaction->amount > 0 ? '+' : '-' }}${{ $amount }}
                </div>

                <p style="color: #666; margin: 0;">{{ $transaction->description }}</p>
            </div>

            <div class="transaction-details">
                <div class="detail-row">
                    <span class="detail-label">Transaction ID</span>
                    <span class="detail-value">#{{ $transaction->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">{{ ucfirst($transaction->type) }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">New Balance</span>
                    <span class="detail-value">${{ $balance }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date & Time</span>
                    <span class="detail-value">{{ $transaction->created_at->format('M d, Y H:i A') }}</span>
                </div>
            </div>

            <a href="{{ route('wallet.show') }}" class="button">View Your Wallet</a>

            <div class="support-text">
                <strong>Questions?</strong><br>
                If you have any questions about this transaction or need assistance, please don't hesitate to contact our support team at support@marketplace.local or reply to this email.
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Multi-Venter Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>