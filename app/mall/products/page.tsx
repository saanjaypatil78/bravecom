import React from 'react';
import { getProducts, getProductsByCategory, getMarketplaceStats, getCategories } from '@/lib/db/products';
import ProductsClient from '../components/ProductsClient';

export const metadata = {
    title: "All Products | Brave Ecom Mall",
    description: "Discover trending products across Electronics, Fashion, Grocery, Home & Kitchen, Health & Beauty, and Premium Lifestyle.",
};

interface ProductPageProps {
    searchParams: Promise<{ category?: string; page?: string; search?: string }>;
}

export default async function ProductBrowseGrid({ searchParams }: ProductPageProps) {
    const params = await searchParams;
    const categorySlug = params.category || null;
    const page = parseInt(params.page || "1", 10);

    // Fetch products — filtered by category if specified
    const { products: dbProducts, total, totalPages } = categorySlug
        ? await getProductsByCategory(categorySlug, page, 24)
        : await getProducts(page, 24);

    const stats = await getMarketplaceStats();
    const categories = await getCategories();

    // Find the active category info
    const activeCategory = categorySlug
        ? categories.find((c: { slug: string }) => c.slug === categorySlug)
        : null;

    return (
        <ProductsClient
            products={dbProducts}
            total={total}
            totalPages={totalPages}
            totalProducts={stats.totalProducts}
            totalCategories={stats.totalCategories}
            activeCategorySlug={categorySlug}
            activeCategoryName={activeCategory?.name || null}
            categories={categories}
        />
    );
}
