/**
 * SEED: 70,000 Mall Products
 * 14 Categories × 5 Subcategories × 1,000 Products each
 * 
 * Run: npx tsx prisma/seed-products.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── CATEGORY DATA ──────────────────────────────────────────────────────────

interface SubCatDef {
    name: string;
    slug: string;
    desc: string;
}

interface CatDef {
    name: string;
    slug: string;
    desc: string;
    icon: string;
    priceRange: [number, number]; // min, max INR
    subs: SubCatDef[];
    brands: string[];
    adjectives: string[];
    productTypes: string[][]; // per-subcategory product type lists
    sellers: string[];
}

const CATEGORIES: CatDef[] = [
    {
        name: 'Electronics', slug: 'electronics',
        desc: 'Latest gadgets, smartphones, laptops & wearables',
        icon: 'devices', priceRange: [499, 199999],
        subs: [
            { name: 'Smartphones', slug: 'smartphones', desc: 'Latest smartphones from top brands' },
            { name: 'Laptops', slug: 'laptops', desc: 'Work & gaming laptops' },
            { name: 'Audio', slug: 'audio', desc: 'Headphones, speakers & earbuds' },
            { name: 'Wearables', slug: 'wearables', desc: 'Smartwatches & fitness bands' },
            { name: 'Accessories', slug: 'electronics-accessories', desc: 'Chargers, cables & cases' },
        ],
        brands: ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Motorola', 'Nokia', 'Sony', 'JBL', 'boAt', 'Noise', 'Lenovo', 'HP', 'Dell', 'Asus', 'Acer', 'LG', 'Philips'],
        adjectives: ['Pro', 'Ultra', 'Max', 'Lite', 'Neo', 'Plus', 'Air', 'Mini', 'Prime', 'Elite', 'Turbo', 'Super', 'Quantum', 'Fusion', 'Edge'],
        productTypes: [
            ['5G Smartphone', 'Dual SIM Phone', 'Foldable Phone', 'Gaming Phone', 'Camera Phone', 'Budget Phone', 'Flagship Phone'],
            ['Gaming Laptop', 'Ultrabook', 'Business Laptop', 'Creator Laptop', 'Chromebook', '2-in-1 Laptop', 'Budget Laptop'],
            ['TWS Earbuds', 'Over-Ear Headphones', 'Neckband', 'Bluetooth Speaker', 'Soundbar', 'Studio Monitor', 'Wired Earphones'],
            ['Smartwatch', 'Fitness Band', 'GPS Watch', 'Sports Watch', 'Hybrid Watch', 'Kids Watch', 'Health Monitor'],
            ['USB-C Cable', 'Fast Charger', 'Phone Case', 'Screen Protector', 'Power Bank', 'Car Charger', 'Laptop Bag'],
        ],
        sellers: ['Brave Electronics', 'TechZone India', 'Gadget Hub', 'Digital Express', 'SmartBuy India'],
    },
    {
        name: 'Fashion Men', slug: 'fashion-men',
        desc: 'Trendy menswear, footwear & accessories',
        icon: 'checkroom', priceRange: [199, 14999],
        subs: [
            { name: 'T-Shirts & Polos', slug: 'men-tshirts', desc: 'Casual & printed tees' },
            { name: 'Jeans & Trousers', slug: 'men-jeans', desc: 'Denim, chinos & formals' },
            { name: 'Formal Wear', slug: 'men-formal', desc: 'Shirts, blazers & suits' },
            { name: 'Ethnic Wear', slug: 'men-ethnic', desc: 'Kurtas, sherwanis & dhotis' },
            { name: 'Footwear', slug: 'men-footwear', desc: 'Sneakers, loafers & sandals' },
        ],
        brands: ['Allen Solly', 'Peter England', 'Van Heusen', 'Louis Philippe', 'Levi\'s', 'US Polo', 'Puma', 'Nike', 'Adidas', 'Wrogn', 'Manyavar', 'Fabindia', 'Bata', 'Woodland', 'Red Tape', 'Campus', 'Sparx', 'Roadster', 'HRX', 'Flying Machine'],
        adjectives: ['Classic', 'Slim Fit', 'Regular Fit', 'Premium', 'Comfort', 'Signature', 'Heritage', 'Urban', 'Street', 'Modern', 'Relaxed', 'Stretch', 'Performance', 'Essential', 'Vintage'],
        productTypes: [
            ['Round Neck T-Shirt', 'Polo T-Shirt', 'V-Neck Tee', 'Striped Tee', 'Printed T-Shirt', 'Henley T-Shirt', 'Oversized Tee'],
            ['Slim Jeans', 'Straight Jeans', 'Jogger Pants', 'Chino Trousers', 'Cargo Pants', 'Track Pants', 'Formal Trousers'],
            ['Formal Shirt', 'Blazer', 'Suit Set', 'Waistcoat', 'Dress Shirt', 'Linen Shirt', 'Oxford Shirt'],
            ['Cotton Kurta', 'Silk Sherwani', 'Nehru Jacket', 'Pathani Suit', 'Dhoti Set', 'Kurta Pyjama', 'Ethnic Jacket'],
            ['Running Shoes', 'Sneakers', 'Loafers', 'Formal Shoes', 'Sandals', 'Flip Flops', 'Sports Shoes'],
        ],
        sellers: ['Brave Fashion', 'StyleVault India', 'TrendSetters', 'Wardrobe Express', 'FashionHub'],
    },
    {
        name: 'Fashion Women', slug: 'fashion-women',
        desc: 'Latest women\'s fashion, ethnic & western wear',
        icon: 'styler', priceRange: [249, 19999],
        subs: [
            { name: 'Dresses & Gowns', slug: 'women-dresses', desc: 'Party, casual & maxi dresses' },
            { name: 'Sarees', slug: 'women-sarees', desc: 'Silk, cotton & designer sarees' },
            { name: 'Kurtas & Kurtis', slug: 'women-kurtas', desc: 'Everyday & festive kurtas' },
            { name: 'Western Wear', slug: 'women-western', desc: 'Tops, jeans & skirts' },
            { name: 'Footwear', slug: 'women-footwear', desc: 'Heels, flats & sneakers' },
        ],
        brands: ['W', 'Biba', 'Aurelia', 'Global Desi', 'Zara', 'H&M', 'Vero Moda', 'Only', 'FabAlley', 'StalkBuyLove', 'Nalli', 'Sabyasachi', 'Anouk', 'Janasya', 'Ishin', 'Metro', 'Catwalk', 'Mochi', 'Lavie', 'Inc.5'],
        adjectives: ['Elegant', 'Chic', 'Bohemian', 'Classic', 'Contemporary', 'Floral', 'Embroidered', 'Printed', 'Handloom', 'Designer', 'Casual', 'Festive', 'Party', 'Vintage', 'Luxe'],
        productTypes: [
            ['Maxi Dress', 'Bodycon Dress', 'A-Line Dress', 'Wrap Dress', 'Shift Dress', 'Shirt Dress', 'Cocktail Gown'],
            ['Banarasi Saree', 'Kanjivaram Saree', 'Georgette Saree', 'Cotton Saree', 'Chiffon Saree', 'Silk Saree', 'Designer Saree'],
            ['Anarkali Kurta', 'Straight Kurta', 'A-Line Kurti', 'Palazzo Kurta Set', 'Printed Kurti', 'Embroidered Kurta', 'Short Kurti'],
            ['Crop Top', 'Skinny Jeans', 'Palazzo Pants', 'Mini Skirt', 'Denim Jacket', 'Blazer', 'Jumpsuit'],
            ['Stiletto Heels', 'Wedge Sandals', 'Ballet Flats', 'Sneakers', 'Block Heels', 'Kolhapuri Chappals', 'Ankle Boots'],
        ],
        sellers: ['Brave Fashion', 'EthnicGlam', 'DesiChic Store', 'Western Avenue', 'ShoeQueen India'],
    },
    {
        name: 'Home & Kitchen', slug: 'home-kitchen',
        desc: 'Cookware, furniture, décor & appliances',
        icon: 'kitchen', priceRange: [149, 49999],
        subs: [
            { name: 'Cookware', slug: 'cookware', desc: 'Pans, pots & utensils' },
            { name: 'Furniture', slug: 'furniture', desc: 'Beds, tables & chairs' },
            { name: 'Home Décor', slug: 'home-decor', desc: 'Wall art, clocks & vases' },
            { name: 'Appliances', slug: 'home-appliances', desc: 'Mixers, ovens & irons' },
            { name: 'Storage & Organization', slug: 'storage', desc: 'Shelves, bins & organizers' },
        ],
        brands: ['Prestige', 'Hawkins', 'Pigeon', 'Butterfly', 'Milton', 'Godrej', 'Nilkamal', 'HomeTown', 'Ikea', 'Wakefit', 'Cello', 'Borosil', 'Philips', 'Bajaj', 'Havells', 'Orient', 'Crompton', 'Solimo', 'Amazon Basics', 'Urban Ladder'],
        adjectives: ['Premium', 'Classic', 'Modern', 'Rustic', 'Elegant', 'Compact', 'Heavy-Duty', 'Non-Stick', 'Stainless Steel', 'Wooden', 'Ceramic', 'Eco-Friendly', 'Designer', 'Handcrafted', 'Professional'],
        productTypes: [
            ['Pressure Cooker', 'Non-Stick Pan', 'Kadhai', 'Tawa', 'Casserole Set', 'Biryani Pot', 'Frying Pan'],
            ['Queen Bed', 'Study Table', 'Office Chair', 'Bookshelf', 'Dining Set', 'Sofa Set', 'Shoe Rack'],
            ['Wall Clock', 'Photo Frame Set', 'Flower Vase', 'Table Lamp', 'Curtains', 'Cushion Covers', 'Wall Art'],
            ['Mixer Grinder', 'Induction Cooktop', 'Air Fryer', 'Microwave Oven', 'Water Purifier', 'Electric Kettle', 'Toaster'],
            ['Shoe Cabinet', 'Wardrobe Organizer', 'Kitchen Rack', 'Storage Boxes', 'Hanging Shelf', 'Drawer Divider', 'Spice Rack'],
        ],
        sellers: ['Brave Home', 'KitchenMart', 'FurnishNow', 'HomeCraft India', 'AppliFresh'],
    },
    {
        name: 'Beauty & Personal Care', slug: 'beauty-care',
        desc: 'Skincare, haircare, makeup & fragrances',
        icon: 'spa', priceRange: [99, 9999],
        subs: [
            { name: 'Skincare', slug: 'skincare', desc: 'Face wash, moisturizers & serums' },
            { name: 'Haircare', slug: 'haircare', desc: 'Shampoos, oils & styling' },
            { name: 'Makeup', slug: 'makeup', desc: 'Lipstick, foundation & eyeshadow' },
            { name: 'Fragrances', slug: 'fragrances', desc: 'Perfumes, deodorants & attars' },
            { name: 'Grooming', slug: 'grooming', desc: 'Trimmers, razors & kits' },
        ],
        brands: ['Lakme', 'Maybelline', 'L\'Oreal', 'Nivea', 'Dove', 'Biotique', 'Himalaya', 'Mamaearth', 'mCaffeine', 'Plum', 'The Body Shop', 'Forest Essentials', 'Fogg', 'Wild Stone', 'Philips', 'Braun', 'Gillette', 'Park Avenue', 'Nykaa', 'Sugar'],
        adjectives: ['Natural', 'Organic', 'Ayurvedic', 'Derma', 'Hydrating', 'Nourishing', 'Anti-Aging', 'Brightening', 'Matte', 'Long-Lasting', 'Daily', 'Intense', 'Soothing', 'Volumizing', 'Repair'],
        productTypes: [
            ['Face Wash', 'Moisturizer', 'Sunscreen SPF 50', 'Vitamin C Serum', 'Night Cream', 'Face Pack', 'Toner'],
            ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum', 'Hair Mask', 'Anti-Dandruff Solution', 'Leave-In Spray'],
            ['Matte Lipstick', 'Liquid Foundation', 'Mascara', 'Eyeshadow Palette', 'Compact Powder', 'Blush', 'Kajal'],
            ['Eau De Parfum', 'Deodorant Spray', 'Body Mist', 'Attar Oil', 'Cologne', 'Roll-On', 'Gift Set'],
            ['Beard Trimmer', 'Electric Shaver', 'Nose Trimmer', 'Grooming Kit', 'Hair Clipper', 'Epilator', 'Body Groomer'],
        ],
        sellers: ['Brave Beauty', 'GlowFresh India', 'SkinFirst Store', 'FragranceVault', 'GroomPro'],
    },
    {
        name: 'Health & Wellness', slug: 'health-wellness',
        desc: 'Supplements, fitness gear & natural remedies',
        icon: 'health_and_safety', priceRange: [149, 24999],
        subs: [
            { name: 'Supplements', slug: 'supplements', desc: 'Vitamins, proteins & minerals' },
            { name: 'Fitness Equipment', slug: 'fitness-equipment', desc: 'Dumbbells, bands & mats' },
            { name: 'Organic Foods', slug: 'organic-foods', desc: 'Honey, dry fruits & superfoods' },
            { name: 'Ayurvedic', slug: 'ayurvedic', desc: 'Traditional herbal remedies' },
            { name: 'Medical Devices', slug: 'medical-devices', desc: 'BP monitors, oximeters & scales' },
        ],
        brands: ['MuscleBlaze', 'HealthKart', 'Optimum Nutrition', 'Ensure', 'Dabur', 'Patanjali', 'Zandu', 'Baidyanath', 'Dr. Morepen', 'Omron', 'Dolo', 'Volini', 'Kozicare', 'Kama Ayurveda', 'Organic India', 'Healthvit', 'Nutrilite', 'Boldfit', 'Decathlon', 'Cultsport'],
        adjectives: ['Natural', 'Pure', 'Premium', 'Organic', 'Cold-Pressed', 'Clinical', 'Pro', 'Lab-Tested', 'Raw', 'Unprocessed', 'Concentrated', 'Vegan', 'Sugar-Free', 'Advanced', 'Therapeutic'],
        productTypes: [
            ['Whey Protein', 'Multivitamin Tablets', 'Omega-3 Capsules', 'Vitamin D3 Drops', 'BCAA Powder', 'Ashwagandha Capsules', 'Biotin Gummies'],
            ['Dumbbells Set', 'Resistance Bands', 'Yoga Mat', 'Skipping Rope', 'Pull-Up Bar', 'Kettlebell', 'Foam Roller'],
            ['Raw Honey', 'Mixed Dry Fruits', 'Chia Seeds', 'Quinoa', 'Green Tea', 'Almond Butter', 'Flax Seeds'],
            ['Chyawanprash', 'Triphala Tablets', 'Tulsi Drops', 'Brahmi Capsules', 'Giloy Juice', 'Neem Capsules', 'Shilajit Resin'],
            ['Digital BP Monitor', 'Pulse Oximeter', 'Glucometer Kit', 'Digital Thermometer', 'Body Weighing Scale', 'Nebulizer', 'Infrared Thermometer'],
        ],
        sellers: ['Brave Health', 'FitStore India', 'OrganicBazaar', 'AyurVeda Direct', 'MediShop India'],
    },
    {
        name: 'Grocery & Essentials', slug: 'grocery',
        desc: 'Everyday staples, snacks, beverages & cleaning',
        icon: 'grocery', priceRange: [19, 4999],
        subs: [
            { name: 'Staples', slug: 'staples', desc: 'Rice, dal, flour & oil' },
            { name: 'Snacks & Packaged', slug: 'snacks', desc: 'Chips, biscuits & namkeen' },
            { name: 'Beverages', slug: 'beverages', desc: 'Tea, coffee, juices & drinks' },
            { name: 'Dairy & Fresh', slug: 'dairy', desc: 'Milk, paneer, curd & butter' },
            { name: 'Cleaning', slug: 'cleaning', desc: 'Detergents, soaps & sanitizers' },
        ],
        brands: ['Tata', 'Fortune', 'Aashirvaad', 'India Gate', 'MDH', 'Everest', 'Haldiram\'s', 'Lay\'s', 'Britannia', 'Parle', 'Amul', 'Mother Dairy', 'Nandini', 'Bru', 'Nescafe', 'Lipton', 'Surf Excel', 'Vim', 'Harpic', 'Dettol'],
        adjectives: ['Premium', 'Organic', 'Farm Fresh', 'Gold', 'Classic', 'Select', 'Roasted', 'Natural', 'Whole Grain', 'Double Action', 'Strong', 'Fresh', 'Pure', 'Extra Virgin', 'Cold-Pressed'],
        productTypes: [
            ['Basmati Rice 5kg', 'Toor Dal 1kg', 'Atta 10kg', 'Sunflower Oil 5L', 'Sugar 5kg', 'Salt 1kg', 'Besan 1kg'],
            ['Potato Chips', 'Cream Biscuits', 'Namkeen Mix', 'Instant Noodles', 'Muesli', 'Corn Flakes', 'Protein Bar'],
            ['Green Tea 100s', 'Instant Coffee 200g', 'Orange Juice 1L', 'Mango Drink 6-Pack', 'Mineral Water 24-Pack', 'Cold Brew Coffee', 'Masala Chai 500g'],
            ['Full Cream Milk 1L', 'Paneer 200g', 'Greek Yogurt 400g', 'Amul Butter 500g', 'Cheese Slices 10-Pack', 'Fresh Curd 1kg', 'Buttermilk 1L'],
            ['Liquid Detergent 2L', 'Dish Wash Gel 750ml', 'Floor Cleaner 1L', 'Hand Sanitizer 500ml', 'Toilet Cleaner 500ml', 'Glass Cleaner', 'Fabric Softener 1L'],
        ],
        sellers: ['Brave Grocery', 'FreshMart India', 'DailyNeeds Express', 'QuickBuy Store', 'KiranaKart'],
    },
    {
        name: 'Baby & Kids', slug: 'baby-kids',
        desc: 'Toys, kids clothing, feeding & nursery essentials',
        icon: 'child_care', priceRange: [99, 14999],
        subs: [
            { name: 'Toys & Games', slug: 'toys', desc: 'Educational, outdoor & board games' },
            { name: 'Kids Clothing', slug: 'kids-clothing', desc: 'Boys & girls wear, newborn sets' },
            { name: 'Feeding', slug: 'feeding', desc: 'Bottles, formula & baby food' },
            { name: 'Nursery', slug: 'nursery', desc: 'Cribs, monitors & bedding' },
            { name: 'School Supplies', slug: 'school-supplies', desc: 'Bags, bottles & stationery' },
        ],
        brands: ['Fisher-Price', 'Lego', 'Hot Wheels', 'Barbie', 'Funskool', 'Chicco', 'Mothercare', 'FirstCry', 'Meemee', 'LuvLap', 'Prestige Baby', 'Bumtum', 'Pampers', 'Huggies', 'Johnson\'s', 'Himalaya Baby', 'Classmate', 'Apsara', 'Wildcraft', 'Skybags'],
        adjectives: ['Fun', 'Educational', 'Colorful', 'Safe', 'Organic', 'BPA-Free', 'Soft', 'Washable', 'Durable', 'Interactive', 'Musical', 'Portable', 'Ergonomic', 'Hypoallergenic', 'Premium'],
        productTypes: [
            ['Building Blocks Set', 'RC Car', 'Board Game', 'Stuffed Animal', 'Science Kit', 'Art Set', 'Outdoor Play Set'],
            ['Cotton Bodysuit 3-Pack', 'Denim Dungaree', 'Party Dress', 'Tracksuit Set', 'Winter Jacket', 'Printed T-Shirt Set', 'School Uniform Set'],
            ['Feeding Bottle Set', 'Baby Cereal', 'Sippy Cup', 'Sterilizer', 'Breast Pump', 'Baby Food Maker', 'Teether Set'],
            ['Baby Crib', 'Baby Monitor', 'Bedding Set', 'Diaper Bag', 'Rocking Chair', 'Play Mat', 'Changing Table'],
            ['School Backpack', 'Lunch Box Set', 'Water Bottle', 'Pencil Box', 'Notebook Set', 'Color Pencil Set', 'Geometry Box'],
        ],
        sellers: ['Brave Kids', 'BabyJoy India', 'ToyLand Store', 'KidZone Express', 'MommyMart'],
    },
    {
        name: 'Sports & Outdoors', slug: 'sports-outdoors',
        desc: 'Cricket, gym gear, camping & cycling',
        icon: 'fitness_center', priceRange: [149, 39999],
        subs: [
            { name: 'Cricket', slug: 'cricket', desc: 'Bats, balls, pads & gloves' },
            { name: 'Gym & Training', slug: 'gym', desc: 'Weights, benches & supplements' },
            { name: 'Camping & Hiking', slug: 'camping', desc: 'Tents, sleeping bags & gear' },
            { name: 'Cycling', slug: 'cycling', desc: 'Bicycles, helmets & accessories' },
            { name: 'Swimming', slug: 'swimming', desc: 'Swimwear, goggles & pool gear' },
        ],
        brands: ['SS', 'SG', 'MRF', 'Gray-Nicolls', 'Kookaburra', 'Decathlon', 'Nike', 'Adidas', 'Puma', 'Yonex', 'Cosco', 'Nivia', 'Hero', 'Firefox', 'Btwin', 'Speedo', 'Arena', 'Wildcraft', 'Quechua', 'Forclaz'],
        adjectives: ['Pro', 'Tournament', 'Elite', 'Performance', 'Competition', 'Training', 'Champion', 'Safari', 'Expedition', 'Urban', 'Racing', 'Aqua', 'Carbon Fiber', 'Titanium', 'Lightweight'],
        productTypes: [
            ['English Willow Bat', 'Cricket Ball 6-Pack', 'Batting Pads', 'Batting Gloves', 'Cricket Kit Bag', 'Wicket Set', 'Helmet'],
            ['Adjustable Dumbbell Set', 'Bench Press', 'Olympic Barbell', 'Weight Plates Set', 'Gym Gloves', 'Wrist Wraps', 'Ab Roller'],
            ['Camping Tent 4P', 'Sleeping Bag', 'Trekking Backpack 60L', 'Headlamp', 'Swiss Knife', 'Camping Stove', 'Hiking Boots'],
            ['Mountain Bike', 'Road Bicycle', 'Helmet', 'Cycling Gloves', 'LED Tail Light', 'Bottle Cage Set', 'Bike Lock'],
            ['Swim Goggles', 'Racing Swimsuit', 'Swim Cap', 'Kickboard', 'Swim Fins', 'Pool Noodle', 'Ear Plugs Set'],
        ],
        sellers: ['Brave Sports', 'CricketPro India', 'GymGear Store', 'OutdoorAdventure', 'AquaSport India'],
    },
    {
        name: 'Books & Stationery', slug: 'books-stationery',
        desc: 'Fiction, non-fiction, notebooks & office supplies',
        icon: 'menu_book', priceRange: [29, 4999],
        subs: [
            { name: 'Fiction', slug: 'fiction', desc: 'Novels, thrillers & romance' },
            { name: 'Non-Fiction', slug: 'non-fiction', desc: 'Self-help, business & biography' },
            { name: 'Notebooks & Diaries', slug: 'notebooks', desc: 'Ruled, unruled & planners' },
            { name: 'Art Supplies', slug: 'art-supplies', desc: 'Colors, brushes & canvases' },
            { name: 'Office Supplies', slug: 'office-supplies', desc: 'Pens, staplers & files' },
        ],
        brands: ['Penguin', 'HarperCollins', 'Rupa', 'Jaico', 'Classmate', 'Navneet', 'Apsara', 'Faber-Castell', 'Camlin', 'Camel', 'Parker', 'Cross', 'Pilot', 'Cello', 'Reynolds', 'Kangaro', 'Luxor', 'Solo', 'Nataraj', 'Staedtler'],
        adjectives: ['Bestselling', 'Award-Winning', 'Premium', 'A5', 'Hardcover', 'Limited Edition', 'Professional', 'Artist', 'Spiral-Bound', 'Leather-Bound', 'Eco-Friendly', 'Refillable', 'Jumbo', 'Pocket', 'Deluxe'],
        productTypes: [
            ['Mystery Novel', 'Fantasy Epic', 'Romance Novel', 'Sci-Fi Thriller', 'Historical Fiction', 'Literary Classic', 'Short Story Collection'],
            ['Self-Help Guide', 'Business Strategy Book', 'Biography', 'Psychology Book', 'Philosophy Book', 'History Book', 'Science Book'],
            ['A4 Ruled Notebook', 'A5 Planner', 'Bullet Journal', 'Diary', 'Composition Book', 'Sketch Pad', 'Legal Pad'],
            ['Watercolor Set', 'Acrylic Paint Set', 'Oil Pastels', 'Canvas Board Set', 'Brush Set', 'Sketching Pencil Set', 'Color Pencil Set'],
            ['Gel Pen Set', 'Stapler with Pins', 'File Folder Set', 'Sticky Notes Pack', 'Desk Organizer', 'Paper Clips Box', 'Whiteboard Marker Set'],
        ],
        sellers: ['Brave Books', 'ReadMore India', 'ArtNation Store', 'PenCraft Shop', 'StationeryHub'],
    },
    {
        name: 'Automotive', slug: 'automotive',
        desc: 'Car & bike accessories, tools & electronics',
        icon: 'directions_car', priceRange: [99, 29999],
        subs: [
            { name: 'Car Accessories', slug: 'car-accessories', desc: 'Seat covers, mats & organizers' },
            { name: 'Bike Accessories', slug: 'bike-accessories', desc: 'Helmets, gloves & guards' },
            { name: 'Tools & Equipment', slug: 'auto-tools', desc: 'Toolkits, jacks & compressors' },
            { name: 'Car Electronics', slug: 'car-electronics', desc: 'Dashcams, GPS & audio' },
            { name: 'Safety & Emergency', slug: 'auto-safety', desc: 'First aid, fire extinguishers & reflectors' },
        ],
        brands: ['3M', 'Bosch', 'Philips', 'Amaron', 'Exide', 'Castrol', 'Motul', 'Shell', 'Studds', 'Steelbird', 'Royal Enfield', 'TVS', 'Garmin', 'Pioneer', 'JBL', 'GoMechanic', 'CarDekho', 'AutoGlym', 'Turtle Wax', 'Formula 1'],
        adjectives: ['Heavy-Duty', 'Universal', 'Custom-Fit', 'All-Weather', 'Anti-Skid', 'Premium', 'LED', 'Smart', 'Waterproof', 'Impact-Resistant', 'Chrome', 'Carbon Fiber', 'Professional', 'Quick-Mount', 'Auto-Sensing'],
        productTypes: [
            ['Seat Cover Set', 'Floor Mats', 'Steering Wheel Cover', 'Car Perfume', 'Sun Shade', 'Boot Organizer', 'Phone Mount'],
            ['Full Face Helmet', 'Riding Gloves', 'Knee Guards', 'Saddle Bag', 'Mobile Holder', 'Tank Pad', 'Visor Shield'],
            ['Tool Kit 40-Piece', 'Car Jack', 'Air Compressor', 'Tyre Inflator', 'Wrench Set', 'Battery Charger', 'Polish Kit'],
            ['Dash Camera', 'Car GPS Navigator', 'Bluetooth Car Kit', 'Parking Sensor', 'Reverse Camera', 'Car Speaker Set', 'Android Head Unit'],
            ['First Aid Kit', 'Fire Extinguisher', 'Safety Triangle', 'Jump Starter', 'Tow Rope', 'Emergency Hammer', 'Reflective Vest'],
        ],
        sellers: ['Brave Auto', 'CarZone India', 'BikeGear Store', 'AutoTech Shop', 'SafeDrive India'],
    },
    {
        name: 'Jewelry & Watches', slug: 'jewelry-watches',
        desc: 'Gold, silver, fashion jewelry & luxury watches',
        icon: 'diamond', priceRange: [199, 99999],
        subs: [
            { name: 'Gold Jewelry', slug: 'gold-jewelry', desc: 'Chains, rings & bangles' },
            { name: 'Silver Jewelry', slug: 'silver-jewelry', desc: 'Rings, pendants & earrings' },
            { name: 'Fashion Jewelry', slug: 'fashion-jewelry', desc: 'Trendy necklaces & bracelets' },
            { name: 'Smartwatches', slug: 'smart-watches', desc: 'Fitness & lifestyle smartwatches' },
            { name: 'Luxury Watches', slug: 'luxury-watches', desc: 'Premium analog & mechanical watches' },
        ],
        brands: ['Tanishq', 'Kalyan', 'Malabar Gold', 'PC Jeweller', 'CaratLane', 'Swarovski', 'Accessorize', 'Titan', 'Fastrack', 'Casio', 'Fossil', 'Sonata', 'Timex', 'Michael Kors', 'Daniel Wellington', 'boAt', 'Noise', 'Fire-Boltt', 'Apple', 'Samsung'],
        adjectives: ['Hallmarked', 'Certified', '22K', '18K', 'Sterling', 'Handcrafted', 'Antique', 'Contemporary', 'Classic', 'Limited Edition', 'Luxury', 'Smart', 'Chronograph', 'Automatic', 'Analog'],
        productTypes: [
            ['Gold Chain', 'Gold Ring', 'Gold Bangles Set', 'Gold Pendant', 'Gold Earrings', 'Gold Necklace Set', 'Gold Coin 10g'],
            ['Silver Ring', 'Silver Anklet', 'Silver Pendant Chain', 'Silver Bracelet', 'Silver Earrings', 'Silver Toe Ring Set', 'Silver Pooja Set'],
            ['Statement Necklace', 'Charm Bracelet', 'Hoop Earrings', 'Layered Chain Set', 'Pearl Studs', 'Kundan Set', 'Oxidized Jhumkas'],
            ['Fitness Smartwatch', 'AMOLED Smartwatch', 'GPS Running Watch', 'Kids Smartwatch', 'Calling Smartwatch', 'Sport Smartwatch', 'Health Monitor Watch'],
            ['Automatic Watch', 'Chronograph Watch', 'Dress Watch', 'Diver Watch', 'Pilot Watch', 'Skeleton Watch', 'Moon Phase Watch'],
        ],
        sellers: ['Brave Jewels', 'GoldVault India', 'SilverCraft Store', 'WatchHouse India', 'LuxeTime'],
    },
    {
        name: 'Pet Supplies', slug: 'pet-supplies',
        desc: 'Dog, cat, fish & bird supplies',
        icon: 'pets', priceRange: [49, 14999],
        subs: [
            { name: 'Dog Supplies', slug: 'dog-supplies', desc: 'Food, toys, leashes & beds' },
            { name: 'Cat Supplies', slug: 'cat-supplies', desc: 'Litter, trees, food & toys' },
            { name: 'Fish & Aquarium', slug: 'fish-aquarium', desc: 'Tanks, filters & fish food' },
            { name: 'Bird Supplies', slug: 'bird-supplies', desc: 'Cages, food & perches' },
            { name: 'Pet Grooming', slug: 'pet-grooming', desc: 'Shampoos, brushes & dryers' },
        ],
        brands: ['Pedigree', 'Royal Canin', 'Whiskas', 'Drools', 'Farmina', 'Purina', 'Hills', 'Me-O', 'Sheba', 'Catit', 'Sobo', 'Sera', 'Taiyo', 'AquaOne', 'Living World', 'Hagen', 'Trixie', 'FurHaven', 'PetSafe', 'Wahl'],
        adjectives: ['Premium', 'Organic', 'Grain-Free', 'Hypoallergenic', 'Eco-Friendly', 'Durable', 'Adjustable', 'Portable', 'Heated', 'Interactive', 'Automatic', 'Natural', 'Large Breed', 'Small Breed', 'Indoor'],
        productTypes: [
            ['Dry Dog Food 10kg', 'Dog Chew Toy', 'Retractable Leash', 'Orthopedic Dog Bed', 'Dog Collar Set', 'Training Treats', 'Dog Raincoat'],
            ['Cat Litter 10L', 'Cat Tree Tower', 'Wet Cat Food 12-Pack', 'Cat Scratching Post', 'Cat Toy Set', 'Litter Box', 'Cat Harness'],
            ['Aquarium Tank 50L', 'Aquarium Filter', 'Fish Food Pack', 'LED Aquarium Light', 'Air Pump', 'Gravel Substrate', 'Fish Net'],
            ['Bird Cage Large', 'Bird Seed Mix 5kg', 'Wooden Perch Set', 'Bird Bath', 'Cuttlebone Pack', 'Nesting Box', 'Bird Swing Toy'],
            ['Pet Shampoo', 'Grooming Brush', 'Nail Clipper', 'Pet Dryer', 'Flea & Tick Spray', 'Ear Cleaner', 'Dental Chew'],
        ],
        sellers: ['Brave Pets', 'PawsNClaws India', 'AquaWorld Store', 'BirdLand India', 'PetGroomPro'],
    },
    {
        name: 'Premium Lifestyle', slug: 'premium-lifestyle',
        desc: 'Designer goods, gourmet food, collectibles & luxury tech',
        icon: 'workspace_premium', priceRange: [999, 499999],
        subs: [
            { name: 'Designer Goods', slug: 'designer-goods', desc: 'Luxury bags, sunglasses & wallets' },
            { name: 'Gourmet Food', slug: 'gourmet-food', desc: 'Imported chocolates, wines & cheeses' },
            { name: 'Collectibles', slug: 'collectibles', desc: 'Coins, figurines & memorabilia' },
            { name: 'Luxury Tech', slug: 'luxury-tech', desc: 'Premium headphones, cameras & drones' },
            { name: 'Art & Paintings', slug: 'art-paintings', desc: 'Original art, prints & sculptures' },
        ],
        brands: ['Gucci', 'Louis Vuitton', 'Prada', 'YSL', 'Chanel', 'Toblerone', 'Lindt', 'Godiva', 'Sony', 'Canon', 'Nikon', 'DJI', 'Bose', 'Bang & Olufsen', 'Montblanc', 'Hermès', 'Tiffany', 'Cartier', 'Ray-Ban', 'Tom Ford'],
        adjectives: ['Exclusive', 'Limited Edition', 'Handmade', 'Artisan', 'Curated', 'Heritage', 'Bespoke', 'Luxe', 'Ultra-Premium', 'Signature', 'Collectors', 'Vintage', 'Grand', 'Royal', 'Imperial'],
        productTypes: [
            ['Leather Handbag', 'Designer Sunglasses', 'Premium Wallet', 'Silk Scarf', 'Leather Belt', 'Card Holder', 'Travel Bag'],
            ['Belgian Chocolate Box', 'Artisan Cheese Board', 'Premium Coffee Beans 1kg', 'Imported Olive Oil', 'Dried Fruit Gift Box', 'Macaron Set', 'Tea Sampler Collection'],
            ['Gold Coin Set', 'Crystal Figurine', 'Vintage Compass', 'Signed Book First Edition', 'Commemorative Medal', 'Antique Clock', 'Model Ship'],
            ['Pro Camera Body', '4K Drone', 'Premium Headphones', 'Portable Projector', 'E-Reader Device', 'Smart Glasses', 'Audiophile DAC'],
            ['Oil Painting Original', 'Canvas Print Set', 'Bronze Sculpture', 'Abstract Wall Art', 'Photography Print', 'Ceramic Vase Artwork', 'Handwoven Tapestry'],
        ],
        sellers: ['Brave Luxe', 'EliteGoods India', 'GourmetVault', 'CollectorsDen', 'ArtGallery India'],
    },
];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

function slugify(text: string): string {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 80);
}

function randomFloat(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateImages(categorySlug: string, index: number): string {
    // Use picsum.photos with deterministic seeds for consistency
    const seed = `${categorySlug}-${index}`;
    const sizes = [400, 500, 600];
    const images = Array.from({ length: 3 }, (_, i) =>
        `https://picsum.photos/seed/${seed}-${i}/${sizes[i % 3]}/${sizes[i % 3]}`
    );
    return JSON.stringify(images);
}

function generateBadge(): string | null {
    const badges = [null, null, null, null, null, null, // 60% no badge
        'BESTSELLER', 'VALUE PICK', 'TRENDING', 'HOT DEAL',
        'NEW', 'PREMIUM', 'ECO FRIENDLY', 'TOP RATED'];
    return pick(badges);
}

function generateSpecs(catSlug: string): string {
    const specTemplates: Record<string, Record<string, string[]>> = {
        'electronics': { 'Brand Origin': ['India', 'China', 'Japan', 'Korea', 'USA'], 'Warranty': ['1 Year', '2 Years', '3 Years'], 'Color': ['Black', 'White', 'Blue', 'Silver', 'Gold'] },
        'fashion-men': { 'Material': ['Cotton', 'Polyester', 'Linen', 'Denim', 'Silk'], 'Fit': ['Slim', 'Regular', 'Relaxed'], 'Care': ['Machine Wash', 'Hand Wash', 'Dry Clean'] },
        'fashion-women': { 'Fabric': ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Rayon'], 'Pattern': ['Solid', 'Printed', 'Embroidered', 'Woven'], 'Occasion': ['Casual', 'Festive', 'Party', 'Office'] },
        'default': { 'Brand Origin': ['India', 'Imported'], 'Material': ['Premium Quality'], 'Warranty': ['6 Months', '1 Year', '2 Years'] },
    };
    const specs = specTemplates[catSlug] || specTemplates['default'];
    const result: Record<string, string> = {};
    for (const [key, vals] of Object.entries(specs)) {
        result[key] = pick(vals);
    }
    return JSON.stringify(result);
}

function generateTags(catName: string, subName: string): string {
    const tags = [catName, subName, 'Brave Ecom', 'Free Shipping', 'Genuine'];
    if (Math.random() > 0.5) tags.push('Best Price');
    if (Math.random() > 0.7) tags.push('Eco Friendly');
    return JSON.stringify(tags);
}

// ─── MAIN SEEDER ──────────────────────────────────────────────────────────

async function main() {
    console.log('🏬 Starting 70,000 product seed...');
    console.log('━'.repeat(60));

    // Clear existing mall data
    console.log('🗑️  Clearing existing mall data...');
    await prisma.mallProduct.deleteMany();
    await prisma.mallSubCategory.deleteMany();
    await prisma.mallCategory.deleteMany();
    console.log('✅ Cleared.');

    let totalProducts = 0;
    const startTime = Date.now();

    for (let catIdx = 0; catIdx < CATEGORIES.length; catIdx++) {
        const cat = CATEGORIES[catIdx];
        const catStartTime = Date.now();

        // Create category
        const category = await prisma.mallCategory.create({
            data: {
                name: cat.name,
                slug: cat.slug,
                description: cat.desc,
                icon: cat.icon,
                imageUrl: `https://picsum.photos/seed/cat-${cat.slug}/800/400`,
                sortOrder: catIdx,
            },
        });
        console.log(`\n📁 [${catIdx + 1}/14] Category: ${cat.name}`);

        for (let subIdx = 0; subIdx < cat.subs.length; subIdx++) {
            const sub = cat.subs[subIdx];

            // Create subcategory
            const subCategory = await prisma.mallSubCategory.create({
                data: {
                    categoryId: category.id,
                    name: sub.name,
                    slug: sub.slug,
                    description: sub.desc,
                    imageUrl: `https://picsum.photos/seed/sub-${sub.slug}/600/300`,
                    sortOrder: subIdx,
                },
            });

            // Generate 1,000 products for this subcategory
            const BATCH_SIZE = 250;
            const PRODUCTS_PER_SUB = 1000;
            const productTypes = cat.productTypes[subIdx];

            for (let batchStart = 0; batchStart < PRODUCTS_PER_SUB; batchStart += BATCH_SIZE) {
                const batchEnd = Math.min(batchStart + BATCH_SIZE, PRODUCTS_PER_SUB);
                const batchData = [];

                for (let i = batchStart; i < batchEnd; i++) {
                    const brand = pick(cat.brands);
                    const adj = pick(cat.adjectives);
                    const productType = pick(productTypes);
                    const variantNum = i + 1;

                    const name = `${brand} ${adj} ${productType} V${variantNum}`;
                    const uniqueSlug = slugify(`${name}-${category.id.substring(0, 4)}-${subCategory.id.substring(0, 4)}-${i}`);

                    const mrp = randomFloat(cat.priceRange[0], cat.priceRange[1]);
                    const discountPct = randomInt(0, 45);
                    const price = Math.round(mrp * (1 - discountPct / 100));

                    batchData.push({
                        name,
                        slug: uniqueSlug,
                        description: `${name} - ${sub.desc}. Premium quality guaranteed by ${pick(cat.sellers)}. Perfect for everyday use.`,
                        shortDescription: `${adj} ${productType} by ${brand}`,
                        categoryId: category.id,
                        subCategoryId: subCategory.id,
                        price,
                        mrp,
                        discount: discountPct,
                        images: generateImages(sub.slug, i),
                        badge: generateBadge(),
                        rating: randomFloat(3.5, 5.0),
                        reviewCount: randomInt(5, 2500),
                        seller: pick(cat.sellers),
                        stock: Math.random() > 0.05 ? 'In Stock' : 'Limited Stock',
                        tags: generateTags(cat.name, sub.name),
                        specs: generateSpecs(cat.slug),
                        isFeatured: Math.random() < 0.05,
                        isTrending: Math.random() < 0.10,
                    });
                }

                await prisma.mallProduct.createMany({ data: batchData });
                totalProducts += batchData.length;
            }

            process.stdout.write(`   ├─ ${sub.name}: 1,000 products ✅\n`);
        }

        const catDuration = ((Date.now() - catStartTime) / 1000).toFixed(1);
        console.log(`   └─ Category complete (${catDuration}s)`);
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n' + '━'.repeat(60));
    console.log(`🎉 SEED COMPLETE!`);
    console.log(`   📦 Total Products: ${totalProducts.toLocaleString()}`);
    console.log(`   📁 Categories: 14`);
    console.log(`   📂 Subcategories: 70`);
    console.log(`   ⏱️  Duration: ${totalDuration}s`);
    console.log('━'.repeat(60));

    // Verify counts
    const catCount = await prisma.mallCategory.count();
    const subCount = await prisma.mallSubCategory.count();
    const prodCount = await prisma.mallProduct.count();
    const featuredCount = await prisma.mallProduct.count({ where: { isFeatured: true } });
    const trendingCount = await prisma.mallProduct.count({ where: { isTrending: true } });

    console.log(`\n📊 VERIFICATION:`);
    console.log(`   Categories: ${catCount}`);
    console.log(`   Subcategories: ${subCount}`);
    console.log(`   Products: ${prodCount.toLocaleString()}`);
    console.log(`   Featured: ${featuredCount.toLocaleString()}`);
    console.log(`   Trending: ${trendingCount.toLocaleString()}`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
