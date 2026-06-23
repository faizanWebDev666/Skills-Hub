<?php

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{conversationUuid}', function (User $user, string $conversationUuid) {
    $conversation = Conversation::where('uuid', $conversationUuid)->first();

    return $conversation && ($conversation->user_one_id === $user->id || $conversation->user_two_id === $user->id);
});

Broadcast::channel('user.{userId}', function (User $user, int $userId) {
    return $user->id === $userId;
});

Broadcast::channel('online', function (User $user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});
