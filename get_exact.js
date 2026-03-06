const google = require('googlethis');

const items = [
    { id: "MALL-PRD-00016", name: "Wrogn Slim Fit Casual Shirt" },
    { id: "MALL-PRD-00017", name: "Instant Pot Duo 7-in-1" },
    { id: "MALL-PRD-00018", name: "Philips Air Purifier Series 800" },
    { id: "MALL-PRD-00020", name: "Borosil Stainless Lunch Box Set" },
    { id: "MALL-PRD-00084", name: "Kisan Parivar Drip Irrigation Kit" },
    { id: "MALL-PRD-00023", name: "Boldfit Anti-Slip Yoga Mat 6mm" },
    { id: "MALL-PRD-00022", name: "Milton Thermosteel Flask 1000ml" },
    { id: "MALL-PRD-00041", name: "Tata Salt 1kg" },
    { id: "MALL-PRD-00082", name: "Jiffy 7 Peat Pellets 50-Pack" },
    { id: "MALL-PRD-00026", name: "Boldfit Pull-Up Bar Doorway" },
    { id: "MALL-PRD-00027", name: "Nivia Dominator Football Size 5" }
];

async function main() {
    for (const item of items) {
        console.log(`\n--- ${item.id}: ${item.name} ---`);
        const query = `${item.name} product image amazon or flipkart`;
        try {
            const images = await google.image(query, { safe: false });
            let count = 0;
            for (const img of images) {
                if (img.url.includes('m.media-amazon.com') || img.url.includes('rukminim') || img.url.includes('bigbasket.com')) {
                    console.log(img.url);
                    count++;
                }
                if (count >= 3) break;
            }
        } catch (e) {
            console.error(e.message);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}
main();
