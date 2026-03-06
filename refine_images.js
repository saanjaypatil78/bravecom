const fs = require('fs');
const google = require('googlethis');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'app', 'api', 'mall', 'products', 'route.ts');

async function main() {
    let content = fs.readFileSync(FILE_PATH, 'utf-8');
    const regex = /(id:\s*"MALL-PRD-\d+".*?name:\s*"([^"]+)".*?image:\s*)"([^"]+)"/g;

    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push({
            full: match[0],
            prefix: match[1],
            name: match[2],
            url: match[3]
        });
    }

    console.log(`Checking ${matches.length} products to enforce perfectly aligned Amazon-style images...`);

    for (let i = 0; i < matches.length; i++) {
        const item = matches[i];

        const query = `site:amazon.in OR site:amazon.com "${item.name}" product image`;
        console.log(`[${i + 1}/${matches.length}] Finding precise Amazon image for: ${item.name}`);

        try {
            const images = await google.image(query, { safe: false });
            let bestImg = null;

            // Prioritize clean amazon media CDNs
            for (const img of images) {
                if (img.url.includes('m.media-amazon.com/images/I') || img.url.includes('images-na.ssl-images-amazon.com')) {
                    // Try to clean up URL to get high res, or just use it as is if it looks good
                    bestImg = img.url;
                    // Make it a nice size if it has the modifier
                    if (bestImg.includes('._AC_')) {
                        bestImg = bestImg.replace(/\._AC_.*?\./, '._AC_SX679_.');
                    }
                    break;
                }
            }

            if (!bestImg && images.length > 0) {
                // Fallback to Flipkart or the first available clean image
                bestImg = images.find(img => !img.url.includes('base64') && img.url.length < 300)?.url || images[0].url;
            }

            if (bestImg && bestImg !== item.url) {
                console.log(` -> Updating to perfectly aligned image: ${bestImg}`);
                const replacement = `${item.prefix}"${bestImg}"`;
                content = content.replace(item.full, replacement);
                fs.writeFileSync(FILE_PATH, content, 'utf-8');
            } else {
                console.log(` -> Retained image (looks good or no better option).`);
            }

        } catch (e) {
            console.error(` -> Error: ${e.message}`);
        }

        // Anti ratelimit
        await new Promise(r => setTimeout(r, 1200));
    }

    console.log("Image refinement complete! All products should now have perfect Amazon-style alignment.");
}

main().catch(console.error);
