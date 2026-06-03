<?php

namespace App\Services;

use App\Models\Call;
use App\Models\User;
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VoiceGrant;
use Twilio\Rest\Client;

class TwilioVoiceService
{
    private Client $twilioClient;
    private string $accountSid;
    private string $authToken;
    private string $apiKey;
    private string $apiSecret;

    public function __construct()
    {
        $this->accountSid = config('services.twilio.account_sid');
        $this->authToken = config('services.twilio.auth_token');
        $this->apiKey = config('services.twilio.api_key');
        $this->apiSecret = config('services.twilio.api_secret');

        $this->twilioClient = new Client($this->accountSid, $this->authToken);
    }

    /**
     * Generate a Twilio access token for the user
     * This token allows the user to make/receive WebRTC calls
     */
    public function generateAccessToken(User $user, int $expirationTime = 3600): string
    {
        $token = new AccessToken(
            $this->accountSid,
            $this->apiKey,
            $this->apiSecret,
            $expirationTime
        );

        // Grant the user permissions to use Voice
        $voiceGrant = new VoiceGrant();
        $voiceGrant->setOutgoingApplicationSid(config('services.twilio.twiml_app_sid'));
        $voiceGrant->setIncomingAllow(true);
        $token->addGrant($voiceGrant);

        // Set the user's identity for the token
        $token->setIdentity($user->uuid);

        return $token->toJWT();
    }

    /**
     * Initiate a voice call
     */
    public function initiateCall(User $caller, User $receiver, ?string $conversationId = null): Call
    {
        $call = Call::create([
            'caller_id' => $caller->id,
            'receiver_id' => $receiver->id,
            'conversation_id' => $conversationId,
            'status' => 'calling',
        ]);

        return $call;
    }

    /**
     * Update call status
     */
    public function updateCallStatus(Call $call, string $status, ?string $twilioCallSid = null): Call
    {
        $updates = ['status' => $status];

        if ($twilioCallSid) {
            $updates['twilio_call_sid'] = $twilioCallSid;
        }

        if ($status === 'accepted' && !$call->started_at) {
            $updates['started_at'] = now();
        }

        $call->update($updates);

        return $call;
    }

    /**
     * End a call and calculate duration
     */
    public function endCall(Call $call): Call
    {
        $call->end();

        // If we have a Twilio call SID, we can optionally log it or perform cleanup
        if ($call->twilio_call_sid) {
            // You can add additional Twilio API calls here if needed
        }

        return $call;
    }

    /**
     * Get the call with details
     */
    public function getCall(string $callUuid): ?Call
    {
        return Call::where('uuid', $callUuid)->first();
    }

    /**
     * Get active calls for a user
     */
    public function getActiveCallsForUser(User $user)
    {
        return Call::where(function ($query) use ($user) {
            $query->where('caller_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
        })
        ->whereIn('status', ['calling', 'ringing', 'accepted'])
        ->latest()
        ->get();
    }

    /**
     * Get call history for a user
     */
    public function getCallHistory(User $user, int $limit = 50)
    {
        return Call::where(function ($query) use ($user) {
            $query->where('caller_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
        })
        ->whereIn('status', ['ended', 'rejected', 'missed', 'failed'])
        ->with(['caller', 'receiver', 'conversation'])
        ->latest()
        ->limit($limit)
        ->get();
    }

    /**
     * Get missed calls for a user
     */
    public function getMissedCalls(User $user, int $limit = 20)
    {
        return Call::where('receiver_id', $user->id)
            ->where('status', 'missed')
            ->with(['caller', 'conversation'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get call statistics for a user
     */
    public function getCallStats(User $user): array
    {
        $calls = Call::where(function ($query) use ($user) {
            $query->where('caller_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
        })->get();

        $totalDuration = $calls->sum('duration') ?? 0;
        $totalCalls = $calls->count();
        $missedCalls = $calls->where('status', 'missed')->count();
        $rejectedCalls = $calls->where('status', 'rejected')->count();

        return [
            'total_calls' => $totalCalls,
            'total_duration' => $totalDuration,
            'total_duration_formatted' => $this->formatDuration($totalDuration),
            'missed_calls' => $missedCalls,
            'rejected_calls' => $rejectedCalls,
            'average_duration' => $totalCalls > 0 ? intdiv($totalDuration, $totalCalls) : 0,
        ];
    }

    /**
     * Format duration (seconds) to MM:SS or HH:MM:SS
     */
    private function formatDuration(int $seconds): string
    {
        if ($seconds < 3600) {
            $minutes = intdiv($seconds, 60);
            $secs = $seconds % 60;
            return sprintf('%02d:%02d', $minutes, $secs);
        }

        $hours = intdiv($seconds, 3600);
        $minutes = intdiv($seconds % 3600, 60);
        $secs = $seconds % 60;
        return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
    }

    /**
     * Create a TwiML application for voice calling (requires Twilio setup)
     * This would typically be done once during initial setup
     */
    public function createTwiMLApp(string $voiceUrl, string $voiceMethod = 'POST'): array
    {
        try {
            $app = $this->twilioClient->api->v2010->accounts->get($this->accountSid)
                ->applications->create([
                    'friendlyName' => 'Multi-Venter Marketplace Chat Calls',
                    'voiceUrl' => $voiceUrl,
                    'voiceMethod' => $voiceMethod,
                    'statusCallbackMethod' => 'POST',
                ]);

            return [
                'success' => true,
                'app_sid' => $app->sid,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
