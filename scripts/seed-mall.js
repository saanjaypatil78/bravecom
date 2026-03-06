import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Support running directly with node
if (typeof __dirname === 'undefined') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
} else {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env or .env.local file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    {
        name: "Cyber Streetwear",
        slug: "cyber-streetwear",
        description: "Next-gen apparel for the sovereign citizen.",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnPm7ci_OPQnWVKcgHiVKvIHvd0kkCa37YmmY9uNp6ZbGk9iwfcNv4_WtxAYwyFj7sVcZeyeHAxxOb57inkWlfsjTtRwHoYq-zPgK1TYyskzDGQTq8uZOP6vIEOB4w3NtLzsNuJpw8iNJXOrbx6FWxfn26yoaaL9Yb-KmnLS2FKsWVmz0SMt8icWiiB-j_KbcuasiQPMyV9wBj2cvAdP6zvj4Xl-sDgZkSWTZoogyTVQ99dvmt5qTlujPtpaqyMu3ei-ws7vwnaS9e"
    },
    {
        name: "Tactical Gear",
        slug: "tactical-gear",
        description: "Durable wear designed for urban survival.",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK5OV-Zgu-EnhjkwqqKYyIZBItosm1RPoam-rPKeA19QL8rIZWFNGb7aIJ2uqOzONTfwyxm9roX_tpCDfaMAW5cybd1mPi6fVYegcvWUCC7isROBjthxq3rOjZdmuQB94kmc8qz4d3mw0hfGMLjLKu7Z_7GmbhQTngzAMoEmJYlVYsg4KUFaTy6UtTL6fYyXurM1mLXwKq0V46ia6uqNnc0e7I5ONHXKjWeBJI8mLkCJ9l6MjuBzpbviGFJ0S6xREPYC87_c2TTVe1"
    },
    {
        name: "Digital Assets",
        slug: "digital-assets",
        description: "Exclusive passes, event access, and digital drops.",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCY9HcNGKfrYdhwMz44dox2Xu-MxniwCBDwL3TqQfWY0YF_nXvL7IJonEMzAKpu6k2X0QiwTjaEHHTMMYdcuvqHUOGfQ5Em7iJJJQmEjh4WMNU2l0HWJTlVX3ZqfyWCk9BlIqIAU8xrF-2z37oW_-NeGAJ-7npOv0NO8KHSkMqmrBXPgKE2hg-gTQRanms3Q4YEUw5dZVHcS1Sc9J4Io80Aj-pdboHr3_DX7h6Fu5SsIxnsGyFrCo0_tQMsEq4StofOcgiIahkV-hIx"
    }
];

const products = [
    {
        name: "Void Runner Jacket",
        price: 18500,
        stock: 50,
        variant: "Core Collection • Season 4",
        badge_text: "Streetwear",
        badge_color: "bg-black/50",
        is_featured: true,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnPm7ci_OPQnWVKcgHiVKvIHvd0kkCa37YmmY9uNp6ZbGk9iwfcNv4_WtxAYwyFj7sVcZeyeHAxxOb57inkWlfsjTtRwHoYq-zPgK1TYyskzDGQTq8uZOP6vIEOB4w3NtLzsNuJpw8iNJXOrbx6FWxfn26yoaaL9Yb-KmnLS2FKsWVmz0SMt8icWiiB-j_KbcuasiQPMyV9wBj2cvAdP6zvj4Xl-sDgZkSWTZoogyTVQ99dvmt5qTlujPtpaqyMu3ei-ws7vwnaS9e",
        // Category slug mapping below
        _categorySlug: "cyber-streetwear"
    },
    {
        name: "Cyber Text Tee",
        price: 4200,
        stock: 200,
        variant: "Core Collection • Season 4",
        badge_text: "Trending",
        badge_color: "bg-[#f425af]/80 shadow-lg",
        is_featured: true,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMCMQdJweXgOhDApXL6pIFCW7qPSbB0-AQMiaEwC4UCVbKQFxABpES08J5DrXlrTcx70vV5bAd8IUOrIOryzgw-9TJeJFACcjQibgvjsgvonsKI3EXBTcSvfhuj3DENv82cANVL9Z_E1UO4w3Jr0g53otGAjwAXT9kpQzdfWpwn_afCDxbbta2nxnTILjMbdBAC47g1KFLu3_dXss_tP92pAke5JgOen8MUtdAEd6E9SbGA573vRSY26Bm7QjEUvY6o_0nalP-gzee",
        _categorySlug: "cyber-streetwear"
    },
    {
        name: "Shadow Hoodie",
        price: 12800,
        stock: 15,
        variant: "Core Collection • Season 4",
        badge_text: "Limited",
        badge_color: "bg-purple-600/80 shadow-lg",
        is_featured: true,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK5OV-Zgu-EnhjkwqqKYyIZBItosm1RPoam-rPKeA19QL8rIZWFNGb7aIJ2uqOzONTfwyxm9roX_tpCDfaMAW5cybd1mPi6fVYegcvWUCC7isROBjthxq3rOjZdmuQB94kmc8qz4d3mw0hfGMLjLKu7Z_7GmbhQTngzAMoEmJYlVYsg4KUFaTy6UtTL6fYyXurM1mLXwKq0V46ia6uqNnc0e7I5ONHXKjWeBJI8mLkCJ9l6MjuBzpbviGFJ0S6xREPYC87_c2TTVe1",
        _categorySlug: "tactical-gear"
    },
    {
        name: "Neon Flux Kicks",
        price: 24999,
        stock: 30,
        variant: "Core Collection • Season 4",
        is_featured: true,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxN7q9_GZZhtF5KhWgQ_pBLqn_Ebq19DTTBtwEZ16HjNEX2k7eXWs2MHto3SD0JuAE8I24gm7eVbudffTxGJmlM143uqTyt2RD8MNZTWvJaJ_h6hAQNa0BBStpLaOspO6yWdofxYAy7OrdcXGQEAdU9Cr7VtW-NMwRFMW8h8FriUC0Ffkimn0aOJu8Y2f9fO7GpNmqy46ktz6yARz3ptm2hGe-SszyHUG4FZsbSi_7q4vEQXwnzR7YX9i4VsrSHa2PqJwWgYwmB8zG",
        _categorySlug: "cyber-streetwear"
    }
];

async function seedMall() {
    console.log("🌱 Starting Mall Seeding Process...");

    // 1. Verify table access by attempting a simple select
    const { error: testError } = await supabase.from('categories').select('id').limit(1);
    if (testError && testError.code === '42P01') {
        console.error(`❌ CRITICAL: The 'categories' table does not exist in Supabase!`);
        console.error(`👉 Please run the migration script first: supabase/migrations/006_ecommerce_mall.sql`);
        console.error(`👉 You can execute the SQL directly in the Supabase Dashboard SQL Editor.`);
        process.exit(1);
    } else if (testError) {
        console.error(`❌ Error connecting to Supabase:`, testError.message);
        process.exit(1);
    }

    // 2. Insert Categories
    console.log(`📦 Upserting ${categories.length} categories...`);
    const categoryIdMap = {};

    for (const cat of categories) {
        const { data, error } = await supabase
            .from('categories')
            .upsert(cat, { onConflict: 'slug' })
            .select('id, slug')
            .single();

        if (error) {
            console.error(`❌ Failed to upsert category ${cat.name}:`, error.message);
        } else if (data) {
            categoryIdMap[data.slug] = data.id;
            console.log(`   ✅ Synced category: ${cat.name}`);
        }
    }

    // 3. Insert Products
    console.log(`🛍️ Upserting ${products.length} products...`);
    for (const prod of products) {
        const categoryId = categoryIdMap[prod._categorySlug];
        if (!categoryId) {
            console.warn(`⚠️ Warning: Category mapping missing for product ${prod.name}`);
        }

        const productData = {
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            variant: prod.variant,
            badge_text: prod.badge_text || null,
            badge_color: prod.badge_color || null,
            is_featured: prod.is_featured,
            image_url: prod.image_url,
            category_id: categoryId || null
        };

        const { error } = await supabase
            .from('products')
            // Upsert based on name for this mock script
            .upsert(productData, { onConflict: 'name', ignoreDuplicates: false });

        if (error) {
            console.error(`❌ Failed to upsert product ${prod.name}:`, error.message);
        } else {
            console.log(`   ✅ Synced product: ${prod.name}`);
        }
    }

    console.log("🎉 Mall Seeding Complete!");
}

seedMall().catch(console.error);
