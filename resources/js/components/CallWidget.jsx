import React, { useState, useEffect, useRef } from 'react';
import { Device } from 'twilio-client';
import echo from '@/echo';

export default function CallWidget({ conversation, otherUser, onCallEnd }) {
    const [isCallActive, setIsCallActive] = useState(false);
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, ringing, accepted, rejected, ended
    const [callDuration, setCallDuration] = useState(0);
    const [accessToken, setAccessToken] = useState(null);
    const [device, setDevice] = useState(null);
    const [connection, setConnection] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isIncoming, setIsIncoming] = useState(false);
    const [currentCall, setCurrentCall] = useState(null);
    const [error, setError] = useState(null);
    const durationIntervalRef = useRef(null);
    const missedCallTimeoutRef = useRef(null);

    const currentUser = window.auth?.user;

    // Initialize Twilio Device
    useEffect(() => {
        const initializeDevice = async () => {
            try {
                const response = await fetch(route('calls.token'));
                const data = await response.json();

                if (!data.success) {
                    throw new Error('Failed to generate token');
                }

                setAccessToken(data.token);

                // Initialize Twilio Device
                const newDevice = new Device(data.token, {
                    logLevel: 1,
                    codecPreferences: ['opus', 'pcmu'],
                    closeProtocol: true,
                });

                // Device events
                newDevice.on('ready', () => {
                    console.log('Twilio Device ready');
                });

                newDevice.on('error', (error) => {
                    console.error('Twilio Device error:', error);
                    setError(`Device error: ${error.message}`);
                });

                newDevice.on('disconnect', (connection) => {
                    console.log('Call disconnected');
                    handleCallEnd();
                });

                newDevice.on('incoming', (incomingConnection) => {
                    handleIncomingCall(incomingConnection);
                });

                setDevice(newDevice);
            } catch (err) {
                console.error('Failed to initialize Twilio Device:', err);
                setError(err.message);
            }
        };

        if (!device) {
            initializeDevice();
        }

        return () => {
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
            }
            if (missedCallTimeoutRef.current) {
                clearTimeout(missedCallTimeoutRef.current);
            }
        };
    }, [device]);

    // Subscribe to call events via WebSocket
    useEffect(() => {
        if (!conversation?.id) return;

        const channelName = `private-call.${currentUser?.id}`;
        const channel = echo.private(channelName);

        channel.listen('call.initiated', (data) => {
            console.log('Incoming call initiated:', data);
            // Handle incoming call notification
        });

        channel.listen('call.accepted', (data) => {
            console.log('Call accepted:', data);
            setCallStatus('accepted');
        });

        channel.listen('call.rejected', (data) => {
            console.log('Call rejected:', data);
            setCallStatus('rejected');
            setError(data.reason || 'Call rejected');
            setIsCallActive(false);
        });

        channel.listen('call.ended', (data) => {
            console.log('Call ended:', data);
            handleCallEnd();
        });

        return () => {
            echo.leave(channelName);
        };
    }, [conversation?.id, currentUser?.id]);

    const initiateCall = async () => {
        if (!device || !otherUser?.id) {
            setError('Device not ready or missing receiver');
            return;
        }

        try {
            // Create call record
            const response = await fetch(route('calls.initiate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    receiver_id: otherUser.id,
                    conversation_id: conversation?.id,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to initiate call');
            }

            setCurrentCall(data.call);
            setCallStatus('calling');
            setIsCallActive(true);
            setError(null);

            // Set timeout to mark as missed if not accepted
            missedCallTimeoutRef.current = setTimeout(() => {
                if (callStatus === 'calling' || callStatus === 'ringing') {
                    markCallMissed(data.call.uuid);
                }
            }, 30000); // 30 second timeout

            // Make the actual Twilio call
            if (device) {
                const conn = await device.connect({
                    To: otherUser.uuid,
                });
                setConnection(conn);
                setCallStatus('ringing');
            }
        } catch (err) {
            console.error('Failed to initiate call:', err);
            setError(err.message);
            setIsCallActive(false);
        }
    };

    const handleIncomingCall = async (incomingConnection) => {
        console.log('Incoming call from:', incomingConnection.parameters.From);

        setIsIncoming(true);
        setCallStatus('ringing');
        setConnection(incomingConnection);

        // Set up events for the incoming connection
        incomingConnection.on('accept', () => {
            setCallStatus('accepted');
            startCallTimer();
        });

        incomingConnection.on('reject', () => {
            setCallStatus('rejected');
            setIsIncoming(false);
        });

        incomingConnection.on('disconnect', () => {
            handleCallEnd();
        });
    };

    const acceptCall = async () => {
        try {
            if (!connection) {
                throw new Error('No incoming connection');
            }

            // Accept the connection
            connection.accept();

            // Update call status in backend
            const response = await fetch(route('calls.accept', { callUuid: currentCall?.uuid }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    twilio_call_sid: connection.parameters?.CallSid,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setCallStatus('accepted');
                startCallTimer();
            }
        } catch (err) {
            console.error('Failed to accept call:', err);
            setError(err.message);
        }
    };

    const rejectCall = async () => {
        try {
            if (connection) {
                connection.reject();
            }

            // Update call status in backend
            if (currentCall?.uuid) {
                await fetch(route('calls.reject', { callUuid: currentCall.uuid }), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({
                        reason: 'User rejected the call',
                    }),
                });
            }

            setIsIncoming(false);
            setCallStatus('rejected');
            setIsCallActive(false);
        } catch (err) {
            console.error('Failed to reject call:', err);
        }
    };

    const endCall = async () => {
        try {
            if (connection) {
                connection.disconnect();
                setConnection(null);
            }

            // Update call status in backend
            if (currentCall?.uuid) {
                const response = await fetch(route('calls.end', { callUuid: currentCall.uuid }), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setCallStatus('ended');
                }
            }

            handleCallEnd();
        } catch (err) {
            console.error('Failed to end call:', err);
            handleCallEnd();
        }
    };

    const markCallMissed = async (callUuid) => {
        try {
            await fetch(route('calls.missed', { callUuid }), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            setCallStatus('missed');
            setIsCallActive(false);
        } catch (err) {
            console.error('Failed to mark call as missed:', err);
        }
    };

    const handleCallEnd = () => {
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
        }
        if (missedCallTimeoutRef.current) {
            clearTimeout(missedCallTimeoutRef.current);
        }
        setIsCallActive(false);
        setCallStatus('idle');
        setCallDuration(0);
        setConnection(null);
        setCurrentCall(null);
        onCallEnd && onCallEnd();
    };

    const toggleMute = () => {
        if (connection) {
            connection.mute(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const startCallTimer = () => {
        durationIntervalRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getStatusText = () => {
        switch (callStatus) {
            case 'calling':
                return 'Calling...';
            case 'ringing':
                return isIncoming ? 'Incoming call...' : 'Ringing...';
            case 'accepted':
                return formatDuration(callDuration);
            case 'rejected':
                return 'Call rejected';
            case 'missed':
                return 'Call missed';
            case 'ended':
                return 'Call ended';
            default:
                return 'Ready';
        }
    };

    return (
        <div className="call-widget">
            {isCallActive && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                        {/* Call header */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                {otherUser?.avatar && (
                                    <img
                                        src={otherUser.avatar}
                                        alt={otherUser.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{otherUser?.name}</h2>
                            <p className={`text-lg font-semibold ${
                                callStatus === 'accepted' ? 'text-green-600' : 'text-gray-600'
                            }`}>
                                {getStatusText()}
                            </p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Call controls */}
                        <div className="flex gap-3 justify-center">
                            {callStatus === 'ringing' && isIncoming ? (
                                <>
                                    <button
                                        onClick={acceptCall}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={rejectCall}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : (callStatus === 'calling' || callStatus === 'ringing') ? (
                                <button
                                    onClick={endCall}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
                                >
                                    Cancel
                                </button>
                            ) : callStatus === 'accepted' ? (
                                <>
                                    <button
                                        onClick={toggleMute}
                                        className={`${
                                            isMuted ? 'bg-red-500' : 'bg-blue-500'
                                        } hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition`}
                                    >
                                        {isMuted ? 'Unmute' : 'Mute'}
                                    </button>
                                    <button
                                        onClick={endCall}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        End Call
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Call initiation button (usually in chat header) */}
            {!isCallActive && (
                <button
                    onClick={initiateCall}
                    disabled={!device || !otherUser}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
                    title="Start voice call"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.02 1.004 1.986 1.722 2.8 1.952 2.286 4.649 3.84 7.641 3.84 1.545 0 3.032-.25 4.434-.726l.772-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.5C6.716 18 2 13.284 2 7.5V3z"></path>
                    </svg>
                    Call
                </button>
            )}
        </div>
    );
}
