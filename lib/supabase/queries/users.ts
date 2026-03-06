/**
 * Supabase Query Helpers — User Profiles & KYC
 */
import { createSupabaseServerClient, createSupabaseAdminClient } from '../server';
import type {
    UserProfileRow,
    UserProfileInsert,
    UserProfileUpdate,
    KYCDocumentRow,
    SupabaseResult,
} from '../types';

// ─────────────────────── USER PROFILES ───────────────────────────────────────

export async function getUserProfile(userId: string): Promise<SupabaseResult<UserProfileRow>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error: error?.message ?? null };
}

export async function getUserProfileByEmail(email: string): Promise<SupabaseResult<UserProfileRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();
    return { data, error: error?.message ?? null };
}

export async function getUserProfileByReferralCode(code: string): Promise<SupabaseResult<UserProfileRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('user_profiles')
        .select('id, email, full_name, referral_code, role')
        .eq('referral_code', code)
        .single();
    return { data, error: error?.message ?? null };
}

export async function createUserProfile(profile: UserProfileInsert): Promise<SupabaseResult<UserProfileRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('user_profiles')
        .insert({ ...profile, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function updateUserProfile(
    userId: string,
    updates: UserProfileUpdate
): Promise<SupabaseResult<UserProfileRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function upsertUserProfile(profile: UserProfileInsert): Promise<SupabaseResult<UserProfileRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('user_profiles')
        .upsert({ ...profile, updated_at: new Date().toISOString() }, { onConflict: 'id' })
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

/** Wallet debit / credit using atomic RPC */
export async function adjustWalletBalance(
    userId: string,
    amount: number,
    operation: 'credit' | 'debit'
): Promise<SupabaseResult<{ new_balance: number }>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.rpc('adjust_wallet_balance', {
        p_user_id: userId,
        p_amount: Math.abs(amount),
        p_operation: operation,
    });
    return { data, error: error?.message ?? null };
}

export async function incrementFailedLoginAttempts(userId: string): Promise<SupabaseResult<null>> {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.rpc('increment_failed_login', { p_user_id: userId });
    return { data: null, error: error?.message ?? null };
}

export async function resetFailedLoginAttempts(userId: string): Promise<SupabaseResult<null>> {
    const admin = createSupabaseAdminClient();
    const { error } = await admin
        .from('user_profiles')
        .update({ failed_login_attempts: 0, locked_until: null, updated_at: new Date().toISOString() })
        .eq('id', userId);
    return { data: null, error: error?.message ?? null };
}

// ─────────────────────────── KYC DOCUMENTS ───────────────────────────────────

export async function getKYCDocuments(userId: string): Promise<SupabaseResult<KYCDocumentRow[]>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data, error: error?.message ?? null };
}

export async function submitKYCDocument(doc: {
    userId: string;
    documentType: string;
    documentUrl: string;
    documentNumber?: string;
}): Promise<SupabaseResult<KYCDocumentRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('kyc_documents')
        .insert({
            user_id: doc.userId,
            document_type: doc.documentType,
            document_url: doc.documentUrl,
            document_number: doc.documentNumber ?? null,
            verification_status: 'PENDING',
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (!error) {
        // Update user KYC status to "pending"
        await admin
            .from('user_profiles')
            .update({ kyc_status: 'pending', updated_at: new Date().toISOString() })
            .eq('id', doc.userId);
    }

    return { data, error: error?.message ?? null };
}

export async function verifyKYCDocument(
    docId: string,
    verifierId: string,
    approved: boolean
): Promise<SupabaseResult<KYCDocumentRow>> {
    const admin = createSupabaseAdminClient();
    const status = approved ? 'APPROVED' : 'REJECTED';
    const { data, error } = await admin
        .from('kyc_documents')
        .update({ verification_status: status, verified_at: new Date().toISOString(), verified_by: verifierId })
        .eq('id', docId)
        .select('*, user_id')
        .single();

    if (!error && data) {
        const kycStatus = approved ? 'approved' : 'rejected';
        await admin
            .from('user_profiles')
            .update({ kyc_status: kycStatus, updated_at: new Date().toISOString() })
            .eq('id', data.user_id);
    }

    return { data, error: error?.message ?? null };
}

// ─────────────────────────── ADMIN USER LIST ─────────────────────────────────

export async function listUsers(options: {
    role?: string;
    kycStatus?: string;
    page?: number;
    limit?: number;
    search?: string;
} = {}) {
    const admin = createSupabaseAdminClient();
    const { role, kycStatus, page = 1, limit = 50, search } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = admin
        .from('user_profiles')
        .select('id, email, full_name, role, kyc_status, member_status, member_tier, wallet_balance, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (role) query = query.eq('role', role);
    if (kycStatus) query = query.eq('kyc_status', kycStatus);
    if (search) query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    query = query.range(from, to);

    const { data, error, count } = await query;
    return {
        data: data ?? [],
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
        error: error?.message ?? null,
    };
}
