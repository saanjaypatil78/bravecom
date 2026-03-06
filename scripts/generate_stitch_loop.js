const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const targetPublicDir = path.join(__dirname, '..', 'public', 'stitch-screens');
const outputFile = path.join(__dirname, '..', 'public', 'stitch_screens_list.json');

if (!fs.existsSync(targetPublicDir)) {
    fs.mkdirSync(targetPublicDir, { recursive: true });
}

const screens = [];

const dirs = fs.readdirSync(rootDir);
dirs.forEach(item => {
    const fullPath = path.join(rootDir, item);
    if (fs.statSync(fullPath).isDirectory() && item !== 'sunray_system') {
        const codePath = path.join(fullPath, 'code.html');
        const imgPath = path.join(fullPath, 'screen.png');

        if (fs.existsSync(codePath)) {
            const targetScreenDir = path.join(targetPublicDir, item);
            if (!fs.existsSync(targetScreenDir)) {
                fs.mkdirSync(targetScreenDir, { recursive: true });
            }

            fs.copyFileSync(codePath, path.join(targetScreenDir, 'code.html'));
            if (fs.existsSync(imgPath)) {
                fs.copyFileSync(imgPath, path.join(targetScreenDir, 'screen.png'));
            }

            let category = "Uncategorized";
            const nameLower = item.toLowerCase();

            if (nameLower.includes("onboarding") || nameLower.includes("registration") || nameLower.includes("enrollment") || nameLower.includes("welcome")) {
                category = "Onboarding & Auth";
            } else if (nameLower.includes("mall") || nameLower.includes("product") || nameLower.includes("checkout") || nameLower.includes("cart") || nameLower.includes("marketplace")) {
                category = "E-Commerce Mall";
            } else if (nameLower.includes("investor") || nameLower.includes("portfolio") || nameLower.includes("wealth") || nameLower.includes("roi") || nameLower.includes("fund")) {
                category = "Investor Hub";
            } else if (nameLower.includes("admin") || nameLower.includes("governance") || nameLower.includes("system") || nameLower.includes("monitor") || nameLower.includes("audit")) {
                category = "Master Admin Console";
            } else if (nameLower.includes("franchise") || nameLower.includes("regional")) {
                category = "Franchise Operations";
            } else if (nameLower.includes("sun_ray") || nameLower.includes("referral") || nameLower.includes("commission") || nameLower.includes("3d_sun_ray")) {
                category = "Sun Ray Network";
            } else if (nameLower.includes("factrade") || nameLower.includes("payout") || nameLower.includes("disbursement") || nameLower.includes("treasury") || nameLower.includes("royalty")) {
                category = "Treasury & Factrade";
            } else if (nameLower.includes("3d") || nameLower.includes("holographic")) {
                category = "3D Cinematic Experiences";
            }

            screens.push({
                id: item,
                name: item.replace(/_/g, ' '),
                category: category,
                htmlUrl: `/stitch-screens/${item}/code.html`,
                imgUrl: fs.existsSync(imgPath) ? `/stitch-screens/${item}/screen.png` : null
            });
        }
    }
});

// Group screens by category
const flows = {};
screens.forEach(s => {
    if (!flows[s.category]) flows[s.category] = [];
    flows[s.category].push(s);
});

fs.writeFileSync(outputFile, JSON.stringify({ screens, flows }, null, 2));
console.log(`Generated loop for ${screens.length} screens across ${Object.keys(flows).length} strategic flows.`);
