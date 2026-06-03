<?php

namespace App\Helpers;

class CallHelper
{
    /**
     * Format duration in seconds to human-readable format
     */
    public static function formatDuration(int $seconds): string
    {
        if ($seconds < 60) {
            return "{$seconds}s";
        }

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
     * Get call status display text
     */
    public static function getStatusDisplay(string $status): string
    {
        $statuses = [
            'calling' => 'Calling',
            'ringing' => 'Ringing',
            'accepted' => 'Active',
            'rejected' => 'Rejected',
            'missed' => 'Missed',
            'ended' => 'Ended',
            'failed' => 'Failed',
        ];

        return $statuses[$status] ?? $status;
    }

    /**
     * Get call status icon/badge color
     */
    public static function getStatusColor(string $status): string
    {
        $colors = [
            'calling' => 'blue',
            'ringing' => 'yellow',
            'accepted' => 'green',
            'rejected' => 'red',
            'missed' => 'orange',
            'ended' => 'gray',
            'failed' => 'red',
        ];

        return $colors[$status] ?? 'gray';
    }

    /**
     * Check if a call is active
     */
    public static function isActive(string $status): bool
    {
        return in_array($status, ['calling', 'ringing', 'accepted']);
    }

    /**
     * Check if a call can be accepted
     */
    public static function canAccept(string $status): bool
    {
        return in_array($status, ['calling', 'ringing']);
    }

    /**
     * Check if a call can be rejected
     */
    public static function canReject(string $status): bool
    {
        return in_array($status, ['calling', 'ringing']);
    }

    /**
     * Check if a call can be ended
     */
    public static function canEnd(string $status): bool
    {
        return in_array($status, ['calling', 'ringing', 'accepted']);
    }

    /**
     * Calculate call quality score based on duration
     * 0-100 scale
     */
    public static function calculateCallQuality(?int $duration): int
    {
        if (!$duration || $duration < 1) {
            return 0;
        }

        if ($duration < 10) {
            return 20;
        }

        if ($duration < 60) {
            return 60;
        }

        if ($duration < 300) {
            return 80;
        }

        return 100;
    }

    /**
     * Get call quality description
     */
    public static function getCallQualityDescription(int $score): string
    {
        if ($score === 0) {
            return 'No call duration';
        }

        if ($score < 30) {
            return 'Very Poor';
        }

        if ($score < 50) {
            return 'Poor';
        }

        if ($score < 70) {
            return 'Fair';
        }

        if ($score < 90) {
            return 'Good';
        }

        return 'Excellent';
    }

    /**
     * Format call start time
     */
    public static function formatStartTime(\DateTime $dateTime): string
    {
        $now = now();
        $diff = $now->diffInSeconds($dateTime);

        if ($diff < 60) {
            return "Just now";
        }

        if ($diff < 3600) {
            $minutes = intdiv($diff, 60);
            return "{$minutes}m ago";
        }

        if ($diff < 86400) {
            $hours = intdiv($diff, 3600);
            return "{$hours}h ago";
        }

        if ($diff < 604800) {
            $days = intdiv($diff, 86400);
            return "{$days}d ago";
        }

        return $dateTime->format('M d, Y');
    }

    /**
     * Get call summary for notification
     */
    public static function getCallSummary(\App\Models\Call $call, \App\Models\User $currentUser): string
    {
        $isOutgoing = $call->caller_id === $currentUser->id;
        $otherUser = $isOutgoing ? $call->receiver : $call->caller;
        $statusText = self::getStatusDisplay($call->status);

        if ($isOutgoing) {
            return "Call to {$otherUser->name} - {$statusText}";
        }

        return "Call from {$otherUser->name} - {$statusText}";
    }
}
