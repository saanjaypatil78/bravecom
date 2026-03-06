/**
 * Centralized Mall Product Data — Real product data sourced from
 * Amazon India, Meesho, Blinkit, and Google Shopping.
 * Generated: 2026-03-01
 */

// ─── TYPES ───────────────────────────────────
export interface ProductReview {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    verified: boolean;
}

export interface ProductSpec {
    label: string;
    value: string;
}

export interface MallProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    discount: number;
    description: string;
    shortDescription: string;
    category: string;
    categorySlug: string;
    images: string[];
    specs: ProductSpec[];
    reviews: ProductReview[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
    seller: string;
    tags: string[];
    badge?: { text: string; color: string };
}

export interface MallCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    productCount: number;
    icon: string;
}

// ─── CATEGORIES ──────────────────────────────
export const MALL_CATEGORIES: MallCategory[] = [
    {
        id: "cat_electronics",
        name: "Electronics",
        slug: "electronics",
        description: "Smartwatches, gadgets, and cutting-edge tech accessories.",
        image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
        productCount: 5,
        icon: "devices"
    },
    {
        id: "cat_fashion",
        name: "Fashion & Footwear",
        slug: "fashion",
        description: "Trending sneakers, casual wear, and athletic footwear.",
        image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
        productCount: 5,
        icon: "checkroom"
    },
    {
        id: "cat_grocery",
        name: "Grocery & Essentials",
        slug: "grocery",
        description: "Premium dals, millets, trail mixes, and organic food packs.",
        image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
        productCount: 5,
        icon: "local_grocery_store"
    },
    {
        id: "cat_home",
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Kitchen organisers, cookware, and smart home essentials.",
        image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        productCount: 5,
        icon: "kitchen"
    },
    {
        id: "cat_beauty",
        name: "Health & Beauty",
        slug: "health-beauty",
        description: "Skincare serums, beauty tools, and grooming essentials.",
        image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
        productCount: 5,
        icon: "spa"
    },
    {
        id: "cat_lifestyle",
        name: "Premium Lifestyle",
        slug: "lifestyle",
        description: "Luxury wallets, designer pens, noise-cancelling headphones.",
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        productCount: 5,
        icon: "diamond"
    }
];

// ─── HELPER: Generate realistic reviews ──────
function makeReviews(base: { rating: number; count: number }): ProductReview[] {
    const names = [
        "Rajesh K.", "Priya S.", "Amit Verma", "Sanya M.", "Vikram P.",
        "Neha Sharma", "Arjun D.", "Kavita R.", "Rohan T.", "Meera J."
    ];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const positiveComments = [
        "Excellent quality! Totally worth the price.",
        "Very happy with this purchase. Fast delivery too.",
        "Great product, matches the description perfectly.",
        "Using it for 2 months now, no complaints whatsoever.",
        "Best value for money in this range."
    ];
    const neutralComments = [
        "Decent product for the price point.",
        "Good but packaging could be better.",
        "Works as expected, nothing extraordinary."
    ];

    const reviewCount = Math.min(5, Math.max(3, Math.floor(base.rating)));
    const reviews: ProductReview[] = [];
    for (let i = 0; i < reviewCount; i++) {
        const r = base.rating + (Math.random() * 0.8 - 0.4);
        const starRating = Math.min(5, Math.max(1, Math.round(r)));
        reviews.push({
            id: `rev_${Date.now()}_${i}`,
            author: names[i % names.length],
            rating: starRating,
            date: `${Math.floor(Math.random() * 28 + 1)} ${months[Math.floor(Math.random() * 12)]} 2025`,
            title: starRating >= 4 ? "Great product!" : "Decent purchase",
            comment: starRating >= 4
                ? positiveComments[i % positiveComments.length]
                : neutralComments[i % neutralComments.length],
            verified: Math.random() > 0.2
        });
    }
    return reviews;
}

// ─── PRODUCTS ────────────────────────────────

const electronicsProducts: MallProduct[] = [
    {
        id: "elec_01",
        name: "Fire-Boltt Ninja Call Pro Plus Smart Watch",
        slug: "fire-boltt-ninja-call-pro-plus",
        price: 1099,
        mrp: 7999,
        discount: 86,
        description: "Bluetooth calling smartwatch with a large 1.83\" HD display and AI voice assistant support. Features 120+ sports modes, IP67 water resistance, and continuous heart rate monitoring. Perfect for fitness enthusiasts and tech-savvy users.",
        shortDescription: "1.83\" HD Bluetooth Calling Smartwatch with AI Assistant",
        category: "Electronics",
        categorySlug: "electronics",
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80"
        ],
        specs: [
            { label: "Display", value: "1.83\" HD IPS" },
            { label: "Sports Modes", value: "120+" },
            { label: "Water Rating", value: "IP67" },
            { label: "Battery", value: "Up to 5 days" }
        ],
        reviews: makeReviews({ rating: 3.8, count: 127361 }),
        rating: 3.8,
        reviewCount: 127361,
        inStock: true,
        seller: "Fire-Boltt Official",
        tags: ["Bestseller", "Smartwatch", "Bluetooth Calling"],
        badge: { text: "Bestseller", color: "bg-amber-500/80" }
    },
    {
        id: "elec_02",
        name: "Fire-Boltt Phoenix Ultra Smart Watch",
        slug: "fire-boltt-phoenix-ultra",
        price: 1299,
        mrp: 9999,
        discount: 87,
        description: "Luxury stainless steel Bluetooth calling smartwatch with a round 1.39\" HD display and SpO2 monitoring. Features heart rate tracking, 120+ sports modes, and a premium metal build for a sophisticated look.",
        shortDescription: "Stainless Steel Round Dial Smartwatch with SpO2",
        category: "Electronics",
        categorySlug: "electronics",
        images: [
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
            "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
            "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80"
        ],
        specs: [
            { label: "Display", value: "1.39\" HD Round" },
            { label: "Build", value: "Stainless Steel" },
            { label: "Health", value: "SpO2 + Heart Rate" },
            { label: "Sports", value: "120+ Modes" }
        ],
        reviews: makeReviews({ rating: 3.9, count: 105119 }),
        rating: 3.9,
        reviewCount: 105119,
        inStock: true,
        seller: "Fire-Boltt Official",
        tags: ["Premium", "Smartwatch", "Metal Build"]
    },
    {
        id: "elec_03",
        name: "SaleOn Tech Pouch Organizer",
        slug: "saleon-tech-pouch-organiser",
        price: 298,
        mrp: 999,
        discount: 70,
        description: "Portable travel storage bag designed for organizing cables, chargers, and small electronic accessories. Water-resistant exterior with multiple mesh compartments for maximum storage efficiency.",
        shortDescription: "Water-resistant Travel Gadget Organizer Pouch",
        category: "Electronics",
        categorySlug: "electronics",
        images: [
            "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600&q=80",
            "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80"
        ],
        specs: [
            { label: "Material", value: "Water-resistant Nylon" },
            { label: "Compartments", value: "Multiple mesh pockets" },
            { label: "Size", value: "Compact portable" }
        ],
        reviews: makeReviews({ rating: 4.2, count: 2785 }),
        rating: 4.2,
        reviewCount: 2785,
        inStock: true,
        seller: "SaleOn",
        tags: ["Travel", "Organizer", "Tech Accessories"]
    },
    {
        id: "elec_04",
        name: "Amazon Basics Electronics Travel Organiser",
        slug: "amazon-basics-electronics-organiser",
        price: 289,
        mrp: 599,
        discount: 52,
        description: "Specifically designed electronics storage case with flexible padded dividers for gadget protection. Waterproof foam padding keeps your devices safe during travel.",
        shortDescription: "Padded Electronics Case with Adjustable Dividers",
        category: "Electronics",
        categorySlug: "electronics",
        images: [
            "https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=600&q=80",
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80"
        ],
        specs: [
            { label: "Protection", value: "Waterproof foam" },
            { label: "Dividers", value: "Adjustable" },
            { label: "Closure", value: "YKK Zipper" }
        ],
        reviews: makeReviews({ rating: 3.9, count: 841 }),
        rating: 3.9,
        reviewCount: 841,
        inStock: true,
        seller: "Amazon Basics",
        tags: ["Amazon Basics", "Travel", "Storage"]
    },
    {
        id: "elec_05",
        name: "Sounce 7-in-1 Electronic Cleaner Kit",
        slug: "sounce-7in1-cleaner-kit",
        price: 199,
        mrp: 499,
        discount: 60,
        description: "A multifunctional cleaning tool set for keeping laptops, phones, and wireless earbuds spotless. Includes high-density keyboard brush, screen cleaner spray port, and precision cleaning tools.",
        shortDescription: "Complete Gadget Cleaning Kit for Laptops & Earbuds",
        category: "Electronics",
        categorySlug: "electronics",
        images: [
            "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&q=80",
            "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80"
        ],
        specs: [
            { label: "Tools", value: "7-in-1 set" },
            { label: "Brush", value: "High-density keyboard" },
            { label: "Spray", value: "Screen cleaner port" }
        ],
        reviews: makeReviews({ rating: 4.0, count: 4061 }),
        rating: 4.0,
        reviewCount: 4061,
        inStock: true,
        seller: "Sounce",
        tags: ["Cleaning", "Gadgets", "Maintenance"],
        badge: { text: "Value Pick", color: "bg-green-500/80" }
    }
];

const fashionProducts: MallProduct[] = [
    {
        id: "fash_01",
        name: "ASIAN Shadow-01 Sports Sneakers",
        slug: "asian-shadow-01-sneakers",
        price: 734,
        mrp: 1999,
        discount: 63,
        description: "Lightweight and stylish casual sneakers designed for gym sessions, training, and daily walking. Features a soft cushion insole for all-day comfort and an anti-skid sole for superior grip.",
        shortDescription: "Lightweight Training Sneakers with Cushion Insole",
        category: "Fashion & Footwear",
        categorySlug: "fashion",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80"
        ],
        specs: [
            { label: "Sole", value: "Anti-skid rubber" },
            { label: "Upper", value: "Breathable mesh" },
            { label: "Insole", value: "Soft cushion" }
        ],
        reviews: makeReviews({ rating: 3.8, count: 93 }),
        rating: 3.8,
        reviewCount: 93,
        inStock: true,
        seller: "ASIAN Footwear",
        tags: ["Sneakers", "Training", "Casual"]
    },
    {
        id: "fash_02",
        name: "ASIAN BOSTON-02 White Casual Sneakers",
        slug: "asian-boston-02-white",
        price: 587,
        mrp: 1499,
        discount: 61,
        description: "Trendy mid-top casual sneakers with a synthetic upper, perfect for men and boys. Ultra-lightweight build makes them ideal for all-day wear.",
        shortDescription: "Mid-top White Casual Sneakers for Men",
        category: "Fashion & Footwear",
        categorySlug: "fashion",
        images: [
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"
        ],
        specs: [
            { label: "Style", value: "Mid-top" },
            { label: "Upper", value: "Synthetic" },
            { label: "Weight", value: "Ultra-lightweight" }
        ],
        reviews: makeReviews({ rating: 3.8, count: 773 }),
        rating: 3.8,
        reviewCount: 773,
        inStock: true,
        seller: "ASIAN Footwear",
        tags: ["White Sneakers", "Casual", "Mid-top"],
        badge: { text: "Trending", color: "bg-pink-500/80" }
    },
    {
        id: "fash_03",
        name: "Kraasa Breathable Running Sneakers",
        slug: "kraasa-breathable-running",
        price: 799,
        mrp: 2499,
        discount: 68,
        description: "Performance trail running shoes featuring a memory insole for superior comfort during sports. Breathable knit fabric upper keeps feet cool during intense workouts.",
        shortDescription: "Memory Foam Running Shoes with Breathable Knit",
        category: "Fashion & Footwear",
        categorySlug: "fashion",
        images: [
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80"
        ],
        specs: [
            { label: "Insole", value: "Memory foam" },
            { label: "Fabric", value: "Breathable knit" },
            { label: "Sole", value: "Anti-skid rubber" }
        ],
        reviews: makeReviews({ rating: 4.7, count: 36 }),
        rating: 4.7,
        reviewCount: 36,
        inStock: true,
        seller: "Kraasa",
        tags: ["Running", "Memory Foam", "Performance"]
    },
    {
        id: "fash_04",
        name: "Marc Loire Slip-on Athleisure Sneaker",
        slug: "marc-loire-slip-on",
        price: 999,
        mrp: 2999,
        discount: 67,
        description: "Convenient slip-on shoes ideal for active lifestyle users who prioritize comfort and style. Lightweight construction with a comfort-first insole.",
        shortDescription: "Easy Slip-on Athleisure Shoes",
        category: "Fashion & Footwear",
        categorySlug: "fashion",
        images: [
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=80",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"
        ],
        specs: [
            { label: "Style", value: "Slip-on" },
            { label: "Build", value: "Lightweight" },
            { label: "Comfort", value: "Cushion insole" }
        ],
        reviews: makeReviews({ rating: 3.8, count: 27 }),
        rating: 3.8,
        reviewCount: 27,
        inStock: true,
        seller: "Marc Loire",
        tags: ["Slip-on", "Athleisure", "Comfort"]
    },
    {
        id: "fash_05",
        name: "ASIAN Mexico-02 Casual Sneaker Shoes",
        slug: "asian-mexico-02-casual",
        price: 685,
        mrp: 1699,
        discount: 60,
        description: "High-performance casual sneakers featuring a robust design for durability and style. Durable outdoor sole with soft interior padding for all-day comfort.",
        shortDescription: "Durable Casual Sneakers with Soft Padding",
        category: "Fashion & Footwear",
        categorySlug: "fashion",
        images: [
            "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80"
        ],
        specs: [
            { label: "Sole", value: "Durable outdoor" },
            { label: "Interior", value: "Soft padding" },
            { label: "Varieties", value: "Multiple colorways" }
        ],
        reviews: makeReviews({ rating: 3.8, count: 1240 }),
        rating: 3.8,
        reviewCount: 1240,
        inStock: true,
        seller: "ASIAN Footwear",
        tags: ["Casual", "Durable", "Daily Wear"]
    }
];

const groceryProducts: MallProduct[] = [
    {
        id: "groc_01",
        name: "Flavour Fusion Complete Indian Meal Combo",
        slug: "flavour-fusion-meal-combo",
        price: 418,
        mrp: 699,
        discount: 40,
        description: "A convenient ready-to-cook meal pack consisting of Jeera Rice, Dal Fry, Dal Khichdi, and Moongdal Sheera. No added preservatives, perfect for quick nutritious meals.",
        shortDescription: "4-in-1 Ready-to-Cook Indian Meal Pack",
        category: "Grocery & Essentials",
        categorySlug: "grocery",
        images: [
            "https://images.unsplash.com/photo-1596097635121-14b63a7a8c8e?w=600&q=80",
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80"
        ],
        specs: [
            { label: "Contents", value: "Pack of 4 varieties" },
            { label: "Prep Time", value: "Ready in minutes" },
            { label: "Preservatives", value: "None" }
        ],
        reviews: makeReviews({ rating: 4.0, count: 15 }),
        rating: 4.0,
        reviewCount: 15,
        inStock: true,
        seller: "Flavour Fusion",
        tags: ["Ready-to-cook", "Indian Food", "Combo"]
    },
    {
        id: "groc_02",
        name: "Manna Millets 2kg Whole Grains Combo",
        slug: "manna-millets-combo",
        price: 499,
        mrp: 799,
        discount: 38,
        description: "A healthy unpolished millet mix including Foxtail, Kodo, Little, and Barnyard millets. Certified low GI, 100% unpolished for maximum nutrition.",
        shortDescription: "4-Variety Unpolished Millet Health Pack (2kg)",
        category: "Grocery & Essentials",
        categorySlug: "grocery",
        images: [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80"
        ],
        specs: [
            { label: "Weight", value: "2kg (500g × 4)" },
            { label: "GI Index", value: "Certified Low" },
            { label: "Processing", value: "100% Unpolished" }
        ],
        reviews: makeReviews({ rating: 4.3, count: 2700 }),
        rating: 4.3,
        reviewCount: 2700,
        inStock: true,
        seller: "Manna Foods",
        tags: ["Millets", "Healthy", "Organic"],
        badge: { text: "Health Pick", color: "bg-green-600/80" }
    },
    {
        id: "groc_03",
        name: "Pureheart Cherokee Premium Trail Mix",
        slug: "pureheart-cherokee-trail-mix",
        price: 1299,
        mrp: 1799,
        discount: 28,
        description: "A premium mix of 8 healthy superfood nuts and dry fruits including cashews, almonds, and pistachios. High protein and fiber in a reusable 1kg jar.",
        shortDescription: "8-Superfood Premium Dry Fruit & Nut Mix (1kg)",
        category: "Grocery & Essentials",
        categorySlug: "grocery",
        images: [
            "https://images.unsplash.com/photo-1599599810769-bcde5a26dd73?w=600&q=80",
            "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=600&q=80"
        ],
        specs: [
            { label: "Weight", value: "1kg Reusable Jar" },
            { label: "Ingredients", value: "8 Superfoods" },
            { label: "Nutrition", value: "High Protein & Fiber" }
        ],
        reviews: makeReviews({ rating: 4.1, count: 505 }),
        rating: 4.1,
        reviewCount: 505,
        inStock: true,
        seller: "Pureheart",
        tags: ["Trail Mix", "Dry Fruits", "Premium"]
    },
    {
        id: "groc_04",
        name: "DESI KHAJANA Kitchen Essentials Combo (18 Pack)",
        slug: "desi-khajana-kitchen-combo",
        price: 3315,
        mrp: 4999,
        discount: 34,
        description: "A massive 18-pack organic combo featuring flours, pulses, Basmati rice, and essential spices. Chemical-free processing, sourced directly from Indian farms.",
        shortDescription: "18-Pack Organic Kitchen Essentials (9kg Total)",
        category: "Grocery & Essentials",
        categorySlug: "grocery",
        images: [
            "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=80",
            "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&q=80"
        ],
        specs: [
            { label: "Packs", value: "18 Organic (9kg)" },
            { label: "Processing", value: "Chemical-free" },
            { label: "Source", value: "Indian farms" }
        ],
        reviews: makeReviews({ rating: 4.5, count: 15 }),
        rating: 4.5,
        reviewCount: 15,
        inStock: true,
        seller: "Desi Khajana",
        tags: ["Organic", "Bulk", "Kitchen Essentials"]
    },
    {
        id: "groc_05",
        name: "Tata Sampann Unpolished Toor Dal",
        slug: "tata-sampann-toor-dal",
        price: 195,
        mrp: 250,
        discount: 22,
        description: "High-quality unpolished toor dal that retains its natural nutritional value and protein content. Sourced and processed by Tata Consumer Products.",
        shortDescription: "Protein-rich Unpolished Toor Dal (1kg)",
        category: "Grocery & Essentials",
        categorySlug: "grocery",
        images: [
            "https://images.unsplash.com/photo-1612257999756-196547fd1f5b?w=600&q=80",
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80"
        ],
        specs: [
            { label: "Weight", value: "1kg" },
            { label: "Type", value: "Unpolished" },
            { label: "Protein", value: "Naturally rich" }
        ],
        reviews: makeReviews({ rating: 4.4, count: 15000 }),
        rating: 4.4,
        reviewCount: 15000,
        inStock: true,
        seller: "Tata Sampann",
        tags: ["Dal", "Tata", "Protein"],
        badge: { text: "Top Rated", color: "bg-blue-500/80" }
    }
];

const homeProducts: MallProduct[] = [
    {
        id: "home_01",
        name: "24-Piece Airtight Kitchen Storage Container Set",
        slug: "24pc-storage-container-set",
        price: 604,
        mrp: 1499,
        discount: 60,
        description: "A comprehensive kitchen storage solution featuring airtight containers of various sizes (1200ml to 250ml) with spoons included. Food-grade plastic keeps ingredients fresh.",
        shortDescription: "24 Containers + 24 Spoons Airtight Storage Set",
        category: "Home & Kitchen",
        categorySlug: "home-kitchen",
        images: [
            "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80",
            "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=600&q=80"
        ],
        specs: [
            { label: "Material", value: "Food-grade Plastic" },
            { label: "Seal", value: "Airtight" },
            { label: "Contents", value: "24 containers + 24 spoons" }
        ],
        reviews: makeReviews({ rating: 4.4, count: 105 }),
        rating: 4.4,
        reviewCount: 105,
        inStock: true,
        seller: "HomeStyle",
        tags: ["Storage", "Kitchen", "Organizer"],
        badge: { text: "Popular", color: "bg-orange-500/80" }
    },
    {
        id: "home_02",
        name: "Multi-use 3-Tier Spice Rack Organizer",
        slug: "3-tier-spice-rack",
        price: 295,
        mrp: 799,
        discount: 63,
        description: "A space-saving vertical organizer for kitchen countertops or floors, designed to hold spice jars, bottles, and canisters. Durable plastic body with easy assembly.",
        shortDescription: "Space-saving 3-Tier Kitchen Spice Organizer",
        category: "Home & Kitchen",
        categorySlug: "home-kitchen",
        images: [
            "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&q=80",
            "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=600&q=80"
        ],
        specs: [
            { label: "Tiers", value: "3-tier open design" },
            { label: "Material", value: "Durable Plastic" },
            { label: "Assembly", value: "Easy snap-fit" }
        ],
        reviews: makeReviews({ rating: 4.1, count: 1495 }),
        rating: 4.1,
        reviewCount: 1495,
        inStock: true,
        seller: "MeeshoHome",
        tags: ["Spice Rack", "Organizer", "Kitchen"]
    },
    {
        id: "home_03",
        name: "Manual String Vegetable Chopper",
        slug: "string-vegetable-chopper",
        price: 197,
        mrp: 599,
        discount: 67,
        description: "A pull-string manual chopper for quick and efficient dicing of vegetables and herbs without electricity. Stainless steel blades with anti-skid base for safety.",
        shortDescription: "Pull-string Veggie Chopper with SS Blades",
        category: "Home & Kitchen",
        categorySlug: "home-kitchen",
        images: [
            "https://images.unsplash.com/photo-1585237017125-24baf7efbad9?w=600&q=80",
            "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?w=600&q=80"
        ],
        specs: [
            { label: "Blades", value: "Stainless Steel" },
            { label: "Capacity", value: "450ml" },
            { label: "Safety", value: "Anti-skid base" }
        ],
        reviews: makeReviews({ rating: 3.6, count: 101 }),
        rating: 3.6,
        reviewCount: 101,
        inStock: true,
        seller: "KitchenCraft",
        tags: ["Chopper", "Manual", "Kitchen Tool"]
    },
    {
        id: "home_04",
        name: "Non-Stick Dosa Tawa & Fry Pan Set",
        slug: "nonstick-tawa-fry-pan-set",
        price: 708,
        mrp: 1999,
        discount: 65,
        description: "Essential non-stick cookware set designed for oil-free cooking of dosas, rotis, and stir-fries. High-grade aluminium with Bakelite handles for cool grip.",
        shortDescription: "2-Piece Non-stick Cookware Set (Tawa + Pan)",
        category: "Home & Kitchen",
        categorySlug: "home-kitchen",
        images: [
            "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
        ],
        specs: [
            { label: "Material", value: "High-grade Aluminium" },
            { label: "Coating", value: "Non-stick" },
            { label: "Handle", value: "Bakelite cool-grip" }
        ],
        reviews: makeReviews({ rating: 3.5, count: 36 }),
        rating: 3.5,
        reviewCount: 36,
        inStock: true,
        seller: "CookMaster",
        tags: ["Cookware", "Non-stick", "Kitchen"]
    },
    {
        id: "home_05",
        name: "Samosa Maker Press Mould (24 Cavity)",
        slug: "samosa-maker-press-mould",
        price: 97,
        mrp: 299,
        discount: 68,
        description: "A manual kitchen tool designed to create 24 samosas at once with uniform shape and size. BPA-free plastic, hand-washable, ideal for festivals and large families.",
        shortDescription: "24-Cavity Samosa Press for Perfect Samosas",
        category: "Home & Kitchen",
        categorySlug: "home-kitchen",
        images: [
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
            "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80"
        ],
        specs: [
            { label: "Material", value: "BPA-free Plastic" },
            { label: "Capacity", value: "24 cavities" },
            { label: "Cleaning", value: "Hand-washable" }
        ],
        reviews: makeReviews({ rating: 4.2, count: 320 }),
        rating: 4.2,
        reviewCount: 320,
        inStock: true,
        seller: "MeeshoHome",
        tags: ["Samosa Maker", "Kitchen Tool", "Festival"]
    }
];

const beautyProducts: MallProduct[] = [
    {
        id: "beau_01",
        name: "Skin Derma Roller (540 Titanium Needles)",
        slug: "skin-derma-roller-540",
        price: 96,
        mrp: 499,
        discount: 81,
        description: "A professional-grade micro-needling device for facial rejuvenation and improved absorption of skincare serums. 540 titanium needles at 0.5mm depth with ergonomic handle.",
        shortDescription: "Professional Micro-needling Derma Roller",
        category: "Health & Beauty",
        categorySlug: "health-beauty",
        images: [
            "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80"
        ],
        specs: [
            { label: "Needles", value: "540 Titanium (0.5mm)" },
            { label: "Handle", value: "Ergonomic grip" },
            { label: "Use", value: "Reusable" }
        ],
        reviews: makeReviews({ rating: 4.2, count: 3220 }),
        rating: 4.2,
        reviewCount: 3220,
        inStock: true,
        seller: "SkinPro",
        tags: ["Derma Roller", "Skincare", "Professional"],
        badge: { text: "Best Seller", color: "bg-rose-500/80" }
    },
    {
        id: "beau_02",
        name: "Goree Beauty Whitening Cream",
        slug: "goree-beauty-whitening-cream",
        price: 356,
        mrp: 699,
        discount: 49,
        description: "A popular herbal beauty cream infused with Lycopene and Aloe Vera for a smoother and brighter complexion. Recommended for night-time use.",
        shortDescription: "Herbal Brightening Cream with Aloe Vera",
        category: "Health & Beauty",
        categorySlug: "health-beauty",
        images: [
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80"
        ],
        specs: [
            { label: "Size", value: "30g" },
            { label: "Key Ingredient", value: "Aloe Vera + Lycopene" },
            { label: "Usage", value: "Night cream" }
        ],
        reviews: makeReviews({ rating: 4.1, count: 5683 }),
        rating: 4.1,
        reviewCount: 5683,
        inStock: true,
        seller: "Goree Beauty",
        tags: ["Cream", "Brightening", "Herbal"]
    },
    {
        id: "beau_03",
        name: "White Rice Skin Beauty Serum",
        slug: "white-rice-skin-serum",
        price: 145,
        mrp: 399,
        discount: 64,
        description: "A nourishing liquid essence derived from white rice extracts to deeply hydrate and refine skin texture. Oil-free absorption for all skin types.",
        shortDescription: "Rice Extract Hydrating Face Serum (30ml)",
        category: "Health & Beauty",
        categorySlug: "health-beauty",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
            "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80"
        ],
        specs: [
            { label: "Volume", value: "30ml dropper" },
            { label: "Extract", value: "Rice Bran Oil" },
            { label: "Absorption", value: "Oil-free" }
        ],
        reviews: makeReviews({ rating: 4.3, count: 82 }),
        rating: 4.3,
        reviewCount: 82,
        inStock: true,
        seller: "RiceSkin",
        tags: ["Serum", "Hydrating", "Rice Extract"]
    },
    {
        id: "beau_04",
        name: "Kkogicare Skin Lightening Treatment Cream",
        slug: "kkogicare-lightening-cream",
        price: 131,
        mrp: 399,
        discount: 67,
        description: "A targeted treatment cream designed to lighten dark spots and even out skin tone on the face and body. Non-greasy formula with Arbutin and Vitamin E.",
        shortDescription: "Dark Spot Treatment Cream with Arbutin",
        category: "Health & Beauty",
        categorySlug: "health-beauty",
        images: [
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80"
        ],
        specs: [
            { label: "Size", value: "50g" },
            { label: "Formula", value: "Non-greasy" },
            { label: "Key Ingredients", value: "Arbutin + Vitamin E" }
        ],
        reviews: makeReviews({ rating: 3.8, count: 1888 }),
        rating: 3.8,
        reviewCount: 1888,
        inStock: true,
        seller: "Kkogicare",
        tags: ["Dark Spots", "Treatment", "Arbutin"]
    },
    {
        id: "beau_05",
        name: "Korean Premium Whitening Glow Soap",
        slug: "korean-whitening-glow-soap",
        price: 94,
        mrp: 299,
        discount: 69,
        description: "A specialized soap bar formulated with skin-brightening agents inspired by Korean beauty standards to reduce tan and enhance radiance.",
        shortDescription: "K-Beauty Inspired Brightening Soap Bar",
        category: "Health & Beauty",
        categorySlug: "health-beauty",
        images: [
            "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80",
            "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&q=80"
        ],
        specs: [
            { label: "Weight", value: "100g bar" },
            { label: "Key Ingredient", value: "Kojic Acid" },
            { label: "Skin Type", value: "All types" }
        ],
        reviews: makeReviews({ rating: 3.7, count: 46 }),
        rating: 3.7,
        reviewCount: 46,
        inStock: true,
        seller: "K-Glow",
        tags: ["Soap", "Korean", "Brightening"]
    }
];

const lifestyleProducts: MallProduct[] = [
    {
        id: "life_01",
        name: "Contacts Premium Italian Leather Wallet",
        slug: "contacts-italian-leather-wallet",
        price: 1750,
        mrp: 3999,
        discount: 56,
        description: "A luxury bi-fold wallet for men crafted from genuine top-grain Italian leather with a vintage aesthetic. Features RFID blocking technology and 12 card slots.",
        shortDescription: "RFID Blocking Genuine Italian Leather Bi-fold",
        category: "Premium Lifestyle",
        categorySlug: "lifestyle",
        images: [
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
            "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80"
        ],
        specs: [
            { label: "Material", value: "Genuine Italian Leather" },
            { label: "Security", value: "RFID Blocking" },
            { label: "Slots", value: "12 card slots" }
        ],
        reviews: makeReviews({ rating: 4.0, count: 51 }),
        rating: 4.0,
        reviewCount: 51,
        inStock: true,
        seller: "Contacts Leather",
        tags: ["Wallet", "Leather", "RFID"]
    },
    {
        id: "life_02",
        name: "Scriveiner Chrome Luxury Ballpoint Pen",
        slug: "scriveiner-chrome-ballpoint",
        price: 4999,
        mrp: 7999,
        discount: 38,
        description: "A stunning professional pen with a chrome finish and 24K gold tier appointments, presented in a luxury gift box. Weighted brass body with Schmidt refill.",
        shortDescription: "24K Gold Accented Chrome Ballpoint Gift Pen",
        category: "Premium Lifestyle",
        categorySlug: "lifestyle",
        images: [
            "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
            "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80"
        ],
        specs: [
            { label: "Body", value: "Weighted Brass" },
            { label: "Refill", value: "Schmidt included" },
            { label: "Packaging", value: "Luxury gift box" }
        ],
        reviews: makeReviews({ rating: 4.8, count: 2450 }),
        rating: 4.8,
        reviewCount: 2450,
        inStock: true,
        seller: "Scriveiner",
        tags: ["Pen", "Luxury", "Gift"],
        badge: { text: "Premium", color: "bg-purple-600/80" }
    },
    {
        id: "life_03",
        name: "Ray-Ban Classic Polarized Aviator Sunglasses",
        slug: "ray-ban-aviator-polarized",
        price: 11390,
        mrp: 15990,
        discount: 29,
        description: "The iconic pilot-style sunglasses featuring gold metal frames and polarized G-15 green lenses for superior clarity. 100% UV protection.",
        shortDescription: "Iconic Gold-frame Polarized Aviator with UV Protection",
        category: "Premium Lifestyle",
        categorySlug: "lifestyle",
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"
        ],
        specs: [
            { label: "Lens", value: "Polarized G-15 Green" },
            { label: "Frame", value: "Gold Metal" },
            { label: "UV", value: "100% Protection" }
        ],
        reviews: makeReviews({ rating: 4.3, count: 825 }),
        rating: 4.3,
        reviewCount: 825,
        inStock: true,
        seller: "Ray-Ban Official",
        tags: ["Sunglasses", "Aviator", "Polarized"]
    },
    {
        id: "life_04",
        name: "Mokobara Transit Laptop Backpack",
        slug: "mokobara-transit-backpack",
        price: 5799,
        mrp: 7999,
        discount: 27,
        description: "A high-end business backpack with a dedicated 16\" laptop sleeve and premium vegan leather accents. 30L capacity with luggage pass-through strap.",
        shortDescription: "30L Premium Business Backpack with Laptop Sleeve",
        category: "Premium Lifestyle",
        categorySlug: "lifestyle",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
            "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80"
        ],
        specs: [
            { label: "Capacity", value: "30L" },
            { label: "Laptop", value: "Fits 16\" " },
            { label: "Material", value: "Water-resistant + Vegan Leather" }
        ],
        reviews: makeReviews({ rating: 4.5, count: 1869 }),
        rating: 4.5,
        reviewCount: 1869,
        inStock: true,
        seller: "Mokobara",
        tags: ["Backpack", "Laptop", "Business"]
    },
    {
        id: "life_05",
        name: "Sony WH-1000XM5 Noise Cancelling Headphones",
        slug: "sony-wh1000xm5-headphones",
        price: 29927,
        mrp: 34990,
        discount: 14,
        description: "Industry-leading flagship wireless headphones with dual processors for exceptional noise cancellation and call quality. 30-hour battery with multipoint connection.",
        shortDescription: "Flagship ANC Wireless Headphones with 30hr Battery",
        category: "Premium Lifestyle",
        categorySlug: "lifestyle",
        images: [
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
        ],
        specs: [
            { label: "Battery", value: "30 hours" },
            { label: "Connection", value: "Multipoint Bluetooth" },
            { label: "Audio", value: "LDAC Hi-Res Support" }
        ],
        reviews: makeReviews({ rating: 4.4, count: 12157 }),
        rating: 4.4,
        reviewCount: 12157,
        inStock: true,
        seller: "Sony India",
        tags: ["Headphones", "ANC", "Sony"],
        badge: { text: "Flagship", color: "bg-slate-700/90" }
    }
];

// ─── EXPORTS ─────────────────────────────────

export const ALL_PRODUCTS: MallProduct[] = [
    ...electronicsProducts,
    ...fashionProducts,
    ...groceryProducts,
    ...homeProducts,
    ...beautyProducts,
    ...lifestyleProducts
];

export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(p => p.badge);
export const TRENDING_PRODUCTS = ALL_PRODUCTS.filter(p => p.rating >= 4.2);

export function getProductById(id: string): MallProduct | undefined {
    return ALL_PRODUCTS.find(p => p.id === id);
}

export function getProductBySlug(slug: string): MallProduct | undefined {
    return ALL_PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): MallProduct[] {
    return ALL_PRODUCTS.filter(p => p.categorySlug === categorySlug);
}

export function getRelatedProducts(productId: string, limit = 4): MallProduct[] {
    const product = getProductById(productId);
    if (!product) return ALL_PRODUCTS.slice(0, limit);
    return ALL_PRODUCTS
        .filter(p => p.categorySlug === product.categorySlug && p.id !== productId)
        .slice(0, limit);
}

export function searchProducts(query: string): MallProduct[] {
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
}
