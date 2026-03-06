'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getProductById, getRelatedProducts, type ProductReview } from '@/lib/data/mall-products-data';
import AddToCartButton from '../../components/AddToCartButton';
import MallHeaderActions from '../../components/MallHeaderActions';

// ─── Star Rating Component ──────────────────
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`material-symbols-outlined ${sizeClass} ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    {star <= Math.floor(rating) ? 'star' : star === Math.ceil(rating) && rating % 1 >= 0.3 ? 'star_half' : 'star'}
                </span>
            ))}
        </div>
    );
}

// ─── Review Card Component ──────────────────
function ReviewCard({ review }: { review: ProductReview }) {
    return (
        <div className="p-5 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f425af] to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {review.author.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{review.author}</p>
                        <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                </div>
                {review.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <span className="material-symbols-outlined text-sm">verified</span> Verified
                    </span>
                )}
            </div>
            <StarRating rating={review.rating} size="sm" />
            <p className="font-semibold text-slate-900 dark:text-white text-sm mt-2">{review.title}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">{review.comment}</p>
        </div>
    );
}

// ─── Main Product Detail Page ───────────────
export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = getProductById(params.id);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f8f5f7] dark:bg-[#22101c] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">inventory_2</span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Product Not Found</h2>
                    <p className="text-slate-500 mt-2">The product you&#39;re looking for doesn&#39;t exist.</p>
                    <Link href="/mall/products" className="inline-block mt-6 bg-[#f425af] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#d41f99] transition-colors">
                        Browse All Products
                    </Link>
                </div>
            </div>
        );
    }

    const relatedProducts = getRelatedProducts(product.id, 4);
    const cartItem = { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.images[0], variant: `${product.category} • ${product.seller}` };

    // Star breakdown (simulated from rating)
    const starBreakdown = [
        { stars: 5, pct: Math.round(product.rating >= 4.5 ? 55 : product.rating >= 4 ? 40 : 25) },
        { stars: 4, pct: Math.round(product.rating >= 4 ? 30 : 35) },
        { stars: 3, pct: Math.round(15) },
        { stars: 2, pct: Math.round(7) },
        { stars: 1, pct: Math.round(3) },
    ];

    return (
        <div className="bg-[#f8f5f7] dark:bg-[#22101c] text-slate-900 dark:text-slate-100 font-display min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-4 bg-[#f8f5f7]/95 dark:bg-[#22101c]/95 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <Link href="/mall" className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-3xl text-[#f425af]">diamond</span>
                        <h2 className="text-xl font-bold tracking-tight uppercase">Sovereign Mall</h2>
                    </Link>
                    {/* Breadcrumb */}
                    <nav className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                        <Link href="/mall" className="hover:text-[#f425af] transition-colors">Mall</Link>
                        <span>/</span>
                        <Link href="/mall/products" className="hover:text-[#f425af] transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
                <MallHeaderActions theme="fuchsia" />
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800">
                            {product.badge && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`px-3 py-1.5 backdrop-blur-md text-white text-xs font-bold uppercase rounded-lg border border-white/10 ${product.badge.color}`}>
                                        {product.badge.text}
                                    </span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                                    {product.discount}% OFF
                                </span>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Thumbnail Strip */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${i === selectedImage
                                        ? 'border-[#f425af] ring-2 ring-[#f425af]/30'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                        }`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-6">
                        {/* Category & Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/mall/categories`} className="text-xs font-semibold text-[#f425af] uppercase tracking-wider hover:underline">
                                {product.category}
                            </Link>
                            {product.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-[#3d2635] text-slate-500 dark:text-slate-400">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title & Rating */}
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <StarRating rating={product.rating} />
                            <span className="text-sm text-slate-500">{product.rating.toFixed(1)}</span>
                            <span className="text-sm text-slate-400">({product.reviewCount.toLocaleString('en-IN')} reviews)</span>
                        </div>

                        {/* Price Block */}
                        <div className="p-5 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                <span className="text-lg line-through text-slate-400">₹{product.mrp.toLocaleString('en-IN')}</span>
                                <span className="text-sm font-bold text-green-500">{product.discount}% off</span>
                            </div>
                            <p className="text-xs text-slate-400">Inclusive of all taxes • Free delivery</p>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>

                        {/* Seller */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#1a0e17] border border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-[#f425af]">storefront</span>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.seller}</p>
                                <p className="text-xs text-slate-400">Verified Seller • Fast Delivery</p>
                            </div>
                        </div>

                        {/* Stock & Add to Cart */}
                        <div className="flex items-center gap-4">
                            <span className={`flex items-center gap-1 text-sm font-medium ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
                                <span className="material-symbols-outlined text-sm">{product.inStock ? 'check_circle' : 'cancel'}</span>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <AddToCartButton product={cartItem} />
                            <Link href="/mall/checkout" className="flex-1 flex items-center justify-center gap-2 bg-[#f425af] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#d41f99] transition-colors">
                                <span className="material-symbols-outlined text-lg">bolt</span>
                                Buy Now
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <Link href="/investor/portfolio" className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a0e17] border border-slate-200 dark:border-slate-800 hover:border-[#f425af] transition-colors">
                                <span className="material-symbols-outlined text-[#f425af] mb-1">trending_up</span>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Invest</p>
                            </Link>
                            <Link href="/mall/categories" className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a0e17] border border-slate-200 dark:border-slate-800 hover:border-[#f425af] transition-colors">
                                <span className="material-symbols-outlined text-[#f425af] mb-1">category</span>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Categories</p>
                            </Link>
                            <Link href="/feedback" className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a0e17] border border-slate-200 dark:border-slate-800 hover:border-[#f425af] transition-colors">
                                <span className="material-symbols-outlined text-[#f425af] mb-1">support_agent</span>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Support</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mb-16">
                    <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
                        <nav className="flex gap-8">
                            {([
                                { key: 'specs', label: 'Specifications', icon: 'tune' },
                                { key: 'reviews', label: `Reviews (${product.reviewCount.toLocaleString('en-IN')})`, icon: 'rate_review' },
                                { key: 'shipping', label: 'Shipping & Warranty', icon: 'local_shipping' },
                            ] as const).map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                        ? 'border-[#f425af] text-[#f425af]'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Specifications Tab */}
                    {activeTab === 'specs' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.specs.map((spec, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{spec.label}</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Rating Summary */}
                            <div className="lg:col-span-1 p-6 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800">
                                <div className="text-center mb-6">
                                    <p className="text-5xl font-bold text-slate-900 dark:text-white">{product.rating.toFixed(1)}</p>
                                    <StarRating rating={product.rating} size="lg" />
                                    <p className="text-sm text-slate-400 mt-2">{product.reviewCount.toLocaleString('en-IN')} ratings</p>
                                </div>
                                <div className="space-y-3">
                                    {starBreakdown.map(({ stars, pct }) => (
                                        <div key={stars} className="flex items-center gap-3">
                                            <span className="text-sm text-slate-500 w-3">{stars}</span>
                                            <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Individual Reviews */}
                            <div className="lg:col-span-2 space-y-4">
                                {product.reviews.map(review => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shipping Tab */}
                    {activeTab === 'shipping' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800 text-center">
                                <span className="material-symbols-outlined text-3xl text-[#f425af] mb-3">local_shipping</span>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Free Shipping</h4>
                                <p className="text-sm text-slate-500">Delivery within 3-7 business days across India</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800 text-center">
                                <span className="material-symbols-outlined text-3xl text-[#f425af] mb-3">autorenew</span>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Easy Returns</h4>
                                <p className="text-sm text-slate-500">7-day hassle-free return policy</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800 text-center">
                                <span className="material-symbols-outlined text-3xl text-[#f425af] mb-3">verified_user</span>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">1 Year Warranty</h4>
                                <p className="text-sm text-slate-500">Manufacturer warranty included</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Related Products</h2>
                            <Link href="/mall/products" className="text-sm font-medium text-[#f425af] hover:underline flex items-center gap-1">
                                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map(rp => (
                                <Link key={rp.id} href={`/mall/product/${rp.id}`} className="group bg-white dark:bg-[#2d1625] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-[#f425af] transition-all">
                                    <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-black">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 truncate group-hover:text-[#f425af] transition-colors">{rp.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white">₹{rp.price.toLocaleString('en-IN')}</span>
                                            <span className="text-xs line-through text-slate-400">₹{rp.mrp.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <StarRating rating={rp.rating} size="sm" />
                                            <span className="text-xs text-slate-400">({rp.reviewCount.toLocaleString('en-IN')})</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer Links */}
                <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 pb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Shop</h4>
                            <div className="space-y-2">
                                <Link href="/mall/products" className="block text-slate-500 hover:text-[#f425af] transition-colors">All Products</Link>
                                <Link href="/mall/categories" className="block text-slate-500 hover:text-[#f425af] transition-colors">Categories</Link>
                                <Link href="/mall/checkout" className="block text-slate-500 hover:text-[#f425af] transition-colors">Cart</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Account</h4>
                            <div className="space-y-2">
                                <Link href="/investor/portfolio" className="block text-slate-500 hover:text-[#f425af] transition-colors">My Portfolio</Link>
                                <Link href="/mall/orders" className="block text-slate-500 hover:text-[#f425af] transition-colors">Orders</Link>
                                <Link href="/mall/wishlist" className="block text-slate-500 hover:text-[#f425af] transition-colors">Wishlist</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Support</h4>
                            <div className="space-y-2">
                                <Link href="/feedback" className="block text-slate-500 hover:text-[#f425af] transition-colors">Contact Us</Link>
                                <Link href="/feedback" className="block text-slate-500 hover:text-[#f425af] transition-colors">FAQ</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Legal</h4>
                            <div className="space-y-2">
                                <Link href="/privacy" className="block text-slate-500 hover:text-[#f425af] transition-colors">Privacy Policy</Link>
                                <Link href="/terms" className="block text-slate-500 hover:text-[#f425af] transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
