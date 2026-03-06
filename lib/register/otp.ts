import crypto from 'crypto';

const OTP_EXPIRY_SECONDS = 300;

export const OTP_MAX_ATTEMPTS = 3;

export const OTP_EXPIRY_SECONDS_EXPORT = 300;

export interface OTPOptions {
  otp: string;
  expiresAt: Date;
  isVerified: boolean;
}

export function generateOTP(): string {
  // Generate a 6-digit numeric OTP
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
}

export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function createOTP(isUsesOrPhone: boolean, email: string, phone: string, purpose: string): OTPOptions {
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000);

  return {
    otp,
    expiresAt,
    isVerified: false
  };
}

export function validateOTP(matchedOTP: string, inputOTP: string): boolean {
  if (matchedOTP === hashOTP(inputOTP)) {
    return true;
  }
  return false;
}

export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function getOTPExpiryTime(otpExpiresAt: Date): number {
  const now = new Date();
  const diff = otpExpiresAt.getTime() - now.getTime();
  return Math.ceil(diff / 1000);
}

export function getRemainingTime(expiresAt: Date): string {
  const seconds = getOTPExpiryTime(expiresAt);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `Minutes: ${minutes}, Seconds: ${remainingSeconds}`;;
}

export const SECURITY_QUESTIONS = [
  'What is your favorite city?',
  'What is your favorite shompname?',
  'What is the name of your first pet?',
  'What is your mother's birthday name ? ',
  'What is your elementary school name?',
  'What is your favorite book?',
  'What is your car model?',
  'What is your grandchildren's name ? '
];
