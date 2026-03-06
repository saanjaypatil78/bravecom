/**
 * Supabase Query Helpers — Vendor Management
 */
import { createSupabaseServerClient, createSupabaseAdminClient } from '../server';
import type {
    VendorRow,
    VendorInsert,
    VendorUpdate,
    VendorProductRow,
    VendorProductInsert,
    VendorProductUpdate,
    VendorOrderRow,
    VendorOrderUpdate,
    VendorSettlementRow,
    PaginatedResult,
    SupabaseResult,
} from '../types';

// ──────────────────────────── VENDORS ────────────────────────────────────────

export async function getVendorByUserId(userId: string): Promise<SupabaseResult<VendorRow>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', userId)
        .single();
    return { data, error: error?.message ?? null };
}

export async function getVendorById(vendorId: string): Promise<SupabaseResult<VendorRow>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();
    return { data, error: error?.message ?? null };
}

export async function createVendor(vendor: VendorInsert): Promise<SupabaseResult<VendorRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('vendors')
        .insert({ ...vendor, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function updateVendor(vendorId: string, updates: VendorUpdate): Promise<SupabaseResult<VendorRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('vendors')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', vendorId)
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function approveVendor(vendorId: string, approverId: string): Promise<SupabaseResult<VendorRow>> {
    return updateVendor(vendorId, {
        status: 'APPROVED',
        approved_at: new Date().toISOString(),
        approved_by: approverId,
    });
}

/** Public catalog — approved vendors with active products */
export async function getApprovedVendors(options: {
    tier?: VendorRow['tier'];
    search?: string;
    page?: number;
    limit?: number;
} = {}): Promise<PaginatedResult<VendorRow>> {
    const supabase = createSupabaseServerClient();
    const { tier, search, page = 1, limit = 20 } = options;
    const from = (page - 1) * limit;

    let query = supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('status', 'APPROVED')
        .order('approved_at', { ascending: false });

    if (tier) query = query.eq('tier', tier);
    if (search) query = query.ilike('business_name', `%${search}%`);
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

// ─────────────────────── VENDOR PRODUCTS ─────────────────────────────────────

export async function getVendorProducts(
    vendorId: string,
    options: { status?: VendorProductRow['status']; category?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResult<VendorProductRow>> {
    const supabase = createSupabaseServerClient();
    const { status, category, page = 1, limit = 50 } = options;
    const from = (page - 1) * limit;

    let query = supabase
        .from('vendor_products')
        .select('*', { count: 'exact' })
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
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

export async function createVendorProduct(
    product: VendorProductInsert
): Promise<SupabaseResult<VendorProductRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('vendor_products')
        .insert({ ...product, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function updateVendorProduct(
    productId: string,
    vendorId: string,
    updates: VendorProductUpdate
): Promise<SupabaseResult<VendorProductRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('vendor_products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .eq('vendor_id', vendorId)
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

export async function deleteVendorProduct(productId: string, vendorId: string): Promise<SupabaseResult<null>> {
    const admin = createSupabaseAdminClient();
    // Check for existing orders first
    const { data: orders } = await admin
        .from('vendor_orders')
        .select('id')
        .eq('product_id', productId)
        .limit(1);

    if (orders && orders.length > 0) {
        // Soft delete
        const { error } = await admin
            .from('vendor_products')
            .update({ status: 'INACTIVE', updated_at: new Date().toISOString() })
            .eq('id', productId)
            .eq('vendor_id', vendorId);
        return { data: null, error: error?.message ?? null };
    }

    const { error } = await admin
        .from('vendor_products')
        .delete()
        .eq('id', productId)
        .eq('vendor_id', vendorId);
    return { data: null, error: error?.message ?? null };
}

// ────────────────────────── VENDOR ORDERS ────────────────────────────────────

export async function getVendorOrders(
    vendorId: string,
    options: {
        status?: VendorOrderRow['status'];
        paymentStatus?: VendorOrderRow['payment_status'];
        page?: number;
        limit?: number;
    } = {}
): Promise<PaginatedResult<VendorOrderRow>> {
    const supabase = createSupabaseServerClient();
    const { status, paymentStatus, page = 1, limit = 50 } = options;
    const from = (page - 1) * limit;

    let query = supabase
        .from('vendor_orders')
        .select('*', { count: 'exact' })
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (paymentStatus) query = query.eq('payment_status', paymentStatus);
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

export async function updateVendorOrder(
    orderId: string,
    vendorId: string,
    updates: VendorOrderUpdate
): Promise<SupabaseResult<VendorOrderRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('vendor_orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('vendor_id', vendorId)
        .select()
        .single();
    return { data, error: error?.message ?? null };
}

// ─────────────────────── VENDOR SETTLEMENTS ──────────────────────────────────

export async function getVendorSettlements(
    vendorId: string
): Promise<SupabaseResult<VendorSettlementRow[]>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('vendor_settlements')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });
    return { data, error: error?.message ?? null };
}

export async function getVendorStats(vendorId: string): Promise<SupabaseResult<{
    orderCount: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    pendingPayout: number;
    activeProducts: number;
}>> {
    const admin = createSupabaseAdminClient();
    const [ordersResult, productsResult, settlementsResult] = await Promise.all([
        admin.from('vendor_orders').select('status, total_amount, vendor_payout').eq('vendor_id', vendorId),
        admin.from('vendor_products').select('status').eq('vendor_id', vendorId),
        admin.from('vendor_settlements').select('status, amount_payable').eq('vendor_id', vendorId),
    ]);

    const orders = ordersResult.data ?? [];
    const products = productsResult.data ?? [];
    const settlements = settlementsResult.data ?? [];

    return {
        data: {
            orderCount: orders.length,
            pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
            completedOrders: orders.filter((o) => o.status === 'DELIVERED').length,
            totalRevenue: orders.reduce((s, o) => s + Number(o.total_amount ?? 0), 0),
            pendingPayout: settlements
                .filter((s) => s.status === 'PENDING')
                .reduce((acc, s) => acc + Number(s.amount_payable ?? 0), 0),
            activeProducts: products.filter((p) => p.status === 'ACTIVE').length,
        },
        error: ordersResult.error?.message ?? null,
    };
}
