const fs = require('fs');
const google = require('googlethis');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'app', 'api', 'mall', 'products', 'route.ts');

async function main() {
    let content = fs.readFileSync(FILE_PATH, 'utf-8');

    // Pattern to grab lines with `image: getImg(...)`
    // We want to capture the prefix, the product name, and the getImg call exactly.
    // Example: { id: "MALL-PRD-00007", name: "Realme 13 Pro+ 5G", ... image: getImg('smartphone', 7)
    const regex = /(id:\s*"MALL-PRD-\d+".*?name:\s*"([^"]+)".*?image:\s*)(getImg\([^)]+\))/g;

    let match;
    const matches = [];
    while ((match = regex.exec(content)) !== null) {
        matches.push({
            full: match[0],
            prefix: match[1],
            name: match[2],
            oldImg: match[3]
        });
    }

    if (matches.length === 0) {
        console.log("No more getImg placeholders found!");
        return;
    }

    console.log(`Found ${matches.length} products to update. Starting Google Images search...`);

    for (let i = 0; i < matches.length; i++) {
        const item = matches[i];
        const query = `${item.name} high res product ecommerce transparent background white bg -site:pinterest.com`;
        console.log(`[${i + 1}/${matches.length}] Searching: ${item.name}`);

        try {
            const images = await google.image(query, { safe: false });
            if (images && images.length > 0) {
                // Pick the first reliable image (often amazon, flipkart, or official sites)
                let bestImg = images[0].url;

                // If it's a huge base64 or completely broken URL, try next
                if (bestImg.length > 500) {
                    bestImg = images[1]?.url || bestImg;
                }

                console.log(` -> Found: ${bestImg}`);

                const replacement = `${item.prefix}"${bestImg}"`;
                content = content.replace(item.full, replacement);

                // Write incrementally so we save progress in case it crashes
                fs.writeFileSync(FILE_PATH, content, 'utf-8');
            } else {
                console.log(` -> No results for ${item.name}`);
            }
        } catch (e) {
            console.error(` -> Error fetching ${item.name}: ${e.message}`);
        }

        // Anti-ratelimit delay
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log("Image update complete!");
}

main().catch(console.error);
