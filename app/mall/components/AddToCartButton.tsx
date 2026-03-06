"use client";

import React, { useState } from 'react';
import { useCart, CartItem } from '@/app/context/CartContext';

export default function AddToCartButton({ product }: { product: CartItem }) {
    const [isAdded, setIsAdded] = useState(false);
    const { addItem } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation if it's inside a Link
        e.stopPropagation(); // Avoid triggering parent click handlers
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center shadow-md ${isAdded
                    ? "bg-green-500 text-white"
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#f425af] dark:hover:bg-[#f425af] hover:text-white dark:hover:text-white"
                }`}
            title={isAdded ? "Added to Cart" : "Add to Cart"}
        >
            <span className="material-symbols-outlined text-lg">
                {isAdded ? "check" : "add_shopping_cart"}
            </span>
        </button>
    );
}
