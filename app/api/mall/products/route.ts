import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type Product = {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number;
    image: string;
    rating: number;
    reviews: number;
    isValuePick: boolean;
    description: string;
    bulletPoints?: string[];
    features?: string[];
    specifications?: Record<string, string>;
    seoKeywords?: string[];
    badge?: string;
    seller?: string;
    stock?: number;
};



// Reliable Pexels/Unsplash image pools per category
const IMAGES: Record<string, string[]> = {
    'Electronics': [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Fashion': [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Home & Kitchen': [
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Health & Fitness': [
        'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Beauty & Personal Care': [
        'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Automotive': [
        'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Sports & Outdoors': [
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Books': [
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Toys & Games': [
        'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1598166/pexels-photo-1598166.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Grocery': [
        'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Pet Supplies': [
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/2803516/pexels-photo-2803516.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Office Products': [
        'https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Baby Products': [
        'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1620647/pexels-photo-1620647.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Musical Instruments': [
        'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/4087991/pexels-photo-4087991.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    'Garden & Outdoors': [
        'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/1284170/pexels-photo-1284170.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
};

const KEYWORD_TO_CAT: Record<string, string> = {
    'earbuds': 'Electronics', 'smartwatch': 'Electronics', 'headphones': 'Electronics', 'computer,mouse': 'Electronics', 'charger': 'Electronics', 'ipad': 'Electronics', 'smartphone': 'Electronics', 'speaker': 'Electronics',
    'sneakers': 'Fashion', 'jeans': 'Fashion', 'sunglasses': 'Fashion', 'jacket': 'Fashion', 'wallet': 'Fashion', 'watch': 'Fashion', 'shoes': 'Fashion', 'shirt': 'Fashion',
    'cooker': 'Home & Kitchen', 'purifier': 'Home & Kitchen', 'vacuum': 'Home & Kitchen', 'lunchbox': 'Home & Kitchen', 'fan': 'Home & Kitchen', 'flask': 'Home & Kitchen',
    'yogamat': 'Health & Fitness', 'massage': 'Health & Fitness', 'protein': 'Health & Fitness', 'fitness': 'Health & Fitness', 'football': 'Health & Fitness', 'jersey': 'Health & Fitness',
    'serum': 'Beauty & Personal Care', 'hair': 'Beauty & Personal Care', 'facewash': 'Beauty & Personal Care', 'makeup': 'Beauty & Personal Care', 'beard': 'Beauty & Personal Care', 'skincare': 'Beauty & Personal Care',
    'dashcam': 'Automotive', 'car,battery': 'Automotive', 'carbattery': 'Automotive', 'car,paint': 'Automotive', 'tire': 'Automotive',
    'backpack': 'Sports & Outdoors', 'resistance,band': 'Sports & Outdoors', 'soccer': 'Sports & Outdoors', 'badminton': 'Sports & Outdoors', 'tent': 'Sports & Outdoors', 'gloves': 'Sports & Outdoors',
    'book,atomic': 'Books', 'book,money': 'Books', 'book,finance': 'Books', 'book,startup': 'Books', 'book,work': 'Books',
    'lego': 'Toys & Games', 'scrabble': 'Toys & Games', 'hotwheels': 'Toys & Games', 'puzzle': 'Toys & Games', 'toy,car': 'Toys & Games',
    'rice': 'Grocery', 'dal': 'Grocery', 'coffee': 'Grocery', 'tea': 'Grocery', 'ghee': 'Grocery',
    'dogfood': 'Pet Supplies', 'catfood': 'Pet Supplies', 'pet,carrier': 'Pet Supplies', 'dog,collar': 'Pet Supplies', 'pet,fountain': 'Pet Supplies',
    'standing,desk': 'Office Products', 'pencil': 'Office Products', 'printer': 'Office Products', 'folder': 'Office Products', 'lightbulb': 'Office Products',
    'diaper': 'Baby Products', 'baby,carrier': 'Baby Products', 'baby,bouncer': 'Baby Products', 'baby,powder': 'Baby Products', 'baby,food': 'Baby Products',
    'piano': 'Musical Instruments', 'guitar': 'Musical Instruments', 'drums': 'Musical Instruments', 'keyboard,music': 'Musical Instruments',
    'plants': 'Garden & Outdoors', 'lawnmower': 'Garden & Outdoors', 'soil': 'Garden & Outdoors', 'garden,lights': 'Garden & Outdoors', 'irrigation': 'Garden & Outdoors'
};

const getImg = (keyword: string, index: number) => {
    const category = KEYWORD_TO_CAT[keyword] || 'Electronics';
    const list = IMAGES[category] || IMAGES['Electronics'];
    return list[index % list.length];
};

const CATALOG: Product[] = [
    {
        id: "MALL-PRD-00001",
        name: "Postural Corrector Pro",
        brand: "HealthCore",
        price: 750,
        originalPrice: 1050,
        rating: 4.8,
        reviews: 5205,
        image: "https://images.pexels.com/photos/449850/pexels-photo-449850.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Health & Fitness",
        badge: "-28%",
        isValuePick: true,
        description: "Achieve perfect posture and relieve back pain with the Postural Corrector Pro. Its ergonomic, adjustable design provides all-day comfort while training your muscles to maintain proper alignment.",
        bulletPoints: ["Adjustable fit", "Ergonomic design", "Breathable material"],
        features: ["Posture correction", "Back pain relief", "Easy to wear"],
        seoKeywords: ["posture corrector", "back support", "health core"]
    },
    {
        "id": "MALL-PRD-07720",
        "name": "Vikas Psychology XXL",
        "brand": "Vikas",
        "category": "Books",
        "price": 920,
        "originalPrice": 1560,
        "image": "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49985,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium psychology from Vikas.",
        "bulletPoints": [
            "Premium quality from Vikas",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Durable",
            "Wireless"
        ],
        "seoKeywords": [
            "psychology",
            "vikas",
            "psychology books"
        ],
        "seller": "Vikas Official",
        "stock": 305,
        "badge": "-41%"
    },

    {
        "id": "MALL-PRD-03635",
        "name": "MuscleBlaze Sports Shoes Smart Gold",
        "brand": "MuscleBlaze",
        "category": "Health & Fitness",
        "price": 8880,
        "originalPrice": 17200,
        "image": "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49954,
        "isValuePick": false,
        "description": "Best-in-class sports shoes with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from MuscleBlaze",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Lightweight",
            "Waterproof",
            "Premium",
            "Durable"
        ],
        "seoKeywords": [
            "sports shoes",
            "muscleblaze",
            "sports shoes health & fitness"
        ],
        "seller": "MuscleBlaze Official",
        "stock": 52,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-12068",
        "name": "Tommee Tippee Baby Carrier 500ml",
        "brand": "Tommee Tippee",
        "category": "Baby Products",
        "price": 7220,
        "originalPrice": 10030,
        "image": "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49872,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium baby carrier from Tommee Tippee.",
        "bulletPoints": [
            "Premium quality from Tommee Tippee",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Lightweight",
            "Compact",
            "Smart",
            "Portable",
            "Waterproof"
        ],
        "seoKeywords": [
            "baby carrier",
            "tommee tippee",
            "baby carrier baby products"
        ],
        "seller": "Tommee Tippee Official",
        "stock": 15,
        "badge": "-28%"
    },

    {
        "id": "MALL-PRD-12777",
        "name": "Dr. Brown's Bath Elite Gold",
        "brand": "Dr. Brown's",
        "category": "Baby Products",
        "price": 5990,
        "originalPrice": 11150,
        "image": "https://images.pexels.com/photos/1620647/pexels-photo-1620647.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49870,
        "isValuePick": false,
        "description": "Premium quality bath from Dr. Brown's. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Dr. Brown's",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Lightweight",
            "Waterproof",
            "Premium"
        ],
        "seoKeywords": [
            "bath",
            "dr. brown's",
            "bath baby products"
        ],
        "seller": "Dr. Brown's Official",
        "stock": 390,
        "badge": "-46%"
    },

    {
        "id": "MALL-PRD-05410",
        "name": "Motul Floor Mat Premium Green",
        "brand": "Motul",
        "category": "Automotive",
        "price": 5490,
        "originalPrice": 7150,
        "image": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49831,
        "isValuePick": true,
        "description": "Premium quality floor mat from Motul. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Motul",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Lightweight",
            "Compact",
            "Waterproof"
        ],
        "seoKeywords": [
            "floor mat",
            "motul",
            "floor mat automotive"
        ],
        "seller": "Motul Official",
        "stock": 429,
        "badge": "-23%"
    },

    {
        "id": "MALL-PRD-10181",
        "name": "Farmina Dog Collar S",
        "brand": "Farmina",
        "category": "Pet Supplies",
        "price": 2590,
        "originalPrice": 3350,
        "image": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49769,
        "isValuePick": false,
        "description": "Premium quality dog collar from Farmina. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Farmina",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Smart",
            "Lightweight",
            "Waterproof"
        ],
        "seoKeywords": [
            "dog collar",
            "farmina",
            "dog collar pet supplies"
        ],
        "seller": "Farmina Official",
        "stock": 472,
        "badge": "-22%"
    },

    {
        "id": "MALL-PRD-13007",
        "name": "Pearl Piano Pro Grey",
        "brand": "Pearl",
        "category": "Musical Instruments",
        "price": 14650,
        "originalPrice": 25550,
        "image": "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49742,
        "isValuePick": false,
        "description": "Premium quality piano from Pearl. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Pearl",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Wireless",
            "Premium",
            "Waterproof",
            "Compact",
            "Lightweight"
        ],
        "seoKeywords": [
            "piano",
            "pearl",
            "piano musical instruments"
        ],
        "seller": "Pearl Official",
        "stock": 498,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-05753",
        "name": "TVS Bulb Smart Grey",
        "brand": "TVS",
        "category": "Automotive",
        "price": 7380,
        "originalPrice": 13710,
        "image": "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49510,
        "isValuePick": false,
        "description": "High-performance bulb designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from TVS",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Compact",
            "Wireless",
            "Smart"
        ],
        "seoKeywords": [
            "bulb",
            "tvs",
            "bulb automotive"
        ],
        "seller": "TVS Official",
        "stock": 199,
        "badge": "-46%"
    },

    {
        "id": "MALL-PRD-04368",
        "name": "L'Oreal Sunscreen Plus Gold",
        "brand": "L'Oreal",
        "category": "Beauty & Personal Care",
        "price": 2010,
        "originalPrice": 3980,
        "image": "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49490,
        "isValuePick": true,
        "description": "Premium quality sunscreen from L'Oreal. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from L'Oreal",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Smart",
            "Premium",
            "Waterproof",
            "Lightweight",
            "Compact"
        ],
        "seoKeywords": [
            "sunscreen",
            "l'oreal",
            "sunscreen beauty & personal care"
        ],
        "seller": "L'Oreal Official",
        "stock": 111,
        "badge": "-49%"
    },

    {
        "id": "MALL-PRD-09041",
        "name": "Britannia Rice 500ml",
        "brand": "Britannia",
        "category": "Grocery",
        "price": 1510,
        "originalPrice": 2510,
        "image": "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49266,
        "isValuePick": false,
        "description": "Premium quality rice from Britannia. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Britannia",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Wireless",
            "Waterproof",
            "Smart",
            "Portable"
        ],
        "seoKeywords": [
            "rice",
            "britannia",
            "rice grocery"
        ],
        "seller": "Britannia Official",
        "stock": 65,
        "badge": "-39%"
    },

    {
        "id": "MALL-PRD-04748",
        "name": "Wow Shampoo White M",
        "brand": "Wow",
        "category": "Beauty & Personal Care",
        "price": 2310,
        "originalPrice": 3390,
        "image": "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49197,
        "isValuePick": false,
        "description": "High-performance shampoo designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Wow",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Compact",
            "Premium",
            "Lightweight",
            "Waterproof"
        ],
        "seoKeywords": [
            "shampoo",
            "wow",
            "shampoo beauty & personal care"
        ],
        "seller": "Wow Official",
        "stock": 299,
        "badge": "-31%"
    },

    {
        "id": "MALL-PRD-06144",
        "name": "Quechua Soccer Ultimate Blue",
        "brand": "Quechua",
        "category": "Sports & Outdoors",
        "price": 7550,
        "originalPrice": 15040,
        "image": "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49179,
        "isValuePick": false,
        "description": "Premium quality soccer from Quechua. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Quechua",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Smart",
            "Compact"
        ],
        "seoKeywords": [
            "soccer",
            "quechua",
            "soccer sports & outdoors"
        ],
        "seller": "Quechua Official",
        "stock": 144,
        "badge": "-49%"
    },

    {
        "id": "MALL-PRD-10100",
        "name": "Hill's Pet Carrier Black",
        "brand": "Hill's",
        "category": "Pet Supplies",
        "price": 2760,
        "originalPrice": 3430,
        "image": "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 49090,
        "isValuePick": true,
        "description": "High-performance pet carrier designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Hill's",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Portable",
            "Premium",
            "Durable",
            "Compact"
        ],
        "seoKeywords": [
            "pet carrier",
            "hill's",
            "pet carrier pet supplies"
        ],
        "seller": "Hill's Official",
        "stock": 62
    },

    {
        "id": "MALL-PRD-00343",
        "name": "OnePlus Smartphone Silver",
        "brand": "OnePlus",
        "category": "Electronics",
        "price": 21480,
        "originalPrice": 38390,
        "image": "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48891,
        "isValuePick": false,
        "description": "High-performance smartphone designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from OnePlus",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Compact",
            "Smart",
            "Lightweight",
            "Waterproof"
        ],
        "seoKeywords": [
            "smartphone",
            "oneplus",
            "smartphone electronics"
        ],
        "seller": "OnePlus Official",
        "stock": 431,
        "badge": "-44%"
    },

    {
        "id": "MALL-PRD-14789",
        "name": "Jiffy Path Green L",
        "brand": "Jiffy",
        "category": "Garden & Outdoors",
        "price": 9990,
        "originalPrice": 13620,
        "image": "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48878,
        "isValuePick": true,
        "description": "Upgrade your experience with this premium path from Jiffy.",
        "bulletPoints": [
            "Premium quality from Jiffy",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Wireless",
            "Lightweight"
        ],
        "seoKeywords": [
            "path",
            "jiffy",
            "path garden & outdoors"
        ],
        "seller": "Jiffy Official",
        "stock": 119,
        "badge": "-26%"
    },

    {
        "id": "MALL-PRD-00291",
        "name": "Sony Ipad Premium White",
        "brand": "Sony",
        "category": "Electronics",
        "price": 13630,
        "originalPrice": 23860,
        "image": "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48780,
        "isValuePick": false,
        "description": "High-performance ipad designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Sony",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Smart",
            "Lightweight",
            "Waterproof",
            "Compact"
        ],
        "seoKeywords": [
            "ipad",
            "sony",
            "ipad electronics"
        ],
        "seller": "Sony Official",
        "stock": 39,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-14856",
        "name": "Ugaoo Fence Elite Green",
        "brand": "Ugaoo",
        "category": "Garden & Outdoors",
        "price": 6690,
        "originalPrice": 8500,
        "image": "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48601,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium fence from Ugaoo.",
        "bulletPoints": [
            "Premium quality from Ugaoo",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Portable",
            "Wireless",
            "Premium"
        ],
        "seoKeywords": [
            "fence",
            "ugaoo",
            "fence garden & outdoors"
        ],
        "seller": "Ugaoo Official",
        "stock": 275,
        "badge": "-21%"
    },

    {
        "id": "MALL-PRD-11542",
        "name": "Lenovo Notebook Smart Black",
        "brand": "Lenovo",
        "category": "Office Products",
        "price": 5560,
        "originalPrice": 9440,
        "image": "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48525,
        "isValuePick": true,
        "description": "Lenovo's signature notebook - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Lenovo",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Premium",
            "Lightweight"
        ],
        "seoKeywords": [
            "notebook",
            "lenovo",
            "notebook office products"
        ],
        "seller": "Lenovo Official",
        "stock": 467,
        "badge": "-41%"
    },

    {
        "id": "MALL-PRD-05175",
        "name": "MRF Tire 1L",
        "brand": "MRF",
        "category": "Automotive",
        "price": 2290,
        "originalPrice": 2850,
        "image": "https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48187,
        "isValuePick": false,
        "description": "High-performance tire designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from MRF",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Premium",
            "Smart",
            "Wireless",
            "Waterproof"
        ],
        "seoKeywords": [
            "tire",
            "mrf",
            "tire automotive"
        ],
        "seller": "MRF Official",
        "stock": 81
    },

    {
        "id": "MALL-PRD-00173",
        "name": "Xiaomi Mouse Elite White",
        "brand": "Xiaomi",
        "category": "Electronics",
        "price": 19100,
        "originalPrice": 35340,
        "image": "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48180,
        "isValuePick": false,
        "description": "Premium quality mouse from Xiaomi. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Xiaomi",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Compact",
            "Lightweight",
            "Portable",
            "Wireless"
        ],
        "seoKeywords": [
            "mouse",
            "xiaomi",
            "mouse electronics"
        ],
        "seller": "Xiaomi Official",
        "stock": 77,
        "badge": "-45%"
    },

    {
        "id": "MALL-PRD-14128",
        "name": "Gardena Soil Gold",
        "brand": "Gardena",
        "category": "Garden & Outdoors",
        "price": 9600,
        "originalPrice": 12720,
        "image": "https://images.pexels.com/photos/1284170/pexels-photo-1284170.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48170,
        "isValuePick": true,
        "description": "Best-in-class soil with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Gardena",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Smart",
            "Waterproof",
            "Wireless",
            "Lightweight"
        ],
        "seoKeywords": [
            "soil",
            "gardena",
            "soil garden & outdoors"
        ],
        "seller": "Gardena Official",
        "stock": 142,
        "badge": "-24%"
    },

    {
        "id": "MALL-PRD-13311",
        "name": "Fender Trumpet Premium White",
        "brand": "Fender",
        "category": "Musical Instruments",
        "price": 39160,
        "originalPrice": 50610,
        "image": "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48135,
        "isValuePick": false,
        "description": "Fender's signature trumpet - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Fender",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Premium",
            "Waterproof",
            "Portable"
        ],
        "seoKeywords": [
            "trumpet",
            "fender",
            "trumpet musical instruments"
        ],
        "seller": "Fender Official",
        "stock": 318,
        "badge": "-22%"
    },

    {
        "id": "MALL-PRD-09573",
        "name": "Parle Cheese Premium Black",
        "brand": "Parle",
        "category": "Grocery",
        "price": 940,
        "originalPrice": 1840,
        "image": "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48128,
        "isValuePick": false,
        "description": "Premium quality cheese from Parle. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Parle",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Waterproof",
            "Lightweight",
            "Premium",
            "Wireless",
            "Durable"
        ],
        "seoKeywords": [
            "cheese",
            "parle",
            "cheese grocery"
        ],
        "seller": "Parle Official",
        "stock": 381,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-11592",
        "name": "Wipro Pen Pro Grey",
        "brand": "Wipro",
        "category": "Office Products",
        "price": 9850,
        "originalPrice": 12550,
        "image": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48104,
        "isValuePick": false,
        "description": "High-performance pen designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Wipro",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Portable",
            "Premium",
            "Smart",
            "Waterproof",
            "Compact"
        ],
        "seoKeywords": [
            "pen",
            "wipro",
            "pen office products"
        ],
        "seller": "Wipro Official",
        "stock": 105,
        "badge": "-21%"
    },

    {
        "id": "MALL-PRD-05763",
        "name": "Bosch Bulb Green S",
        "brand": "Bosch",
        "category": "Automotive",
        "price": 7200,
        "originalPrice": 11710,
        "image": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 48017,
        "isValuePick": false,
        "description": "Best-in-class bulb with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Bosch",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Waterproof"
        ],
        "seoKeywords": [
            "bulb",
            "bosch",
            "bulb automotive"
        ],
        "seller": "Bosch Official",
        "stock": 470,
        "badge": "-38%"
    },

    {
        "id": "MALL-PRD-04631",
        "name": "Mamaearth Perfume Pro Silver",
        "brand": "Mamaearth",
        "category": "Beauty & Personal Care",
        "price": 3680,
        "originalPrice": 7240,
        "image": "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47986,
        "isValuePick": false,
        "description": "Mamaearth's signature perfume - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Mamaearth",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Smart",
            "Portable",
            "Durable"
        ],
        "seoKeywords": [
            "perfume",
            "mamaearth",
            "perfume beauty & personal care"
        ],
        "seller": "Mamaearth Official",
        "stock": 15,
        "badge": "-49%"
    },

    {
        "id": "MALL-PRD-10037",
        "name": "Royal Canin Dog Food Ultimate Navy",
        "brand": "Royal Canin",
        "category": "Pet Supplies",
        "price": 740,
        "originalPrice": 1200,
        "image": "https://images.pexels.com/photos/2803516/pexels-photo-2803516.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47966,
        "isValuePick": false,
        "description": "Best-in-class dog food with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Royal Canin",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Durable",
            "Waterproof",
            "Smart",
            "Premium",
            "Compact"
        ],
        "seoKeywords": [
            "dog food",
            "royal canin",
            "dog food pet supplies"
        ],
        "seller": "Royal Canin Official",
        "stock": 287,
        "badge": "-38%"
    },

    {
        "id": "MALL-PRD-02546",
        "name": "Bajaj Grinder Red XL",
        "brand": "Bajaj",
        "category": "Home & Kitchen",
        "price": 22710,
        "originalPrice": 40130,
        "image": "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47766,
        "isValuePick": false,
        "description": "High-performance grinder designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Bajaj",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Smart",
            "Waterproof",
            "Compact",
            "Wireless"
        ],
        "seoKeywords": [
            "grinder",
            "bajaj",
            "grinder home & kitchen"
        ],
        "seller": "Bajaj Official",
        "stock": 392,
        "badge": "-43%"
    },

    {
        "id": "MALL-PRD-05944",
        "name": "Castrol Cover Smart Silver",
        "brand": "Castrol",
        "category": "Automotive",
        "price": 5150,
        "originalPrice": 9010,
        "image": "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47651,
        "isValuePick": false,
        "description": "Premium quality cover from Castrol. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Castrol",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Smart",
            "Premium",
            "Waterproof",
            "Compact",
            "Durable"
        ],
        "seoKeywords": [
            "cover",
            "castrol",
            "cover automotive"
        ],
        "seller": "Castrol Official",
        "stock": 487,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-07043",
        "name": "Arihant Novel Blue",
        "brand": "Arihant",
        "category": "Books",
        "price": 410,
        "originalPrice": 700,
        "image": "https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47630,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium novel from Arihant.",
        "bulletPoints": [
            "Premium quality from Arihant",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Premium",
            "Portable"
        ],
        "seoKeywords": [
            "novel",
            "arihant",
            "novel books"
        ],
        "seller": "Arihant Official",
        "stock": 134,
        "badge": "-41%"
    },

    {
        "id": "MALL-PRD-14477",
        "name": "Agripro Sprayer Elite Beige",
        "brand": "Agripro",
        "category": "Garden & Outdoors",
        "price": 3960,
        "originalPrice": 5940,
        "image": "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47540,
        "isValuePick": true,
        "description": "Premium quality sprayer from Agripro. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Agripro",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Wireless",
            "Durable"
        ],
        "seoKeywords": [
            "sprayer",
            "agripro",
            "sprayer garden & outdoors"
        ],
        "seller": "Agripro Official",
        "stock": 286,
        "badge": "-33%"
    },

    {
        "id": "MALL-PRD-07575",
        "name": "Penguin History Navy 500g",
        "brand": "Penguin",
        "category": "Books",
        "price": 810,
        "originalPrice": 1350,
        "image": "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47339,
        "isValuePick": false,
        "description": "High-performance history designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Penguin",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Smart",
            "Portable",
            "Wireless"
        ],
        "seoKeywords": [
            "history",
            "penguin",
            "history books"
        ],
        "seller": "Penguin Official",
        "stock": 282,
        "badge": "-40%"
    },

    {
        "id": "MALL-PRD-14342",
        "name": "Bosch Fertilizer Smart Grey",
        "brand": "Bosch",
        "category": "Garden & Outdoors",
        "price": 3570,
        "originalPrice": 5800,
        "image": "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47157,
        "isValuePick": false,
        "description": "High-performance fertilizer designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Bosch",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Premium",
            "Smart",
            "Waterproof"
        ],
        "seoKeywords": [
            "fertilizer",
            "bosch",
            "fertilizer garden & outdoors"
        ],
        "seller": "Bosch Official",
        "stock": 145,
        "badge": "-38%"
    },

    {
        "id": "MALL-PRD-03885",
        "name": "HealthViva Tennis Grey",
        "brand": "HealthViva",
        "category": "Health & Fitness",
        "price": 8400,
        "originalPrice": 12210,
        "image": "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47108,
        "isValuePick": false,
        "description": "Premium quality tennis from HealthViva. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from HealthViva",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Compact",
            "Smart"
        ],
        "seoKeywords": [
            "tennis",
            "healthviva",
            "tennis health & fitness"
        ],
        "seller": "HealthViva Official",
        "stock": 181,
        "badge": "-31%"
    },

    {
        "id": "MALL-PRD-11250",
        "name": "Classmate Chair Red Free Size",
        "brand": "Classmate",
        "category": "Office Products",
        "price": 5630,
        "originalPrice": 11020,
        "image": "https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47030,
        "isValuePick": false,
        "description": "Classmate's signature chair - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Classmate",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Portable"
        ],
        "seoKeywords": [
            "chair",
            "classmate",
            "chair office products"
        ],
        "seller": "Classmate Official",
        "stock": 237,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-06501",
        "name": "Wilson Cycle Free Size",
        "brand": "Wilson",
        "category": "Sports & Outdoors",
        "price": 8310,
        "originalPrice": 16030,
        "image": "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 47010,
        "isValuePick": false,
        "description": "High-performance cycle designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Wilson",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Wireless",
            "Premium",
            "Smart",
            "Durable",
            "Portable"
        ],
        "seoKeywords": [
            "cycle",
            "wilson",
            "cycle sports & outdoors"
        ],
        "seller": "Wilson Official",
        "stock": 414,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-07956",
        "name": "McGraw Hill Comics Gold XXL",
        "brand": "McGraw Hill",
        "category": "Books",
        "price": 770,
        "originalPrice": 1220,
        "image": "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46951,
        "isValuePick": false,
        "description": "Premium quality comics from McGraw Hill. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from McGraw Hill",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Premium",
            "Durable",
            "Lightweight",
            "Portable"
        ],
        "seoKeywords": [
            "comics",
            "mcgraw hill",
            "comics books"
        ],
        "seller": "McGraw Hill Official",
        "stock": 409,
        "badge": "-36%"
    },

    {
        "id": "MALL-PRD-14966",
        "name": "Rootex Barbecue Smart Silver",
        "brand": "Rootex",
        "category": "Garden & Outdoors",
        "price": 9010,
        "originalPrice": 16060,
        "image": "https://images.pexels.com/photos/1284170/pexels-photo-1284170.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46891,
        "isValuePick": false,
        "description": "High-performance barbecue designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Rootex",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Portable",
            "Waterproof",
            "Wireless"
        ],
        "seoKeywords": [
            "barbecue",
            "rootex",
            "barbecue garden & outdoors"
        ],
        "seller": "Rootex Official",
        "stock": 149,
        "badge": "-43%"
    },

    {
        "id": "MALL-PRD-13713",
        "name": "Gibson Case L",
        "brand": "Gibson",
        "category": "Musical Instruments",
        "price": 8790,
        "originalPrice": 14350,
        "image": "https://images.pexels.com/photos/4087991/pexels-photo-4087991.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46879,
        "isValuePick": false,
        "description": "Best-in-class case with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Gibson",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Waterproof",
            "Wireless",
            "Compact"
        ],
        "seoKeywords": [
            "case",
            "gibson",
            "case musical instruments"
        ],
        "seller": "Gibson Official",
        "stock": 430,
        "badge": "-38%"
    },

    {
        "id": "MALL-PRD-02449",
        "name": "Prestige Blender Pro Beige",
        "brand": "Prestige",
        "category": "Home & Kitchen",
        "price": 14740,
        "originalPrice": 18770,
        "image": "https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46769,
        "isValuePick": true,
        "description": "High-performance blender designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Prestige",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Premium",
            "Smart",
            "Waterproof",
            "Portable"
        ],
        "seoKeywords": [
            "blender",
            "prestige",
            "blender home & kitchen"
        ],
        "seller": "Prestige Official",
        "stock": 245,
        "badge": "-21%"
    },

    {
        "id": "MALL-PRD-11212",
        "name": "Classmate Lightbulb Grey",
        "brand": "Classmate",
        "category": "Office Products",
        "price": 7300,
        "originalPrice": 10740,
        "image": "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46683,
        "isValuePick": false,
        "description": "Premium quality lightbulb from Classmate. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Classmate",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Wireless",
            "Compact"
        ],
        "seoKeywords": [
            "lightbulb",
            "classmate",
            "lightbulb office products"
        ],
        "seller": "Classmate Official",
        "stock": 162,
        "badge": "-32%"
    },

    {
        "id": "MALL-PRD-07638",
        "name": "Random House Science M",
        "brand": "Random House",
        "category": "Books",
        "price": 1190,
        "originalPrice": 1660,
        "image": "https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46659,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium science from Random House.",
        "bulletPoints": [
            "Premium quality from Random House",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Compact"
        ],
        "seoKeywords": [
            "science",
            "random house",
            "science books"
        ],
        "seller": "Random House Official",
        "stock": 147,
        "badge": "-28%"
    },

    {
        "id": "MALL-PRD-01581",
        "name": "Liberty Lehenga Pro Red",
        "brand": "Liberty",
        "category": "Fashion",
        "price": 4810,
        "originalPrice": 6890,
        "image": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46361,
        "isValuePick": false,
        "description": "High-performance lehenga designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Liberty",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Durable",
            "Smart"
        ],
        "seoKeywords": [
            "lehenga",
            "liberty",
            "lehenga fashion"
        ],
        "seller": "Liberty Official",
        "stock": 157,
        "badge": "-30%"
    },

    {
        "id": "MALL-PRD-02526",
        "name": "Bajaj Grinder Elite Green",
        "brand": "Bajaj",
        "category": "Home & Kitchen",
        "price": 17470,
        "originalPrice": 32520,
        "image": "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46173,
        "isValuePick": false,
        "description": "Best-in-class grinder with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Bajaj",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Compact",
            "Wireless"
        ],
        "seoKeywords": [
            "grinder",
            "bajaj",
            "grinder home & kitchen"
        ],
        "seller": "Bajaj Official",
        "stock": 70,
        "badge": "-46%"
    },

    {
        "id": "MALL-PRD-05305",
        "name": "Shell Helmet Smart White",
        "brand": "Shell",
        "category": "Automotive",
        "price": 5690,
        "originalPrice": 9020,
        "image": "https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46162,
        "isValuePick": false,
        "description": "Premium quality helmet from Shell. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Shell",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Durable",
            "Wireless",
            "Lightweight"
        ],
        "seoKeywords": [
            "helmet",
            "shell",
            "helmet automotive"
        ],
        "seller": "Shell Official",
        "stock": 5,
        "badge": "-36%"
    },

    {
        "id": "MALL-PRD-01514",
        "name": "Louis Philippe Saree S",
        "brand": "Louis Philippe",
        "category": "Fashion",
        "price": 13150,
        "originalPrice": 25240,
        "image": "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46128,
        "isValuePick": false,
        "description": "Premium quality saree from Louis Philippe. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Louis Philippe",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Waterproof",
            "Compact"
        ],
        "seoKeywords": [
            "saree",
            "louis philippe",
            "saree fashion"
        ],
        "seller": "Louis Philippe Official",
        "stock": 28,
        "badge": "-47%"
    },

    {
        "id": "MALL-PRD-03677",
        "name": "Optimum Nutrition Cycling Ultimate Gold",
        "brand": "Optimum Nutrition",
        "category": "Health & Fitness",
        "price": 8740,
        "originalPrice": 11980,
        "image": "https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46067,
        "isValuePick": false,
        "description": "Optimum Nutrition's signature cycling - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Optimum Nutrition",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Compact"
        ],
        "seoKeywords": [
            "cycling",
            "optimum nutrition",
            "cycling health & fitness"
        ],
        "seller": "Optimum Nutrition Official",
        "stock": 426,
        "badge": "-27%"
    },

    {
        "id": "MALL-PRD-05774",
        "name": "Michelin Bulb Silver M",
        "brand": "Michelin",
        "category": "Automotive",
        "price": 1400,
        "originalPrice": 1920,
        "image": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46058,
        "isValuePick": false,
        "description": "Michelin's signature bulb - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Michelin",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Waterproof",
            "Premium",
            "Compact"
        ],
        "seoKeywords": [
            "bulb",
            "michelin",
            "bulb automotive"
        ],
        "seller": "Michelin Official",
        "stock": 50,
        "badge": "-27%"
    },

    {
        "id": "MALL-PRD-01837",
        "name": "Liberty Blazer Pro White",
        "brand": "Liberty",
        "category": "Fashion",
        "price": 8880,
        "originalPrice": 15010,
        "image": "https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 46046,
        "isValuePick": false,
        "description": "Premium quality blazer from Liberty. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Liberty",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Compact",
            "Waterproof",
            "Lightweight"
        ],
        "seoKeywords": [
            "blazer",
            "liberty",
            "blazer fashion"
        ],
        "seller": "Liberty Official",
        "stock": 420,
        "badge": "-40%"
    },

    {
        "id": "MALL-PRD-01533",
        "name": "Liberty Saree Beige",
        "brand": "Liberty",
        "category": "Fashion",
        "price": 11710,
        "originalPrice": 14770,
        "image": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 45775,
        "isValuePick": false,
        "description": "High-performance saree designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Liberty",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Smart",
            "Durable",
            "Premium"
        ],
        "seoKeywords": [
            "saree",
            "liberty",
            "saree fashion"
        ],
        "seller": "Liberty Official",
        "stock": 377,
        "badge": "-20%"
    },

    {
        "id": "MALL-PRD-06460",
        "name": "Nike Net Pro Gold",
        "brand": "Nike",
        "category": "Sports & Outdoors",
        "price": 14530,
        "originalPrice": 28350,
        "image": "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 45623,
        "isValuePick": false,
        "description": "Premium quality net from Nike. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Nike",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Compact",
            "Durable"
        ],
        "seoKeywords": [
            "net",
            "nike",
            "net sports & outdoors"
        ],
        "seller": "Nike Official",
        "stock": 19,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-04080",
        "name": "Lotus Hair Gold 1L",
        "brand": "Lotus",
        "category": "Beauty & Personal Care",
        "price": 1780,
        "originalPrice": 3240,
        "image": "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 45543,
        "isValuePick": false,
        "description": "High-performance hair designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Lotus",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Lightweight",
            "Premium",
            "Durable",
            "Compact",
            "Portable"
        ],
        "seoKeywords": [
            "hair",
            "lotus",
            "hair beauty & personal care"
        ],
        "seller": "Lotus Official",
        "stock": 45,
        "badge": "-45%"
    },

    {
        "id": "MALL-PRD-13798",
        "name": "Zildjian Pick Smart Blue",
        "brand": "Zildjian",
        "category": "Musical Instruments",
        "price": 44470,
        "originalPrice": 77110,
        "image": "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 45121,
        "isValuePick": true,
        "description": "High-performance pick designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Zildjian",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Portable",
            "Smart"
        ],
        "seoKeywords": [
            "pick",
            "zildjian",
            "pick musical instruments"
        ],
        "seller": "Zildjian Official",
        "stock": 299,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-06350",
        "name": "Cosco Bat Green",
        "brand": "Cosco",
        "category": "Sports & Outdoors",
        "price": 12790,
        "originalPrice": 25540,
        "image": "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 45104,
        "isValuePick": false,
        "description": "Cosco's signature bat - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Cosco",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Wireless",
            "Smart"
        ],
        "seoKeywords": [
            "bat",
            "cosco",
            "bat sports & outdoors"
        ],
        "seller": "Cosco Official",
        "stock": 137,
        "badge": "-49%"
    },

    {
        "id": "MALL-PRD-02692",
        "name": "Borosil Microwave Black Free Size",
        "brand": "Borosil",
        "category": "Home & Kitchen",
        "price": 12780,
        "originalPrice": 22100,
        "image": "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44988,
        "isValuePick": true,
        "description": "High-performance microwave designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Borosil",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Waterproof",
            "Lightweight",
            "Durable",
            "Compact"
        ],
        "seoKeywords": [
            "microwave",
            "borosil",
            "microwave home & kitchen"
        ],
        "seller": "Borosil Official",
        "stock": 449,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-02073",
        "name": "Eureka Purifier Ultimate Grey",
        "brand": "Eureka",
        "category": "Home & Kitchen",
        "price": 20220,
        "originalPrice": 38590,
        "image": "https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44979,
        "isValuePick": false,
        "description": "Best-in-class purifier with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Eureka",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Wireless",
            "Smart",
            "Portable",
            "Compact"
        ],
        "seoKeywords": [
            "purifier",
            "eureka",
            "purifier home & kitchen"
        ],
        "seller": "Eureka Official",
        "stock": 449,
        "badge": "-47%"
    },

    {
        "id": "MALL-PRD-05652",
        "name": "Bosch Wax Plus Beige",
        "brand": "Bosch",
        "category": "Automotive",
        "price": 2440,
        "originalPrice": 4230,
        "image": "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44919,
        "isValuePick": true,
        "description": "Best-in-class wax with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Bosch",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Waterproof",
            "Portable",
            "Smart"
        ],
        "seoKeywords": [
            "wax",
            "bosch",
            "wax automotive"
        ],
        "seller": "Bosch Official",
        "stock": 470,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-01713",
        "name": "Van Heusen Kurta Green",
        "brand": "Van Heusen",
        "category": "Fashion",
        "price": 7000,
        "originalPrice": 9030,
        "image": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44907,
        "isValuePick": false,
        "description": "High-performance kurta designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Van Heusen",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Smart",
            "Premium"
        ],
        "seoKeywords": [
            "kurta",
            "van heusen",
            "kurta fashion"
        ],
        "seller": "Van Heusen Official",
        "stock": 41,
        "badge": "-22%"
    },

    {
        "id": "MALL-PRD-14451",
        "name": "GreenMyLife Sprayer Grey",
        "brand": "GreenMyLife",
        "category": "Garden & Outdoors",
        "price": 160,
        "originalPrice": 270,
        "image": "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44695,
        "isValuePick": false,
        "description": "High-performance sprayer designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from GreenMyLife",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Waterproof",
            "Portable",
            "Lightweight",
            "Durable"
        ],
        "seoKeywords": [
            "sprayer",
            "greenmylife",
            "sprayer garden & outdoors"
        ],
        "seller": "GreenMyLife Official",
        "stock": 469,
        "badge": "-40%"
    },

    {
        "id": "MALL-PRD-12889",
        "name": "Fisher-Price Cream Elite Green",
        "brand": "Fisher-Price",
        "category": "Baby Products",
        "price": 1090,
        "originalPrice": 1610,
        "image": "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44434,
        "isValuePick": true,
        "description": "Fisher-Price's signature cream - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Fisher-Price",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Waterproof",
            "Wireless",
            "Lightweight"
        ],
        "seoKeywords": [
            "cream",
            "fisher-price",
            "cream baby products"
        ],
        "seller": "Fisher-Price Official",
        "stock": 150,
        "badge": "-32%"
    },

    {
        "id": "MALL-PRD-10438",
        "name": "Kong  Leash Premium Green",
        "brand": "Kong",
        "category": "Pet Supplies",
        "price": 530,
        "originalPrice": 1020,
        "image": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44226,
        "isValuePick": true,
        "description": "Upgrade your experience with this premium  leash from Kong.",
        "bulletPoints": [
            "Premium quality from Kong",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Premium",
            "Lightweight"
        ],
        "seoKeywords": [
            " leash",
            "kong",
            " leash pet supplies"
        ],
        "seller": "Kong Official",
        "stock": 356,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-14196",
        "name": "Gardena Irrigation Beige",
        "brand": "Gardena",
        "category": "Garden & Outdoors",
        "price": 1750,
        "originalPrice": 2760,
        "image": "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 44007,
        "isValuePick": false,
        "description": "Gardena's signature irrigation - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Gardena",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Smart",
            "Portable"
        ],
        "seoKeywords": [
            "irrigation",
            "gardena",
            "irrigation garden & outdoors"
        ],
        "seller": "Gardena Official",
        "stock": 46,
        "badge": "-36%"
    },

    {
        "id": "MALL-PRD-02419",
        "name": "Philips Blender Navy",
        "brand": "Philips",
        "category": "Home & Kitchen",
        "price": 16990,
        "originalPrice": 32580,
        "image": "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43835,
        "isValuePick": false,
        "description": "High-performance blender designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Philips",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Smart",
            "Durable",
            "Premium",
            "Waterproof"
        ],
        "seoKeywords": [
            "blender",
            "philips",
            "blender home & kitchen"
        ],
        "seller": "Philips Official",
        "stock": 165,
        "badge": "-47%"
    },

    {
        "id": "MALL-PRD-01534",
        "name": "Bata Saree Ultimate Gold",
        "brand": "Bata",
        "category": "Fashion",
        "price": 9720,
        "originalPrice": 12670,
        "image": "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43710,
        "isValuePick": false,
        "description": "Best-in-class saree with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Bata",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Waterproof",
            "Compact",
            "Portable",
            "Durable",
            "Lightweight"
        ],
        "seoKeywords": [
            "saree",
            "bata",
            "saree fashion"
        ],
        "seller": "Bata Official",
        "stock": 290,
        "badge": "-23%"
    },

    {
        "id": "MALL-PRD-06834",
        "name": "Li-Ning Hiking Smart Green",
        "brand": "Li-Ning",
        "category": "Sports & Outdoors",
        "price": 7070,
        "originalPrice": 11590,
        "image": "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43706,
        "isValuePick": false,
        "description": "High-performance hiking designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Li-Ning",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Compact",
            "Waterproof",
            "Smart"
        ],
        "seoKeywords": [
            "hiking",
            "li-ning",
            "hiking sports & outdoors"
        ],
        "seller": "Li-Ning Official",
        "stock": 407,
        "badge": "-38%"
    },

    {
        "id": "MALL-PRD-00373",
        "name": "Ambrane Speaker Grey 500g",
        "brand": "Ambrane",
        "category": "Electronics",
        "price": 43580,
        "originalPrice": 57050,
        "image": "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43504,
        "isValuePick": true,
        "description": "Best-in-class speaker with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Ambrane",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Premium"
        ],
        "seoKeywords": [
            "speaker",
            "ambrane",
            "speaker electronics"
        ],
        "seller": "Ambrane Official",
        "stock": 346,
        "badge": "-23%"
    },

    {
        "id": "MALL-PRD-10981",
        "name": "Orijen Aquarium Elite Black",
        "brand": "Orijen",
        "category": "Pet Supplies",
        "price": 770,
        "originalPrice": 1080,
        "image": "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43410,
        "isValuePick": false,
        "description": "Orijen's signature aquarium - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Orijen",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Durable",
            "Waterproof"
        ],
        "seoKeywords": [
            "aquarium",
            "orijen",
            "aquarium pet supplies"
        ],
        "seller": "Orijen Official",
        "stock": 115,
        "badge": "-28%"
    },

    {
        "id": "MALL-PRD-01936",
        "name": "Louis Philippe Sandal Pro Gold",
        "brand": "Louis Philippe",
        "category": "Fashion",
        "price": 3520,
        "originalPrice": 4700,
        "image": "https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43261,
        "isValuePick": false,
        "description": "Premium quality sandal from Louis Philippe. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Louis Philippe",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Durable",
            "Premium",
            "Compact"
        ],
        "seoKeywords": [
            "sandal",
            "louis philippe",
            "sandal fashion"
        ],
        "seller": "Louis Philippe Official",
        "stock": 204,
        "badge": "-25%"
    },

    {
        "id": "MALL-PRD-02052",
        "name": "Pigeon Purifier Pro Gold",
        "brand": "Pigeon",
        "category": "Home & Kitchen",
        "price": 840,
        "originalPrice": 1110,
        "image": "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 43109,
        "isValuePick": true,
        "description": "Upgrade your experience with this premium purifier from Pigeon.",
        "bulletPoints": [
            "Premium quality from Pigeon",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Waterproof",
            "Compact"
        ],
        "seoKeywords": [
            "purifier",
            "pigeon",
            "purifier home & kitchen"
        ],
        "seller": "Pigeon Official",
        "stock": 343,
        "badge": "-24%"
    },

    {
        "id": "MALL-PRD-13228",
        "name": "Behringer Violin Premium Gold",
        "brand": "Behringer",
        "category": "Musical Instruments",
        "price": 13810,
        "originalPrice": 17360,
        "image": "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42986,
        "isValuePick": false,
        "description": "Premium quality violin from Behringer. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Behringer",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Compact",
            "Wireless",
            "Portable",
            "Smart"
        ],
        "seoKeywords": [
            "violin",
            "behringer",
            "violin musical instruments"
        ],
        "seller": "Behringer Official",
        "stock": 386,
        "badge": "-20%"
    },

    {
        "id": "MALL-PRD-06425",
        "name": "Head Racket Navy",
        "brand": "Head",
        "category": "Sports & Outdoors",
        "price": 10390,
        "originalPrice": 14960,
        "image": "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42974,
        "isValuePick": false,
        "description": "Head's signature racket - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Head",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Smart",
            "Premium",
            "Waterproof",
            "Compact"
        ],
        "seoKeywords": [
            "racket",
            "head",
            "racket sports & outdoors"
        ],
        "seller": "Head Official",
        "stock": 232,
        "badge": "-30%"
    },

    {
        "id": "MALL-PRD-08553",
        "name": "Barbie Drone Free Size",
        "brand": "Barbie",
        "category": "Toys & Games",
        "price": 4320,
        "originalPrice": 5420,
        "image": "https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42960,
        "isValuePick": false,
        "description": "Barbie's signature drone - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Barbie",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Smart",
            "Portable",
            "Compact",
            "Premium"
        ],
        "seoKeywords": [
            "drone",
            "barbie",
            "drone toys & games"
        ],
        "seller": "Barbie Official",
        "stock": 112,
        "badge": "-20%"
    },

    {
        "id": "MALL-PRD-02728",
        "name": "Syska Fridge Ultimate Grey",
        "brand": "Syska",
        "category": "Home & Kitchen",
        "price": 1370,
        "originalPrice": 2390,
        "image": "https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42730,
        "isValuePick": true,
        "description": "Syska's signature fridge - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Syska",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Waterproof",
            "Lightweight",
            "Compact"
        ],
        "seoKeywords": [
            "fridge",
            "syska",
            "fridge home & kitchen"
        ],
        "seller": "Syska Official",
        "stock": 388,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-03368",
        "name": "Yonex Weight Plus Gold",
        "brand": "Yonex",
        "category": "Health & Fitness",
        "price": 1300,
        "originalPrice": 2040,
        "image": "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42680,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium weight from Yonex.",
        "bulletPoints": [
            "Premium quality from Yonex",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Portable",
            "Waterproof",
            "Durable"
        ],
        "seoKeywords": [
            "weight",
            "yonex",
            "weight health & fitness"
        ],
        "seller": "Yonex Official",
        "stock": 55,
        "badge": "-36%"
    },

    {
        "id": "MALL-PRD-06097",
        "name": "Puma Resistance Band Smart Green",
        "brand": "Puma",
        "category": "Sports & Outdoors",
        "price": 13730,
        "originalPrice": 24760,
        "image": "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42668,
        "isValuePick": false,
        "description": "High-performance resistance band designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Puma",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Durable",
            "Compact",
            "Portable"
        ],
        "seoKeywords": [
            "resistance band",
            "puma",
            "resistance band sports & outdoors"
        ],
        "seller": "Puma Official",
        "stock": 352,
        "badge": "-44%"
    },

    {
        "id": "MALL-PRD-10488",
        "name": "Hill's Treats Plus Gold",
        "brand": "Hill's",
        "category": "Pet Supplies",
        "price": 1670,
        "originalPrice": 2480,
        "image": "https://images.pexels.com/photos/2803516/pexels-photo-2803516.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42580,
        "isValuePick": false,
        "description": "Best-in-class treats with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Hill's",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Portable",
            "Waterproof",
            "Durable",
            "Compact",
            "Wireless"
        ],
        "seoKeywords": [
            "treats",
            "hill's",
            "treats pet supplies"
        ],
        "seller": "Hill's Official",
        "stock": 118,
        "badge": "-32%"
    },

    {
        "id": "MALL-PRD-04978",
        "name": "Himalaya Nail Polish 1L",
        "brand": "Himalaya",
        "category": "Beauty & Personal Care",
        "price": 2510,
        "originalPrice": 3190,
        "image": "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42481,
        "isValuePick": true,
        "description": "Best-in-class nail polish with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Himalaya",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Compact",
            "Lightweight",
            "Wireless",
            "Durable",
            "Waterproof"
        ],
        "seoKeywords": [
            "nail polish",
            "himalaya",
            "nail polish beauty & personal care"
        ],
        "seller": "Himalaya Official",
        "stock": 266,
        "badge": "-21%"
    },

    {
        "id": "MALL-PRD-02040",
        "name": "Pigeon Cooker Premium Red",
        "brand": "Pigeon",
        "category": "Home & Kitchen",
        "price": 2920,
        "originalPrice": 5120,
        "image": "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42383,
        "isValuePick": false,
        "description": "Best-in-class cooker with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Pigeon",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Lightweight",
            "Waterproof"
        ],
        "seoKeywords": [
            "cooker",
            "pigeon",
            "cooker home & kitchen"
        ],
        "seller": "Pigeon Official",
        "stock": 229,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-14715",
        "name": "Agripro Fountain Navy S",
        "brand": "Agripro",
        "category": "Garden & Outdoors",
        "price": 8960,
        "originalPrice": 12870,
        "image": "https://images.pexels.com/photos/1284170/pexels-photo-1284170.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42206,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium fountain from Agripro.",
        "bulletPoints": [
            "Premium quality from Agripro",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Premium",
            "Smart",
            "Wireless"
        ],
        "seoKeywords": [
            "fountain",
            "agripro",
            "fountain garden & outdoors"
        ],
        "seller": "Agripro Official",
        "stock": 499,
        "badge": "-30%"
    },

    {
        "id": "MALL-PRD-11688",
        "name": "Wipro Tape Plus Green",
        "brand": "Wipro",
        "category": "Office Products",
        "price": 4050,
        "originalPrice": 6470,
        "image": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42155,
        "isValuePick": false,
        "description": "Best-in-class tape with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Wipro",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Waterproof",
            "Wireless",
            "Premium"
        ],
        "seoKeywords": [
            "tape",
            "wipro",
            "tape office products"
        ],
        "seller": "Wipro Official",
        "stock": 100,
        "badge": "-37%"
    },

    {
        "id": "MALL-PRD-11017",
        "name": "Pilot Standing Desk Plus Beige",
        "brand": "Pilot",
        "category": "Office Products",
        "price": 4560,
        "originalPrice": 6420,
        "image": "https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42126,
        "isValuePick": true,
        "description": "Best-in-class standing desk with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Pilot",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Premium",
            "Lightweight",
            "Portable"
        ],
        "seoKeywords": [
            "standing desk",
            "pilot",
            "standing desk office products"
        ],
        "seller": "Pilot Official",
        "stock": 195,
        "badge": "-28%"
    },

    {
        "id": "MALL-PRD-02017",
        "name": "Eureka Cooker Grey",
        "brand": "Eureka",
        "category": "Home & Kitchen",
        "price": 22070,
        "originalPrice": 36290,
        "image": "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 42091,
        "isValuePick": false,
        "description": "High-performance cooker designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Eureka",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Durable",
            "Waterproof",
            "Compact",
            "Portable"
        ],
        "seoKeywords": [
            "cooker",
            "eureka",
            "cooker home & kitchen"
        ],
        "seller": "Eureka Official",
        "stock": 443,
        "badge": "-39%"
    },

    {
        "id": "MALL-PRD-13477",
        "name": "Sabian Speaker Pro Green",
        "brand": "Sabian",
        "category": "Musical Instruments",
        "price": 46590,
        "originalPrice": 55970,
        "image": "https://images.pexels.com/photos/4087991/pexels-photo-4087991.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 41900,
        "isValuePick": false,
        "description": "High-performance speaker designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Sabian",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Compact",
            "Lightweight",
            "Waterproof"
        ],
        "seoKeywords": [
            "speaker",
            "sabian",
            "speaker musical instruments"
        ],
        "seller": "Sabian Official",
        "stock": 47,
        "badge": "New Launch"
    },

    {
        "id": "MALL-PRD-00237",
        "name": "Realme Charger Premium Silver",
        "brand": "Realme",
        "category": "Electronics",
        "price": 3250,
        "originalPrice": 5730,
        "image": "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 41688,
        "isValuePick": true,
        "description": "Realme's signature charger - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Realme",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Waterproof",
            "Premium",
            "Smart"
        ],
        "seoKeywords": [
            "charger",
            "realme",
            "charger electronics"
        ],
        "seller": "Realme Official",
        "stock": 172,
        "badge": "-43%"
    },

    {
        "id": "MALL-PRD-01271",
        "name": "Levi's Watch Premium Grey",
        "brand": "Levi's",
        "category": "Fashion",
        "price": 11420,
        "originalPrice": 18180,
        "image": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 41308,
        "isValuePick": false,
        "description": "Premium quality watch from Levi's. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Levi's",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Smart",
            "Lightweight",
            "Waterproof",
            "Portable",
            "Durable"
        ],
        "seoKeywords": [
            "watch",
            "levi's",
            "watch fashion"
        ],
        "seller": "Levi's Official",
        "stock": 330,
        "badge": "-37%"
    },

    {
        "id": "MALL-PRD-08682",
        "name": "Fisher-Price Doll Elite Blue",
        "brand": "Fisher-Price",
        "category": "Toys & Games",
        "price": 150,
        "originalPrice": 260,
        "image": "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40694,
        "isValuePick": false,
        "description": "Best-in-class doll with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Fisher-Price",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Lightweight",
            "Durable"
        ],
        "seoKeywords": [
            "doll",
            "fisher-price",
            "doll toys & games"
        ],
        "seller": "Fisher-Price Official",
        "stock": 396,
        "badge": "-42%"
    },

    {
        "id": "MALL-PRD-11711",
        "name": "Faber-Castell Tape Gold 500g",
        "brand": "Faber-Castell",
        "category": "Office Products",
        "price": 4970,
        "originalPrice": 8750,
        "image": "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40669,
        "isValuePick": true,
        "description": "Premium quality tape from Faber-Castell. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Faber-Castell",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Compact",
            "Waterproof",
            "Premium"
        ],
        "seoKeywords": [
            "tape",
            "faber-castell",
            "tape office products"
        ],
        "seller": "Faber-Castell Official",
        "stock": 336,
        "badge": "-43%"
    },

    {
        "id": "MALL-PRD-09203",
        "name": "Patanjali Ghee Pro Silver",
        "brand": "Patanjali",
        "category": "Grocery",
        "price": 1770,
        "originalPrice": 3410,
        "image": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40465,
        "isValuePick": true,
        "description": "High-performance ghee designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Patanjali",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Waterproof",
            "Portable",
            "Wireless",
            "Premium",
            "Durable"
        ],
        "seoKeywords": [
            "ghee",
            "patanjali",
            "ghee grocery"
        ],
        "seller": "Patanjali Official",
        "stock": 266,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-01691",
        "name": "UCB Top XL",
        "brand": "UCB",
        "category": "Fashion",
        "price": 2930,
        "originalPrice": 5830,
        "image": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40423,
        "isValuePick": false,
        "description": "High-performance top designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from UCB",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Compact",
            "Lightweight",
            "Smart"
        ],
        "seoKeywords": [
            "top",
            "ucb",
            "top fashion"
        ],
        "seller": "UCB Official",
        "stock": 360,
        "badge": "-49%"
    },

    {
        "id": "MALL-PRD-02534",
        "name": "Bajaj Grinder Grey 500g",
        "brand": "Bajaj",
        "category": "Home & Kitchen",
        "price": 4090,
        "originalPrice": 7280,
        "image": "https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40369,
        "isValuePick": false,
        "description": "High-performance grinder designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Bajaj",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Premium",
            "Lightweight",
            "Smart"
        ],
        "seoKeywords": [
            "grinder",
            "bajaj",
            "grinder home & kitchen"
        ],
        "seller": "Bajaj Official",
        "stock": 252,
        "badge": "-43%"
    },

    {
        "id": "MALL-PRD-05632",
        "name": "Honda Polish Premium Beige",
        "brand": "Honda",
        "category": "Automotive",
        "price": 6710,
        "originalPrice": 8420,
        "image": "https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40347,
        "isValuePick": false,
        "description": "Honda's signature polish - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Honda",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Wireless",
            "Smart",
            "Durable"
        ],
        "seoKeywords": [
            "polish",
            "honda",
            "polish automotive"
        ],
        "seller": "Honda Official",
        "stock": 222,
        "badge": "-20%"
    },

    {
        "id": "MALL-PRD-08644",
        "name": "Nintendo Building Blocks Silver M",
        "brand": "Nintendo",
        "category": "Toys & Games",
        "price": 2390,
        "originalPrice": 4340,
        "image": "https://images.pexels.com/photos/1598166/pexels-photo-1598166.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40323,
        "isValuePick": false,
        "description": "Best-in-class building blocks with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Nintendo",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Durable"
        ],
        "seoKeywords": [
            "building blocks",
            "nintendo",
            "building blocks toys & games"
        ],
        "seller": "Nintendo Official",
        "stock": 293,
        "badge": "-44%"
    },

    {
        "id": "MALL-PRD-11884",
        "name": "Faber-Castell Paper XL",
        "brand": "Faber-Castell",
        "category": "Office Products",
        "price": 3910,
        "originalPrice": 4820,
        "image": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40147,
        "isValuePick": false,
        "description": "High-performance paper designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Faber-Castell",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Durable",
            "Wireless"
        ],
        "seoKeywords": [
            "paper",
            "faber-castell",
            "paper office products"
        ],
        "seller": "Faber-Castell Official",
        "stock": 269
    },

    {
        "id": "MALL-PRD-04183",
        "name": "Patanjali Makeup 500ml",
        "brand": "Patanjali",
        "category": "Beauty & Personal Care",
        "price": 2520,
        "originalPrice": 4240,
        "image": "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40146,
        "isValuePick": true,
        "description": "Upgrade your experience with this premium makeup from Patanjali.",
        "bulletPoints": [
            "Premium quality from Patanjali",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Compact",
            "Portable",
            "Smart"
        ],
        "seoKeywords": [
            "makeup",
            "patanjali",
            "makeup beauty & personal care"
        ],
        "seller": "Patanjali Official",
        "stock": 314,
        "badge": "-40%"
    },

    {
        "id": "MALL-PRD-06090",
        "name": "Quechua Resistance Band Plus Red",
        "brand": "Quechua",
        "category": "Sports & Outdoors",
        "price": 4390,
        "originalPrice": 8600,
        "image": "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 40007,
        "isValuePick": true,
        "description": "Premium quality resistance band from Quechua. Perfect for everyday use.",
        "bulletPoints": [
            "Premium quality from Quechua",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Waterproof",
            "Compact",
            "Lightweight",
            "Wireless"
        ],
        "seoKeywords": [
            "resistance band",
            "quechua",
            "resistance band sports & outdoors"
        ],
        "seller": "Quechua Official",
        "stock": 354,
        "badge": "-48%"
    },

    {
        "id": "MALL-PRD-08096",
        "name": "Mattel Scrabble White",
        "brand": "Mattel",
        "category": "Toys & Games",
        "price": 1780,
        "originalPrice": 3030,
        "image": "https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 39865,
        "isValuePick": false,
        "description": "Upgrade your experience with this premium scrabble from Mattel.",
        "bulletPoints": [
            "Premium quality from Mattel",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Wireless",
            "Smart",
            "Durable",
            "Lightweight"
        ],
        "seoKeywords": [
            "scrabble",
            "mattel",
            "scrabble toys & games"
        ],
        "seller": "Mattel Official",
        "stock": 362,
        "badge": "-41%"
    },

    {
        "id": "MALL-PRD-11487",
        "name": "Classmate Organizer Pro Blue",
        "brand": "Classmate",
        "category": "Office Products",
        "price": 60,
        "originalPrice": 110,
        "image": "https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 39834,
        "isValuePick": false,
        "description": "High-performance organizer designed for maximum comfort and durability.",
        "bulletPoints": [
            "Premium quality from Classmate",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use"
        ],
        "features": [
            "Durable",
            "Wireless",
            "Waterproof",
            "Portable"
        ],
        "seoKeywords": [
            "organizer",
            "classmate",
            "organizer office products"
        ],
        "seller": "Classmate Official",
        "stock": 78,
        "badge": "-45%"
    },

    {
        "id": "MALL-PRD-08735",
        "name": "Nintendo Teddy Bear Silver 500ml",
        "brand": "Nintendo",
        "category": "Toys & Games",
        "price": 400,
        "originalPrice": 750,
        "image": "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 39803,
        "isValuePick": false,
        "description": "Best-in-class teddy bear with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Nintendo",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Lightweight",
            "Compact",
            "Waterproof"
        ],
        "seoKeywords": [
            "teddy bear",
            "nintendo",
            "teddy bear toys & games"
        ],
        "seller": "Nintendo Official",
        "stock": 378,
        "badge": "-46%"
    },

    {
        "id": "MALL-PRD-14932",
        "name": "Trust Basket Shed Blue",
        "brand": "Trust Basket",
        "category": "Garden & Outdoors",
        "price": 4770,
        "originalPrice": 5990,
        "image": "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 39798,
        "isValuePick": false,
        "description": "Best-in-class shed with advanced features and sleek design.",
        "bulletPoints": [
            "Premium quality from Trust Basket",
            "Durable and long-lasting",
            "Modern design",
            "Easy to use",
            "Best value for money"
        ],
        "features": [
            "Smart",
            "Compact",
            "Waterproof",
            "Portable",
            "Lightweight"
        ],
        "seoKeywords": [
            "shed",
            "trust basket",
            "shed garden & outdoors"
        ],
        "seller": "Trust Basket Official",
        "stock": 450,
        "badge": "-20%"
    },

    {
        "id": "MALL-PRD-08197",
        "name": "Hasbro Puzzle Elite Grey",
        "brand": "Hasbro",
        "category": "Toys & Games",
        "price": 4000,
        "originalPrice": 5850,
        "image": "https://images.pexels.com/photos/1598166/pexels-photo-1598166.jpeg?auto=compress&cs=tinysrgb&w=500",
        "rating": 5,
        "reviews": 39755,
        "isValuePick": false,
        "description": "Hasbro's signature puzzle - combining style with functionality.",
        "bulletPoints": [
            "Premium quality from Hasbro",
            "Durable and long-lasting",
            "Modern design"
        ],
        "features": [
            "Wireless",
            "Smart",
            "Lightweight"
        ],
        "seoKeywords": [
            "puzzle",
            "hasbro",
            "puzzle toys & games"
        ],
        "seller": "Hasbro Official",
        "stock": 160,
        "badge": "-31%"
    }
];

export const ALL_CATEGORIES = [...new Set(CATALOG.map(p => p.category))];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const counts = searchParams.get('counts') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const category = (searchParams.get('category') || 'all').toLowerCase();
    const search = (searchParams.get('search') || '').toLowerCase();
    const sort = searchParams.get('sort') || 'relevance';

    if (id) {
        const product = CATALOG.find(p => p.id === id);
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const relatedProducts = CATALOG
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 6);

        return NextResponse.json({
            ...product,
            relatedProducts,
            seo: {
                title: `${product.brand} ${product.name} | Sovereign Mall`,
                description: product.description.substring(0, 160),
                keywords: product.seoKeywords || [],
            }
        });
    }

    if (counts) {
        const result: Record<string, number> = { all: CATALOG.length };
        ALL_CATEGORIES.forEach(cat => {
            result[cat] = CATALOG.filter(p => p.category === cat).length;
        });
        return NextResponse.json(result);
    }

    const filtered = CATALOG.filter(p => {
        if (category !== 'all' && p.category.toLowerCase() !== category) return false;
        if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false;
        return true;
    });

    switch (sort) {
        case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
        case 'discount': filtered.sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice); break;
        case 'newest': filtered.sort((a, b) => parseInt(b.id.split('-')[2]) - parseInt(a.id.split('-')[2])); break;
        default: break;
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const items = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
        products: items,
        pagination: { page, limit, total, totalPages }
    });
}
