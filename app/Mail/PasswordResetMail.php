<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $emailAddress;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->emailAddress = $email;
    }

    public function build()
    {
        $resetUrl = url('/password/reset/' . $this->token) . '?email=' . urlencode($this->emailAddress);

        return $this->subject('Password Reset Request')
                    ->view('emails.password-reset')
                    ->with(['resetUrl' => $resetUrl]);
    }
}
