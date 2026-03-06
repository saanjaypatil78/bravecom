/**
 * Password Security Utilities
 * - bcrypt hashing with 12 rounds
 * - Password validation
 * - Account lockout after 5 failed attempts
 */
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

// Configuration
const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

// Password validation
export interface PasswordValidation {
    valid: boolean;
    errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < MIN_PASSWORD_LENGTH) {
        errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Check failed login attempts
export async function checkFailedAttempts(userId: string): Promise<{
    locked: boolean;
    remainingAttempts: number;
    lockedUntil?: Date;
}> {
    try {
        const { data: user } = await supabase
            .from('user_profiles')
            .select('failed_login_attempts, locked_until')
            .eq('id', userId)
            .single();

        if (!user) {
            return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
        }

        const failedAttempts = user.failed_login_attempts || 0;
        const lockedUntil = user.locked_until ? new Date(user.locked_until) : null;

        // Check if still locked
        if (lockedUntil && lockedUntil > new Date()) {
            return { locked: true, remainingAttempts: 0, lockedUntil };
        }

        return {
            locked: false,
            remainingAttempts: MAX_FAILED_ATTEMPTS - failedAttempts
        };
    } catch (error) {
        console.error('[Password] Failed to check attempts:', error);
        return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
    }
}

// Record failed login attempt
export async function recordFailedAttempt(userId: string): Promise<void> {
    try {
        const { data: user } = await supabase
            .from('user_profiles')
            .select('failed_login_attempts')
            .eq('id', userId)
            .single();

        const attempts = (user?.failed_login_attempts || 0) + 1;

        let updateData: Record<string, unknown> = { failed_login_attempts: attempts };

        // Lock account if max attempts reached
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
            updateData.locked_until = lockUntil.toISOString();
        }

        await supabase
            .from('user_profiles')
            .update(updateData)
            .eq('id', userId);
    } catch (error) {
        console.error('[Password] Failed to record attempt:', error);
    }
}

// Reset failed attempts after successful login
export async function resetFailedAttempts(userId: string): Promise<void> {
    try {
        await supabase
            .from('user_profiles')
            .update({
                failed_login_attempts: 0,
                locked_until: null
            })
            .eq('id', userId);
    } catch (error) {
        console.error('[Password] Failed to reset attempts:', error);
    }
}

// Generate password reset token
export function generateResetToken(): string {
    return crypto.randomUUID() + '-' + Date.now().toString(36);
}

// Hash reset token
export async function hashResetToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
}

// Create password reset
export async function createPasswordReset(userId: string): Promise<{
    token: string;
    hashedToken: string;
    expiresAt: Date;
} | null> {
    try {
        const token = generateResetToken();
        const hashedToken = await hashResetToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await supabase
            .from('password_resets')
            .insert({
                user_id: userId,
                token: hashedToken,
                expires_at: expiresAt.toISOString(),
                used: false,
            });

        return { token, hashedToken, expiresAt };
    } catch (error) {
        console.error('[Password] Failed to create reset:', error);
        return null;
    }
}

// Verify password reset token
export async function verifyPasswordResetToken(
    userId: string,
    token: string
): Promise<boolean> {
    try {
        const { data: reset } = await supabase
            .from('password_resets')
            .select('*')
            .eq('user_id', userId)
            .eq('used', false)
            .gte('expires_at', new Date().toISOString())
            .single();

        if (!reset) return false;

        return bcrypt.compare(token, reset.token);
    } catch (error) {
        console.error('[Password] Failed to verify token:', error);
        return false;
    }
}

// Mark reset token as used
export async function markResetTokenUsed(userId: string): Promise<void> {
    try {
        await supabase
            .from('password_resets')
            .update({ used: true })
            .eq('user_id', userId)
            .eq('used', false);
    } catch (error) {
        console.error('[Password] Failed to mark token used:', error);
    }
}
