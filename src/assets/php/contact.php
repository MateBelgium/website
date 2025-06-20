<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Assuming you installed PHPMailer via Composer
$config = require 'config.php';

// Handle form data
$firstName = $_POST['firstname'] ?? '';
$lastName  = $_POST['lastname'] ?? '';
$email     = $_POST['email'] ?? '';
$message   = $_POST['message'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid email address.';
    exit;
}

// Compose email
$mail = new PHPMailer(true);

try {
    // SMTP settings
    $mail->isSMTP();
    $mail->Host       = $config['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['username'];
    $mail->Password   = $config['password'];
    $mail->SMTPSecure = $config['secure'];
    $mail->Port       = $config['port'];

    // Email headers
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($email, "$firstName $lastName");

    $mail->Subject = "New Contact Form Submission from $firstName $lastName";
    $mail->Body    = "Name: $firstName $lastName\nEmail: $email\n\nMessage:\n$message";

    $mail->send();
    echo 'Message sent successfully';
} catch (Exception $e) {
    http_response_code(500);
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}