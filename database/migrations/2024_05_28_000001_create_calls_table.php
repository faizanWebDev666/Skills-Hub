<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('calls', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('caller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->onDelete('set null');
            $table->string('twilio_call_sid')->nullable()->unique();
            $table->enum('status', [
                'calling',      // Call initiated, waiting for response
                'ringing',      // Call is ringing on receiver's end
                'accepted',     // Call was accepted
                'rejected',     // Call was explicitly rejected
                'missed',       // Call was not answered
                'ended',        // Call has ended
                'failed',       // Call failed to connect
            ])->default('calling');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('ended_at')->nullable();
            $table->integer('duration')->nullable(); // Duration in seconds
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for faster queries
            $table->index('caller_id');
            $table->index('receiver_id');
            $table->index('conversation_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calls');
    }
};
