# Voice Calling Implementation Guide

## Quick Integration Steps

### Step 1: Install npm packages
```bash
npm install twilio-client
npm install axios
```

### Step 2: Update your Chat page component

Edit your main Chat component (e.g., `resources/js/pages/Chat/Index.jsx` or `Show.jsx`):

```jsx
import React, { useState } from 'react';
import CallWidget from '@/components/CallWidget';
import IncomingCallNotification from '@/components/IncomingCallNotification';
import CallHistory from '@/components/CallHistory';

export default function ChatPage({ conversation, otherUser }) {
    const [showCallHistory, setShowCallHistory] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Existing chat UI */}
            <div className="flex-1">
                {/* Chat header with call button */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{otherUser?.name}</h1>
                        <p className="text-sm text-gray-500">Online</p>
                    </div>
                    
                    {/* Call controls */}
                    <div className="flex items-center gap-2">
                        {/* Existing call button reference */}
                        <CallWidget 
                            conversation={conversation}
                            otherUser={otherUser}
                            onCallEnd={() => {
                                // Handle call completion
                            }}
                        />
                        
                        {/* Call history button */}
                        <button
                            onClick={() => setShowCallHistory(!showCallHistory)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="View call history"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Chat messages area (your existing code) */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Your chat messages here */}
                </div>

                {/* Message input (your existing code) */}
                <div className="bg-white border-t p-4">
                    {/* Your message input here */}
                </div>
            </div>

            {/* Call history sidebar */}
            {showCallHistory && (
                <div className="w-96 bg-white border-l overflow-y-auto">
                    <CallHistory />
                </div>
            )}

            {/* Incoming call notification */}
            <IncomingCallNotification 
                userId={window.auth?.user?.id}
                onCallReceived={(call) => {
                    console.log('Received incoming call:', call);
                    // Optional: Auto-open call widget or show notification
                }}
            />
        </div>
    );
}
```

### Step 3: Update your Chat Sidebar

Edit your ChatSidebar component to show call status indicators:

```jsx
import React from 'react';
import CallService from '@/services/CallService';

export default function ChatSidebar({ conversations }) {
    const getCallIndicator = (conversation) => {
        // Check if there's an active call for this conversation
        // You'd need to fetch this data from your backend or state
        return null; // or return call status badge
    };

    return (
        <div className="space-y-2">
            {conversations.map((conv) => (
                <div 
                    key={conv.id} 
                    className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer relative"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{conv.name}</h3>
                        {/* Show call indicator if active */}
                        {getCallIndicator(conv) && (
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" 
                                  title="Active call"></span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{conv.lastMessage}</p>
                </div>
            ))}
        </div>
    );
}
```

### Step 4: Add call button to chat header

If you have a separate header component:

```jsx
// ChatHeader.jsx
import CallWidget from '@/components/CallWidget';

export default function ChatHeader({ conversation, otherUser }) {
    return (
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-bold">{otherUser?.name}</h2>
            </div>
            
            <div className="flex items-center gap-2">
                <CallWidget 
                    conversation={conversation}
                    otherUser={otherUser}
                />
                {/* Other header actions */}
            </div>
        </header>
    );
}
```

## Component Props Reference

### CallWidget
```jsx
<CallWidget
    conversation={{id, uuid}} // Current conversation
    otherUser={{id, uuid, name, avatar}} // User to call
    onCallEnd={() => {}} // Callback when call ends
/>
```

### IncomingCallNotification
```jsx
<IncomingCallNotification
    userId={integer} // Current user ID
    onCallReceived={(call) => {}} // Callback when call is received
/>
```

### CallHistory
```jsx
<CallHistory />
```

No props required, fetches data directly from API.

## Using CallService

Import and use the CallService utility for call-related operations:

```javascript
import CallService from '@/services/CallService';

// Initiate a call
const result = await CallService.initiateCall(receiverId, conversationId);

// Get call history
const history = await CallService.getCallHistory(limit);

// Format duration
const formatted = CallService.formatDuration(300); // "05:00"

// Check browser support
if (CallService.isAudioSupported() && CallService.isWebRTCSupported()) {
    console.log('Voice calling is supported');
}

// Request microphone permission
const granted = await CallService.requestMicrophonePermission();
if (!granted) {
    alert('Please enable microphone access');
}
```

## Environment Setup

### Required .env variables

Add to your `.env` file:

```env
# Twilio Voice
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Register the Service Provider

The TwilioVoiceService should be automatically registered. To manually register it:

```php
// config/app.php
'providers' => [
    // ...
    App\Providers\CallServiceProvider::class,
],
```

Create the provider if needed:

```php
// app/Providers/CallServiceProvider.php
<?php

namespace App\Providers;

use App\Services\TwilioVoiceService;
use Illuminate\Support\ServiceProvider;

class CallServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(TwilioVoiceService::class, function ($app) {
            return new TwilioVoiceService();
        });
    }
}
```

## Database Migration

Run the migration to create the calls table:

```bash
php artisan migrate
```

This creates:
- `calls` table with columns: uuid, caller_id, receiver_id, status, duration, etc.
- Indexes for optimized queries

## Broadcasting Setup

Ensure Laravel Echo is configured in your JS:

```javascript
// resources/js/bootstrap.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher', // or 'reverb'
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
});
```

Or for Laravel Reverb:

```javascript
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
});
```

## State Management (Optional)

If using state management (Redux, Pinia, etc.), consider storing:

```javascript
// State structure
{
    calls: {
        active: {},           // Current active calls by UUID
        history: [],          // Recent call history
        statistics: {},       // User call statistics
        deviceReady: false,   // Twilio device status
        error: null,          // Last error message
    }
}
```

## Mobile Responsiveness

The components are mobile-responsive using Tailwind CSS. On mobile:
- Call modal takes full screen
- Buttons are touch-friendly
- History sidebar converts to tab/modal

## Accessibility

All components include:
- ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast modes

## Testing

### Manual Testing Checklist

- [ ] Call initiation works
- [ ] Receiver gets notification
- [ ] Audio connects after accept
- [ ] Call timer increments correctly
- [ ] Call ends and saves to history
- [ ] Rejected calls don't connect
- [ ] Missed calls are recorded
- [ ] Call history loads
- [ ] Statistics calculate correctly
- [ ] Works on mobile
- [ ] Works on desktop
- [ ] WebSocket reconnects if disconnected
- [ ] Handles network errors gracefully

### Automated Testing

```javascript
// Example Jest test
import CallService from '@/services/CallService';

describe('CallService', () => {
    test('formats duration correctly', () => {
        expect(CallService.formatDuration(65)).toBe('01:05');
        expect(CallService.formatDuration(3661)).toBe('61:01');
    });

    test('detects browser capabilities', () => {
        expect(CallService.isAudioSupported()).toBe(true);
        expect(CallService.isWebRTCSupported()).toBe(true);
    });
});
```

## Performance Tips

1. **Token Caching**: Tokens last 1 hour - cache them to reduce API calls
2. **Lazy Loading**: Load call history only when needed
3. **Connection Pooling**: Database connections are pooled
4. **Event Debouncing**: Call status changes are debounced
5. **Media Constraints**: Audio-only (no video) reduces bandwidth

## Troubleshooting

### Call doesn't connect
- Check browser console for errors
- Verify microphone permissions
- Check if WebSocket is connected
- Verify TWILIO_TWIML_APP_SID is set

### No incoming call notification
- Check if private-user channel is subscribed
- Verify WebSocket connection in Network tab
- Check browser console for auth errors

### Microphone not working
- Request permission: `CallService.requestMicrophonePermission()`
- Ensure browser has access
- Check device settings
- Try different browser

### Call history not loading
- Verify user is authenticated
- Check API endpoint is accessible
- Check browser dev tools for network errors

## Support

For issues:
1. Check browser console for errors
2. Check Laravel logs: `storage/logs/laravel.log`
3. Check Twilio dashboard for call logs
4. Review VOICE_CALLING_SETUP.md for detailed configuration

---

**Version**: 1.0
**Last Updated**: May 28, 2026
