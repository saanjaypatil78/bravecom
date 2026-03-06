import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const gmailEmail = process.env.GMAIL_EMAIL;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  // Only create transporter if credentials are configured
  if (gmailEmail && gmailPassword && gmailEmail !== "your-email@gmail.com") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });
  }

  return transporter;
}

async function sendOTPEmail(to: string, otp: string, name: string): Promise<{ success: boolean; message: string; debugOTP?: string }> {
  const transporter = getTransporter();
  
  // Development mode fallback - no email configured
  if (!transporter) {
    console.log(`\n`);
    console.log(`═══════════════════════════════════════`);
    console.log(`🔐 OTP for ${to}: ${otp}`);
    console.log(`═══════════════════════════════════════`);
    console.log(`\n`);
    
    return {
      success: true,
      message: "OTP generated (Development Mode - check console)",
      debugOTP: otp
    };
  }

  try {
    await transporter.sendMail({
      from: `"BRAVECOM" <${process.env.GMAIL_EMAIL}>`,
      to: to,
      subject: "Your BRAVECOM OTP Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0f1a; margin: 0; padding: 20px; }
            .container { max-width: 480px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #d946ef, #3b82f6); padding: 30px; text-align: center; }
            .logo { color: white; font-size: 24px; font-weight: bold; letter-spacing: 3px; }
            .content { padding: 30px; text-align: center; }
            .title { color: white; font-size: 22px; margin-bottom: 20px; }
            .otp-box { background: rgba(255,255,255,0.1); border: 2px solid #d946ef; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .otp { color: #d946ef; font-size: 36px; font-weight: bold; letter-spacing: 12px; }
            .note { color: #94a3b8; font-size: 13px; margin-top: 20px; }
            .footer { background: #0f0f1a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BRAVECOM</div>
            </div>
            <div class="content">
              <div class="title">Verify Your Email</div>
              <p style="color: #94a3b8;">Hi ${name},</p>
              <p style="color: #94a3b8;">Use this OTP to verify your email:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p class="note">Valid for 10 minutes</p>
            </div>
            <div class="footer">
              <p>© 2026 Brave Ecom Pvt Ltd</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, message: "OTP sent to email" };
  } catch (error) {
    console.error("[GMAIL ERROR]", error);
    return { success: false, message: "Email service error" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, name } = body;

    if (action === "send") {
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email is required" },
          { status: 400 }
        );
      }

      const identifier = email.toLowerCase();
      const existing = otpStore.get(identifier);

      if (existing && existing.attempts >= 5) {
        return NextResponse.json(
          { success: false, message: "Too many attempts. Try again after 1 hour." },
          { status: 429 }
        );
      }

      if (existing && Date.now() < existing.expiresAt - 60000 * 5) {
        const remaining = Math.ceil((existing.expiresAt - 60000 * 5 - Date.now()) / 1000);
        return NextResponse.json(
          { success: false, message: `Wait ${remaining} seconds` },
          { status: 429 }
        );
      }

      const otp = generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      otpStore.set(identifier, {
        otp,
        expiresAt,
        attempts: existing ? existing.attempts + 1 : 1,
      });

      const userName = name || email.split("@")[0];
      const result = await sendOTPEmail(email, otp, userName);

      // In development, always return success with debug OTP
      if (!getTransporter() || result.success) {
        return NextResponse.json({
          success: true,
          message: result.message,
          debugOTP: result.debugOTP,
        });
      }

      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    if (action === "verify") {
      const { identifier, otp } = body;

      if (!identifier || !otp) {
        return NextResponse.json(
          { success: false, message: "Identifier and OTP required" },
          { status: 400 }
        );
      }

      const key = identifier.toLowerCase();
      const stored = otpStore.get(key);

      if (!stored) {
        return NextResponse.json(
          { success: false, message: "OTP expired or not requested" },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(key);
        return NextResponse.json(
          { success: false, message: "OTP expired" },
          { status: 400 }
        );
      }

      if (stored.otp !== otp) {
        return NextResponse.json(
          { success: false, message: "Invalid OTP" },
          { status: 400 }
        );
      }

      otpStore.delete(key);

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[OTP API Error]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
