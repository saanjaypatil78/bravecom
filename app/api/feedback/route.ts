/**
 * Feedback API Route — POST /api/feedback
 * - Validates input
 * - Runs AI sentiment analysis via OpenRouter (Llama 3 free tier)
 * - Sends email to admin via Nodemailer
 * - Persists to Supabase feedback_submissions table
 */
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { writeAuditLog } from '@/lib/supabase/queries/otp';
import nodemailer from 'nodemailer';

// ─────────────────── TYPES ───────────────────────────────────────────────────

interface FeedbackPayload {
    category: string;
    rating: number;
    comment: string;
    productInterest?: string;
    userType?: string;
    email: string;
    username?: string;
    wouldRecommend: boolean;
    improvements?: string;
    contactPermission?: boolean;
    userId?: string;
}

interface AIAnalysis {
    sentiment: 'positive' | 'negative' | 'neutral';
    sentimentScore: number;
    keyTopics: string[];
    urgency: 'low' | 'medium' | 'high';
    requiresFollowUp: boolean;
    suggestedAction: string;
    productMatch: string;
    riskFlags: string[];
}

// ─────────────────── AI ANALYSIS ─────────────────────────────────────────────

async function analyzeWithAI(payload: FeedbackPayload): Promise<AIAnalysis> {
    const fallback: AIAnalysis = {
        sentiment: 'neutral',
        sentimentScore: 50,
        keyTopics: ['general feedback'],
        urgency: 'medium',
        requiresFollowUp: true,
        suggestedAction: 'Review manually',
        productMatch: 'N/A',
        riskFlags: [],
    };

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) return fallback;

    const prompt = `Analyze this feedback and respond ONLY with valid JSON:

Feedback:
- Category: ${payload.category}
- Rating: ${payload.rating}/5
- Comment: ${payload.comment}
- Product Interest: ${payload.productInterest ?? 'N/A'}
- User Type: ${payload.userType ?? 'N/A'}
- Would Recommend: ${payload.wouldRecommend ? 'Yes' : 'No'}

JSON schema:
{
  "sentiment": "positive|negative|neutral",
  "sentimentScore": 0-100,
  "keyTopics": ["string"],
  "urgency": "low|medium|high",
  "requiresFollowUp": boolean,
  "suggestedAction": "string",
  "productMatch": "string",
  "riskFlags": ["string"]
}`;

    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
                'X-Title': 'BRAVECOM Sunray Feedback',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3-8b-instruct:free',
                messages: [
                    { role: 'system', content: 'Output ONLY valid JSON. No extra text.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 400,
                temperature: 0.2,
            }),
        });

        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content ?? '';
        return JSON.parse(raw) as AIAnalysis;
    } catch {
        return fallback;
    }
}

// ─────────────────── EMAIL ────────────────────────────────────────────────────

async function sendAdminEmail(payload: FeedbackPayload, analysis: AIAnalysis): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL ?? '007saanjaypatil@gmail.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
        console.warn('[Feedback] SMTP credentials missing — skipping email');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
    });

    const sentimentEmoji =
        analysis.sentiment === 'positive' ? '🟢' : analysis.sentiment === 'negative' ? '🔴' : '🟡';
    const urgencyBadge = analysis.urgency === 'high' ? '🚨 HIGH' : analysis.urgency === 'medium' ? '⚠️ MEDIUM' : '✅ LOW';

    const html = `
    <div style="font-family:Inter,sans-serif;max-width:640px;margin:auto;background:#0f172a;color:#f8fafc;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#f59e0b,#fbbf24);padding:24px;">
        <h1 style="margin:0;font-size:24px;color:#0f172a;">☀️ Sunray Feedback Alert</h1>
        <p style="margin:4px 0 0;color:#1e293b;font-size:14px;">${sentimentEmoji} ${analysis.sentiment.toUpperCase()} · Urgency: ${urgencyBadge}</p>
      </div>
      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#94a3b8;width:160px;">From</td><td style="padding:8px 0;font-weight:600;">${payload.username ?? 'Anonymous'} &lt;${payload.email}&gt;</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;">Category</td><td style="padding:8px 0;">${payload.category}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;">Rating</td><td style="padding:8px 0;">${'⭐'.repeat(payload.rating)} (${payload.rating}/5)</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;">Would Recommend</td><td style="padding:8px 0;">${payload.wouldRecommend ? '👍 Yes' : '👎 No'}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;">Product Interest</td><td style="padding:8px 0;">${payload.productInterest ?? 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;">Contact OK?</td><td style="padding:8px 0;">${payload.contactPermission ? '✅ Yes' : '❌ No'}</td></tr>
        </table>

        <div style="margin-top:20px;padding:16px;background:#1e293b;border-radius:8px;">
          <h3 style="margin:0 0 8px;color:#f59e0b;font-size:14px;">💬 Comment</h3>
          <p style="margin:0;line-height:1.6;">${payload.comment}</p>
        </div>

        ${payload.improvements ? `
        <div style="margin-top:12px;padding:16px;background:#1e293b;border-radius:8px;">
          <h3 style="margin:0 0 8px;color:#f59e0b;font-size:14px;">🛠 Improvements Suggested</h3>
          <p style="margin:0;">${payload.improvements}</p>
        </div>` : ''}

        <div style="margin-top:20px;padding:16px;background:#1e293b;border-radius:8px;border-left:4px solid #8b5cf6;">
          <h3 style="margin:0 0 12px;color:#a78bfa;font-size:14px;">🤖 AI Analysis</h3>
          <p><strong>Sentiment Score:</strong> ${analysis.sentimentScore}/100</p>
          <p><strong>Key Topics:</strong> ${analysis.keyTopics.join(', ')}</p>
          <p><strong>Suggested Action:</strong> ${analysis.suggestedAction}</p>
          <p><strong>Product Match:</strong> ${analysis.productMatch}</p>
          ${analysis.riskFlags.length > 0
            ? `<p style="color:#ef4444;"><strong>⚠️ Risk Flags:</strong> ${analysis.riskFlags.join(', ')}</p>`
            : ''}
        </div>

        <p style="margin-top:20px;color:#64748b;font-size:12px;">Received: ${new Date().toLocaleString()}</p>
      </div>
    </div>`;

    await transporter.sendMail({
        from: `"Sunray Feedback System" <${smtpUser}>`,
        to: adminEmail,
        subject: `[${payload.category.toUpperCase()}] ${analysis.urgency === 'high' ? '🚨 ' : ''}Feedback from ${payload.username ?? payload.email} (${payload.rating}⭐)`,
        html,
    });
}

// ─────────────────── ROUTE HANDLER ───────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as FeedbackPayload;

        // Basic validation
        if (!body.email || !body.category || !body.comment || !body.rating) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }
        if (body.comment.length < 20) {
            return NextResponse.json({ success: false, error: 'Comment must be at least 20 characters' }, { status: 400 });
        }
        if (body.rating < 1 || body.rating > 5) {
            return NextResponse.json({ success: false, error: 'Rating must be 1–5' }, { status: 400 });
        }

        // Run AI analysis in parallel with DB write prep
        const aiAnalysis = await analyzeWithAI(body);

        // Persist to Supabase
        const admin = createSupabaseAdminClient();
        const { data: saved, error: dbError } = await admin
            .from('feedback_submissions')
            .insert({
                user_id: body.userId ?? null,
                email: body.email,
                username: body.username ?? null,
                category: body.category,
                rating: body.rating,
                comment: body.comment,
                product_interest: body.productInterest ?? null,
                user_type: body.userType ?? null,
                would_recommend: body.wouldRecommend,
                improvements: body.improvements ?? null,
                contact_permission: body.contactPermission ?? false,
                ai_sentiment: aiAnalysis.sentiment,
                ai_sentiment_score: aiAnalysis.sentimentScore,
                ai_urgency: aiAnalysis.urgency,
                ai_requires_follow_up: aiAnalysis.requiresFollowUp,
                ai_suggested_action: aiAnalysis.suggestedAction,
                ai_product_match: aiAnalysis.productMatch,
                ai_risk_flags: aiAnalysis.riskFlags,
                ai_key_topics: aiAnalysis.keyTopics,
                status: 'open',
                created_at: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (dbError) {
            console.warn('[Feedback] DB insert warning:', dbError.message);
            // Non-fatal — still send email
        }

        // Send admin email (fire-and-forget — don't fail the response if this fails)
        sendAdminEmail(body, aiAnalysis).catch((err) =>
            console.error('[Feedback] Email send failed:', err)
        );

        // Audit log
        await writeAuditLog({
            action: 'FEEDBACK_SUBMITTED',
            user_id: body.userId ?? null,
            session_id: null,
            ip_address: request.headers.get('x-forwarded-for') ?? null,
            user_agent: request.headers.get('user-agent') ?? null,
            details: { category: body.category, rating: body.rating, sentiment: aiAnalysis.sentiment },
        });

        return NextResponse.json({
            success: true,
            feedbackId: saved?.id ?? null,
            aiAnalysis,
            message: 'Feedback submitted successfully.',
        });
    } catch (error) {
        console.error('[Feedback] Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    // Admin-only: list feedback submissions
    const { searchParams } = new URL(request.url);
    const sentiment = searchParams.get('sentiment');
    const urgency = searchParams.get('urgency');
    const status = searchParams.get('status') ?? 'open';
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    try {
        const admin = createSupabaseAdminClient();
        let query = admin
            .from('feedback_submissions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (sentiment) query = query.eq('ai_sentiment', sentiment);
        if (urgency) query = query.eq('ai_urgency', urgency);
        if (status !== 'all') query = query.eq('status', status);

        const { data, error } = await query;
        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, data, total: data?.length ?? 0 });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
