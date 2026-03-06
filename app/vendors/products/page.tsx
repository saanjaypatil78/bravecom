// Vendor Products Management Page
// BRAVECOM Sunray Ecosystem - Products Management

'use client';

import { useState, useEffect } from 'react';
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    X,
    Check,
    AlertCircle,
    Image as ImageIcon,
    DollarSign,
    Tag
} from 'lucide-react';

// Types
interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    mrp: number;
    selling_price: number;
    commission: number;
    inventory: number;
    status: string;
    images: string[];
    roi_percentage: number | null;
    created_at: string;
}

// Category options
const categories = [
    'ELECTRONICS',
    'FASHION',
    'HOME',
    'BEAUTY',
    'SPORTS',
    'BOOKS',
    'TOYS',
    'FOOD',
    'OTHER'
];

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: 'bg-green-100', text: 'text-green-800' },
    INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800' },
    DELETED: { bg: 'bg-red-100', text: 'text-red-800' },
    OUT_OF_STOCK: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
};

// Format INR
const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default function VendorProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'OTHER',
        tags: '',
        mrp: '',
        sellingPrice: '',
        inventory: '',
        roiPercentage: ''
    });

    useEffect(() => {
        fetchProducts();
    }, [search, category, status]);

    const fetchProducts = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (category) params.set('category', category);
            if (status) params.set('status', status);

            const response = await fetch(`/api/vendors/products?${params}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            if (!text) return;
            const data = JSON.parse(text);

            if (data.success) {
                setProducts(data.data);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                mrp: parseFloat(formData.mrp),
                sellingPrice: parseFloat(formData.sellingPrice),
                inventory: parseInt(formData.inventory),
                roiPercentage: formData.roiPercentage ? parseFloat(formData.roiPercentage) : null
            };

            const url = editingProduct
                ? `/api/vendors/products/${editingProduct.id}`
                : '/api/vendors/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to save product');
            const text = await response.text();
            const data = text ? JSON.parse(text) : { success: true };

            if (data.success) {
                setProducts(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                mrp: parseFloat(formData.mrp),
                sellingPrice: parseFloat(formData.sellingPrice),
                inventory: parseInt(formData.inventory),
                roiPercentage: formData.roiPercentage ? parseFloat(formData.roiPercentage) : null
            };

            const url = editingProduct
                ? `/api/vendors/products/${editingProduct.id}`
                : '/api/vendors/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to save product');
            const text = await response.text();
            const data = text ? JSON.parse(text) : { success: true };

            if (data.success) {
                setShowModal(false);
                setEditingProduct(null);
                setFormData({
                    name: '',
                    description: '',
                    category: 'OTHER',
                    tags: '',
                    mrp: '',
                    sellingPrice: '',
                    inventory: '',
                    roiPercentage: ''
                });
                fetchProducts();
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            tags: product.tags?.join(', ') || '',
            mrp: product.mrp.toString(),
            sellingPrice: product.selling_price.toString(),
            inventory: product.inventory.toString(),
            roiPercentage: product.roi_percentage?.toString() || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/vendors/products/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            const text = await response.text();
            const data = text ? JSON.parse(text) : { success: true };

            if (data.success) {
                fetchProducts();
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
        }
    };

    const openNewProductModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            category: 'OTHER',
            tags: '',
            mrp: '',
            sellingPrice: '',
            inventory: '',
            roiPercentage: ''
        });
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Package className="w-8 h-8 text-purple-400" />
                                Products Management
                            </h1>
                            <p className="text-gray-400">{products.length} products</p>
                        </div>
                        <button
                            onClick={openNewProductModal}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        >
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-12 text-center">
                        <Package className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No Products Yet</h2>
                        <p className="text-gray-400 mb-6">Start adding products to sell on the Sunray marketplace</p>
                        <button
                            onClick={openNewProductModal}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-400 transition-all"
                            >
                                {/* Product Image */}
                                <div className="aspect-square bg-slate-700/50 relative">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-16 h-16 text-gray-600" />
                                        </div>
                                    )}
                                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[product.status]?.bg || 'bg-gray-100'} ${statusColors[product.status]?.text || 'text-gray-800'}`}>
                                        {product.status}
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-white truncate">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{product.category}</p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold text-white">{formatINR(product.selling_price)}</span>
                                        <span className="text-sm text-gray-500 line-through">{formatINR(product.mrp)}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                        <span>Stock: {product.inventory}</span>
                                        <span>Commission: {product.commission}%</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 text-white py-2 rounded-lg hover:bg-slate-600 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-purple-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                    placeholder="Enter product name"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                    placeholder="Enter product description"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        MRP (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.mrp}
                                        onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Selling Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Inventory & ROI */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Inventory *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.inventory}
                                        onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        ROI Percentage
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={formData.roiPercentage}
                                        onChange={(e) => setFormData({ ...formData, roiPercentage: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all"
                                >
                                    {editingProduct ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Update Product
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Add Product
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}