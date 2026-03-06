export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    image_url?: string;
    created_at?: string;
}

export interface Product {
    id: string;
    category_id?: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image_url?: string;
    variant?: string;
    badge_text?: string;
    badge_color?: string;
    is_featured: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface UserProfile {
    id: string; // References auth.users
    email: string;
    full_name?: string;
    avatar_url?: string;
    role: 'user' | 'admin' | 'investor';
    wallet_balance: number;
    member_status: 'Active' | 'Inactive' | 'Suspended';
    member_tier: 'Core' | 'Sovereign' | 'Imperial';
    created_at?: string;
}

export interface Order {
    id: string;
    user_id: string; // References UserProfile
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    taxes: number;
    shipping_cost: number;
    created_at?: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at?: string;
}
