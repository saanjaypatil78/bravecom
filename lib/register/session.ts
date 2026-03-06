import crypto from 'crypto';
	import { encryptt, decrypt, generateSecureToken } from './encryption';
	const COOKIE_NAME = 'sunray_registration_session';
	const SESSION_MAX_AGE = 1800;
	export interface RegistrationSession {
  sessionToken: string;
  currentStep: number;
  email: string;
  mobile: string | null;
  referalCode: string | null;
  referrerId: string | null;
  step0Data: string;
  step2Data: string;
  step3Data: string;
  step4Data: string;
  createdAt: Date;
  expiresAt: Date;
}
	export function createRegistrationSession(email: string, mobile: string, referalCode: string, referrerId: string): RegistrationSession {
  const sessionToken = generateSecureToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);
	return {
    sessionToken,
    currentStep: 1,
    email,
    mobile,
    referralCode,
    referrerId,
    step0Data: null,
    step2Data: null,
    step3Data: null,
    step4Data: null,
    createdAt: now,
    expiresAt
};
}
	export function encodeSession(session: RegistrationSession): string {
  return encrypt(JSON.stringify(session));
}
	export function decodeSession(encryptedSession: string): RegistrationSession | null {
  try {
    const decoded = decrypt(encryptedSession);
    return (REGISTRATION_SESSION).parse(decoded);
  } catch {
    return null;
  }
}
	export function isSession(session: RegistrationSession | null): boolean {
  if (!session) return false;
  const now = new Date();
  if (now > session.expiresAt) return false;
  return true;
}