import React, { useEffect, useState } from 'react';
import echo from '@/echo';

export default function IncomingCallNotification({ userId, onCallReceived }) {
    const [notification, setNotification] = useState(null);
    const [ringingAudio, setRingingAudio] = useState(null);

    useEffect(() => {
        // Play ringing sound
        const audio = new Audio('/sounds/ringing.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        setRingingAudio(audio);

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        if (!userId) return;

        const channelName = `private-user.${userId}`;
        const channel = echo.private(channelName);

        channel.listen('call.initiated', (data) => {
            console.log('Incoming call notification:', data);
            setNotification(data.call);
            ringingAudio?.play().catch(err => console.error('Failed to play ringing sound:', err));
            onCallReceived && onCallReceived(data.call);
        });

        return () => {
            ringingAudio?.pause();
            echo.leave(channelName);
        };
    }, [userId, ringingAudio, onCallReceived]);

    if (!notification) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
                <div className="flex items-center gap-4">
                    {notification.caller_avatar && (
                        <img
                            src={notification.caller_avatar}
                            alt={notification.caller_name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    )}
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{notification.caller_name}</h3>
                        <p className="text-sm text-gray-600">Incoming call...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
