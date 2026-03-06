/**
 * Supabase Query Helpers — OTP Verification & Audit Logs
 */
import { createSupabaseAdminClient } from '../server';
import crypto from 'crypto';
import type { OTPVerificationRow, OTPVerificationInsert, AuditLogInsert, SupabaseResult } from '../types';

// ────────────────────────── OTP HELPERS ──────────────────────────────────────

const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 3;

function hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

function generate6DigitOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Create a new OTP — invalidates any existing OTPs for the same email+purpose */
export async function createOTP(
    email: string,
    phone: string,
    purpose: OTPVerificationRow['purpose']
): Promise<SupabaseResult<{ otp: string; expiresAt: Date }>> {
    const admin = createSupabaseAdminClient();
    const otp = generate6DigitOTP();
    const hashedOTP = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000);

    // Delete any existing OTPs for same email+purpose
    await admin
        .from('otp_verifications')
        .delete()
        .eq('email', email)
        .eq('purpose', purpose)
        .eq('verified', false);

    const payload: OTPVerificationInsert = {
        phone,
        email,
        otp_hash: hashedOTP,
        purpose,
        verified: false,
        attempts: 0,
        max_attempts: MAX_ATTEMPTS,
        expires_at: expiresAt.toISOString(),
    };

    const { error } = await admin.from('otp_verifications').insert(payload);

    if (error) return { data: null, error: error.message };
    return { data: { otp, expiresAt }, error: null };
}

/** Verify an OTP — returns 'valid' | 'invalid' | 'expired' | 'too_many_attempts' */
export async function verifyOTP(
    email: string,
    purpose: OTPVerificationRow['purpose'],
    inputOTP: string
): Promise<{ valid: boolean; reason?: string }> {
    const admin = createSupabaseAdminClient();

    const { data: record, error } = await admin
        .from('otp_verifications')
        .select('*')
        .eq('email', email)
        .eq('purpose', purpose)
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !record) return { valid: false, reason: 'not_found' };

    // Expired?
    if (new Date(record.expires_at) < new Date()) {
        return { valid: false, reason: 'expired' };
    }

    // Too many attempts?
    if (record.attempts >= record.max_attempts) {
        return { valid: false, reason: 'too_many_attempts' };
    }

    const isValid = record.otp_hash === hashOTP(inputOTP);

    if (isValid) {
        await admin
            .from('otp_verifications')
            .update({ verified: true })
            .eq('id', record.id);
        return { valid: true };
    } else {
        await admin
            .from('otp_verifications')
            .update({ attempts: record.attempts + 1 })
            .eq('id', record.id);
        return { valid: false, reason: 'invalid_code' };
    }
}

/** Check if a recent verified OTP exists (for step-continuation) */
export async function hasVerifiedOTP(
    email: string,
    purpose: OTPVerificationRow['purpose']
): Promise<boolean> {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
        .from('otp_verifications')
        .select('id')
        .eq('email', email)
        .eq('purpose', purpose)
        .eq('verified', true)
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // within 15 min
        .limit(1);
    return (data?.length ?? 0) > 0;
}

// ─────────────────────────── AUDIT LOGS ──────────────────────────────────────

export async function writeAuditLog(log: Omit<AuditLogInsert, 'id' | 'created_at'>): Promise<void> {
    try {
        const admin = createSupabaseAdminClient();
        await admin.from('audit_logs').insert({
            ...log,
            created_at: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[AuditLog] Failed to write audit log:', err);
    }
}

export async function getAuditLogs(options: {
    userId?: string;
    action?: string;
    from?: Date;
    limit?: number;
} = {}): Promise<SupabaseResult<AuditLogInsert[]>> {
    const admin = createSupabaseAdminClient();
    const { userId, action, from, limit = 100 } = options;

    let query = admin
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (userId) query = query.eq('user_id', userId);
    if (action) query = query.eq('action', action);
    if (from) query = query.gte('created_at', from.toISOString());

    const { data, error } = await query;
    return { data, error: error?.message ?? null };
}
