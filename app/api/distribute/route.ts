import { NextResponse } from "next/server";
import { runDistributionCycle } from "@/lib/commission-engine";

export async function POST() {
    try {
        const result = await runDistributionCycle();
        return NextResponse.json({
            success: true,
            message: `Distribution cycle complete. Processed ${result.processedCount} investments, distributed ₹${result.totalPayout.toLocaleString("en-IN")}.`,
            ...result,
        });
    } catch (error) {
        console.error("Distribution cycle error:", error);
        return NextResponse.json({ error: "Distribution cycle failed" }, { status: 500 });
    }
}
