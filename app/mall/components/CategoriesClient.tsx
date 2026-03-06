"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { AnimatedCategoryCard, AnimatedTitle } from "./AnimatedMallComponents";
import { FloatingParticles } from "../../components/CinematicEffects";

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
    product_count: number;
    icon_name: string;
    is_featured: boolean;
}

interface StyleConfig {
    gradient: string;
    heightClass: string;
    colSpanClass: string;
    iconBg: string;
}

function getCategoryStyle(slug: string, index: number): StyleConfig {
    const styles: Record<string, Partial<StyleConfig>> = {
        electronics: { gradient: "from-blue-900/50 to-blue-700/20", iconBg: "bg-blue-500/20 text-blue-400" },
        "fashion-men": { gradient: "from-amber-900/50 to-amber-700/20", iconBg: "bg-amber-500/20 text-amber-400" },
        "fashion-women": { gradient: "from-pink-900/50 to-pink-700/20", iconBg: "bg-pink-500/20 text-pink-400" },
        "home-kitchen": { gradient: "from-emerald-900/50 to-emerald-700/20", iconBg: "bg-emerald-500/20 text-emerald-400" },
        "beauty-personal-care": { gradient: "from-rose-900/50 to-rose-700/20", iconBg: "bg-rose-500/20 text-rose-400" },
        "health-wellness": { gradient: "from-green-900/50 to-green-700/20", iconBg: "bg-green-500/20 text-green-400" },
        "grocery-essentials": { gradient: "from-teal-900/50 to-teal-700/20", iconBg: "bg-teal-500/20 text-teal-400" },
        "baby-kids": { gradient: "from-yellow-900/50 to-yellow-700/20", iconBg: "bg-yellow-500/20 text-yellow-400" },
        "sports-outdoors": { gradient: "from-cyan-900/50 to-cyan-700/20", iconBg: "bg-cyan-500/20 text-cyan-400" },
        "books-stationery": { gradient: "from-indigo-900/50 to-indigo-700/20", iconBg: "bg-indigo-500/20 text-indigo-400" },
        automotive: { gradient: "from-red-900/50 to-red-700/20", iconBg: "bg-red-500/20 text-red-400" },
        "jewelry-watches": { gradient: "from-amber-900/50 to-yellow-700/20", iconBg: "bg-amber-500/20 text-amber-400" },
        "pet-supplies": { gradient: "from-lime-900/50 to-lime-700/20", iconBg: "bg-lime-500/20 text-lime-400" },
        "premium-lifestyle": { gradient: "from-purple-900/50 to-purple-700/20", iconBg: "bg-purple-500/20 text-purple-400" },
    };

    const s = styles[slug] || { gradient: "from-slate-900/50 to-slate-700/20", iconBg: "bg-slate-500/20 text-slate-400" };
    const isFeatured = index < 3 || slug === "baby-kids" || slug === "premium-lifestyle";
    return {
        gradient: s.gradient || "from-slate-900/50 to-slate-700/20",
        heightClass: isFeatured ? "min-h-[220px]" : "min-h-[180px]",
        colSpanClass: (slug === "fashion-men" || slug === "baby-kids" || slug === "premium-lifestyle") ? "md:col-span-2" : "",
        iconBg: s.iconBg || "bg-slate-500/20 text-slate-400",
    };
}

interface CategoriesClientProps {
    categories: CategoryData[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
    const displayCategories = categories.length > 0
        ? categories
        : Array.from({ length: 14 }, (_, i) => ({
            id: `placeholder-${i}`,
            name: `Category ${i + 1}`,
            slug: `category-${i + 1}`,
            description: "Explore this category",
            image_url: null,
            product_count: 0,
            icon_name: "category",
            is_featured: i < 3,
        }));

    return (
        <div className="min-h-screen bg-[#f5f8f8] dark:bg-[#102222] text-slate-900 dark:text-[#e2e8e8] font-display overflow-x-hidden">
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
                                    <h2 className="text-2xl font-bold leading-tight tracking-tight">Brave Ecom</h2>
                                </Link>
                                <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-[480px]">
                                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-[#162a2a] border border-transparent focus-within:border-[#25f4f4]/50 transition-colors">
                                        <div className="text-[#9cbaba] flex items-center justify-center pl-4">
                                            <span className="material-symbols-outlined text-xl">search</span>
                                        </div>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none h-full placeholder:text-[#9cbaba] px-4 text-sm font-normal"
                                            placeholder="Search categories, items, or collections..."
                                        />
                                    </div>
                                </label>
                            </div>
                            <div className="flex items-center gap-4 lg:gap-8">
                                <nav className="hidden lg:flex items-center gap-6">
                                    <Link href="/mall/categories" className="text-[#25f4f4] text-sm font-medium">Marketplace</Link>
                                    <Link href="/investor/portfolio" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Invest</Link>
                                    <Link href="/mall/products" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Auctions</Link>
                                    <Link href="/dashboard" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Dashboard</Link>
                                </nav>
                                <Link href="/mall/cart" className="flex items-center justify-center h-10 px-4 bg-[#25f4f4] text-[#111818] rounded-lg font-bold text-sm hover:bg-[#25f4f4]/90 transition-colors shadow-[0_0_15px_rgba(37,244,244,0.3)]">
                                    Connect Wallet
                                </Link>
                                <Link href="/mall/cart" className="relative p-2">
                                    <span className="material-symbols-outlined text-slate-600 dark:text-[#9cbaba]">shopping_cart</span>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#25f4f4] rounded-full shadow-[0_0_5px_rgba(37,244,244,0.8)]"></span>
                                </Link>
                            </div>
                        </header>

                        {/* Hero Section */}
                        <section className="relative mb-12 overflow-hidden">
                            <FloatingParticles count={12} color="#25f4f4" />
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="flex items-center gap-2 text-[#25f4f4] text-xs font-bold uppercase tracking-wider bg-[#25f4f4]/10 px-3 py-1.5 rounded-full w-fit border border-[#25f4f4]/20"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-[#25f4f4] animate-pulse"></span>
                                        Live Drops
                                    </motion.div>
                                    <AnimatedTitle delay={0.1}>
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                            Explore Sovereign <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25f4f4] to-teal-400">Luxury Categories</span>
                                        </h2>
                                    </AnimatedTitle>
                                    <motion.p
                                        className="text-lg text-slate-600 dark:text-[#9cbaba] max-w-xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        Discover exclusive assets, from vintage watches to digital art. Invest in the future of luxury commerce with verified ownership.
                                    </motion.p>
                                </div>
                                <motion.div
                                    className="flex gap-2"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <button className="px-4 py-2 rounded-full bg-[#25f4f4] text-[#111818] text-sm font-bold shadow-[0_0_15px_rgba(37,244,244,0.3)] hover:scale-105 transition-transform">All Categories</button>
                                    <button className="px-4 py-2 rounded-full border border-[#283939] text-slate-600 dark:text-[#9cbaba] text-sm font-medium hover:border-[#25f4f4]/50 transition-colors">Trending</button>
                                    <button className="px-4 py-2 rounded-full border border-[#283939] text-slate-600 dark:text-[#9cbaba] text-sm font-medium hover:border-[#25f4f4]/50 transition-colors">New Arrivals</button>
                                </motion.div>
                            </div>
                        </section>

                        {/* Categories Grid — 3D Animated */}
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" style={{ perspective: 1200 }}>
                            {displayCategories.map((category, index) => {
                                const style = getCategoryStyle(category.slug, index);
                                return (
                                    <AnimatedCategoryCard key={category.id} index={index} className={`group relative ${style.heightClass} w-full rounded-2xl overflow-hidden cursor-pointer ${style.colSpanClass} transition-all duration-300`}>
                                        <Link href={`/mall/products?category=${category.slug}`} className="block w-full h-full">
                                            <Image
                                                src={category.image_url || "https://dummyimage.com/800x600/162a2a/ffffff"}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} via-transparent to-black/30 group-hover:to-black/50 transition-all duration-300`}></div>
                                            <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                                                <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center mb-3 backdrop-blur-sm border border-white/10`}>
                                                    <span className="material-symbols-outlined text-xl">{category.icon_name || "category"}</span>
                                                </div>
                                                <h3 className="text-white text-xl font-bold mb-1 group-hover:text-[#25f4f4] transition-colors">{category.name}</h3>
                                                <p className="text-white/70 text-xs mb-2 line-clamp-2">{category.description}</p>
                                                {category.is_featured && (
                                                    <span className="inline-flex items-center gap-1 text-[#25f4f4] text-sm font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Explore Collection <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                    </span>
                                                )}
                                            </div>
                                            {category.is_featured && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className="px-2 py-1 bg-[#25f4f4]/80 text-[#111818] text-xs font-bold uppercase rounded backdrop-blur-sm">Premium</span>
                                                </div>
                                            )}
                                        </Link>
                                    </AnimatedCategoryCard>
                                );
                            })}
                        </section>

                        {/* Featured Drop Banner */}
                        <motion.section
                            className="relative rounded-2xl overflow-hidden group mb-12"
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY9HcNGKfrYdhwMz44dox2Xu-MxniwCBDwL3TqQfWY0YF_nXvL7IJonEMzAKpu6k2X0QiwTjaEHHTMMYdcuvqHUOGfQ5Em7iJJJQmEjh4WMNU2l0HWJTlVX3ZqfyWCk9BlIqIAU8xrF-2z37oW_-NeGAJ-7npOv0NO8KHSkMqmrBXPgKE2hg-gTQRanms3Q4YEUw5dZVHcS1Sc9J4Io80Aj-pdboHr3_DX7h6Fu5SsIxnsGyFrCo0_tQMsEq4StofOcgiIahkV-hIx"
                                alt="Fashion Collection"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="relative z-20 flex flex-col justify-center p-8 md:p-12 min-h-[200px]">
                                <span className="inline-block px-3 py-1 bg-[#25f4f4] text-[#111818] text-xs font-bold uppercase rounded w-fit mb-3">Featured Drop</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 max-w-xl">The &quot;Future Classic&quot; Sneaker Collection</h2>
                                <p className="text-slate-300 text-sm md:text-base max-w-md mb-6">
                                    Limited edition drops powered by blockchain verification. Own a piece of the future.
                                </p>
                                <Link href="/mall/products" className="w-fit bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-[#25f4f4] hover:text-[#111818] transition-colors flex items-center gap-2">
                                    Explore Now <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </Link>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
}
