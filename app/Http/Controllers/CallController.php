<?php

namespace App\Http\Controllers;

use App\Events\CallAccepted;
use App\Events\CallEnded;
use App\Events\CallInitiated;
use App\Events\CallRejected;
use App\Events\CallStatusChanged;
use App\Models\Call;
use App\Models\Conversation;
use App\Models\User;
use App\Services\TwilioVoiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CallController extends Controller
{
    private TwilioVoiceService $twilioService;

    public function __construct(TwilioVoiceService $twilioService)
    {
        $this->twilioService = $twilioService;
        $this->middleware('auth');
    }

    /**
     * Initiate a voice call
     */
    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id|different:from_user_id',
            'conversation_id' => 'nullable|exists:conversations,id',
        ]);

        $caller = Auth::user();
        $receiver = User::findOrFail($validated['receiver_id']);

        // Check if there's already an active call between these users
        $activeCall = Call::where(function ($query) use ($caller, $receiver) {
            $query->where('caller_id', $caller->id)->where('receiver_id', $receiver->id)
                  ->orWhere('caller_id', $receiver->id)->where('receiver_id', $caller->id);
        })
        ->whereIn('status', ['calling', 'ringing', 'accepted'])
        ->first();

        if ($activeCall) {
            return response()->json([
                'success' => false,
                'message' => 'Call already in progress between these users',
                'call' => $activeCall,
            ], 409);
        }

        // Create the call record
        $call = $this->twilioService->initiateCall(
            $caller,
            $receiver,
            $validated['conversation_id'] ?? null
        );

        // Broadcast call initiated event
        CallInitiated::dispatch($call);

        // Auto-mark as ringing after 1 second (simulating signaling delay)
        $this->twilioService->updateCallStatus($call, 'ringing');
        CallStatusChanged::dispatch($call, 'calling');

        return response()->json([
            'success' => true,
            'message' => 'Call initiated',
            'call' => [
                'uuid' => $call->uuid,
                'status' => $call->status,
                'caller' => [
                    'id' => $caller->id,
                    'uuid' => $caller->uuid,
                    'name' => $caller->name,
                    'avatar' => $caller->avatar,
                ],
                'receiver' => [
                    'id' => $receiver->id,
                    'uuid' => $receiver->uuid,
                    'name' => $receiver->name,
                    'avatar' => $receiver->avatar,
                ],
            ],
        ], 201);
    }

    /**
     * Accept an incoming call
     */
    public function accept(Request $request, string $callUuid)
    {
        $validated = $request->validate([
            'twilio_call_sid' => 'nullable|string',
        ]);

        $call = Call::where('uuid', $callUuid)->firstOrFail();
        $user = Auth::user();

        // Verify the current user is the receiver
        if ($call->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to accept this call',
            ], 403);
        }

        // Check if call is still in a state that can be accepted
        if (!in_array($call->status, ['calling', 'ringing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Call cannot be accepted in current state: ' . $call->status,
            ], 400);
        }

        $previousStatus = $call->status;

        // Update call status to accepted
        $call->accept();
        if ($validated['twilio_call_sid'] ?? null) {
            $call->update(['twilio_call_sid' => $validated['twilio_call_sid']]);
        }

        // Broadcast events
        CallAccepted::dispatch($call);
        CallStatusChanged::dispatch($call, $previousStatus);

        return response()->json([
            'success' => true,
            'message' => 'Call accepted',
            'call' => [
                'uuid' => $call->uuid,
                'status' => $call->status,
                'started_at' => $call->started_at,
            ],
        ]);
    }

    /**
     * Reject an incoming call
     */
    public function reject(Request $request, string $callUuid)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        $call = Call::where('uuid', $callUuid)->firstOrFail();
        $user = Auth::user();

        // Verify the current user is the receiver
        if ($call->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to reject this call',
            ], 403);
        }

        // Check if call is still in a state that can be rejected
        if (!in_array($call->status, ['calling', 'ringing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Call cannot be rejected in current state: ' . $call->status,
            ], 400);
        }

        $call->reject();

        // Broadcast rejection event
        CallRejected::dispatch($call, $validated['reason'] ?? 'User rejected the call');

        return response()->json([
            'success' => true,
            'message' => 'Call rejected',
            'call' => [
                'uuid' => $call->uuid,
                'status' => $call->status,
            ],
        ]);
    }

    /**
     * End an ongoing call
     */
    public function end(Request $request, string $callUuid)
    {
        $call = Call::where('uuid', $callUuid)->firstOrFail();
        $user = Auth::user();

        // Verify the current user is either caller or receiver
        if ($call->caller_id !== $user->id && $call->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to end this call',
            ], 403);
        }

        // Check if call is still active
        if (!$call->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Call is not active',
            ], 400);
        }

        $call->end();

        // Broadcast call ended event
        CallEnded::dispatch($call);

        return response()->json([
            'success' => true,
            'message' => 'Call ended',
            'call' => [
                'uuid' => $call->uuid,
                'status' => $call->status,
                'duration' => $call->duration,
                'formatted_duration' => $call->formatted_duration,
            ],
        ]);
    }

    /**
     * Mark a call as missed
     */
    public function markMissed(string $callUuid)
    {
        $call = Call::where('uuid', $callUuid)->firstOrFail();
        $user = Auth::user();

        // Verify the current user is the receiver
        if ($call->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if ($call->status !== 'calling' && $call->status !== 'ringing') {
            return response()->json([
                'success' => false,
                'message' => 'Call cannot be marked as missed',
            ], 400);
        }

        $call->markMissed();

        return response()->json([
            'success' => true,
            'message' => 'Call marked as missed',
            'call' => [
                'uuid' => $call->uuid,
                'status' => $call->status,
            ],
        ]);
    }

    /**
     * Get a specific call details
     */
    public function show(string $callUuid)
    {
        $call = Call::where('uuid', $callUuid)
            ->with(['caller', 'receiver', 'conversation'])
            ->firstOrFail();

        $user = Auth::user();

        // Verify user is involved in the call
        if ($call->caller_id !== $user->id && $call->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'call' => [
                'uuid' => $call->uuid,
                'caller' => [
                    'id' => $call->caller->id,
                    'name' => $call->caller->name,
                    'avatar' => $call->caller->avatar,
                ],
                'receiver' => [
                    'id' => $call->receiver->id,
                    'name' => $call->receiver->name,
                    'avatar' => $call->receiver->avatar,
                ],
                'status' => $call->status,
                'started_at' => $call->started_at,
                'ended_at' => $call->ended_at,
                'duration' => $call->duration,
                'formatted_duration' => $call->formatted_duration,
            ],
        ]);
    }

    /**
     * Get active calls for the current user
     */
    public function active()
    {
        $user = Auth::user();
        $activeCalls = $this->twilioService->getActiveCallsForUser($user);

        return response()->json([
            'success' => true,
            'calls' => $activeCalls->map(function (Call $call) {
                return [
                    'uuid' => $call->uuid,
                    'caller_id' => $call->caller_id,
                    'receiver_id' => $call->receiver_id,
                    'status' => $call->status,
                    'created_at' => $call->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get call history for the current user
     */
    public function history(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'integer|min:1|max:100',
        ]);

        $user = Auth::user();
        $limit = $validated['limit'] ?? 50;
        $history = $this->twilioService->getCallHistory($user, $limit);

        return response()->json([
            'success' => true,
            'calls' => $history->map(function (Call $call) use ($user) {
                $otherUser = $call->caller_id === $user->id ? $call->receiver : $call->caller;

                return [
                    'uuid' => $call->uuid,
                    'status' => $call->status,
                    'duration' => $call->duration,
                    'formatted_duration' => $call->formatted_duration,
                    'started_at' => $call->started_at,
                    'ended_at' => $call->ended_at,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                    ],
                    'is_incoming' => $call->receiver_id === $user->id,
                ];
            }),
        ]);
    }

    /**
     * Get missed calls for the current user
     */
    public function missedCalls()
    {
        $user = Auth::user();
        $missedCalls = $this->twilioService->getMissedCalls($user);

        return response()->json([
            'success' => true,
            'calls' => $missedCalls->map(function (Call $call) {
                return [
                    'uuid' => $call->uuid,
                    'caller' => [
                        'id' => $call->caller->id,
                        'name' => $call->caller->name,
                        'avatar' => $call->caller->avatar,
                    ],
                    'created_at' => $call->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get call statistics for the current user
     */
    public function statistics()
    {
        $user = Auth::user();
        $stats = $this->twilioService->getCallStats($user);

        return response()->json([
            'success' => true,
            'statistics' => $stats,
        ]);
    }

    /**
     * Generate Twilio access token for the current user
     */
    public function generateToken()
    {
        $user = Auth::user();

        try {
            $token = $this->twilioService->generateAccessToken($user);

            return response()->json([
                'success' => true,
                'token' => $token,
                'identity' => $user->uuid,
                'expires_in' => 3600,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate access token: ' . $e->getMessage(),
            ], 500);
        }
    }
}
