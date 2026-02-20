import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // MUST be true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add these specific timeout extensions
  connectionTimeout: 30000, 
  greetingTimeout: 30000,
  socketTimeout: 30000,
  debug: true,
  logger: true,
});

export const sendEmail = async ({ to, otp, subject }) => {

  let title = "Verify your Avenza sign-up";
  let description = "We received a sign-up attempt with the following code. Please enter it in the browser window where you started signing up.";

  // Change content for password reset
  if (subject === "Password Reset OTP") {
    title = "Reset your Avenza password";
    description =
      "We received a request to reset your password. Enter the following OTP to create a new password.";
  }

  const htmlContent = emailTemplate
    .replace("{{title}}", title)
    .replace("{{description}}", description)
    .replace("{{otp}}", otp);

  await transporter.sendMail({
    from: `"Avenza" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });
};


const emailTemplate = `
    <!-- Container -->
    <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff; border-radius:10px; padding:10px; box-shadow:0 2px 6px rgba(0,0,0,0.05); font-family: sans-serif;">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" valign="middle" style="padding-right:8px;">
                  <img 
                    src="https://lh3.googleusercontent.com/a/ACg8ocKMIxngFoJs9eFdVBRz7a_LTrA9tFBFUDy82GQp0hQKXIzGbE8=s360-c-no"
                    alt="Avenza Logo"
                    width="35"
                    height="35"
                    style="border-radius:50%; display:block;"
                  />
                </td>
                <td align="center" valign="middle">
                  <span style="color:#6d28d9; font-size:30px; font-weight:bold; font-family:sans-serif;">
                    Avenza
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Title -->
        <tr>
            <td align="center">
                <h1 style="padding-top:20px; margin: 0; font-size:22px; color:#111827;">
                    {{title}}
                </h1>
            </td>
        </tr>

        <!-- Description -->
        <tr>
            <td align="center" style="padding:15px 20px 25px 20px;">
                <p style="margin:0; font-size:14px; color:#000; line-height:1.6;">
                    {{description}}
                </p>
            </td>
        </tr>

        <!-- OTP Box -->
        <tr>
            <td align="center">
                <div style="
            background:#f3f4f6;
            padding:20px;
            border-radius:8px;
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            color:#111827;
            display:inline-block;
            min-width:220px;
          ">
                    {{otp}}
                </div>
            </td>
        </tr>

        <!-- Note -->
        <tr>
            <td align="center" style="padding:25px 20px;">
                <p style="margin:0; font-size:13px; color:#6b7280;">
                    If you did not request this email, you can safely ignore it.
                    This code will expire in <b>5 minutes</b>.
                </p>
            </td>
        </tr>

        <!-- Divider -->
        <tr>
            <td>
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:10px 0;">
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding-top:10px;">
                <p style="font-size:12px; color:#9ca3af; margin:0;">
                    © 2026 Avenza. All rights reserved.
                </p>
            </td>
        </tr>

    </table>
    <!-- End Container -->

    </td>
    </tr>
`;
