<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Sanitize all inputs
    $firstName = htmlspecialchars(trim($_POST['firstname']));
    $lastName  = htmlspecialchars(trim($_POST['lastname']));
    $email     = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message   = htmlspecialchars(trim($_POST['message']));

    // 2. Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "❌ Invalid email address. Please go back and try again.";
        exit;
    }

    // 3. Basic checks (optional)
    if (empty($firstName) || empty($lastName) || empty($message)) {
        echo "❌ Please fill in all fields.";
        exit;
    }

    // 4. Email details
    $to = "matebelgium.contact@gmail.com";
    $subject = "New Contact Form Submission";
    $body = "You received a new message from your website:\n\n" .
            "Name: $firstName $lastName\n" .
            "Email: $email\n\n" .
            "Message:\n$message\n";
    $headers = "From: $email";

    // 5. Attempt to send email
    if (mail($to, $subject, $body, $headers)) {
        echo "✅ Message sent successfully. Thank you!";
    } else {
        echo "❌ Something went wrong. Please try again later.";
    }
} else {
    echo "⚠️ Invalid request.";
}
?>