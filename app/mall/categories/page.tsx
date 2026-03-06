import React from 'react';
import { getCategories } from '@/lib/db/products';
import CategoriesClient from '../components/CategoriesClient';

export const metadata = {
    title: "Luxury Categories | Brave Ecom Mall",
    description: "Explore premium categories from Electronics to Fashion, Home & Kitchen, and more. Invest in the future of luxury commerce.",
};

export default async function CategoriesPage() {
    const categories = await getCategories();
    return <CategoriesClient categories={categories} />;
}
