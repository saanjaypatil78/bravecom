/**
 * Supabase Query Helpers — Investments & Commission Ledger
 */
import { createSupabaseServerClient, createSupabaseAdminClient } from '../server';
import type {
    InvestmentRow,
    InvestmentInsert,
    CommissionLedgerRow,
    CommissionLedgerInsert,
    RankBonusRow,
    PaginatedResult,
    SupabaseResult,
} from '../types';

// ─────────────────────────── INVESTMENTS ─────────────────────────────────────

export async function getInvestmentsByUser(
    userId: string,
    options: { status?: InvestmentRow['status']; page?: number; limit?: number } = {}
): Promise<PaginatedResult<InvestmentRow>> {
    const supabase = createSupabaseServerClient();
    const { status, page = 1, limit = 20 } = options;
    const from = (page - 1) * limit;

    let query = supabase
        .from('investments')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    query = query.range(from, from + limit - 1);

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

export async function getInvestmentById(id: string, userId: string): Promise<SupabaseResult<InvestmentRow>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
    return { data, error: error?.message ?? null };
}

export async function createInvestment(investment: InvestmentInsert): Promise<SupabaseResult<InvestmentRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('investments')
        .insert({ ...investment, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function updateInvestmentStatus(
    id: string,
    status: InvestmentRow['status'],
    actualReturn?: number
): Promise<SupabaseResult<InvestmentRow>> {
    const admin = createSupabaseAdminClient();
    const updates: Partial<InvestmentRow> = { status, updated_at: new Date().toISOString() };
    if (actualReturn !== undefined) updates.actual_return = actualReturn;

    const { data, error } = await admin
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

/** Portfolio summary stats for dashboard */
export async function getInvestmentSummary(userId: string): Promise<SupabaseResult<{
    totalInvested: number;
    totalReturn: number;
    activeCount: number;
    maturedCount: number;
}>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('investments')
        .select('amount, actual_return, status')
        .eq('user_id', userId);

    if (error) return { data: null, error: error.message };

    const summary = (data ?? []).reduce(
        (acc, inv) => {
            acc.totalInvested += Number(inv.amount);
            acc.totalReturn += Number(inv.actual_return ?? 0);
            if (inv.status === 'ACTIVE') acc.activeCount++;
            if (inv.status === 'MATURED') acc.maturedCount++;
            return acc;
        },
        { totalInvested: 0, totalReturn: 0, activeCount: 0, maturedCount: 0 }
    );

    return { data: summary, error: null };
}

// ─────────────────────── COMMISSION LEDGER ───────────────────────────────────

export async function getCommissionsByUser(
    userId: string,
    options: { status?: CommissionLedgerRow['status']; page?: number; limit?: number } = {}
): Promise<PaginatedResult<CommissionLedgerRow>> {
    const supabase = createSupabaseServerClient();
    const { status, page = 1, limit = 30 } = options;
    const from = (page - 1) * limit;

    let query = supabase
        .from('commission_ledger')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    query = query.range(from, from + limit - 1);

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

export async function insertCommissionEntry(entry: CommissionLedgerInsert): Promise<SupabaseResult<CommissionLedgerRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('commission_ledger')
        .insert({ ...entry, created_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function releaseCommissions(commissionIds: string[]): Promise<SupabaseResult<null>> {
    const admin = createSupabaseAdminClient();
    const { error } = await admin
        .from('commission_ledger')
        .update({ status: 'RELEASED', released_at: new Date().toISOString() })
        .in('id', commissionIds)
        .eq('status', 'APPROVED');
    return { data: null, error: error?.message ?? null };
}

export async function getCommissionSummary(userId: string): Promise<SupabaseResult<{
    pending: number;
    approved: number;
    released: number;
    total: number;
}>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('commission_ledger')
        .select('status, commission_amount')
        .eq('user_id', userId);

    if (error) return { data: null, error: error.message };

    const summary = (data ?? []).reduce(
        (acc, entry) => {
            const amount = Number(entry.commission_amount);
            acc.total += amount;
            if (entry.status === 'PENDING') acc.pending += amount;
            else if (entry.status === 'APPROVED') acc.approved += amount;
            else if (entry.status === 'RELEASED') acc.released += amount;
            return acc;
        },
        { pending: 0, approved: 0, released: 0, total: 0 }
    );

    return { data: summary, error: null };
}

// ─────────────────────────── RANK BONUSES ────────────────────────────────────

export async function getRankBonusesByUser(userId: string): Promise<SupabaseResult<RankBonusRow[]>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('rank_bonuses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data, error: error?.message ?? null };
}
