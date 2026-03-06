/**
 * Prisma DB Layer — Mall Product Queries
 * Provides pagination, filtering, search, and category-based queries
 */

import { PrismaClient } from '@prisma/client';

// Use singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
    categoryId?: string;
    subCategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    isTrending?: boolean;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'discount';
}

export interface PaginatedProducts {
    products: MallProductWithCategory[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface MallProductWithCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    price: number;
    mrp: number;
    discount: number;
    images: string[];   // parsed from JSON
    badge: string | null;
    rating: number;
    reviewCount: number;
    seller: string;
    stock: string;
    tags: string[];     // parsed from JSON
    specs: Record<string, string>; // parsed from JSON
    isFeatured: boolean;
    isTrending: boolean;
    categoryName: string;
    categorySlug: string;
    subCategoryName: string;
    subCategorySlug: string;
}

// ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

/**
 * Get paginated products with filters
 */
export async function getProducts(
    page: number = 1,
    pageSize: number = 24,
    filters: ProductFilters = {}
): Promise<PaginatedProducts> {
    const where: Record<string, unknown> = {};

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.subCategoryId) where.subCategoryId = filters.subCategoryId;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isTrending !== undefined) where.isTrending = filters.isTrending;

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) (where.price as Record<string, number>).gte = filters.minPrice;
        if (filters.maxPrice) (where.price as Record<string, number>).lte = filters.maxPrice;
    }

    if (filters.search) {
        where.name = { contains: filters.search };
    }

    // Sort order
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (filters.sortBy) {
        case 'price_asc': orderBy = { price: 'asc' }; break;
        case 'price_desc': orderBy = { price: 'desc' }; break;
        case 'rating': orderBy = { rating: 'desc' }; break;
        case 'newest': orderBy = { createdAt: 'desc' }; break;
        case 'discount': orderBy = { discount: 'desc' }; break;
    }

    const [total, rawProducts] = await Promise.all([
        prisma.mallProduct.count({ where }),
        prisma.mallProduct.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                category: { select: { name: true, slug: true } },
                subCategory: { select: { name: true, slug: true } },
            },
        }),
    ]);

    const products: MallProductWithCategory[] = rawProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount,
        images: safeParseJSON(p.images, []),
        badge: p.badge,
        rating: p.rating,
        reviewCount: p.reviewCount,
        seller: p.seller,
        stock: p.stock,
        tags: safeParseJSON(p.tags, []),
        specs: safeParseJSON(p.specs, {}),
        isFeatured: p.isFeatured,
        isTrending: p.isTrending,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        subCategoryName: p.subCategory.name,
        subCategorySlug: p.subCategory.slug,
    }));

    return {
        products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

/**
 * Get featured products for the dashboard
 */
export async function getFeaturedProducts(limit: number = 8): Promise<MallProductWithCategory[]> {
    const result = await getProducts(1, limit, { isFeatured: true, sortBy: 'rating' });
    return result.products;
}

/**
 * Get trending products
 */
export async function getTrendingProducts(limit: number = 12): Promise<MallProductWithCategory[]> {
    const result = await getProducts(1, limit, { isTrending: true, sortBy: 'newest' });
    return result.products;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<MallProductWithCategory | null> {
    const p = await prisma.mallProduct.findUnique({
        where: { id },
        include: {
            category: { select: { name: true, slug: true } },
            subCategory: { select: { name: true, slug: true } },
        },
    });

    if (!p) return null;

    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount,
        images: safeParseJSON(p.images, []),
        badge: p.badge,
        rating: p.rating,
        reviewCount: p.reviewCount,
        seller: p.seller,
        stock: p.stock,
        tags: safeParseJSON(p.tags, []),
        specs: safeParseJSON(p.specs, {}),
        isFeatured: p.isFeatured,
        isTrending: p.isTrending,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        subCategoryName: p.subCategory.name,
        subCategorySlug: p.subCategory.slug,
    };
}

/**
 * Get all categories with product counts
 */
export async function getCategories() {
    const categories = await prisma.mallCategory.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: { select: { products: true } },
            subCategories: {
                orderBy: { sortOrder: 'asc' },
                include: {
                    _count: { select: { products: true } },
                },
            },
        },
    });

    return categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        imageUrl: c.imageUrl,
        productCount: c._count.products,
        subCategories: c.subCategories.map((s) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            description: s.description,
            imageUrl: s.imageUrl,
            productCount: s._count.products,
        })),
    }));
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(
    categorySlug: string,
    page: number = 1,
    pageSize: number = 24
): Promise<PaginatedProducts> {
    const category = await prisma.mallCategory.findUnique({
        where: { slug: categorySlug },
    });

    if (!category) return { products: [], total: 0, page, pageSize, totalPages: 0 };

    return getProducts(page, pageSize, { categoryId: category.id });
}

/**
 * Search products by name
 */
export async function searchProducts(
    query: string,
    page: number = 1,
    pageSize: number = 24
): Promise<PaginatedProducts> {
    return getProducts(page, pageSize, { search: query });
}

/**
 * Get related products (same subcategory, different product)
 */
export async function getRelatedProducts(
    productId: string,
    limit: number = 6
): Promise<MallProductWithCategory[]> {
    const product = await prisma.mallProduct.findUnique({
        where: { id: productId },
        select: { subCategoryId: true },
    });

    if (!product) return [];

    const result = await getProducts(1, limit, { subCategoryId: product.subCategoryId });
    return result.products.filter((p) => p.id !== productId);
}

/**
 * Get marketplace stats
 */
export async function getMarketplaceStats() {
    const [totalProducts, totalCategories, totalSubCategories, featuredCount, trendingCount] = await Promise.all([
        prisma.mallProduct.count(),
        prisma.mallCategory.count(),
        prisma.mallSubCategory.count(),
        prisma.mallProduct.count({ where: { isFeatured: true } }),
        prisma.mallProduct.count({ where: { isTrending: true } }),
    ]);

    return { totalProducts, totalCategories, totalSubCategories, featuredCount, trendingCount };
}

// ─── UTILS ──────────────────────────────────────────────────────────────────

function safeParseJSON<T>(val: string | null | undefined, fallback: T): T {
    if (!val) return fallback;
    try { return JSON.parse(val); } catch { return fallback; }
}
