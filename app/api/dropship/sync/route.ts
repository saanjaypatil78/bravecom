import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getGem, GemType } from "@/lib/gemini/gems";
import { runGem } from "@/lib/gemini/gemini";

const prisma = new PrismaClient();
const SYNC_SECRET = process.env.DROPSHIP_SYNC_SECRET || "brave-ecom-sync-dev";

// Autonomous Dropship Sync API (Functions as a smart scraper endpoint)
interface ScrapedProduct {
    name: string;
    categoryId?: string;
    subCategoryId?: string;
    mrp?: number;
    price: number;
    discount?: number;
    shortDescription?: string;
    images?: string[];
    tags?: string[];
    specs?: Record<string, string>;
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${SYNC_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized dropship sync request." }, { status: 401 });
        }

        // 1. Receive Scraping Target Data
        const body = await req.json();
        const { targetUrl, platform, options } = body;

        if (!targetUrl || !platform) {
            return NextResponse.json({ error: "Missing 'targetUrl' or 'platform'." }, { status: 400 });
        }

        let gemType: GemType;
        if (platform === "amazon") gemType = "amazon_scraper";
        else if (platform === "aliexpress") gemType = "aliexpress_scraper";
        else if (platform === "meesho") gemType = "meesho_scraper";
        else {
            return NextResponse.json({ error: "Unsupported platform. Use 'amazon', 'aliexpress', or 'meesho'." }, { status: 400 });
        }

        // 2. Trigger the precise autonomous Gem
        const model = getGem(gemType);
        const prompt = `Navigate to and scrape the following product URL autonomously: ${targetUrl}
Extract the precise HD product thumbnail, variant pricing, specification, and clean titles/descriptions.
Calculate an optimal retail markup based on the wholesale prices found.
Options: ${JSON.stringify(options || {})}
Output strictly JSON matching the requested Prisma MallProduct format.`;

        const gemResponse = await runGem<{ products: ScrapedProduct[] }>(model, prompt);

        if (!gemResponse.success || !gemResponse.data) {
            console.error("Scraper LLM error:", gemResponse.error);
            return NextResponse.json({ error: "Scraper Gem failed to return valid data.", details: gemResponse.error }, { status: 500 });
        }

        const structuredResult = gemResponse.data;

        if (!structuredResult.products || !Array.isArray(structuredResult.products)) {
            return NextResponse.json({ error: "Invalid array structure from Scraper Gem." }, { status: 500 });
        }

        // 4. Save to Database
        const results = {
            scrapedAndSynced: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const productData of structuredResult.products) {
            try {
                const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

                let categoryId = productData.categoryId;
                let subCategoryId = productData.subCategoryId;

                // Fallback IDs if the AI failed to map exactly to our real DB IDs
                if (!categoryId || typeof categoryId !== 'string' || categoryId.length < 10) {
                    const defaultCategory = await prisma.mallCategory.findFirst();
                    if (defaultCategory) categoryId = defaultCategory.id;
                }
                if (!subCategoryId || typeof subCategoryId !== 'string' || subCategoryId.length < 10) {
                    const defaultSubCat = await prisma.mallSubCategory.findFirst({ where: { categoryId } });
                    if (defaultSubCat) subCategoryId = defaultSubCat.id;
                }
                if (!categoryId || !subCategoryId) {
                    throw new Error(`Missing category or subcategory for ${productData.name}. DB is empty?`);
                }

                const mrp = productData.mrp || productData.price * 1.5;
                const discount = productData.discount || Math.round(((mrp - productData.price) / mrp) * 100) || 0;

                await prisma.mallProduct.upsert({
                    where: { slug },
                    update: {
                        name: productData.name,
                        mrp: mrp,
                        price: productData.price,
                        discount: discount,
                        shortDescription: productData.shortDescription,
                        images: JSON.stringify(productData.images || []),
                        tags: JSON.stringify(productData.tags || []),
                        specs: JSON.stringify(productData.specs || {}),
                        updatedAt: new Date()
                    },
                    create: {
                        name: productData.name,
                        slug: slug,
                        mrp: mrp,
                        price: productData.price,
                        discount: discount,
                        shortDescription: productData.shortDescription,
                        categoryId: categoryId,
                        subCategoryId: subCategoryId,
                        images: JSON.stringify(productData.images || []),
                        tags: JSON.stringify(productData.tags || []),
                        specs: JSON.stringify(productData.specs || {}),
                    }
                });
                results.scrapedAndSynced++;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.error(`Failed to upsert product ${productData.name}: ${message}`);
                results.failed++;
                results.errors.push(message);
            }
        }

        return NextResponse.json({
            status: "success",
            message: `Scraping complete. Products synced: ${results.scrapedAndSynced}, Failed: ${results.failed}`,
            details: results
        });

    } catch (error: unknown) {
        console.error("Dropship route critical error:", error);
        const message = error instanceof Error ? error.message : "Internal server process error.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

