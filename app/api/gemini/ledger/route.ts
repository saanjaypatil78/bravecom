// ============================================================================
// GEMINI LEDGER — Bank Withdrawal Processing via BankWithdrawalGem
// POST /api/gemini/ledger { action: "process_withdrawal", amount, beneficiary, ... }
// ============================================================================

import { NextResponse } from "next/server";
import { getGem } from "@/lib/gemini/gems";
import { runGem } from "@/lib/gemini/gemini";

interface WithdrawalRequest {
    action: "process_withdrawal" | "reconcile_month" | "generate_entry";
    amount?: number;
    beneficiary?: string;
    transactionType?: string;
    month?: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as WithdrawalRequest;
        const { action } = body;

        switch (action) {
            case "process_withdrawal": {
                const { amount, beneficiary, transactionType } = body;
                if (!amount || !beneficiary) {
                    return NextResponse.json(
                        { error: "Missing amount or beneficiary" },
                        { status: 400 }
                    );
                }

                const withdrawalGem = getGem("withdrawal");
                const prompt = `Process a bank withdrawal for the following:
- Amount: ₹${amount.toLocaleString("en-IN")}
- Beneficiary: ${beneficiary}
- Transaction Type: ${transactionType || "BANK_WITHDRAWAL"}
- Date: ${new Date().toISOString()}

Select the optimal payment mode based on the amount.
Generate a masked bank account and IFSC code.
Output the complete withdrawal entry as JSON.`;

                const result = await runGem(withdrawalGem, prompt);
                return NextResponse.json({ success: result.success, ...result });
            }

            case "reconcile_month": {
                const { month } = body;
                if (!month) {
                    return NextResponse.json(
                        { error: "Missing month (YYYY-MM format)" },
                        { status: 400 }
                    );
                }

                const reconciliationGem = getGem("reconciliation");
                const prompt = `Reconcile the ledger for month: ${month}

Please perform the following:
1. Verify all transactions are properly categorized
2. Check payment mode limits compliance
3. Flag any anomalies
4. Generate a monthly P&L summary
5. Confirm all outflow entries have "Withdrawn to Bank" status

Output the reconciliation report as JSON.`;

                const result = await runGem(reconciliationGem, prompt);
                return NextResponse.json({ success: result.success, ...result });
            }

            case "generate_entry": {
                const { amount, beneficiary, transactionType } = body;
                const investorGem = getGem("investor");
                const prompt = `Generate a ledger entry for:
- Type: ${transactionType || "INVESTMENT_INFLOW"}
- Amount: ₹${(amount || 0).toLocaleString("en-IN")}
- Entity: ${beneficiary || "New Investor"}

Match the appropriate investment tier and calculate expected monthly returns.
Generate proper reference ID and bank details.
Output as JSON.`;

                const result = await runGem(investorGem, prompt);
                return NextResponse.json({ success: result.success, ...result });
            }

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}. Valid: process_withdrawal, reconcile_month, generate_entry` },
                    { status: 400 }
                );
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: "Brave Ecom Ledger Automation",
        actions: {
            process_withdrawal: "Process a bank withdrawal with optimal payment mode",
            reconcile_month: "Reconcile and verify a month's ledger entries",
            generate_entry: "Generate a new ledger entry with AI-determined parameters",
        },
        usage: "POST /api/gemini/ledger with { action, amount, beneficiary, ... }",
    });
}
