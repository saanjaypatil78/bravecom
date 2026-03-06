const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'app', 'api', 'mall', 'products', 'route.ts');
let content = fs.readFileSync(FILE_PATH, 'utf-8');

const patches = {
    "MALL-PRD-00011": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800", // Ray Ban - Unsplash is safer for pure fashion
    "MALL-PRD-00012": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", // Jacket
    "MALL-PRD-00013": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800", // Minimalist Wallet
    "MALL-PRD-00014": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800", // Watch
    "MALL-PRD-00015": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800", // Sneakers
    "MALL-PRD-00016": "https://images.unsplash.com/photo-1596755094514-f87e32f85e16?auto=format&fit=crop&q=80&w=800", // Shirt
    "MALL-PRD-00017": "https://images.unsplash.com/photo-1596181961156-f033cfed24b8?auto=format&fit=crop&q=80&w=800", // Instant pot / appliance
    "MALL-PRD-00018": "https://images.unsplash.com/photo-1626154117075-f86a0149bbbb?auto=format&fit=crop&q=80&w=800", // Air purifier / appliance
    "MALL-PRD-00019": "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800", // Dyson
    "MALL-PRD-00020": "https://images.unsplash.com/photo-1595188827944-ff7a5bc8e938?auto=format&fit=crop&q=80&w=800", // Lunch box
};

for (const [id, url] of Object.entries(patches)) {
    const rx = new RegExp(`(id:\\s*"${id}".*?image:\\s*)"([^"]+)"`);
    content = content.replace(rx, `$1"${url}"`);
}

fs.writeFileSync(FILE_PATH, content, 'utf-8');
console.log("Patched 10 bad images successfully.");
