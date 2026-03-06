import { NextRequest, NextResponse } from "next/server";
import { getGem, GemType, GEM_DESCRIPTIONS } from "@/lib/gemini/gems";
import { runGem } from "@/lib/gemini/gemini";

// POST /api/gemini/audit — Run any Gem
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { gem, page, context, action, role } = body;

        // All available gem types
        const validGems: GemType[] = [
            "auditor", "seo", "designer",
            "webviewer", "reviewer", "stitch_designer",
            "franchise", "investor", "vendor", "withdrawal", "reconciliation",
            "ecosystem_bridge", "amazon_scraper", "aliexpress_scraper", "meesho_scraper"
        ];

        if (!gem || !validGems.includes(gem)) {
            return NextResponse.json(
                { error: `Invalid gem type. Must be one of: ${validGems.join(", ")}`, available: GEM_DESCRIPTIONS },
                { status: 400 }
            );
        }

        const model = getGem(gem);

        // Build the prompt based on gem type
        let prompt = "";
        switch (gem) {
            case "auditor":
                prompt = `Audit the page "${page || "/"}" for the Brave Ecom webapp. Context: ${context || "Full audit"}. Review ALL links, buttons, forms, images, and navigation. Provide exact fixes.`;
                break;
            case "seo":
                prompt = `Generate complete SEO optimization for "${page || "/"}". Include title tag, meta description, OpenGraph, Twitter card, JSON-LD, heading hierarchy.`;
                break;
            case "designer":
                prompt = `Review UI design of "${page || "/"}". Check colors, typography, spacing, responsive, dark mode, accessibility, animations. Provide CSS/JSX fixes.`;
                break;
            case "webviewer":
                prompt = `Simulate a complete user journey as ${role || "BUYER"} role. Visit all pages in the journey: ${context || "full flow"}. Test every link, button, form. Report PASS/FAIL for each step.`;
                break;
            case "reviewer":
                prompt = `Conduct strategic review of "${page || "entire webapp"}". Score functionality, design, performance, SEO, security. Identify blockers, improvements, competitive gaps. ${context || ""}`;
                break;
            case "stitch_designer":
                prompt = `${action === "generate" ? "Generate a new screen design" : action === "edit" ? "Edit the existing screen" : "Create variant of"} for ${page || "dashboard"}. Use BRAVECOM design system. ${context || "Dark mode, Outfit font, accent #25f4f4"}`;
                break;
            case "ecosystem_bridge":
                prompt = `Bridge the ecosystems for this task: ${context || "Standard bridging"}. Output JSON aligning Stitch UI, Antigravity logic, and WordPress architecture.`;
                break;
            case "amazon_scraper":
                prompt = `Navigate Amazon for: ${context || "New products"}. Extract precise HD thumbnails, parse pricing variations, and map tightly to MallProduct Schema.`;
                break;
            case "aliexpress_scraper":
                prompt = `Scrape AliExpress for: ${context || "Trending items"}. Filter watermarks from images, map international variants, and calculate retail markup.`;
                break;
            case "meesho_scraper":
                prompt = `Navigate Meesho listings for: ${context || "Local market goods"}. Extract localized Indian pricing, vendor details, and clean catalog images.`;
                break;
            default:
                prompt = `${action || "Process"}: ${context || "Standard operation"} for page ${page || "/"}`;
        }

        const result = await runGem(model, prompt);

        return NextResponse.json({
            gem,
            gemInfo: GEM_DESCRIPTIONS[gem as GemType],
            page: page || "/",
            role: role || null,
            action: action || "full_review",
            result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Audit API error:", error);
        return NextResponse.json(
            { error: "Failed to run gem", details: String(error) },
            { status: 500 }
        );
    }
}

// GET /api/gemini/audit — List all available gems
export async function GET() {
    return NextResponse.json({
        gems: GEM_DESCRIPTIONS,
        totalGems: Object.keys(GEM_DESCRIPTIONS).length,
        categories: {
            financial: ["franchise", "investor", "vendor", "withdrawal", "reconciliation"],
            quality: ["auditor", "webviewer", "reviewer"],
            design: ["seo", "designer", "stitch_designer"],
            bridge: ["ecosystem_bridge"],
            automation: ["amazon_scraper", "aliexpress_scraper", "meesho_scraper"],
        },
        usage: {
            method: "POST",
            body: {
                gem: "required — gem type key",
                page: "optional — target page path",
                context: "optional — additional context",
                action: "optional — specific action",
                role: "optional — user role for webviewer",
            },
            example: { gem: "webviewer", role: "BUYER", page: "/mall", context: "Test full buyer journey" },
        },
    });
}
