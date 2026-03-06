/**
 * Supabase Query Helpers — Mall (Products & Categories)
 * Server-safe: use createSupabaseServerClient() / createSupabaseAdminClient()
 */
import { createSupabaseServerClient, createSupabaseAdminClient } from '../server';
import type {
    CategoryRow,
    ProductRow,
    OrderRow,
    OrderItemRow,
    OrderInsert,
    OrderItemInsert,
    PaginatedResult,
    SupabaseResult,
} from '../types';

// ────────────────────────────── CATEGORIES ───────────────────────────────────

export async function getCategories(): Promise<SupabaseResult<CategoryRow[]>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
    return { data, error: error?.message ?? null };
}

export async function getCategoryBySlug(slug: string): Promise<SupabaseResult<CategoryRow>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
    return { data, error: error?.message ?? null };
}

// ─────────────────────────────── PRODUCTS ────────────────────────────────────

export async function getProducts(options: {
    categoryId?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    search?: string;
} = {}): Promise<PaginatedResult<ProductRow>> {
    const supabase = createSupabaseServerClient();
    const { categoryId, featured, page = 1, limit = 20, search } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (categoryId) query = query.eq('category_id', categoryId);
    if (featured !== undefined) query = query.eq('is_featured', featured);
    if (search) query = query.ilike('name', `%${search}%`);

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

export async function getProductById(id: string): Promise<SupabaseResult<ProductRow & { category?: CategoryRow }>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();
    return { data, error: error?.message ?? null };
}

export async function getFeaturedProducts(limit = 8): Promise<SupabaseResult<ProductRow[]>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);
    return { data, error: error?.message ?? null };
}

/** Decrement product stock on purchase — uses admin client to bypass RLS */
export async function decrementProductStock(productId: string, quantity: number): Promise<SupabaseResult<null>> {
    const admin = createSupabaseAdminClient();
    // Use RPC to do atomic decrement
    const { error } = await admin.rpc('decrement_product_stock', {
        p_product_id: productId,
        p_quantity: quantity,
    });
    return { data: null, error: error?.message ?? null };
}

// ─────────────────────────────── ORDERS ──────────────────────────────────────

export async function createOrder(
    orderData: OrderInsert,
    items: OrderItemInsert[]
): Promise<SupabaseResult<OrderRow>> {
    const admin = createSupabaseAdminClient();

    // Insert order
    const { data: order, error: orderError } = await admin
        .from('orders')
        .insert(orderData)
        .select()
        .single();

    if (orderError || !order) {
        return { data: null, error: orderError?.message ?? 'Order creation failed' };
    }

    // Insert order items
    const itemsWithOrderId = items.map((item) => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await admin.from('order_items').insert(itemsWithOrderId);

    if (itemsError) {
        return { data: null, error: itemsError.message };
    }

    return { data: order, error: null };
}

export async function getOrdersByUser(userId: string): Promise<SupabaseResult<(OrderRow & { items: OrderItemRow[] })[]>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(id, name, image_url, price))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data, error: error?.message ?? null };
}

export async function getOrderById(
    orderId: string,
    userId: string
): Promise<SupabaseResult<OrderRow & { items: OrderItemRow[] }>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(id, name, image_url, price))')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();
    return { data, error: error?.message ?? null };
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderRow['status']
): Promise<SupabaseResult<OrderRow>> {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
    return { data, error: error?.message ?? null };
}
