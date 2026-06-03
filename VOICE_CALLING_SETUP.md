# Twilio Voice Calling Integration Guide

## Overview
This guide walks you through setting up real-time voice calling in your Laravel chat system using Twilio Voice API and Laravel Reverb for real-time signaling.

## Prerequisites
- Twilio account (https://www.twilio.com)
- Laravel 13+ 
- Node.js 16+
- npm or yarn
- Laravel Reverb configured for WebSocket support

## Step 1: Twilio Account Setup

### 1.1 Create a Twilio Account
1. Sign up at https://www.twilio.com/console
2. Verify your email and phone number
3. Get your Account SID and Auth Token from the dashboard

### 1.2 Create API Key
1. Go to Account > API keys & tokens
2. Create a new API Key (not the Auth Token)
3. Save the SID and Secret

### 1.3 Create a TwiML Application
1. Go to Voice > Manage > TwiML Apps
2. Click "Create new TwiML Application"
3. Name it "Multi-Venter Marketplace Chat"
4. For Voice Request URL, use: `https://yourdomain.com/api/voice/callback`
5. Save the App SID

### 1.4 Set up Phone Number (Optional)
If you want to add PSTN calling:
1. Go to Phone Numbers > Manage > Active Numbers
2. Buy a number or use existing
3. Configure voice webhook to your callback URL

## Step 2: Environment Configuration

### 2.1 Update .env File
Add these variables to your `.env` file:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Install Dependencies

### 3.1 Backend
```bash
# Install Twilio PHP SDK
composer require twilio/sdk
```

### 3.2 Frontend
```bash
# Install Twilio Client SDK
npm install twilio-client twilio-conversations twilio

# Ensure you have Laravel Echo and WebSocket support
npm install --save-dev laravel-echo pusher-js
```

## Step 4: Database Setup

### 4.1 Run Migrations
```bash
php artisan migrate

# This creates the calls table with call history
```

## Step 5: Frontend Integration

### 5.1 Add CallWidget to Chat Page

Edit your Chat component (`resources/js/pages/Chat/Show.jsx` or similar):

```jsx
import CallWidget from '@/components/CallWidget';
import IncomingCallNotification from '@/components/IncomingCallNotification';

export default function Chat({ conversation, otherUser }) {
    return (
        <div>
            {/* Your existing chat UI */}
            
            {/* Add call components */}
            <IncomingCallNotification 
                userId={window.auth.user.id}
                onCallReceived={(call) => {
                    console.log('Incoming call:', call);
                }}
            />
            
            <CallWidget 
                conversation={conversation}
                otherUser={otherUser}
                onCallEnd={() => {
                    // Handle call end
                }}
            />
            
            {/* Call history page */}
        </div>
    );
}
```

### 5.2 Add Call Button to Chat Header

Add this button to your chat header where the call icon already exists:

```jsx
import CallWidget from '@/components/CallWidget';

// In your chat header component:
<button 
    onClick={() => {
        // Reference the call button inside CallWidget
        document.querySelector('.call-widget button').click();
    }}
    className="p-2 hover:bg-gray-100 rounded-lg"
    title="Start voice call"
>
    <PhoneIcon className="w-5 h-5" />
</button>
```

### 5.3 Ensure WebSocket Connection

Make sure your `echo.js` is properly configured:

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
    broadcaster: 'reverb',  // or 'pusher'
    key: import.meta.env.VITE_REVERB_APP_KEY || import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 443,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

## Step 6: Broadcasting Channels

The system uses private channels for call signaling:

### Private Channels
- `private-user.{userId}` - For incoming call notifications
- `private-call.{callUuid}` - For active call status updates

These are authenticated in `routes/channels.php` (should already be configured).

## Step 7: Testing

### 7.1 Local Testing with Two Browsers
1. Open the app in two browser windows (different users)
2. Navigate to chat between the two users
3. Click the call button
4. Accept/reject on the other side
5. Monitor console for WebSocket events

### 7.2 Test Scenarios
- **Normal call**: User A calls User B, B accepts, call connects, both can hear each other, A or B ends call
- **Rejected call**: User A calls User B, B rejects call
- **Missed call**: User A calls User B, B doesn't respond for 30 seconds
- **Disconnect**: Call is active, user disconnects unexpectedly

### 7.3 Console Debugging
All Twilio and signaling events are logged to browser console:
- Look for "Twilio Device ready"
- Look for "call.initiated" events
- Look for "Incoming call from" messages
- Check network tab for WebSocket messages to `private-user.*` and `private-call.*`

## Step 8: Production Deployment

### 8.1 SSL/TLS (Required)
Twilio Voice requires secure HTTPS connections. Ensure:
- Your domain has valid SSL certificate
- Browser can access your site via https://yourdomain.com
- WebSocket uses wss:// protocol

### 8.2 Environment Variables
Ensure all Twilio credentials are in production `.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 8.3 Update Callback URLs
In Twilio Dashboard, update your TwiML App's callback URL to your production domain:
- Voice Request URL: `https://production-domain.com/api/voice/callback`

### 8.4 Firewall/Network
- Ensure WebSocket ports are open (usually 443 for wss://)
- Twilio needs to reach your callback URLs
- Users need microphone permissions from their browsers

## Step 9: Advanced Configuration

### 9.1 Call Recording (Optional)
Enable call recording in TwiML by modifying the callback response.

### 9.2 Call Transcription (Optional)
Add transcription capabilities through Twilio's transcription service.

### 9.3 Custom Hold Music
Customize hold music and call routing with TwiML.

### 9.4 Analytics & Monitoring
Track call metrics:
- Total call duration
- Call success rate
- Call drop rate
- User call patterns

## Troubleshooting

### Issue: "Device error: Invalid Access Token"
- Check TWILIO_API_KEY and TWILIO_API_SECRET are correct
- Verify TWILIO_TWIML_APP_SID is set
- Token may have expired (generated for 1 hour)

### Issue: "Call initiated but no ringing"
- Check WebSocket connection in browser dev tools
- Verify broadcasting is configured correctly
- Check Laravel Reverb is running
- Check browser console for errors

### Issue: "Microphone permission denied"
- User must allow microphone access
- HTTPS is required for microphone access
- Check browser settings for microphone permissions

### Issue: "Caller hears nothing"
- Verify audio codec settings
- Check firewall blocking audio traffic
- Ensure both users have microphone connected
- Test microphone in browser settings

### Issue: WebSocket disconnects frequently
- Check network stability
- Increase WebSocket timeout settings
- Monitor server logs for errors
- Check Reverb/Pusher configuration

## Security Considerations

1. **Token Generation**: Access tokens are short-lived (1 hour) and user-specific
2. **Private Channels**: Only authenticated users can receive call notifications
3. **HTTPS Required**: Always use HTTPS in production
4. **Rate Limiting**: Consider adding rate limits to call initiation
5. **Call Validation**: Verify users exist before initiating calls
6. **Audit Logs**: Call history is stored in database for audit trail

## API Endpoints

### Call Initiation
- `POST /calls/initiate` - Start a new call
- Body: `{ receiver_id, conversation_id? }`

### Call Management
- `POST /calls/{callUuid}/accept` - Accept incoming call
- `POST /calls/{callUuid}/reject` - Reject incoming call
- `POST /calls/{callUuid}/end` - End active call
- `POST /calls/{callUuid}/missed` - Mark call as missed

### Call History
- `GET /calls/{callUuid}` - Get call details
- `GET /calls/active/list` - Get active calls
- `GET /calls/history/list` - Get call history
- `GET /calls/missed/list` - Get missed calls
- `GET /calls/statistics/user` - Get call statistics

### Authentication
- `GET /calls/token/generate` - Get Twilio access token

## Architecture Overview

```
Frontend (React)
├── CallWidget (main call UI)
├── IncomingCallNotification (incoming alerts)
└── CallHistory (call logs)
        ↓
WebSocket Events (Laravel Echo/Reverb)
├── call.initiated
├── call.accepted
├── call.rejected
└── call.ended
        ↓
Backend API (CallController)
├── Call initiation & validation
├── Call status management
└── Database recording
        ↓
Twilio Voice API
├── Signaling (via WebSocket)
├── Peer connection setup
└── Audio streaming
```

## Performance Optimization

1. **Connection Pooling**: Database connections are pooled
2. **Event Broadcasting**: Only relevant users receive notifications
3. **Token Caching**: Tokens are generated on-demand and cached client-side
4. **Database Indexing**: Call queries are optimized with indexes
5. **Lazy Loading**: Call history loaded on-demand

## Support & Resources

- Twilio Documentation: https://www.twilio.com/docs/voice
- Twilio JavaScript SDK: https://www.twilio.com/docs/voice/sdks
- Laravel Reverb: https://laravel.com/docs/reverb
- GitHub Issues: Report issues in your repository

## License

This implementation follows your project's license.

---

**Last Updated**: May 28, 2026
**Version**: 1.0
