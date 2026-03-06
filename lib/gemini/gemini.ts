// ============================================================================
// AI CLIENT — Core initialization for Brave Ecom Automation
// Proxies Gemini logic through OpenRouter to bypass direct quota limits
// ============================================================================

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Mocking the GenerativeModel interface so we don't break the existing Gem Registry
export interface GenerativeModel {
    model: string;
    systemInstruction: string;
}

/**
 * Create a specialized AI model instance with a specific system instruction (Gem)
 */
export function createGem(systemInstruction: string, modelId: string = "google/gemini-2.5-flash"): GenerativeModel {
    return {
        model: modelId, // Using OpenRouter routing syntax
        systemInstruction,
    };
}

/**
 * Run a prompt through a specific Gem via OpenRouter and return structured JSON
 */
export async function runGem<T = Record<string, unknown>>(
    gem: GenerativeModel,
    prompt: string,
    retries = 3,
    ...args: any[]
): Promise<{ success: boolean; data: T | null; error?: string }> {
    if (!OPENROUTER_API_KEY) {
        return { success: false, data: null, error: "OPENROUTER_API_KEY is not set in environment variables" };
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": `${APP_URL}`,
                    "X-Title": "Brave Ecom Autonomous Gems",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: gem.model,
                    messages: [
                        { role: "system", content: gem.systemInstruction },
                        { role: "user", content: args.length > 0 ? args[0] : prompt } // fallback for potential hidden args
                    ]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const jsonResponse = await response.json();
            const text = jsonResponse.choices?.[0]?.message?.content;

            if (!text) {
                throw new Error("Empty response from OpenRouter API");
            }

            // Try to parse JSON from the response
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                const data = JSON.parse(jsonStr) as T;
                return { success: true, data };
            }

            // If no JSON, return the text as a string in data
            return { success: true, data: { text, raw: true } as unknown as T };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown API error";
            if (message.includes("429") || message.includes("quota") || message.includes("limit")) {
                if (attempt < retries) {
                    console.warn(`[OpenRouter Gem] Rate limited. Retrying attempt ${attempt + 1}/${retries} in ${attempt * 5} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, attempt * 5000));
                    continue; // Retry
                }
            }
            console.error(`[OpenRouter Gem] Error after ${attempt} attempts:`, message);
            return { success: false, data: null, error: message };
        }
    }
    return { success: false, data: null, error: "Max retries exceeded" };
}

/**
 * Run a prompt and get a plain text response (no JSON parsing)
 */
export async function runGemText(gem: GenerativeModel, prompt: string): Promise<string> {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": `${APP_URL}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: gem.model,
                messages: [
                    { role: "system", content: gem.systemInstruction },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[OpenRouter Gem] Text Error:", message);
        return `Error: ${message}`;
    }
}
