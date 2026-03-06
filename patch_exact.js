const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'app', 'api', 'mall', 'products', 'route.ts');
let content = fs.readFileSync(FILE_PATH, 'utf-8');

const patches = {
    // Exact requested fixes by user
    "MALL-PRD-00023": "https://m.media-amazon.com/images/I/71wLpW55yEL._AC_SX679_.jpg", // Boldfit Anti-slip yoga mat
    "MALL-PRD-00022": "https://m.media-amazon.com/images/I/61r58MhKxEL._AC_SX679_.jpg", // Milton flask
    "MALL-PRD-00041": "https://www.bigbasket.com/media/uploads/p/l/240052_13-tata-infant-iodized-salt.jpg", // Tata salt
    "MALL-PRD-00082": "https://m.media-amazon.com/images/I/71Yy36XQ47L._AC_SX679_.jpg", // Jiffy Peat
    "MALL-PRD-00026": "https://m.media-amazon.com/images/I/71jC90hB50L._AC_SX679_.jpg", // Boldfit Pull up bar
    "MALL-PRD-00027": "https://rukminim2.flixcart.com/image/832/832/xif0q/ball/y/s/x/350-400-5-22-1-dominator-football-size-5-1-dominator-nivia-original-imagsy7d6y2tcfhz.jpeg?q=70&crop=false", // Nivia football

    // Broken images from previous screenshot
    "MALL-PRD-00016": "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/i/v/o/40-st1007-wrogn-original-imahfyyffw3x2kbg.jpeg?q=70&crop=false", // Wrogn shirt
    "MALL-PRD-00017": "https://m.media-amazon.com/images/I/71tS+8Vb9xL._AC_SX679_.jpg", // Instant Pot
    "MALL-PRD-00018": "https://m.media-amazon.com/images/I/71Oa+aO8y8L._AC_SX679_.jpg", // Philips Air Purifier
    "MALL-PRD-00020": "https://m.media-amazon.com/images/I/71G1dDkI6LL._AC_SX679_.jpg", // Borosil Lunch Box
    "MALL-PRD-00084": "https://m.media-amazon.com/images/I/71ZpTf7uS-L._AC_SX679_.jpg"  // Kisan Parivar Drip Kit
};

for (const [id, url] of Object.entries(patches)) {
    const rx = new RegExp(`(id:\\s*"${id}".*?image:\\s*)"([^"]+)"`);
    const match = rx.exec(content);
    if (match) {
        content = content.replace(rx, `$1"${url}"`);
        console.log(`Patched ${id} -> ${url}`);
    } else {
        console.log(`Failed to patch ${id}`);
    }
}

fs.writeFileSync(FILE_PATH, content, 'utf-8');
console.log("All explicit exact image fixes applied.");
