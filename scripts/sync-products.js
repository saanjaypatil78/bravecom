const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'data', 'products.json');
const ROUTE_TS_PATH = path.join(__dirname, '..', 'app', 'api', 'mall', 'products', 'route.ts');

const MAX_PRODUCTS = process.env.MAX_PRODUCTS ? parseInt(process.env.MAX_PRODUCTS) : 100;

function syncProductsToRoute() {
    console.log('🔄 Starting daily product sync...\n');

    try {
        const productsJson = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
        let products = JSON.parse(productsJson);

        if (!Array.isArray(products) || products.length === 0) {
            console.log('⚠️ No products found in products.json');
            return;
        }

        // Sort by rating and reviews to get best products first
        products = products
            .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0))
            .slice(0, MAX_PRODUCTS);

        console.log(`📦 Found ${products.length} products to sync (limited from total)`);

        let routeContent = fs.readFileSync(ROUTE_TS_PATH, 'utf-8');

        const catalogStartMarker = 'const CATALOG: Product[] = [';
        const catalogEndMarker = '];';

        const startIndex = routeContent.indexOf(catalogStartMarker);
        
        // Find the first occurrence of ]; after the start marker (end of CATALOG array)
        const afterStart = routeContent.substring(startIndex + catalogStartMarker.length);
        const endIndex = startIndex + catalogStartMarker.length + afterStart.indexOf(catalogEndMarker);

        if (startIndex === -1 || endIndex === -1) {
            console.error('❌ Could not find CATALOG markers in route.ts');
            return;
        }

        const productsArrayStr = products.map(p => {
            return JSON.stringify(p, null, 2);
        }).join(',\n\n');

        const newContent = routeContent.substring(0, startIndex + catalogStartMarker.length) +
            '\n' + productsArrayStr +
            '\n' + routeContent.substring(endIndex);

        fs.writeFileSync(ROUTE_TS_PATH, newContent, 'utf-8');

        console.log(`✅ Successfully synced ${products.length} products to route.ts`);
        console.log('🚀 Products are now live on the mall!\n');

    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    syncProductsToRoute();
}

module.exports = { syncProductsToRoute };
