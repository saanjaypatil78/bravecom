// ============================================================================
// GEMINI GEMS API — Main dispatch endpoint
// POST /api/gemini { gem: "franchise"|"investor"|"vendor"|"withdrawal"|"reconciliation", prompt: "..." }
// ============================================================================

import { NextResponse } from "next/server";
import { getGem, GEM_DESCRIPTIONS } from "@/lib/gemini/gems";
import type { GemType } from "@/lib/gemini/gems";
import { runGem, runGemText } from "@/lib/gemini/gemini";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { gem, prompt, format } = body as {
            gem: GemType;
            prompt: string;
            format?: "json" | "text";
        };

        if (!gem || !prompt) {
            return NextResponse.json(
                { error: "Missing required fields: gem, prompt" },
                { status: 400 }
            );
        }

        if (!GEM_DESCRIPTIONS[gem]) {
            return NextResponse.json(
                { error: `Invalid gem type: ${gem}. Valid types: ${Object.keys(GEM_DESCRIPTIONS).join(", ")}` },
                { status: 400 }
            );
        }

        const gemModel = getGem(gem);

        if (format === "text") {
            const text = await runGemText(gemModel, prompt);
            return NextResponse.json({ success: true, gem, data: { text } });
        }

        const result = await runGem(gemModel, prompt);
        return NextResponse.json({ success: result.success, gem, ...result });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: "Brave Ecom Gemini Gems",
        gems: GEM_DESCRIPTIONS,
        usage: "POST /api/gemini with { gem: 'franchise|investor|vendor|withdrawal|reconciliation', prompt: '...' }",
    });
}
