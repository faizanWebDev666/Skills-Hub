# Voice Calling System - Testing Guide

## Backend Testing

### 1. Test Call Creation

```php
// Using Tinker
php artisan tinker

// Get two users
$user1 = User::first();
$user2 = User::skip(1)->first();

// Create a call
$call = Call::create([
    'caller_id' => $user1->id,
    'receiver_id' => $user2->id,
    'status' => 'calling',
]);

// Verify call
$call->load('caller', 'receiver');
$call->toArray();
```

### 2. Test Call Service

```php
use App\Services\TwilioVoiceService;

$service = app(TwilioVoiceService::class);

// Get user
$user = User::first();

// Generate token
$token = $service->generateAccessToken($user);
echo $token; // Should output JWT token

// Get active calls
$activeCalls = $service->getActiveCallsForUser($user);

// Get call history
$history = $service->getCallHistory($user, 10);

// Get statistics
$stats = $service->getCallStats($user);
print_r($stats);
```

### 3. Test API Endpoints

```bash
# Generate token
curl -X GET http://localhost:8000/calls/token/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Initiate call
curl -X POST http://localhost:8000/calls/initiate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: YOUR_CSRF_TOKEN" \
  -d '{
    "receiver_id": 2,
    "conversation_id": null
  }'

# Accept call
curl -X POST http://localhost:8000/calls/{callUuid}/accept \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: YOUR_CSRF_TOKEN" \
  -d '{
    "twilio_call_sid": null
  }'

# Get call history
curl -X GET http://localhost:8000/calls/history/list?limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Get call statistics
curl -X GET http://localhost:8000/calls/statistics/user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

## Frontend Testing

### 1. Test Component Rendering

```jsx
// resources/js/components/__tests__/CallWidget.test.jsx
import { render, screen } from '@testing-library/react';
import CallWidget from '../CallWidget';

describe('CallWidget', () => {
    test('renders call button', () => {
        const mockOtherUser = {
            id: 1,
            uuid: 'uuid-123',
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg'
        };

        render(
            <CallWidget
                conversation={{ id: 1, uuid: 'conv-uuid' }}
                otherUser={mockOtherUser}
                onCallEnd={() => {}}
            />
        );

        const button = screen.getByTitle('Start voice call');
        expect(button).toBeInTheDocument();
    });

    test('call button is disabled when device not ready', () => {
        // Test device initialization
    });
});
```

### 2. Test Call Service

```javascript
// resources/js/services/__tests__/CallService.test.js
import CallService from '../CallService';

describe('CallService', () => {
    test('formats duration correctly', () => {
        expect(CallService.formatDuration(0)).toBe('00:00');
        expect(CallService.formatDuration(65)).toBe('01:05');
        expect(CallService.formatDuration(3665)).toBe('01:01:05');
    });

    test('formats relative time correctly', () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 3600000);
        expect(CallService.formatRelativeTime(oneHourAgo)).toContain('ago');
    });

    test('checks audio support', () => {
        const supported = CallService.isAudioSupported();
        expect(typeof supported).toBe('boolean');
    });

    test('checks WebRTC support', () => {
        const supported = CallService.isWebRTCSupported();
        expect(typeof supported).toBe('boolean');
    });
});
```

### 3. Test WebSocket Integration

```javascript
// Test incoming call notification
const mockEcho = {
    private: (channel) => ({
        listen: (event, callback) => {
            if (event === 'call.initiated') {
                // Simulate incoming call
                callback({
                    call: {
                        uuid: 'call-123',
                        caller_id: 1,
                        caller_name: 'John Doe',
                        caller_avatar: 'https://example.com/avatar.jpg'
                    }
                });
            }
        }
    })
};

// Mock window.Echo
window.Echo = mockEcho;
```

## Manual Testing Scenarios

### Scenario 1: Normal Call Flow

1. **Setup**:
   - Open app in 2 browsers (or incognito windows)
   - Log in as User A in browser 1
   - Log in as User B in browser 2
   - Navigate to chat between User A and B in both browsers

2. **Steps**:
   - Browser 1: Click call button
   - Browser 2: Should see incoming call notification
   - Browser 2: Click accept
   - Both: Should see "Accepted" status
   - Browser 2: Speak and confirm User 1 hears audio
   - Browser 1: Speak and confirm User 2 hears audio
   - Browser 1: Click "End Call"
   - Both: Should see "Call ended" with duration

3. **Verification**:
   - Call appears in history for both users
   - Duration is recorded correctly
   - Status is "ended"
   - Call summary shows correct participants

### Scenario 2: Call Rejection

1. **Setup**: Same as Scenario 1

2. **Steps**:
   - Browser 1: Click call button
   - Browser 2: Click "Reject"
   - Browser 1: Should see "Call rejected"
   - Browser 2: Should see "Call ended"

3. **Verification**:
   - Call history shows "rejected" status
   - No audio connection established
   - Duration is empty or 0

### Scenario 3: Missed Call

1. **Setup**: Same as Scenario 1

2. **Steps**:
   - Browser 1: Click call button
   - Browser 2: Do nothing (wait 30 seconds)
   - Automatic: Call should transition to "missed"
   - Browser 1: Should see "Missed"

3. **Verification**:
   - Missed calls list updated
   - Call history shows "missed" status
   - Browser 2 has missed call notification

### Scenario 4: Call During Network Issue

1. **Setup**: Same as Scenario 1

2. **Steps**:
   - Browser 1: Click call button
   - Browser 2: Accept call
   - Simulate network issue: DevTools > Network > Offline
   - Wait for reconnection
   - Resume audio

3. **Verification**:
   - WebSocket reconnects automatically
   - Call continues after reconnection
   - Error messages are user-friendly

### Scenario 5: Mobile Responsive Test

1. **Setup**: Open app on mobile device or use responsive design mode

2. **Steps**:
   - Initiate call
   - Verify call modal fits screen
   - Verify buttons are touch-friendly (44px minimum)
   - Test mute/unmute on mobile
   - Test end call on mobile

3. **Verification**:
   - No horizontal scrolling
   - All touch targets are >= 44x44px
   - Text is readable
   - Icons scale properly

## Performance Testing

### Load Testing

```bash
# Using Apache Bench
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/calls/statistics/user

# Should complete in < 5 seconds
# Most requests should be < 200ms
```

### Memory Testing

```javascript
// Monitor memory in DevTools
// Call component should not grow indefinitely
// Should stabilize around 10-20MB
```

### Network Monitoring

```
DevTools > Network tab
- WebSocket connection should be established
- Calls to /calls/* endpoints should be < 500ms
- Token generation should be < 200ms
```

## Database Testing

### Verify Data Integrity

```sql
-- Check calls created
SELECT * FROM calls WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Check call duration calculation
SELECT 
    id, 
    caller_id, 
    receiver_id, 
    status, 
    started_at, 
    ended_at, 
    TIMESTAMPDIFF(SECOND, started_at, ended_at) as calculated_duration,
    duration as stored_duration
FROM calls
WHERE status = 'ended'
ORDER BY created_at DESC LIMIT 10;

-- Verify missing calls
SELECT * FROM calls WHERE status = 'missed';

-- Call history by user
SELECT c.*, u.name 
FROM calls c 
JOIN users u ON c.caller_id = u.id 
WHERE c.receiver_id = 1 
ORDER BY c.created_at DESC;
```

## Debug Mode

### Enable Debug Logging

```javascript
// In CallWidget.jsx or boot file
if (process.env.NODE_ENV === 'development') {
    window.DEBUG_CALLS = true;
}

// Log events
if (window.DEBUG_CALLS) {
    console.log('Call event:', event);
}
```

### Twilio Logging

```javascript
// In CallWidget initialization
const newDevice = new Device(token, {
    logLevel: 1, // 0=off, 1=error, 2=warn, 3=info, 4=debug
});
```

### Laravel Logging

```php
// config/logging.php
'single' => [
    'driver' => 'single',
    'path' => storage_path('logs/laravel.log'),
    'level' => env('LOG_LEVEL', 'debug'),
],

// In code
Log::channel('single')->info('Call initiated', [
    'caller_id' => $caller->id,
    'receiver_id' => $receiver->id,
]);
```

## Common Issues & Solutions

### Issue: Token generation fails

```
Solution:
1. Check TWILIO_API_KEY and TWILIO_API_SECRET
2. Verify TWILIO_TWIML_APP_SID is set
3. Check Twilio account has API keys enabled
```

### Issue: WebSocket doesn't connect

```
Solution:
1. Check if Reverb/Pusher is running
2. Verify ws:// or wss:// protocol
3. Check firewall isn't blocking WebSocket
4. Check browser console for errors
```

### Issue: Audio not working

```
Solution:
1. Check microphone permissions
2. Verify audio codec support
3. Test microphone in browser settings
4. Check for HTTPS (required for mic access)
```

### Issue: Calls appear in history but duration is 0

```
Solution:
1. Check started_at timestamp
2. Verify ended_at was updated
3. Check for premature call ending
4. Monitor database for calculation issues
```

## Test Report Template

```
Date: [DATE]
Tester: [NAME]
Environment: [LOCAL/STAGING/PRODUCTION]

Test Results:
- [ ] Call Initiation: PASS/FAIL
- [ ] Call Acceptance: PASS/FAIL
- [ ] Call Rejection: PASS/FAIL
- [ ] Call Duration: PASS/FAIL
- [ ] Audio Quality: PASS/FAIL
- [ ] Missed Call Handling: PASS/FAIL
- [ ] History Recording: PASS/FAIL
- [ ] Mobile Responsive: PASS/FAIL
- [ ] Error Handling: PASS/FAIL
- [ ] Performance: PASS/FAIL

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]
```

---

**Version**: 1.0
**Last Updated**: May 28, 2026
