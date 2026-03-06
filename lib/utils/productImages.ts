/**
 * Smart Product Image Resolver
 * Maps product categories & names to relevant, high-quality curated images.
 * Uses direct Unsplash photo URLs (no redirects) that work with Next.js Image.
 * 
 * Approach: Each category has a curated pool of real Unsplash photo IDs that
 * are rotated deterministically based on a hash of the product name.
 */

// Curated Unsplash photo IDs per category — direct URLs, no redirects
const CATEGORY_PHOTOS: Record<string, string[]> = {
    'electronics': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', // smartphone
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', // laptop
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // headphones
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // smartwatch
        'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&h=400&fit=crop', // earbuds
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop', // gadgets
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop', // pc setup
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop', // tech setup
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', // phone accessories
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop', // camera
    ],
    'fashion-men': [
        'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop', // mens shirt
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', // suits
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', // sneakers
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', // jeans
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop', // clothes rack
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', // sneakers 2
        'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', // mens watch
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop', // tshirt
        'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=400&h=400&fit=crop', // menswear
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop', // formal shoes
    ],
    'fashion-women': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', // womens dress
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop', // saree
        'https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=400&h=400&fit=crop', // heels
        'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop', // fashion
        'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=400&fit=crop', // clothing
        'https://images.unsplash.com/photo-1596993100167-2644eac955b8?w=400&h=400&fit=crop', // jewelry
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop', // handbag
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop', // womens fashion
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop', // kurta
        'https://images.unsplash.com/photo-1569394905193-d3d0fedbe50d?w=400&h=400&fit=crop', // flats
    ],
    'home-kitchen': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', // kitchen
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop', // modern kitchen
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', // sofa
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop', // living room
        'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&h=400&fit=crop', // table lamp
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop', // home decor
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop', // furniture
        'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=400&fit=crop', // cookware
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&h=400&fit=crop', // bedroom
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', // appliances
    ],
    'beauty-care': [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', // makeup
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', // skincare
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', // cosmetics
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop', // perfume
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop', // lipstick
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop', // hair care
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', // beauty products
        'https://images.unsplash.com/photo-1620756235835-886e7ec3810a?w=400&h=400&fit=crop', // serum
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop', // cream
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', // grooming
    ],
    'beauty-personal-care': [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1620756235835-886e7ec3810a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
    ],
    'health-wellness': [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', // yoga
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', // gym
        'https://images.unsplash.com/photo-1593095948071-474c5cc2c7e4?w=400&h=400&fit=crop', // supplements
        'https://images.unsplash.com/photo-1505576399279-0d754d038d2c?w=400&h=400&fit=crop', // protein
        'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=400&h=400&fit=crop', // dumbbells
        'https://images.unsplash.com/photo-1612208695882-02f2322b7fee?w=400&h=400&fit=crop', // vitamins
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=400&fit=crop', // healthy food
        'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=400&fit=crop', // wellness
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', // fitness
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop', // meditation
    ],
    'grocery': [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop', // grocery
        'https://images.unsplash.com/photo-1553546895-531931aa1aa8?w=400&h=400&fit=crop', // spices
        'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=400&fit=crop', // bread
        'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&h=400&fit=crop', // vegetables
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', // fruits
        'https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=400&fit=crop', // grocery bag
        'https://images.unsplash.com/photo-1505576399279-0d754d038d2c?w=400&h=400&fit=crop', // snacks
        'https://images.unsplash.com/photo-1557178985-891ca9b9b01c?w=400&h=400&fit=crop', // tea
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop', // coffee
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', // dairy
    ],
    'grocery-essentials': [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553546895-531931aa1aa8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505576399279-0d754d038d2c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1557178985-891ca9b9b01c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
    ],
    'baby-kids': [
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop', // toys
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', // baby toys
        'https://images.unsplash.com/photo-1522771739944-46367740051e?w=400&h=400&fit=crop', // kids
        'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop', // baby
        'https://images.unsplash.com/photo-1587654780037-e6d3dce1d477?w=400&h=400&fit=crop', // school bag
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop', // child
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop', // baby products
        'https://images.unsplash.com/photo-1584553421349-3557471bed79?w=400&h=400&fit=crop', // lego
        'https://images.unsplash.com/photo-1581783898382-80983a9a2e03?w=400&h=400&fit=crop', // blocks
        'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=400&h=400&fit=crop', // nursery
    ],
    'sports-outdoors': [
        'https://images.unsplash.com/photo-1461896836934-bd45ba7e8f83?w=400&h=400&fit=crop', // cricket
        'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop', // gym
        'https://images.unsplash.com/photo-1504280390366-3e69e4fa57f7?w=400&h=400&fit=crop', // camping
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop', // bicycle
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop', // swimming
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop', // football
        'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=400&fit=crop', // running
        'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=400&h=400&fit=crop', // sports shoes
        'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=400&fit=crop', // weights
        'https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=400&h=400&fit=crop', // hiking
    ],
    'books-stationery': [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', // book
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', // library
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', // notebook
        'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=400&fit=crop', // writing
        'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop', // pens
        'https://images.unsplash.com/photo-1452457807411-4979b707e5be?w=400&h=400&fit=crop', // reading
        'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop', // old books
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop', // open book
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop', // art
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop', // stationery
    ],
    'automotive': [
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop', // car
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=400&fit=crop', // car interior
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', // motorcycle
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', // wheel
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=400&fit=crop', // sports car
        'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop', // steering
        'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=400&h=400&fit=crop', // helmet
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop', // tools
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop', // luxury car
        'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=400&h=400&fit=crop', // bike
    ],
    'jewelry-watches': [
        'https://images.unsplash.com/photo-1515562141589-67f0d478b808?w=400&h=400&fit=crop', // jewelry
        'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=400&fit=crop', // watch
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&h=400&fit=crop', // rings
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', // necklace
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop', // bracelet
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', // earrings
        'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&h=400&fit=crop', // gold
        'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop', // luxury watch
        'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop', // diamond
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop', // smartwatch
    ],
    'pet-supplies': [
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', // dog
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop', // cat
        'https://images.unsplash.com/photo-1584753987666-ead137ec0614?w=400&h=400&fit=crop', // aquarium
        'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop', // bird
        'https://images.unsplash.com/photo-1601758175580-4b58e81e1a63?w=400&h=400&fit=crop', // puppy
        'https://images.unsplash.com/photo-1583336663277-620dc1996580?w=400&h=400&fit=crop', // kitten
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop', // dogs
        'https://images.unsplash.com/photo-1596854273338-cbf078ec7071?w=400&h=400&fit=crop', // pet food
        'https://images.unsplash.com/photo-1508014924566-6ec3dc15d5f3?w=400&h=400&fit=crop', // fish
        'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=400&h=400&fit=crop', // hamster
    ],
    'premium-lifestyle': [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', // luxury bag
        'https://images.unsplash.com/photo-1509941943102-10c232fc3c45?w=400&h=400&fit=crop', // wine
        'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', // luxury
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', // premium
        'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=400&fit=crop', // product
        'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=400&fit=crop', // chocolate
        'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=400&fit=crop', // sunglasses
        'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400&h=400&fit=crop', // art
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', // drone view
        'https://images.unsplash.com/photo-1613915617621-2b1a7b84b37b?w=400&h=400&fit=crop', // camera
    ],
};

// Default fallback photos
const DEFAULT_PHOTOS = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
];

/** Deterministic hash for consistent image assignment */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Get a keyword-relevant image URL for a product.
 * Uses curated Unsplash photo URLs (direct, no redirects) matched to category.
 * Each product gets a consistent image based on its name hash.
 */
export function getRelevantProductImage(
    productName: string,
    categorySlug: string,
    existingImageUrl?: string,
): string {
    // If image URL is already a real product image (not picsum/dummy), use it
    if (existingImageUrl && !existingImageUrl.includes('picsum.photos') && !existingImageUrl.includes('dummyimage')) {
        return existingImageUrl;
    }

    const hash = simpleHash(productName);
    const photos = CATEGORY_PHOTOS[categorySlug] || DEFAULT_PHOTOS;
    return photos[hash % photos.length];
}

/**
 * Get a relevant category banner image
 */
export function getRelevantCategoryImage(categorySlug: string): string {
    const photos = CATEGORY_PHOTOS[categorySlug];
    if (!photos || photos.length === 0) return DEFAULT_PHOTOS[0];
    return photos[0].replace('w=400&h=400', 'w=800&h=400');
}
