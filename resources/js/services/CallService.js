import axios from 'axios';

class CallService {
    /**
     * Initiate a voice call
     */
    static async initiateCall(receiverId, conversationId = null) {
        try {
            const response = await axios.post(route('calls.initiate'), {
                receiver_id: receiverId,
                conversation_id: conversationId,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to initiate call:', error);
            throw error;
        }
    }

    /**
     * Accept an incoming call
     */
    static async acceptCall(callUuid, twilioCallSid = null) {
        try {
            const response = await axios.post(route('calls.accept', { callUuid }), {
                twilio_call_sid: twilioCallSid,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to accept call:', error);
            throw error;
        }
    }

    /**
     * Reject an incoming call
     */
    static async rejectCall(callUuid, reason = null) {
        try {
            const response = await axios.post(route('calls.reject', { callUuid }), {
                reason: reason || 'User rejected the call',
            });
            return response.data;
        } catch (error) {
            console.error('Failed to reject call:', error);
            throw error;
        }
    }

    /**
     * End an active call
     */
    static async endCall(callUuid) {
        try {
            const response = await axios.post(route('calls.end', { callUuid }));
            return response.data;
        } catch (error) {
            console.error('Failed to end call:', error);
            throw error;
        }
    }

    /**
     * Mark a call as missed
     */
    static async markCallMissed(callUuid) {
        try {
            const response = await axios.post(route('calls.missed', { callUuid }));
            return response.data;
        } catch (error) {
            console.error('Failed to mark call as missed:', error);
            throw error;
        }
    }

    /**
     * Get call details
     */
    static async getCall(callUuid) {
        try {
            const response = await axios.get(route('calls.show', { callUuid }));
            return response.data;
        } catch (error) {
            console.error('Failed to get call details:', error);
            throw error;
        }
    }

    /**
     * Get active calls
     */
    static async getActiveCalls() {
        try {
            const response = await axios.get(route('calls.active'));
            return response.data;
        } catch (error) {
            console.error('Failed to get active calls:', error);
            throw error;
        }
    }

    /**
     * Get call history
     */
    static async getCallHistory(limit = 50) {
        try {
            const response = await axios.get(route('calls.history'), {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get call history:', error);
            throw error;
        }
    }

    /**
     * Get missed calls
     */
    static async getMissedCalls() {
        try {
            const response = await axios.get(route('calls.missed-list'));
            return response.data;
        } catch (error) {
            console.error('Failed to get missed calls:', error);
            throw error;
        }
    }

    /**
     * Get call statistics
     */
    static async getStatistics() {
        try {
            const response = await axios.get(route('calls.statistics'));
            return response.data;
        } catch (error) {
            console.error('Failed to get statistics:', error);
            throw error;
        }
    }

    /**
     * Generate Twilio access token
     */
    static async generateToken() {
        try {
            const response = await axios.get(route('calls.token'));
            return response.data;
        } catch (error) {
            console.error('Failed to generate token:', error);
            throw error;
        }
    }

    /**
     * Format call duration
     */
    static formatDuration(seconds) {
        if (!seconds) return '00:00';

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    /**
     * Format relative time
     */
    static formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString();
    }

    /**
     * Request microphone permission
     */
    static async requestMicrophonePermission() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }

    /**
     * Check if browser supports audio
     */
    static isAudioSupported() {
        return !!(
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia
        );
    }

    /**
     * Check if browser supports WebRTC
     */
    static isWebRTCSupported() {
        return !!(
            window.RTCPeerConnection ||
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection
        );
    }
}

export default CallService;
