"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedProductCard, AnimatedTitle } from "./AnimatedMallComponents";
import AddToCartButton from "./AddToCartButton";
import MallHeaderActions from "./MallHeaderActions";
import { getRelevantProductImage } from "@/lib/utils/productImages";

interface ProductData {
    id: string;
    name: string;
    price: number;
    images: string[];
    categoryName: string;
    categorySlug?: string;
    seller: string;
    badge: string | null;
    slug: string;
    rating: number;
    reviewCount: number;
    mrp: number;
    discount: number;
}

interface CategoryInfo {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
    product_count: number;
    icon_name: string;
    is_featured: boolean;
}

interface ProductsClientProps {
    products: ProductData[];
    total: number;
    totalPages: number;
    totalProducts: number;
    totalCategories: number;
    activeCategorySlug?: string | null;
    activeCategoryName?: string | null;
    categories?: CategoryInfo[];
}

// Badge colors for product tags
function getBadgeStyle(badge: string | null): { text: string; color: string; bg: string } | null {
    if (!badge) return null;
    const lower = badge.toLowerCase();
    if (lower.includes("best")) return { text: badge, color: "#ff6b35", bg: "bg-orange-500" };
    if (lower.includes("value")) return { text: badge, color: "#22c55e", bg: "bg-green-500" };
    if (lower.includes("trend")) return { text: badge, color: "#a855f7", bg: "bg-purple-500" };
    if (lower.includes("health")) return { text: badge, color: "#ef4444", bg: "bg-red-500" };
    if (lower.includes("new")) return { text: badge, color: "#3b82f6", bg: "bg-blue-500" };
    if (lower.includes("premium")) return { text: badge, color: "#f59e0b", bg: "bg-amber-500" };
    return { text: badge, color: "#25f4f4", bg: "bg-teal-500" };
}

export default function ProductsClient({
    products, total, totalPages, totalProducts, totalCategories,
    activeCategorySlug, activeCategoryName, categories = []
}: ProductsClientProps) {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
    const [sortBy, setSortBy] = useState<string>("default");
    const filterRef = useRef<HTMLDivElement>(null);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setActiveFilter(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Smart image resolution — replaces random picsum with relevant product images
    const displayProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: getRelevantProductImage(p.name, p.categorySlug || activeCategorySlug || '', p.images[0]),
        variant: `${p.categoryName} • ${p.seller}`,
        badge: getBadgeStyle(p.badge),
        slug: p.slug,
        rating: p.rating,
        reviewCount: p.reviewCount,
        mrp: p.mrp,
        discount: p.discount,
    }));

    // Apply client-side sorting
    const sortedProducts = [...displayProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            case 'discount': return b.discount - a.discount;
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });

    // Apply client-side price filter
    const filteredProducts = priceRange
        ? sortedProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
        : sortedProducts;

    const pageTitle = activeCategoryName || "All Products";
    const buildCategoryUrl = (page: number) => {
        const base = "/mall/products";
        const params = new URLSearchParams();
        if (activeCategorySlug) params.set("category", activeCategorySlug);
        params.set("page", String(page));
        return `${base}?${params.toString()}`;
    };

    const PRICE_RANGES: { label: string; range: [number, number] | null }[] = [
        { label: 'All Prices', range: null },
        { label: 'Under ₹500', range: [0, 500] },
        { label: '₹500 - ₹1,000', range: [500, 1000] },
        { label: '₹1,000 - ₹5,000', range: [1000, 5000] },
        { label: '₹5,000 - ₹10,000', range: [5000, 10000] },
        { label: '₹10,000 - ₹50,000', range: [10000, 50000] },
        { label: '₹50,000+', range: [50000, 9999999] },
    ];

    const SORT_OPTIONS = [
        { label: 'Relevance', value: 'default' },
        { label: 'Price: Low → High', value: 'price_asc' },
        { label: 'Price: High → Low', value: 'price_desc' },
        { label: 'Best Discount', value: 'discount' },
        { label: 'Top Rated', value: 'rating' },
    ];

    return (
        <div className="bg-[#f5f8f8] dark:bg-[#102222] min-h-screen text-slate-900 dark:text-[#e2e8e8] font-display overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center w-full">
                    <div className="layout-content-container flex flex-col w-full max-w-[1440px] px-6 md:px-12 lg:px-20 pb-10">
                        {/* Header */}
                        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#283939] py-5 mb-8">
                            <div className="flex items-center gap-8">
                                <Link href="/mall" className="flex items-center gap-4 text-slate-900 dark:text-white cursor-pointer">
                                    <div className="size-8 text-[#25f4f4]">
                                        <span className="material-symbols-outlined text-[32px]">diamond</span>
                                    </div>
                                    <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Brave Ecom</h2>
                                </Link>
                                <div className="hidden md:flex flex-col min-w-[320px]">
                                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10 bg-slate-100 dark:bg-[#162a2a] border border-transparent focus-within:border-[#25f4f4]/50 transition-colors">
                                        <div className="text-[#9cbaba] flex items-center justify-center pl-4">
                                            <span className="material-symbols-outlined text-xl">search</span>
                                        </div>
                                        <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none h-full placeholder:text-[#9cbaba] px-4 text-sm" placeholder="Search products..." />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 lg:gap-8">
                                <nav className="hidden lg:flex items-center gap-6">
                                    <Link href="/mall/categories" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Marketplace</Link>
                                    <Link href="/investor/portfolio" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Invest</Link>
                                    <Link href="/dashboard" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Dashboard</Link>
                                </nav>
                                <MallHeaderActions />
                            </div>
                        </header>

                        {/* Breadcrumbs — category-aware */}
                        <motion.div className="flex flex-wrap gap-2 mb-4 px-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <Link href="/mall" className="text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Home</Link>
                            <span className="text-[#9cbaba] text-sm font-medium">/</span>
                            <Link href="/mall/categories" className="text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Categories</Link>
                            <span className="text-[#9cbaba] text-sm font-medium">/</span>
                            {activeCategoryName ? (
                                <span className="text-[#25f4f4] text-sm font-bold">{activeCategoryName}</span>
                            ) : (
                                <span className="text-slate-900 dark:text-white text-sm font-medium">All Products</span>
                            )}
                        </motion.div>

                        {/* Category Filter Chips (when browsing a category) */}
                        {categories.length > 0 && (
                            <motion.div className="flex flex-wrap gap-2 mb-6 px-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                                <Link
                                    href="/mall/products"
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!activeCategorySlug
                                        ? "bg-[#25f4f4] text-[#111818] shadow-[0_0_15px_rgba(37,244,244,0.3)]"
                                        : "bg-white dark:bg-[#162a2a] border border-slate-200 dark:border-[#283939] text-slate-600 dark:text-[#9cbaba] hover:border-[#25f4f4]/50"
                                        }`}
                                >
                                    All
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/mall/products?category=${cat.slug}`}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategorySlug === cat.slug
                                            ? "bg-[#25f4f4] text-[#111818] shadow-[0_0_15px_rgba(37,244,244,0.3)]"
                                            : "bg-white dark:bg-[#162a2a] border border-slate-200 dark:border-[#283939] text-slate-600 dark:text-[#9cbaba] hover:border-[#25f4f4]/50"
                                            }`}
                                    >
                                        {cat.name} ({cat.product_count})
                                    </Link>
                                ))}
                            </motion.div>
                        )}

                        {/* Page Title */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-1">
                            <div>
                                <AnimatedTitle>
                                    <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight mb-2">{pageTitle}</h1>
                                </AnimatedTitle>
                                <motion.p className="text-[#9cbaba] text-lg" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                                    {activeCategoryName
                                        ? `${total.toLocaleString("en-IN")} products in ${activeCategoryName}`
                                        : `Explore ${totalProducts.toLocaleString("en-IN")} products across ${totalCategories} categories`
                                    }
                                </motion.p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#9cbaba] text-sm">Showing {displayProducts.length} of {total.toLocaleString("en-IN")} results (Page 1 of {totalPages})</span>
                            </div>
                        </div>

                        {/* Filters Toolbar — Functional */}
                        <motion.div ref={filterRef} className="flex flex-wrap items-center gap-3 mb-10 px-1 relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            {/* Price Range Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
                                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-lg border pl-4 pr-3 transition-all ${priceRange ? 'bg-[#25f4f4]/10 border-[#25f4f4]/50 text-[#25f4f4]' : 'bg-white dark:bg-[#162a2a] border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50'
                                        }`}
                                >
                                    <p className="text-sm font-medium">{priceRange ? `₹${priceRange[0].toLocaleString('en-IN')} - ₹${priceRange[1].toLocaleString('en-IN')}` : 'Price Range'}</p>
                                    <span className="material-symbols-outlined text-xl">{activeFilter === 'price' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
                                </button>
                                <AnimatePresence>
                                    {activeFilter === 'price' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-12 left-0 z-50 bg-white dark:bg-[#162a2a] border border-slate-200 dark:border-[#283939] rounded-xl shadow-2xl py-2 min-w-[200px]"
                                        >
                                            {PRICE_RANGES.map(({ label, range }) => (
                                                <button
                                                    key={label}
                                                    onClick={() => { setPriceRange(range); setActiveFilter(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${JSON.stringify(priceRange) === JSON.stringify(range)
                                                            ? 'bg-[#25f4f4]/10 text-[#25f4f4] font-bold'
                                                            : 'text-slate-700 dark:text-[#9cbaba] hover:bg-slate-100 dark:hover:bg-[#283939]'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sort By Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
                                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-lg border pl-4 pr-3 transition-all ${sortBy !== 'default' ? 'bg-[#25f4f4]/10 border-[#25f4f4]/50 text-[#25f4f4]' : 'bg-white dark:bg-[#162a2a] border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50'
                                        }`}
                                >
                                    <p className="text-sm font-medium">Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}</p>
                                    <span className="material-symbols-outlined text-xl">{activeFilter === 'sort' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
                                </button>
                                <AnimatePresence>
                                    {activeFilter === 'sort' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-12 left-0 z-50 bg-white dark:bg-[#162a2a] border border-slate-200 dark:border-[#283939] rounded-xl shadow-2xl py-2 min-w-[200px]"
                                        >
                                            {SORT_OPTIONS.map(({ label, value }) => (
                                                <button
                                                    key={value}
                                                    onClick={() => { setSortBy(value); setActiveFilter(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === value
                                                            ? 'bg-[#25f4f4]/10 text-[#25f4f4] font-bold'
                                                            : 'text-slate-700 dark:text-[#9cbaba] hover:bg-slate-100 dark:hover:bg-[#283939]'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Clear Filters */}
                            {(priceRange || sortBy !== 'default') && (
                                <button
                                    onClick={() => { setPriceRange(null); setSortBy('default'); }}
                                    className="flex h-10 items-center gap-2 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                    Clear Filters
                                </button>
                            )}

                            <div className="ml-auto flex gap-2">
                                <button className="p-2 rounded-lg bg-[#162a2a] border border-[#283939] text-[#25f4f4]"><span className="material-symbols-outlined">grid_view</span></button>
                                <button className="p-2 rounded-lg bg-transparent hover:bg-[#162a2a] text-[#9cbaba]"><span className="material-symbols-outlined">view_list</span></button>
                            </div>
                        </motion.div>

                        {/* Empty State */}
                        {displayProducts.length === 0 && (
                            <motion.div
                                className="flex flex-col items-center justify-center py-20 text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="material-symbols-outlined text-6xl text-[#9cbaba] mb-4">inventory_2</span>
                                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                                <p className="text-[#9cbaba] mb-6">
                                    {activeCategoryName
                                        ? `No products available in "${activeCategoryName}" yet. Check back soon!`
                                        : "No products match your filters."
                                    }
                                </p>
                                <Link href="/mall/products" className="px-6 py-3 bg-[#25f4f4] text-[#111818] rounded-lg font-bold hover:bg-[#25f4f4]/90 transition-colors">
                                    View All Products
                                </Link>
                            </motion.div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-1" style={{ perspective: 1200 }}>
                            {filteredProducts.length === 0 && displayProducts.length > 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                                    <span className="material-symbols-outlined text-5xl text-[#9cbaba] mb-3">filter_list_off</span>
                                    <h3 className="text-lg font-bold text-white mb-1">No products match those filters</h3>
                                    <p className="text-[#9cbaba] text-sm mb-4">Try adjusting your price range or sorting</p>
                                    <button onClick={() => { setPriceRange(null); setSortBy('default'); }} className="px-5 py-2.5 bg-[#25f4f4] text-[#111818] rounded-lg font-bold text-sm">Reset Filters</button>
                                </div>
                            )}
                            {filteredProducts.map((product, idx) => (
                                <AnimatedProductCard key={product.id} index={idx} className="group relative flex flex-col bg-white dark:bg-[#162a2a] rounded-xl overflow-hidden border border-slate-100 dark:border-[#283939] transition-all duration-300">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-gray-800">
                                        {product.badge && (
                                            <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 ${product.badge.bg} text-white text-[10px] font-bold uppercase rounded tracking-wide`}>
                                                {product.badge.text}
                                            </span>
                                        )}
                                        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-[#25f4f4] hover:text-black text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100">
                                            <span className="material-symbols-outlined text-sm">favorite</span>
                                        </button>
                                        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight line-clamp-2 mb-2">{product.name}</h3>
                                        <p className="text-[#9cbaba] text-sm font-normal mb-4">{product.variant}</p>
                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-[#283939] pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[#9cbaba] text-xs uppercase tracking-wide">Price</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-900 dark:text-white text-xl font-bold">₹ {product.price.toLocaleString("en-IN")}</span>
                                                    {product.mrp > product.price && (
                                                        <span className="text-[#9cbaba] text-sm line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                                                    )}
                                                </div>
                                                {product.discount > 0 && (
                                                    <span className="text-green-400 text-xs font-bold">{product.discount}% OFF</span>
                                                )}
                                            </div>
                                            <AddToCartButton product={product} />
                                        </div>
                                    </div>
                                </AnimatedProductCard>
                            ))}
                        </div>

                        {/* Pagination — category-aware links */}
                        {totalPages > 1 && (
                            <motion.div className="flex justify-center mt-12 mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <nav className="flex items-center gap-2">
                                    <Link href={buildCategoryUrl(1)} className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-500 dark:text-[#9cbaba] hover:bg-slate-100 dark:hover:bg-[#283939] transition-colors">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </Link>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                        <Link key={p} href={buildCategoryUrl(p)} className={`flex items-center justify-center size-10 rounded-lg font-bold ${p === 1 ? "bg-[#25f4f4] text-black" : "border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#283939]"} transition-colors`}>
                                            {p}
                                        </Link>
                                    ))}
                                    {totalPages > 5 && (
                                        <>
                                            <span className="text-[#9cbaba] px-2">...</span>
                                            <Link href={buildCategoryUrl(totalPages)} className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#283939] transition-colors">{totalPages}</Link>
                                        </>
                                    )}
                                    <Link href={buildCategoryUrl(2)} className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-500 dark:text-[#9cbaba] hover:bg-slate-100 dark:hover:bg-[#283939] transition-colors">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </Link>
                                </nav>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
