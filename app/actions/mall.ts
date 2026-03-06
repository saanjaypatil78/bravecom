'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Product, Category } from '@/types/mall';
import { cacheGet, cacheSet } from '@/lib/cache/upstash-free-tier';

const CACHE_TTL = 3600; // 1 hour

/**
 * Fetches all categories from Supabase with Caching
 */
export async function getCategories(): Promise<Category[]> {
    const cacheKey = 'mall:categories';
    const cached = await cacheGet(cacheKey);
    if (cached) return cached as Category[];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories from Supabase:', error);
        return [];
    }

    if (data && data.length > 0) {
        await cacheSet(cacheKey, data, CACHE_TTL);
    }
    return data as Category[];
}

/**
 * Fetches all products, optionally filtered by category id, with Caching
 */
export async function getProducts(categoryId?: string): Promise<Product[]> {
    const cacheKey = `mall:products:${categoryId || 'all'}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached as Product[];

    const supabase = await createSupabaseServerClient();
    let query = supabase.from('products').select('*');

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products from Supabase:', error);
        return [];
    }

    if (data && data.length > 0) {
        await cacheSet(cacheKey, data, CACHE_TTL);
    }
    return data as Product[];
}


/**
 * Fetches featured products specifically
 */
export async function getFeaturedProducts(): Promise<Product[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching featured products from Supabase:', error);
        return [];
    }

    return data as Product[];
}

/**
 * Helper to fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching product ${id} from Supabase:`, error);
        return null;
    }

    return data as Product;
}
