export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

    <div style="background:linear-gradient(135deg,#4CAF50,#2e7d32); padding:25px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:22px;">Verify Your Email</h1>
    </div>

    <div style="padding:30px; color:#333;">
      <p>Hello,</p>
      <p>Thank you for signing up! Use the verification code below:</p>

      <div style="text-align:center; margin:30px 0;">
        <div style="display:inline-block; font-size:34px; letter-spacing:6px; font-weight:bold; color:#2e7d32;">
          {verificationCode}
        </div>
      </div>

      <p>Enter this code on the verification page to complete your registration.</p>
      <p style="color:#777;">This code will expire in a few minutes for security reasons.</p>

      <p>If this wasn’t you, ignore this email.</p>

      <p>Best regards,<br><strong>Your App Team</strong></p>
    </div>

    <div style="text-align:center; padding:15px; font-size:12px; color:#999;">
      This is an automated message, please do not reply.
    </div>

  </div>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset Successful</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial,sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

    <div style="background:linear-gradient(135deg,#4CAF50,#2e7d32); padding:25px; text-align:center;">
      <h1 style="color:#fff; margin:0;">Password Reset Successful</h1>
    </div>

    <div style="padding:30px;">
      <p>Hello,</p>
      <p>Your password has been successfully reset.</p>

      <div style="text-align:center; margin:25px 0;">
        <div style="width:60px; height:60px; background:#4CAF50; color:#fff; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:28px;">
          ✓
        </div>
      </div>

      <p>If this wasn’t you, contact support immediately.</p>

      <p><strong>Security tips:</strong></p>
      <ul>
        <li>Use a strong password</li>
        <li>Enable 2FA if possible</li>
        <li>Don’t reuse passwords</li>
      </ul>

      <p>Stay safe,<br><strong>Your App Team</strong></p>
    </div>

    <div style="text-align:center; padding:15px; font-size:12px; color:#999;">
      This is an automated message, please do not reply.
    </div>

  </div>
</body>
</html>
`;


export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial,sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

    <div style="background:linear-gradient(135deg,#4CAF50,#2e7d32); padding:25px; text-align:center;">
      <h1 style="color:#fff; margin:0;">Reset Your Password</h1>
    </div>

    <div style="padding:30px;">
      <p>Hello,</p>
      <p>We received a request to reset your password.</p>

      <div style="text-align:center; margin:30px 0;">
        <a href="{resetURL}" style="background:#4CAF50; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px; font-weight:bold;">
          Reset Password
        </a>
      </div>

      <p style="color:#777;">This link will expire in 2 minutes for security reasons.</p>

      <p>If you didn’t request this, ignore this email.</p>

      <p>Best regards,<br><strong>Your App Team</strong></p>
    </div>

    <div style="text-align:center; padding:15px; font-size:12px; color:#999;">
      This is an automated message, please do not reply.
    </div>

  </div>
</body>
</html>
`;


export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial,sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

    <div style="background:linear-gradient(135deg,#4CAF50,#2e7d32); padding:25px; text-align:center;">
      <h1 style="color:#fff; margin:0;">Welcome 🎉</h1>
    </div>

    <div style="padding:30px;">
      <p>Hello,</p>

      <p>Welcome to our platform! We're excited to have you here.</p>

      <p>You can now explore all features and get started right away.</p>

      <div style="text-align:center; margin:25px 0;">
        <div style="font-size:40px;">🎉</div>
      </div>

      <p>Best regards,<br><strong>Your App Team</strong></p>
    </div>

    <div style="text-align:center; padding:15px; font-size:12px; color:#999;">
      This is an automated message, please do not reply.
    </div>

  </div>
</body>
</html>
`;