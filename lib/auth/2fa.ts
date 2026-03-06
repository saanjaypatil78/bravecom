/**
 * Two-Factor Authentication (2FA) Implementation
 * TOTP-based 2FA using speakeasy
 */
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

// Types
export interface TwoFactorSetup {
    secret: string;
    qrCode: string;
    backupCodes: string[];
}

export interface TwoFactorVerify {
    valid: boolean;
    message: string;
}

// Generate 2FA setup for user
export async function generateTwoFactorSetup(userId: string, email: string): Promise<TwoFactorSetup | null> {
    try {
        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `BRAVECOM Sunray:${email}`,
            issuer: 'BRAVECOM',
            length: 20,
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

        // Generate backup codes
        const backupCodes = generateBackupCodes(8);

        // Store encrypted secret in database
        const { error } = await supabase
            .from('user_profiles')
            .update({
                two_factor_secret: secret.base32,
                two_factor_backup_codes: backupCodes,
                two_factor_enabled: false, // Not enabled until verified
            })
            .eq('id', userId);

        if (error) {
            console.error('[2FA] Failed to store secret:', error);
            return null;
        }

        return {
            secret: secret.base32,
            qrCode,
            backupCodes,
        };
    } catch (error) {
        console.error('[2FA] Setup generation failed:', error);
        return null;
    }
}

// Verify 2FA code
export function verifyTwoFactorCode(secret: string, token: string): TwoFactorVerify {
    try {
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1, // Allow 1 step before/after for clock drift
        });

        if (verified) {
            return { valid: true, message: 'Code verified successfully' };
        }
        return { valid: false, message: 'Invalid verification code' };
    } catch (error) {
        console.error('[2FA] Verification failed:', error);
        return { valid: false, message: 'Verification error' };
    }
}

// Verify backup code
export function verifyBackupCode(storedCodes: string[], providedCode: string): { valid: boolean; remainingCodes: string[] } {
    const codeIndex = storedCodes.findIndex(code => code === providedCode);

    if (codeIndex === -1) {
        return { valid: false, remainingCodes: storedCodes };
    }

    // Remove used backup code
    const remainingCodes = storedCodes.filter((_, index) => index !== codeIndex);
    return { valid: true, remainingCodes };
}

// Enable 2FA after verification
export async function enableTwoFactor(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_profiles')
            .update({ two_factor_enabled: true })
            .eq('id', userId);

        if (error) {
            console.error('[2FA] Enable failed:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('[2FA] Enable error:', error);
        return false;
    }
}

// Disable 2FA
export async function disableTwoFactor(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_profiles')
            .update({
                two_factor_enabled: false,
                two_factor_secret: null,
                two_factor_backup_codes: null,
            })
            .eq('id', userId);

        if (error) {
            console.error('[2FA] Disable failed:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('[2FA] Disable error:', error);
        return false;
    }
}

// Get 2FA status
export async function getTwoFactorStatus(userId: string): Promise<{ enabled: boolean; hasSecret: boolean }> {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('two_factor_enabled, two_factor_secret')
            .eq('id', userId)
            .single();

        if (error || !data) {
            return { enabled: false, hasSecret: false };
        }

        return {
            enabled: data.two_factor_enabled || false,
            hasSecret: !!data.two_factor_secret,
        };
    } catch (error) {
        console.error('[2FA] Status check failed:', error);
        return { enabled: false, hasSecret: false };
    }
}

// Generate backup codes
function generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        codes.push(code);
    }
    return codes;
}
