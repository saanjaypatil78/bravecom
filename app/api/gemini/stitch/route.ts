import { NextRequest, NextResponse } from "next/server";
import { getGem } from "@/lib/gemini/gems";
import { runGem } from "@/lib/gemini/gemini";

// POST /api/gemini/stitch — UI Design generation via Stitch-aware Gem
// This endpoint generates design specifications that can be used with Stitch MCP
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, page, specs, deviceType } = body;

        const validActions = ["generate", "edit", "variant", "review", "export"];
        if (!action || !validActions.includes(action)) {
            return NextResponse.json(
                { error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
                { status: 400 }
            );
        }

        const gem = getGem("stitch_designer");

        const prompt = `Action: ${action}
Page/Component: ${page || "dashboard"}
Device Type: ${deviceType || "DESKTOP"}
Design Specs: ${JSON.stringify(specs || {})}

Using the BRAVECOM design system (Dark Mode: #050B14, Primary: #25f4f4, Font: Outfit), ${action === "generate"
                ? `generate a complete design specification for a ${page} screen. Include exact colors, typography, spacing, component layout, and responsive breakpoints.`
                : action === "edit"
                    ? `suggest edits to improve the ${page} screen design. Focus on consistency with the design system and modern UI patterns.`
                    : action === "variant"
                        ? `create 3 design variants for the ${page} screen. Vary layout, color emphasis, and animation approach.`
                        : action === "review"
                            ? `review the ${page} screen for design quality. Check color consistency, typography, spacing, dark mode, animations, and accessibility.`
                            : `export the ${page} screen design as a React/Next.js component with Tailwind CSS and framer-motion animations.`
            }

Include a Stitch MCP prompt that could be used with generate_screen_from_text for this design.`;

        const result = await runGem(gem, prompt);

        return NextResponse.json({
            action,
            page: page || "dashboard",
            deviceType: deviceType || "DESKTOP",
            result,
            stitchIntegration: {
                note: "Use the 'prompt' field from the result to generate screens via Stitch MCP",
                stitchActions: {
                    generate: "mcp_StitchMCP_generate_screen_from_text",
                    edit: "mcp_StitchMCP_edit_screens",
                    variant: "mcp_StitchMCP_generate_variants",
                },
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Stitch API error:", error);
        return NextResponse.json(
            { error: "Failed to generate design", details: String(error) },
            { status: 500 }
        );
    }
}

// GET /api/gemini/stitch — Available design features
export async function GET() {
    return NextResponse.json({
        name: "Stitch UI Designer Gem",
        description: "Generates design specifications using BRAVECOM design system, compatible with Stitch MCP for screen generation",
        designSystem: {
            colors: {
                primary: "#25f4f4",
                secondary: "#1173d4",
                accent: "#f425af",
                darkBg: "#050B14",
                cardDark: "#0f1a2e",
                text: "#e2e8e8",
                muted: "#9cbaba",
            },
            typography: {
                headings: "Outfit, sans-serif",
                weights: "100-900",
                body: "system-ui",
            },
            spacing: "4px grid (4, 8, 12, 16, 24, 32, 48, 64)",
            borderRadius: "12px (cards), 16px (modals), 99px (pills)",
            animations: "framer-motion, 300ms transitions, spring physics",
        },
        actions: ["generate", "edit", "variant", "review", "export"],
        deviceTypes: ["DESKTOP", "MOBILE", "TABLET"],
        roles: ["ADMIN", "INVESTOR", "FRANCHISE_PARTNER", "BUYER", "VENDOR", "QA_ANALYST"],
    });
}
