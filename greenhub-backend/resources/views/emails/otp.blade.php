<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div
        style="font-family: Arial, sans-serif; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #84cc16;">Greenhub Platform</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the code below to proceed. This code is valid for **10
            minutes**.</p>

        <div
            style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #374151;">
            {{ $otp }}
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            If you did not request this, please ignore this email.
        </p>
    </div>
</body>

</html>
